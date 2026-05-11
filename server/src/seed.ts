import { SiteSettings } from "./models/SiteSettings.js";

import type { BilingualSiteContent } from "../../client/shared/siteContent.js";
import { normalizeBilingualFromApi } from "../../client/shared/siteContent.js";

const MAIN_KEY = "main";

function cloneDefaults(): BilingualSiteContent {
  return normalizeBilingualFromApi(undefined);
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

export async function getMergedSiteContent(): Promise<BilingualSiteContent> {
  const doc = await SiteSettings.findOne({ key: MAIN_KEY }).lean();
  return normalizeBilingualFromApi(doc?.data);
}
