import mongoose from 'mongoose'

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String, default: '' },
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

contactMessageSchema.index({ createdAt: -1 })

export const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema)
