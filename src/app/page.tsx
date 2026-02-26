'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useBlogs } from '@/hooks/useBlogs';
import { useProfile } from '@/hooks/useProfile';
import { ArrowRight, Calendar, User, Cpu, Compass, LayoutGrid, BookOpen } from 'lucide-react';

const CATEGORIES = [
  { label: 'All Posts', value: 'all', icon: LayoutGrid },
  { label: 'Technology', value: 'technology', icon: Cpu },
  { label: 'Travel', value: 'travel', icon: Compass },
  { label: 'Chronicles', value: 'chronicles', icon: BookOpen },
];



export default function Home() {
  const { blogs, loading } = useBlogs();
  const { profile } = useProfile();
  const [activeCategory, setActiveCategory] = useState('all');

  const published = blogs.filter(b => b.published);

  const filtered = published.filter(b => {
    if (activeCategory === 'all') return true;
    return b.category.toLowerCase() === activeCategory ||
      (activeCategory === 'technology' && b.category.toLowerCase() === 'tech');
  });

  // Prefer explicitly featured post; fall back to first sorted post
  const featured = filtered.find(b => b.featured) || filtered[0];
  const rest = filtered.filter(b => b.id !== featured?.id);

  return (
    <div className="home-root">
      {/* ════════════════════════════════════════
          HERO / AUTHOR BANNER
      ════════════════════════════════════════ */}
      <section className="hero-banner">
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="hero-inner container"
        >
          <div className="hero-avatar">
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt={profile.name} />
            ) : (
              <div className="avatar-fallback"><User size={44} /></div>
            )}
            <div className="avatar-ring" />
          </div>

          <div className="hero-text">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="hero-eyebrow"
            >
              👋 Hello, I'm
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="hero-name gradient-text"
            >
              {profile.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
              className="hero-title-tag"
            >
              {profile.title}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="hero-bio"
            >
              {profile.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="hero-bottom-row"
            >
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-num">{published.length}</span>
                  <span className="stat-lbl">Articles</span>
                </div>
                <div className="stat-divider" />
                <div className="stat">
                  <span className="stat-num">
                    {[...new Set(published.map(b => b.category.toLowerCase()))].length}
                  </span>
                  <span className="stat-lbl">Topics</span>
                </div>
              </div>
              <a
                href="https://portfolio.muntasiramit.me"
                target="_blank"
                rel="noopener noreferrer"
                className="portfolio-btn"
              >
                View Portfolio ↗
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ════════════════════════════════════════
          CATEGORY FILTER
      ════════════════════════════════════════ */}
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="filter-row"
        >
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const active = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`filter-pill ${active ? 'filter-pill--active' : ''}`}
              >
                <Icon size={15} />
                {cat.label}
              </button>
            );
          })}
        </motion.div>

        {/* ════════════════════════════════════════
            FEATURED POST (first in sorted list)
        ════════════════════════════════════════ */}
        <AnimatePresence mode="wait">
          {!loading && featured && (
            <motion.div
              key={featured.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <Link href={`/blog/${featured.slug}`} className="featured-card glass">
                <div
                  className="featured-img"
                  style={{ backgroundImage: `url("${featured.image_url || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200'}")` }}
                >
                  <div className="featured-img-overlay" />
                  <span className="featured-badge">✦ Featured</span>
                </div>
                <div className="featured-body">
                  <span className="cat-pill">{featured.category}</span>
                  <h2 className="featured-title">{featured.title}</h2>
                  <p className="featured-excerpt">
                    {featured.content.replace(/<[^>]*>/g, '').substring(0, 220)}...
                  </p>
                  <div className="featured-footer">
                    <div className="post-meta">
                      <Calendar size={14} />
                      {new Date(featured.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <span className="read-cta">
                      Read Article <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ════════════════════════════════════════
            POSTS GRID
        ════════════════════════════════════════ */}
        {!loading && rest.length > 0 && (
          <div className="section-label">
            <span>More Articles</span>
            <div className="section-line" />
          </div>
        )}

        <AnimatePresence>
          <div className="posts-grid">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))
              : rest.map((blog, i) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
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
                      <span className="cat-pill">{blog.category}</span>
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
              ))}
          </div>
        </AnimatePresence>

        {!loading && filtered.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
          >
            No posts in this category yet. Stay tuned!
          </motion.p>
        )}
      </div>

      {/* ════════════════════════════════════════
          GLOBAL STYLES
      ════════════════════════════════════════ */}
      <style jsx global>{`
        /* ── Hero ── */
        .hero-banner {
          position: relative;
          overflow: hidden;
          padding: 7rem 0 4rem;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .hero-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(120px);
          pointer-events: none;
          opacity: 0.25;
        }
        .hero-glow-left {
          top: -100px;
          left: -150px;
          background: radial-gradient(circle, #7c3aed 0%, transparent 70%);
        }
        .hero-glow-right {
          bottom: -150px;
          right: -150px;
          background: radial-gradient(circle, #3b82f6 0%, transparent 70%);
        }
        .hero-inner {
          display: flex;
          align-items: center;
          gap: 4rem;
          position: relative;
          z-index: 2;
        }
        .hero-avatar {
          position: relative;
          flex-shrink: 0;
          width: 160px;
          height: 160px;
        }
        .hero-avatar img,
        .avatar-fallback {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(124, 58, 237, 0.15);
          color: var(--accent);
          border: 3px solid rgba(124, 58, 237, 0.4);
        }
        .avatar-ring {
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px dashed rgba(124, 58, 237, 0.3);
          animation: spin-slow 20s linear infinite;
        }
        @keyframes spin-slow { to { transform: rotate(360deg); } }

        .hero-eyebrow {
          font-size: 0.95rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
        }
        .hero-name {
          font-size: 3.5rem;
          font-weight: 900;
          letter-spacing: -1.5px;
          line-height: 1;
          margin-bottom: 0.75rem;
        }
        .hero-title-tag {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--accent);
          background: rgba(124, 58, 237, 0.12);
          border: 1px solid rgba(124, 58, 237, 0.3);
          padding: 0.3rem 0.9rem;
          border-radius: 50px;
          margin-bottom: 1.25rem;
        }
        .hero-bio {
          color: var(--text-muted);
          font-size: 1.05rem;
          line-height: 1.75;
          max-width: 560px;
          margin-bottom: 2rem;
        }
        .hero-bottom-row {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          flex-wrap: wrap;
        }
        .hero-stats {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .stat { text-align: center; }
        .stat-num {
          display: block;
          font-size: 1.8rem;
          font-weight: 900;
          color: white;
          line-height: 1;
        }
        .stat-lbl {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-muted);
          margin-top: 0.25rem;
          display: block;
        }
        .stat-divider {
          width: 1px;
          height: 32px;
          background: rgba(255,255,255,0.1);
        }
        .portfolio-btn {
          padding: 0.55rem 1.25rem;
          border-radius: 50px;
          border: 1px solid rgba(124,58,237,0.4);
          background: transparent;
          color: var(--accent);
          font-size: 0.85rem;
          font-weight: 700;
          transition: all 0.25s;
          text-decoration: none;
        }
        .portfolio-btn:hover {
          background: var(--accent);
          color: white;
          box-shadow: 0 4px 16px rgba(124,58,237,0.35);
        }

        /* ── Filter ── */
        .filter-row {
          display: flex;
          gap: 0.75rem;
          margin: 3.5rem 0 2rem;
          flex-wrap: wrap;
        }
        .filter-pill {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.55rem 1.25rem;
          border-radius: 50px;
          border: 1px solid var(--glass-border);
          background: transparent;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s;
        }
        .filter-pill:hover {
          color: white;
          border-color: rgba(124,58,237,0.4);
        }
        .filter-pill--active {
          background: var(--accent);
          border-color: var(--accent);
          color: white;
          box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35);
        }

        /* ── Featured card ── */
        .featured-card {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-radius: 28px;
          overflow: hidden;
          margin-bottom: 3.5rem;
          text-decoration: none;
          transition: transform 0.35s, box-shadow 0.35s;
          min-height: 380px;
        }
        .featured-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 60px rgba(0,0,0,0.4);
        }
        .featured-img {
          background-size: cover;
          background-position: center;
          position: relative;
          min-height: 340px;
        }
        .featured-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, transparent 60%, rgba(10,10,20,0.8) 100%);
        }
        .featured-badge {
          position: absolute;
          top: 1.25rem;
          left: 1.25rem;
          background: var(--accent);
          color: white;
          padding: 0.35rem 0.85rem;
          border-radius: 50px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .featured-body {
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1rem;
        }
        .featured-title {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1.2;
          color: white;
        }
        .featured-excerpt {
          color: var(--text-muted);
          line-height: 1.75;
          font-size: 0.95rem;
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .featured-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .read-cta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--accent);
          font-weight: 700;
          font-size: 0.88rem;
          transition: gap 0.2s;
        }
        .featured-card:hover .read-cta { gap: 0.7rem; }

        /* ── Section label ── */
        .section-label {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .section-label span {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .section-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        /* ── Post cards grid ── */
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.75rem;
          padding-bottom: 7rem;
        }
        .post-card {
          display: flex;
          flex-direction: column;
          border-radius: 20px;
          overflow: hidden;
          text-decoration: none;
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .post-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.35);
        }
        .post-card-img {
          height: 190px;
          background-size: cover;
          background-position: center;
        }
        .post-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          flex: 1;
        }
        .post-card-title {
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.3;
          color: white;
        }
        .post-card-excerpt {
          color: var(--text-muted);
          font-size: 0.88rem;
          line-height: 1.65;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .post-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .arrow-icon {
          color: var(--text-muted);
          transition: transform 0.2s, color 0.2s;
        }
        .post-card:hover .arrow-icon {
          color: var(--accent);
          transform: translateX(4px);
        }

        /* ── Shared ── */
        .cat-pill {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--accent);
          background: rgba(124, 58, 237, 0.12);
          border: 1px solid rgba(124, 58, 237, 0.25);
          padding: 0.25rem 0.7rem;
          border-radius: 50px;
        }
        .post-meta {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.79rem;
          color: var(--text-muted);
        }
        .dot { opacity: 0.4; }

        /* ── Skeleton ── */
        .skeleton-card {
          height: 320px;
          border-radius: 20px;
          background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%);
          background-size: 400% 100%;
          animation: shimmer 1.6s infinite;
        }
        @keyframes shimmer { to { background-position: -400% 0; } }

        /* ── Empty ── */
        .empty-state {
          text-align: center;
          color: var(--text-muted);
          padding: 5rem;
          font-size: 1.05rem;
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .hero-inner { gap: 2.5rem; }
          .hero-name { font-size: 2.5rem; }
          .featured-card { grid-template-columns: 1fr; }
          .featured-img { min-height: 240px; }
          .featured-img-overlay { background: linear-gradient(to bottom, transparent 50%, rgba(10,10,20,0.85) 100%); }
        }
        @media (max-width: 640px) {
          .hero-banner { padding: 5.5rem 0 3rem; }
          .hero-inner { flex-direction: column; text-align: center; gap: 1.75rem; }
          .hero-bio { margin: 0 auto 1.5rem; }
          .hero-stats { justify-content: center; }
          .hero-avatar { width: 120px; height: 120px; }
          .hero-name { font-size: 2rem; }
          .posts-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
