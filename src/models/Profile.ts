import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  user_id: { type: String, default: null },
  business_name: { type: String, required: true },
  owner_name: { type: String, default: '' },
  category: { type: String, required: true },
  wilaya: { type: String, required: true },
  address: { type: String, default: '' },
  description: { type: String, default: '' },
  phone: { type: String, required: true },
  whatsapp: { type: String, default: '' },
  email: { type: String, default: '' },
  location_link: { type: String, default: '' },
  latitude: { type: Number, default: null },
  longitude: { type: Number, default: null },
  facebook: { type: String, default: '' },
  instagram: { type: String, default: '' },
  tiktok: { type: String, default: '' },
  images: { type: [String], default: [] },
  logo_url: { type: String, default: '' },
  status: { type: String, default: 'pending' },
  is_published: { type: Boolean, default: false },
  code: { type: String, default: '' },
  start_date: { type: String, default: '' },
  end_date: { type: String, default: '' },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// Convert _id to id in JSON response to match existing frontend code seamlessly
ProfileSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id.toString();
    delete ret._id;
  }
});

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
