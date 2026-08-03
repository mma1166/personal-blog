"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Share2, Facebook, Linkedin, Clock, X, ZoomIn, ZoomOut } from "lucide-react";

type BlogData = {
  title: string;
  content: string;
  author?: string;
  created_at?: string;
  image_url?: string;
  imageUrl?: string;
};

type BlogPost = {
  title: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
};

export default function BlogPostClient({ blogData }: { blogData: BlogData }) {
  const initialPost: BlogPost = {
    title: blogData.title || 'Untitled post',
    content: blogData.content || '',
    author: blogData.author || 'Md Muntasir Mahmud Amit',
    date: blogData.created_at ? new Date(blogData.created_at).toLocaleDateString('en-GB') : 'Today',
    imageUrl: blogData.image_url || blogData.imageUrl || '',
  };

  const [post] = useState<BlogPost>(() => initialPost);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  // blogData is used to derive initial state; updates to blogData would require remounting or external handling

  const openImage = (src: string) => {
    setSelectedImage(src);
    setZoomLevel(1);
    setDragPos({ x: 0, y: 0 });
  };

  // delegate image clicks from rendered HTML
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t && t.tagName === 'IMG') {
        e.preventDefault();
        e.stopPropagation();
        openImage((t as HTMLImageElement).src);
      }
    };
    container.addEventListener('click', onClick);
    return () => container.removeEventListener('click', onClick);
  }, [post]);

  const handleZoomIn = () => setZoomLevel(z => Math.min(4, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => {
    const next = Math.max(0.5, +(zoomLevel - 0.25).toFixed(2));
    if (next <= 1) setDragPos({ x: 0, y: 0 });
    setZoomLevel(next);
  };

  const handleShare = (e: React.MouseEvent, platform: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = typeof window !== 'undefined' ? window.location.href : '';
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
        break;
      case 'copy':
        navigator.clipboard?.writeText(url).then(() => alert('Link copied to clipboard!'));
        break;
    }
  };

  return (
    <>
      {/* Lightbox modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 1000, maxHeight: '94vh', display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 12, overflow: 'hidden' }}
            >
              <div style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e6e6e6' }}>
                <strong style={{ color: '#111' }}>Image Preview</strong>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button onClick={handleZoomOut} style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid #ddd', background: '#f3f4f6', cursor: 'pointer' }} title="Zoom Out"><ZoomOut size={16} /></button>
                  <span style={{ minWidth: 42, textAlign: 'center', fontWeight: 700, color: '#6b7280' }}>{Math.round(zoomLevel * 100)}%</span>
                  <button onClick={handleZoomIn} style={{ padding: '8px 10px', borderRadius: 8, border: 'none', background: '#7c3aed', color: '#fff', cursor: 'pointer' }} title="Zoom In"><ZoomIn size={16} /></button>
                  <button onClick={() => setSelectedImage(null)} style={{ marginLeft: 6, padding: 8, borderRadius: 8, border: 'none', background: '#f3f4f6', cursor: 'pointer' }} title="Close"><X size={16} /></button>
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, background: '#fafafa', overflow: 'hidden', cursor: zoomLevel > 1 ? 'grab' : 'default' }}>
                <motion.div drag={zoomLevel > 1} dragMomentum={false} onDragEnd={(_, info) => setDragPos(p => ({ x: p.x + info.offset.x, y: p.y + info.offset.y }))} animate={{ x: dragPos.x, y: dragPos.y }} style={{ display: 'inline-block' }} whileDrag={{ cursor: 'grabbing' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedImage} alt="Full size" draggable={false} style={{ maxWidth: '100%', maxHeight: 'calc(94vh - 120px)', objectFit: 'contain', transform: `scale(${zoomLevel})`, transition: 'transform 0.25s ease', borderRadius: 8, userSelect: 'none', display: 'block' }} />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="post-view">
        <div className="post-hero" style={{ backgroundImage: post.imageUrl ? `url('${post.imageUrl}')` : 'none' }}>
          <div className="hero-overlay" />
        </div>

        <div className="container post-container">
          <article className="post-main-card glass">
            <header className="post-header">
              <h1 className="post-title">{post.title}</h1>

              <div className="post-meta-detailed">
                <div className="meta-item">
                  <div className="author-avatar">{post.author.charAt(0)}</div>
                  <div className="meta-text">
                    <span className="label">Author</span>
                    <span className="value">{post.author}</span>
                  </div>
                </div>

                <div className="meta-divider" />

                <div className="meta-item">
                  <Calendar size={16} className="meta-icon" />
                  <div className="meta-text">
                    <span className="label">Date</span>
                    <span className="value">{post.date}</span>
                  </div>
                </div>

                <div className="meta-divider" />

                <div className="meta-item">
                  <Clock size={16} className="meta-icon" />
                  <div className="meta-text">
                    <span className="label">Read Time</span>
                    <span className="value">{Math.max(1, Math.ceil((post.content || '').replace(/<[^>]*>/g, '').trim().split(/\s+/).filter((w: string) => w.length > 0).length / 200))} min</span>
                  </div>
                </div>
              </div>
            </header>

            <div className="post-layout-grid">
              <main ref={contentRef} className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

              <aside className="post-sidebar">
                <div className="share-menu-sticky glass">
                  <span className="share-label">Share</span>
                  <div className="share-buttons">
                    <button onClick={(e) => handleShare(e, 'facebook')} title="Share on Facebook"><Facebook size={16} /></button>
                    <button onClick={(e) => handleShare(e, 'linkedin')} title="Share on LinkedIn"><Linkedin size={16} /></button>
                    <button onClick={(e) => handleShare(e, 'copy')} title="Copy Link"><Share2 size={16} /></button>
                  </div>
                </div>
              </aside>
            </div>

            {/* mobile floating share */}
            <div className="mobile-share">
              <button onClick={(e) => handleShare(e, 'facebook')} title="Share on Facebook"><Facebook size={18} /></button>
              <button onClick={(e) => handleShare(e, 'linkedin')} title="Share on LinkedIn"><Linkedin size={18} /></button>
              <button onClick={(e) => handleShare(e, 'copy')} title="Copy Link"><Share2 size={18} /></button>
            </div>
          </article>
        </div>

        <style jsx>{`
          .post-view { position: relative; background: var(--background); min-height: 100vh; overflow-x: hidden; }
          .post-hero { position: absolute; inset: 0; height: 55vh; background-size: cover; background-position: center; z-index: 1; }
          .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(5,5,5,0.25), rgba(5,5,5,1)); }

          .post-container { position: relative; z-index: 10; padding-top: 14vh; padding-bottom: 4rem; }
          .post-main-card { border-radius: 24px; padding: 3.25rem 2rem; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 30px 80px rgba(0,0,0,0.55); background: rgba(12,12,14,0.86); }

          .post-header { text-align: center; margin-bottom: 2.75rem; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 2.25rem; }
          .post-title { font-size: 2.8rem; font-weight: 900; line-height: 1.08; margin-bottom: 1.25rem; background: linear-gradient(to bottom, #fff 40%, #a78bfa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

          .post-meta-detailed { display: flex; align-items: center; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }
          .meta-item { display: flex; align-items: center; gap: 0.6rem; text-align: left; }
          .author-avatar { width: 40px; height: 40px; background: var(--accent); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; }
          .meta-divider { width: 1px; height: 28px; background: rgba(255,255,255,0.06); }
          .label { display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; }
          .value { font-size: 0.9rem; color: white; font-weight: 600; }

          .post-layout-grid { display: grid; grid-template-columns: 1fr 84px; gap: 24px; align-items: start; }
          .post-content {
            font-size: 1rem;
            line-height: 1.8;
            color: #e2e8f0;
            word-break: break-word;
            overflow-wrap: anywhere;
          }
          .post-content :global(*) {
            color: inherit !important;
            max-width: 100%;
          }
          .post-content :global(strong),
          .post-content :global(b) {
            font-weight: 700 !important;
          }
          .post-content :global(em),
          .post-content :global(i) {
            font-style: italic !important;
          }
          .post-content :global(u) {
            text-decoration: underline !important;
          }
          .post-content :global(s),
          .post-content :global(strike) {
            text-decoration: line-through !important;
          }
          .post-content :global(p) {
            margin: 0 0 1rem;
          }
          .post-content :global(h2),
          .post-content :global(h3) {
            color: #fff !important;
            margin: 2rem 0 1rem;
            line-height: 1.25;
            font-weight: 800;
          }
          .post-content :global(h2) { font-size: clamp(1.3rem, 3vw, 1.8rem); }
          .post-content :global(h3) { font-size: clamp(1.15rem, 2.4vw, 1.45rem); }
          .post-content :global(ul),
          .post-content :global(ol) {
            margin: 0 0 1rem;
            padding-left: 1.25rem;
          }
          .post-content :global(li) {
            margin: 0.35rem 0;
            line-height: 1.7;
          }
          .post-content :global(li > p) {
            margin: 0;
          }
          .post-content :global(blockquote) {
            margin: 1.25rem 0;
            padding: 0.9rem 1rem;
            border-left: 3px solid var(--accent);
            background: rgba(124, 58, 237, 0.08);
            border-radius: 0 12px 12px 0;
          }
          .post-content :global(pre) {
            margin: 1.25rem 0;
            padding: 1rem;
            overflow-x: auto;
            border-radius: 12px;
            background: rgba(255,255,255,0.06);
          }
          .post-content :global(code) {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace;
            font-size: 0.92em;
          }
          .post-content :global(img) {
            width: 100%;
            height: auto;
            border-radius: 16px;
            margin: 1.25rem 0;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            cursor: zoom-in;
          }
          .post-content :global(iframe),
          .post-content :global(video) {
            width: 100%;
            max-width: 100%;
            aspect-ratio: 16 / 9;
            height: auto;
            border: 0;
            border-radius: 16px;
            margin: 1.25rem 0;
          }
          .post-content :global(hr) {
            border: 0;
            border-top: 1px solid rgba(255,255,255,0.08);
            margin: 1.5rem 0;
          }

          .post-sidebar { display: block; }
          .share-menu-sticky { position: sticky; top: 96px; padding: 1rem 0.6rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; border-radius: 20px; background: rgba(18,18,20,0.6); border: 1px solid rgba(255,255,255,0.04); }
          .share-label { writing-mode: vertical-rl; font-size: 0.64rem; font-weight: 900; color: var(--accent); text-transform: uppercase; letter-spacing: 1.6px; }
          .share-buttons { display: flex; flex-direction: column; gap: 0.6rem; }
          .share-buttons button { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.06); background: transparent; color: var(--text-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; }

          .mobile-share { display: none; }

          @media (max-width: 1024px) {
            .post-layout-grid { grid-template-columns: 1fr; }
            .post-sidebar { display: none; }
            .post-main-card { padding: 2.25rem 1.25rem; }
            .post-title { font-size: 2.2rem; }
          }

          @media (max-width: 768px) {
            .post-container { padding-top: 8vh; }
            .post-hero { height: 40vh; }
            .post-main-card { border-radius: 12px; padding: 1.25rem; }
            .post-title { font-size: 1.6rem; }
            .post-content { font-size: 1rem; }
            .post-content :global(img) { border-radius: 12px; margin: 1rem 0; }

            .mobile-share { display: flex; position: fixed; left: 50%; transform: translateX(-50%); bottom: 16px; gap: 12px; background: rgba(10,10,12,0.9); padding: 8px 12px; border-radius: 999px; z-index: 60; box-shadow: 0 8px 30px rgba(0,0,0,0.5); }
            .mobile-share button { background: transparent; border: none; color: var(--text-muted); display: flex; align-items: center; justify-content: center; }
          }

          @media (max-width: 480px) {
            .post-hero { height: 34vh; }
            .post-container { padding-top: 6vh; }
            .post-title { font-size: 1.25rem; }
            .post-main-card { padding: 1rem; border-radius: 8px; }
          }
        `}</style>
      </div>
    </>
  );
}
