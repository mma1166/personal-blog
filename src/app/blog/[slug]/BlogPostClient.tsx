'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Share2, Facebook, Linkedin, Clock, X, ZoomIn, ZoomOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function BlogPostClient({ blogData }: { blogData: any }) {
  const [post, setPost] = useState<any>(blogData);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blogData) {
      setPost({
        ...blogData,
        author: blogData.author || 'Md Muntasir Mahmud Amit',
        date: blogData.created_at 
          ? new Date(blogData.created_at).toLocaleDateString('en-GB') 
          : (blogData.date || 'Today'),
        imageUrl: blogData.image_url || blogData.imageUrl
      });
    }
  }, [blogData]);

  // Attach click handler to the rendered HTML content via ref
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG') {
        e.preventDefault();
        e.stopPropagation();
        openImage((target as HTMLImageElement).src);
      }
    };

    container.addEventListener('click', handleClick);
    return () => container.removeEventListener('click', handleClick);
  }, [post]);

  const openImage = (src: string) => {
    setSelectedImage(src);
    setZoomLevel(1);
    setDragPos({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoomLevel(z => Math.min(4, +(z + 0.2).toFixed(1)));
  };

  const handleZoomOut = () => {
    const next = Math.max(0.3, +(zoomLevel - 0.2).toFixed(1));
    if (next <= 1) setDragPos({ x: 0, y: 0 }); // snap back when returning to fit
    setZoomLevel(next);
  };

  const handleShare = (e: React.MouseEvent, platform: string) => {
    e.preventDefault();
    e.stopPropagation();
    const url = window.location.href;
    const text = post?.title || '';
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'width=600,height=400');
        break;
      case 'copy':
        navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
        break;
    }
  };

  if (!post) return <div className="container" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <>
      {/* ===== IMAGE POPUP MODAL ===== */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0,0,0,0.85)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              backdropFilter: 'blur(8px)',
            }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 250 }}
              style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                width: '100%',
                maxWidth: '900px',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
                <span style={{ fontWeight: 700, color: '#111', fontSize: '1rem' }}>Image Preview</span>
                <button
                  onClick={() => setSelectedImage(null)}
                  style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: '#f3f4f6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', transition: 'background 0.2s' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body — with drag-to-pan support */}
              <div
                style={{
                  flex: 1,
                  overflow: 'hidden',
                  background: '#f9fafb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1.5rem',
                  minHeight: '300px',
                  cursor: zoomLevel > 1 ? 'grab' : 'default',
                  position: 'relative',
                }}
              >
                <motion.div
                  drag={zoomLevel > 1}
                  dragMomentum={false}
                  animate={{ x: dragPos.x, y: dragPos.y }}
                  onDragEnd={(_, info) => setDragPos(p => ({ x: p.x + info.offset.x, y: p.y + info.offset.y }))}
                  style={{ display: 'inline-block', cursor: zoomLevel > 1 ? 'grab' : 'default' }}
                  whileDrag={{ cursor: 'grabbing' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage}
                    alt="Full size"
                    draggable={false}
                    style={{
                      maxWidth: '100%',
                      maxHeight: 'calc(90vh - 150px)',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: 'center center',
                      transition: 'transform 0.25s ease',
                      display: 'block',
                      userSelect: 'none',
                    }}
                  />
                </motion.div>
              </div>

              {/* Modal Footer — Zoom controls */}
              <div style={{ padding: '0.875rem 1.5rem', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', background: '#fff' }}>
                <button
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', padding: '0.5rem 1.1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                >
                  <ZoomOut size={18} /> Zoom Out
                </button>
                <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#6b7280', minWidth: '3rem', textAlign: 'center' }}>{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={handleZoomIn}
                  title="Zoom In"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#7c3aed', color: 'white', border: 'none', padding: '0.5rem 1.1rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                >
                  <ZoomIn size={18} /> Zoom In
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== PAGE CONTENT ===== */}
      <div className="post-view">
        {/* Background Image Layer */}
        <div
          className="post-hero-bg"
          style={{ backgroundImage: `url("${post.imageUrl}")` }}
        >
          <div className="hero-overlay" />
        </div>

        <div className="container post-container">
          <motion.article
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="post-main-card glass"
          >
            <header className="post-header">
              <h1 className="post-title">{post.title}</h1>

              <div className="post-meta-detailed">
                <div className="meta-item">
                  <div className="author-avatar">{post.author?.charAt(0)}</div>
                  <div className="meta-text">
                    <span className="label">Author</span>
                    <span className="value">{post.author}</span>
                  </div>
                </div>

                <div className="meta-divider" />

                <div className="meta-item">
                  <Calendar size={18} className="meta-icon" />
                  <div className="meta-text">
                    <span className="label">Date</span>
                    <span className="value">{post.date}</span>
                  </div>
                </div>

                <div className="meta-divider" />

                <div className="meta-item">
                  <Clock size={18} className="meta-icon" />
                  <div className="meta-text">
                    <span className="label">Read Time</span>
                    <span className="value">
                      {Math.max(1, Math.ceil((post.content || '').replace(/<[^>]*>/g, '').trim().split(/\s+/).filter((w: string) => w.length > 0).length / 200))} min
                    </span>
                  </div>
                </div>
              </div>
            </header>

            <div className="post-layout-grid">
              <div className="sidebar-spacer" />
              <div
                ref={contentRef}
                className="post-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <aside className="post-sidebar">
                <div className="share-menu-sticky glass">
                  <span className="share-label">Share</span>
                  <div className="share-buttons">
                    <button onClick={(e) => handleShare(e, 'facebook')} title="Share on Facebook"><Facebook size={18} /></button>
                    <button onClick={(e) => handleShare(e, 'linkedin')} title="Share on LinkedIn"><Linkedin size={18} /></button>
                    <button onClick={(e) => handleShare(e, 'copy')} title="Copy Link"><Share2 size={18} /></button>
                  </div>
                </div>
              </aside>
            </div>
          </motion.article>
        </div>

        <style jsx>{`
        .post-view {
          position: relative;
          background: var(--background);
          min-height: 100vh;
          overflow: hidden;
        }
        .post-hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 60vh;
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          z-index: 1;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, 
            rgba(5, 5, 5, 0.3) 0%, 
            rgba(5, 5, 5, 1) 100%
          );
        }
        .post-container {
          position: relative;
          z-index: 10;
          padding-top: 15vh;
          padding-bottom: 5rem;
        }
        .post-main-card {
          background: rgba(15, 15, 15, 0.85) !important;
          backdrop-filter: blur(20px) !important;
          border-radius: 32px;
          padding: 4rem 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 40px 100px rgba(0,0,0,0.6);
        }
        .post-header {
          text-align: center;
          margin-bottom: 4rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 3rem;
        }
        .post-title {
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 2.5rem;
          background: linear-gradient(to bottom, #fff 40%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .post-meta-detailed {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2.5rem;
        }
        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-align: left;
        }
        .author-avatar {
          width: 40px;
          height: 40px;
          background: var(--accent);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }
        .meta-divider {
          width: 1px;
          height: 30px;
          background: rgba(255, 255, 255, 0.1);
        }
        .label {
          display: block;
          font-size: 0.65rem;
          color: var(--text-muted);
          text-transform: uppercase;
          font-weight: 700;
        }
        .value {
          font-size: 0.9rem;
          color: white;
          font-weight: 600;
        }
        .meta-icon {
          color: var(--accent);
        }
        .post-layout-grid {
          display: grid;
          grid-template-columns: 60px 1fr 60px;
          gap: 2rem;
        }
        .sidebar-spacer {
          width: 60px;
        }
        .post-content {
          font-size: 1.15rem;
          line-height: 1.9;
          color: #e2e8f0;
        }
        .post-content :global(*) {
          color: #e2e8f0 !important;
        }
        .post-content :global(h2), .post-content :global(h3) {
          color: white !important;
          margin: 3.5rem 0 1.5rem;
          font-size: 2rem;
          font-weight: 800;
        }
        .post-content :global(p) {
          margin-bottom: 2rem;
        }
        .post-content :global(img) {
          max-width: 100%;
          height: auto;
          border-radius: 20px;
          margin: 3rem 0;
          cursor: zoom-in;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .post-content :global(ul), .post-content :global(ol) {
          padding-left: 2.5rem;
          margin-bottom: 2rem;
        }
        .post-content :global(ul) {
          list-style-type: disc;
        }
        .post-content :global(ol) {
          list-style-type: decimal;
        }
        .post-content :global(li) {
          margin-bottom: 0.75rem;
        }
        .share-menu-sticky {
          position: sticky;
          top: 8rem;
          padding: 2.5rem 0.6rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          border-radius: 50px;
          background: rgba(20, 20, 20, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .share-label {
          writing-mode: vertical-rl;
          font-size: 0.65rem;
          font-weight: 900;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        .share-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .share-buttons button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: transparent;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .share-buttons button:hover {
          background: var(--accent);
          color: white;
          transform: scale(1.15) rotate(5deg);
        }
        @media (max-width: 1024px) {
          .post-layout-grid { grid-template-columns: 1fr; }
          .sidebar-spacer { display: none; }
          .post-sidebar { display: none; }
          .post-main-card { padding: 3rem 1.5rem; }
          .post-title { font-size: 2.5rem; }
        }
        @media (max-width: 768px) {
          .post-container { padding: 5rem 0 0 0; }
          .post-main-card { 
            padding: 2.5rem 1.5rem; 
            border-radius: 0; 
            border-left: none; 
            border-right: none; 
            width: 100%; 
            box-sizing: border-box; 
            background: #0a0a0c !important; 
            backdrop-filter: none !important;
          }
          .post-meta-detailed { flex-direction: column; gap: 1rem; align-items: flex-start; }
          .meta-item { width: 100%; }
          .meta-divider { display: none; }
          .post-hero-bg { height: 35vh; }
          .post-title { 
            font-size: 2.2rem; 
            text-align: left; 
            margin-bottom: 1.5rem; 
            background: none !important; 
            -webkit-text-fill-color: #ffffff !important; 
            color: #ffffff !important; 
            line-height: 1.3;
            word-wrap: break-word; 
            hyphens: auto; 
          }
          .post-header { text-align: left; padding-bottom: 2rem; margin-bottom: 2.5rem; }
          .post-content { font-size: 1.1rem; line-height: 1.8; overflow-wrap: break-word; word-break: break-word; }
          .post-content :global(h2), .post-content :global(h3) { font-size: 1.6rem; margin: 2.5rem 0 1rem; }
          .post-content :global(img) { border-radius: 12px; margin: 2rem 0; width: 100%; }
        }
        @media (max-width: 480px) {
          .post-main-card { padding: 2rem 1.25rem; }
          .post-title { font-size: 1.85rem; }
        }
      `}</style>
      </div>
    </>
  );
}
