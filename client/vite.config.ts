import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/** Replaces `<!-- @include relative/path.html -->` with file contents at dev + build. */
function htmlPartialsPlugin(): Plugin {
  const includeRe = /<!--\s*@include\s+([^\s]+)\s*-->/g;
  return {
    name: "html-partials",
    transformIndexHtml(html) {
      return html.replace(includeRe, (_, raw: string) => {
        const full = path.resolve(projectRoot, raw.trim());
        return fs.readFileSync(full, "utf-8");
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [htmlPartialsPlugin(), react(), tailwindcss()],
  server: {
    allowedHosts: ["microphysical-tameka-explicitly.ngrok-free.dev"],
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(projectRoot, "./src"),
      "@shared": path.resolve(projectRoot, "./shared"),
    },
  },
});
