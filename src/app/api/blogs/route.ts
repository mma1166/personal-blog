import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Server-side Supabase client using service role key — bypasses RLS completely
function getAdminClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    if (!url || !serviceKey) {
        throw new Error('Supabase environment variables not configured');
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
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
