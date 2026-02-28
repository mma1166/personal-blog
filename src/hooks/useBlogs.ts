import { useState, useEffect } from 'react';

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

    // Check if the new Pro stack (Postgres + Cloudinary) is available
    const isConfigured =
        process.env.NEXT_PUBLIC_VERCEL_ENV !== undefined ||
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== undefined;

    const fetchBlogs = async () => {
        if (!isConfigured) {
            // LocalStorage fallback for local dev without Supabase
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
                const sorted = parsed.sort((a: Blog, b: Blog) => {
                    const orderA = a.sort_order ?? 999;
                    const orderB = b.sort_order ?? 999;
                    if (orderA !== orderB) return orderA - orderB;
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
                setBlogs(sorted);
            }
            setLoading(false);
            return;
        }

        // Use server-side API route — bypasses Supabase RLS completely
        try {
            const res = await fetch('/api/blogs');
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Failed to fetch blogs');
            }
            const data = await res.json();
            setBlogs(data || []);
        } catch (err) {
            console.error('Error fetching blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    const createBlog = async (blog: Partial<Blog>) => {
        if (!isConfigured) {
            const newBlog = {
                ...blog,
                id: Math.random().toString(36).substr(2, 9),
                created_at: new Date().toISOString(),
                sort_order: blog.sort_order ?? 999
            } as Blog;
            const updated = [newBlog, ...blogs];
            localStorage.setItem('local_blogs', JSON.stringify(updated));
            fetchBlogs();
            return [newBlog];
        }

        const res = await fetch('/api/blogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(blog),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to create blog');
        fetchBlogs();
        return data;
    };

    const updateBlog = async (id: string, updates: Partial<Blog>) => {
        if (!isConfigured) {
            const updated = blogs.map(b => b.id === id ? { ...b, ...updates } : b);
            localStorage.setItem('local_blogs', JSON.stringify(updated));
            fetchBlogs();
            return;
        }

        const res = await fetch(`/api/blogs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update blog');
        fetchBlogs();
    };

    const deleteBlog = async (id: string) => {
        if (!isConfigured) {
            const updated = blogs.filter(b => b.id !== id);
            localStorage.setItem('local_blogs', JSON.stringify(updated));
            setBlogs(updated);
            return;
        }

        const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to delete blog');
        fetchBlogs();
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    return { blogs, loading, createBlog, updateBlog, deleteBlog, refresh: fetchBlogs };
}
