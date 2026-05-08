import { promises as fsPromises } from "node:fs";
import path from "node:path";
import { timingSafeEqual } from "node:crypto";
import { fileURLToPath } from "node:url";

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import multer from "multer";

import { Buffer } from "node:buffer";

import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
  normalizeProductCardsFromUnknown,
  type SiteContentData,
} from "../../client/shared/siteContent.js";
import { ContactMessage } from "./models/ContactMessage.js";
import { SiteSettings } from "./models/SiteSettings.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { ensureSiteContentSeeded, getMergedSiteContent } from "./seed.js";
import { contactFormSchema, siteContentDataSchema } from "./validation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, "../.env") });

const MAIN_KEY = "main";
const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const UPLOAD_DIR = path.resolve(
  process.env.UPLOAD_DIR ?? path.join(__dirname, "../uploads"),
);

function requireEnv(): void {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is required");
  if (!JWT_SECRET) throw new Error("JWT_SECRET is required");
  if (!ADMIN_PASSWORD) throw new Error("ADMIN_PASSWORD is required");
}

const app = express();
app.disable("x-powered-by");
app.use(
  cors({
    origin(origin, cb) {
      if (!origin) {
        cb(null, true);
        return;
      }
      if (
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
      ) {
        cb(null, true);
        return;
      }
      cb(null, false);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/uploads", express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename(_req, file, cb) {
    const ext = path.extname(file.originalname || "") || "";
    const base = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    cb(null, `${base}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
});

function cryptoSafeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ba.length !== bb.length) return false;
  try {
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

app.post("/api/auth/login", (req, res) => {
  if (!JWT_SECRET || !ADMIN_PASSWORD) {
    res.status(500).json({ error: "Server misconfigured" });
    return;
  }
  const password =
    typeof req.body?.password === "string" ? req.body.password : "";
  const ok = cryptoSafeEqual(password, ADMIN_PASSWORD);
  if (!ok) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = jwt.sign({ role: "admin" }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({ token });
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  const parsed = contactFormSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid payload", details: parsed.error.flatten() });
    return;
  }
  await ContactMessage.create({
    name: parsed.data.name,
    company: parsed.data.company ?? "",
    email: parsed.data.email,
    message: parsed.data.message,
  });
  res.status(201).json({ ok: true });
});

app.get("/api/site-content", async (_req, res) => {
  const merged = await getMergedSiteContent();
  const doc = await SiteSettings.findOne({ key: MAIN_KEY }).lean();
  res.json({
    version: doc?.version ?? 1,
    updatedAt: (doc?.updatedAt ?? new Date()).toISOString(),
    data: merged,
  });
});

app.patch("/api/site-content", requireAuth, async (req, res) => {
  const raw =
    typeof req.body?.data === "object" && req.body.data != null
      ? req.body.data
      : req.body;
  const body =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? ({ ...raw } as Record<string, unknown>)
      : {};
  const productsUnknown = body.products;
  if (
    productsUnknown &&
    typeof productsUnknown === "object" &&
    !Array.isArray(productsUnknown)
  ) {
    const pIn = productsUnknown as { cards?: unknown };
    if (Array.isArray(pIn.cards)) {
      const cards = normalizeProductCardsFromUnknown(pIn.cards);
      if (cards !== undefined) {
        body.products = {
          ...(productsUnknown as Record<string, unknown>),
          cards,
        };
      }
    }
  }
  const parsed = siteContentDataSchema.safeParse(body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid site content", details: parsed.error.flatten() });
    return;
  }
  const data: SiteContentData = parsed.data;
  const normalized = mergeSiteContent(DEFAULT_SITE_CONTENT, data);

  const doc =
    (await SiteSettings.findOne({ key: MAIN_KEY }).exec()) ??
    new SiteSettings({ key: MAIN_KEY });

  doc.data = normalized;
  doc.version = (doc.version ?? 1) + 1;
  doc.updatedAt = new Date();
  await doc.save();

  res.json({
    version: doc.version,
    updatedAt: doc.updatedAt?.toISOString() ?? new Date().toISOString(),
    data: normalized,
  });
});

app.get("/api/contact-messages", requireAuth, async (req, res) => {
  const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 50));
  const items = await ContactMessage.find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  res.json({
    items: items.map((m) => ({
      id: String(m._id),
      name: m.name,
      company: m.company,
      email: m.email,
      message: m.message,
      createdAt: m.createdAt,
    })),
  });
});

app.delete("/api/contact-messages/:id", requireAuth, async (req, res) => {
  const idParam = req.params.id;
  const raw = Array.isArray(idParam) ? idParam[0] : idParam;
  if (!raw || !mongoose.Types.ObjectId.isValid(raw)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const result = await ContactMessage.deleteOne({ _id: raw }).exec();
  if (result.deletedCount === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.status(204).send();
});

app.post("/api/upload", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'Missing file field "file"' });
    return;
  }
  const publicPath = `/uploads/${encodeURIComponent(req.file.filename)}`;
  const base = `${req.protocol}://${req.get("host") ?? `localhost:${PORT}`}`;
  res.json({
    filename: req.file.filename,
    url: `${base}${publicPath}`,
    path: publicPath,
  });
});

async function main() {
  requireEnv();

  await fsPromises.mkdir(UPLOAD_DIR, { recursive: true });

  await mongoose.connect(MONGODB_URI!);
  await ensureSiteContentSeeded();

  app.listen(PORT, () => {
    console.warn(`Smart Mode API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
