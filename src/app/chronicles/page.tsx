'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useBlogs } from '@/hooks/useBlogs';
import { ArrowRight, Calendar, BookOpen } from 'lucide-react';


export default function ChroniclesPage() {
    const { blogs, loading } = useBlogs();

    const chronicles = blogs.filter(b =>
        b.published && b.category.toLowerCase() === 'chronicles'
    );

    const featured = chronicles.find(b => b.featured) || chronicles[0];
    const rest = chronicles.filter(b => b.id !== featured?.id);

    return (
        <div>
            {/* ── Hero ── */}
            <div className="cat-hero chronicles-hero">
                <div className="cat-hero-glow chronicles-glow" />
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="cat-hero-inner"
                    >
                        <div className="cat-icon chronicles-icon">
                            <BookOpen size={28} />
                        </div>
                        <h1 className="gradient-text cat-title">Chronicles</h1>
                        <p className="cat-subtitle">
                            Real stories from real life — career milestones, life lessons, and the moments that shaped who I am.
                        </p>

                        {/* What is Chronicles callout */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="chronicles-about glass"
                        >
                            <p>
                                🧭 From landing my first job to navigating the unknown — this is where I write about
                                the unscripted chapters of my life. No filters, just honest stories.
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <div className="container">
                {/* ── Featured Story ── */}
                {!loading && featured && (
                    <AnimatePresence>
                        <motion.div
                            key={featured.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Link href={`/blog/${featured.slug}`} className="featured-card glass chronicles-featured">
                                <div
                                    className="featured-img"
                                    style={{ backgroundImage: `url("${featured.image_url || 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&q=80&w=800'}")` }}
                                >
                                    <div className="featured-img-overlay" />
                                    <span className="featured-badge chronicles-badge">✦ Featured Story</span>
                                </div>
                                <div className="featured-body">
                                    <span className="cat-pill chronicles-pill">Chronicles</span>
                                    <h2 className="featured-title">{featured.title}</h2>
                                    <p className="featured-excerpt">
                                        {featured.content.replace(/<[^>]*>/g, '').substring(0, 220)}...
                                    </p>
                                    <div className="featured-footer">
                                        <div className="post-meta">
                                            <Calendar size={14} />
                                            {new Date(featured.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <span className="read-cta chronicles-cta">
                                            Read Story <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* ── More Stories ── */}
                {!loading && rest.length > 0 && (
                    <div className="section-label">
                        <span>More Stories</span>
                        <div className="section-line" />
                    </div>
                )}

                <div className="posts-grid">
                    {loading
                        ? Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="skeleton-card" />
                        ))
                        : rest.map((blog, i) => (
                            <motion.div
                                key={blog.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                            >
                                <Link href={`/blog/${blog.slug}`} className="post-card glass">
                                    {blog.image_url && (
                                        <div
                                            className="post-card-img"
                                            style={{ backgroundImage: `url("${blog.image_url}")` }}
                                        />
                                    )}
                                    <div className="post-card-body">
                                        <span className="cat-pill chronicles-pill">Chronicles</span>
                                        <h3 className="post-card-title">{blog.title}</h3>
                                        <p className="post-card-excerpt">
                                            {blog.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                                        </p>
                                        <div className="post-card-footer">
                                            <div className="post-meta">
                                                <Calendar size={13} />
                                                {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </div>
                                            <ArrowRight size={16} className="arrow-icon" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))
                    }
                </div>

                {!loading && chronicles.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="empty-chronicles glass"
                    >
                        <BookOpen size={48} className="empty-icon" />
                        <h3>The first chapter is yet to be written.</h3>
                        <p>Life stories are coming soon. Stay tuned.</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
