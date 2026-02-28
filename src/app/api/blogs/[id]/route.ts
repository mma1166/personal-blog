import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// PUT /api/blogs/[id] — update a blog post via Prisma
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const updates: any = {};

        // Match Prisma model field names
        if (body.title) {
            updates.title = body.title;
            updates.slug = body.slug || body.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        if (body.content !== undefined) updates.content = body.content;
        if (body.category !== undefined) updates.category = body.category;
        if (body.published !== undefined) updates.published = body.published;
        if (body.featured !== undefined) updates.featured = body.featured;
        if (body.image_url !== undefined) updates.image_url = body.image_url;
        if (body.sort_order !== undefined) updates.sort_order = parseInt(body.sort_order) || 999;

        const updatedBlog = await prisma.blog.update({
            where: { id },
            data: updates
        });

        return NextResponse.json({ success: true, blog: updatedBlog });
    } catch (err: any) {
        console.error('API PUT ERROR:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE /api/blogs/[id] — delete a blog post via Prisma
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.blog.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('API DELETE ERROR:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
