'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useBlogs } from '@/hooks/useBlogs';
import { ArrowRight, Calendar, BookOpen } from 'lucide-react';


export default function ChroniclesPage() {
    const { blogs, loading } = useBlogs();

    const chroniclesBlogs = blogs.filter(b =>
        b.published && b.category.toLowerCase() === 'chronicles'
    );

    const featured = chroniclesBlogs.find(b => b.featured) || chroniclesBlogs[0];
    const rest = chroniclesBlogs.filter(b => b.id !== featured?.id);

    return (
        <div>
            {/* Hero */}
            <div className="cat-hero">
                <div className="cat-hero-glow" />
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="cat-hero-inner">
                        <div className="cat-icon"><BookOpen size={28} /></div>
                        <h1 className="gradient-text cat-title">Chronicles</h1>
                        <p className="cat-subtitle">Long-form stories, personal reflections, and deep dives into various topics.</p>
                    </motion.div>
                </div>
            </div>

            <div className="container">
                {/* Featured */}
                {!loading && featured && (
                    <AnimatePresence>
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Link href={`/blog/${featured.slug}`} className="featured-card glass">
                                <div className="featured-img" style={{ backgroundImage: `url("${featured.image_url}")` }}>
                                    <div className="featured-img-overlay" />
                                    <span className="featured-badge">✦ Featured</span>
                                </div>
                                <div className="featured-body">
                                    <span className="cat-pill">{featured.category}</span>
                                    <h2 className="featured-title">{featured.title}</h2>
                                    <p className="featured-excerpt">{featured.content.replace(/<[^>]*>/g, '').substring(0, 220)}...</p>
                                    <div className="featured-footer">
                                        <div className="post-meta">
                                            <Calendar size={14} />
                                            {new Date(featured.created_at).toLocaleDateString('en-GB')}
                                        </div>
                                        <span className="read-cta">Read Story <ArrowRight size={16} /></span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Grid */}
                {!loading && rest.length > 0 && (
                    <div className="section-label"><span>More Stories</span><div className="section-line" /></div>
                )}
                <div className="posts-grid">
                    {loading
                        ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton-card" />)
                        : rest.map((blog, i) => (
                            <motion.div key={blog.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                                <Link href={`/blog/${blog.slug}`} className="post-card glass">
                                    {blog.image_url && <div className="post-card-img" style={{ backgroundImage: `url("${blog.image_url}")` }} />}
                                    <div className="post-card-body">
                                        <span className="cat-pill">{blog.category}</span>
                                        <h3 className="post-card-title">{blog.title}</h3>
                                        <p className="post-card-excerpt">{blog.content.replace(/<[^>]*>/g, '').substring(0, 120)}...</p>
                                        <div className="post-card-footer">
                                            <div className="post-meta"><Calendar size={13} />{new Date(blog.created_at).toLocaleDateString('en-GB')}</div>
                                            <ArrowRight size={16} className="arrow-icon" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    }
                </div>
                {!loading && chroniclesBlogs.length === 0 && <p className="empty-state">Chronicles coming soon!</p>}
            </div>
        </div>
    );
}
