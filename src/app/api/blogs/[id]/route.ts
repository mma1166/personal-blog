import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!url || !serviceKey) {
        throw new Error('Supabase environment variables not configured');
    }
    return createClient(url, serviceKey);
}

// PUT /api/blogs/[id] — update a blog post
export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json();
        const supabase = getAdminClient();
        const { error } = await supabase
            .from('blogs')
            .update(body)
            .eq('id', params.id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE /api/blogs/[id] — delete a blog post
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
    try {
        const supabase = getAdminClient();
        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', params.id);

        if (error) throw error;
        return NextResponse.json({ success: true });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
