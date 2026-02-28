import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function getAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!url || !serviceKey) {
        throw new Error('Supabase environment variables not configured. Ensure SUPABASE_SERVICE_ROLE_KEY is in Vercel.');
    }
    return createClient(url, serviceKey);
}

// GET /api/blogs — fetch all blogs
export async function GET() {
    try {
        const supabase = getAdminClient();
        const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data || []);
    } catch (err: any) {
        console.error('API GET ERROR:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/blogs — create a new blog post
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const supabase = getAdminClient();
        const { data, error } = await supabase
            .from('blogs')
            .insert([body])
            .select();

        if (error) throw error;
        return NextResponse.json(data);
    } catch (err: any) {
        console.error('API POST ERROR:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
