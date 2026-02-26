'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  slug: string;
  imageUrl?: string;
}

export default function BlogCard({ title, excerpt, category, date, slug, imageUrl }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="card glass"
    >
      {imageUrl && (
        <div className="card-image" style={{ backgroundImage: `url("${imageUrl}")` }} />
      )}
      <div className="card-content">
        <div className="card-meta">
          <span className="category">{category}</span>
          <span><Calendar size={14} /> {date}</span>
        </div>
        <h3 className="card-title">{title}</h3>
        <p className="card-excerpt">{excerpt}</p>
        <Link href={`/blog/${slug}`} className="read-more">
          Read Story <ArrowRight size={16} />
        </Link>
      </div>

      <style jsx>{`
        .card {
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .card-image {
          height: 200px;
          background-size: cover;
          background-position: center;
          border-bottom: 1px solid var(--glass-border);
        }
        .card-content {
          padding: 1.5rem;
        }
        .card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }
        .category {
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--accent);
          font-weight: 600;
        }
        .card-title {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }
        .card-excerpt {
          color: var(--text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .read-more {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--accent);
          font-weight: 600;
          font-size: 0.9rem;
          transition: gap 0.3s;
        }
        .card:hover .read-more {
          gap: 0.75rem;
        }
      `}</style>
    </motion.div>
  );
}
