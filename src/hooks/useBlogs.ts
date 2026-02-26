import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    category: string;
    published: boolean;
    featured?: boolean;
    created_at: string;
    image_url: string;
    sort_order?: number;
}

export function useBlogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    // Consistent with supabase.ts — only true when URL is a real HTTP URL
    const isSupabaseConfigured =
        process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('http') &&
        (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length ?? 0) > 10;

    const fetchBlogs = async () => {
        console.log('useBlogs: fetching blogs, configured:', isSupabaseConfigured);
        if (!isSupabaseConfigured) {
            const local = typeof window !== 'undefined' ? localStorage.getItem('local_blogs') : null;
            if (!local) {
                const initialMocks = [
                    {
                        id: 'mock-1',
                        title: 'The Future of AI in Web Development',
                        slug: 'ai-web-dev',
                        content: '<p>Artificial Intelligence is no longer a buzzword...</p>',
                        category: 'Technology',
                        published: true,
                        created_at: new Date('2026-02-12').toISOString(),
                        image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
                        sort_order: 1
                    },
                    {
                        id: 'mock-2',
                        title: 'A Week in the Swiss Alps',
                        slug: 'swiss-alps',
                        content: '<p>Exploring the breathtaking landscapes...</p>',
                        category: 'Travel',
                        published: true,
                        created_at: new Date('2026-01-28').toISOString(),
                        image_url: 'https://picsum.photos/seed/swiss/800/450',
                        sort_order: 2
                    }
                ];
                if (typeof window !== 'undefined') {
                    localStorage.setItem('local_blogs', JSON.stringify(initialMocks));
                }
                setBlogs(initialMocks);
            } else {
                const parsed = JSON.parse(local);
                // Sort by sort_order ascending, then created_at descending
                const sorted = parsed.sort((a: Blog, b: Blog) => {
                    const orderA = a.sort_order ?? 999;
                    const orderB = b.sort_order ?? 999;
                    if (orderA !== orderB) return orderA - orderB;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
                setBlogs(sorted);
            }
            setLoading(false);
            console.log('useBlogs: Loaded from local storage');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBlogs(data || []);
        } catch (err) {
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    const createBlog = async (blog: Partial<Blog>) => {
        if (!isSupabaseConfigured) {
            const newBlog = {
                ...blog,
                id: Math.random().toString(36).substr(2, 9),
                created_at: new Date().toISOString(),
                sort_order: blog.sort_order ?? 999
            } as Blog;
            const updated = [newBlog, ...blogs];
            localStorage.setItem('local_blogs', JSON.stringify(updated));
            fetchBlogs(); // Re-fetch to apply sort
            return [newBlog];
        }

        const { data, error } = await supabase
            .from('blogs')
            .insert([blog])
            .select();
        if (error) throw error;
        fetchBlogs();
        return data;
    };

    const updateBlog = async (id: string, updates: Partial<Blog>) => {
        if (!isSupabaseConfigured) {
            const updated = blogs.map(b => b.id === id ? { ...b, ...updates } : b);
            localStorage.setItem('local_blogs', JSON.stringify(updated));
            fetchBlogs(); // Re-fetch to apply sort
            return;
        }

        const { error } = await supabase
            .from('blogs')
            .update(updates)
            .eq('id', id);
        if (error) throw error;
        fetchBlogs();
    };

    const deleteBlog = async (id: string) => {
        if (!isSupabaseConfigured) {
            const updated = blogs.filter(b => b.id !== id);
            localStorage.setItem('local_blogs', JSON.stringify(updated));
            setBlogs(updated);
            return;
        }

        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id);
        if (error) throw error;
        fetchBlogs();
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    return { blogs, loading, createBlog, updateBlog, deleteBlog, refresh: fetchBlogs };
}
