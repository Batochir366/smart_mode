import { SiteSettings } from "./models/SiteSettings.js";

import type { SiteContentData } from "../../client/shared/siteContent.js";
import {
  DEFAULT_SITE_CONTENT,
  mergeSiteContent,
} from "../../client/shared/siteContent.js";

const MAIN_KEY = "main";

function cloneDefaults(): SiteContentData {
  const sc = structuredClone(DEFAULT_SITE_CONTENT) as SiteContentData;
  return sc;
}

/** Creates the main settings row once. */
export async function ensureSiteContentSeeded(): Promise<void> {
  const exists = await SiteSettings.exists({ key: MAIN_KEY }).exec();
  if (exists) return;
  await SiteSettings.create({
    key: MAIN_KEY,
    version: 1,
    data: cloneDefaults(),
    updatedAt: new Date(),
  });
}

export async function getMergedSiteContent(): Promise<SiteContentData> {
  const doc = await SiteSettings.findOne({ key: MAIN_KEY }).lean();
  const raw = doc?.data;
  return mergeSiteContent(DEFAULT_SITE_CONTENT, raw);
}
