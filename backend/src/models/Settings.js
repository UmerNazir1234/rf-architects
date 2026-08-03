import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    phone: String,
    email: String,
    address: String,
    social: {
      tiktok: String,
      facebook: String,
      instagram: String,
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      metaKeywords: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
