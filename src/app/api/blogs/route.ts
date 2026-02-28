import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/blogs — fetch all blogs via Prisma
export async function GET() {
    try {
        const blogs = await prisma.blog.findMany({
            orderBy: [
                { sort_order: 'asc' },
                { created_at: 'desc' }
            ]
        });
        return NextResponse.json(blogs);
    } catch (err: any) {
        console.error('API GET ERROR:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/blogs — create a new blog post via Prisma
export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Match Prisma model field names
        const blogData = {
            title: body.title,
            slug: body.slug || body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            content: body.content,
            category: body.category,
            published: body.published ?? false,
            featured: body.featured ?? false,
            image_url: body.image_url,
            sort_order: parseInt(body.sort_order) || 999
        };

        const newBlog = await prisma.blog.create({
            data: blogData
        });

        return NextResponse.json(newBlog);
    } catch (err: any) {
        console.error('API POST ERROR:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
