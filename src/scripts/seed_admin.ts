import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://yacnas:yacnas1234@cluster0.xa7skjc.mongodb.net/?appName=Cluster0';

const UserSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'nassim@wassla.com';
    const password = '@@@nassim123';
    const passwordHash = await bcrypt.hash(password, 10);

    // Delete existing admin if any
    await User.deleteOne({ email });
    
    await User.create({
      email,
      passwordHash,
      role: 'admin'
    });

    console.log('Admin account created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
