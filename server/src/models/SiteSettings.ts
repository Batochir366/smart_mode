import mongoose from 'mongoose'

const siteSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true, index: true },
  version: { type: Number, default: 1 },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
})

export const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema)
