import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: Request) {
    try {
        const { image } = await request.json(); // image is a base64 string

        if (!image) {
            return NextResponse.json({ error: 'No image provided' }, { status: 400 });
        }

        // High-quality upload to Cloudinary directly from base64
        const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: 'blog-images',
            resource_type: 'auto',
        });

        return NextResponse.json({ url: uploadResponse.secure_url });
    } catch (error: any) {
        console.error('Cloudinary upload error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
