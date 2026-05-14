import { NextRequest } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  // Re-configure inside handler to ensure env vars are fresh and applied
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

  try {
    console.log('--- Upload Request ---');
    console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
    console.log('API Key:', process.env.CLOUDINARY_API_KEY);
    const secret = process.env.CLOUDINARY_API_SECRET || '';
    console.log('API Secret (masked):', secret.substring(0, 4) + '***' + secret.substring(secret.length - 4));

    let formData;
    try {
      formData = await request.formData();
    } catch (e) {
      console.error('Error parsing form data:', e);
      return Response.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json({ error: 'File too large. Max 5MB.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json({ error: 'Invalid file type. Only images allowed.' }, { status: 400 });
    }

    // Convert file to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert buffer to base64
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    console.log('Uploading base64 image to Cloudinary...');
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: 'wassla_uploads',
      resource_type: 'auto',
    });

    console.log('Cloudinary upload successful:', uploadResult.secure_url);

    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error('Upload succeeded but no URL was returned');
    }

    return Response.json({ 
      success: true, 
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id 
    });
  } catch (error: any) {
    console.error('CRITICAL UPLOAD ERROR:', error);
    return Response.json({ 
      success: false, 
      error: error.message || 'Upload failed',
      details: error.toString()
    }, { status: 500 });
  }
}
