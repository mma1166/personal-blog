'use client';

import { useState } from 'react';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { Save, Eye, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBlogs } from '@/hooks/useBlogs';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/admin/ImageUpload';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('tech');
  const [published, setPublished] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [sortOrder, setSortOrder] = useState('999');
  const [featured, setFeatured] = useState(false);
  const { createBlog } = useBlogs();
  const router = useRouter();

  const handleSave = async () => {
    if (!title || !content) {
      alert('Please provide a title and content.');
      return;
    }

    try {
      await createBlog({
        title,
        content,
        category,
        published,
        featured,
        sort_order: parseInt(sortOrder) || 999,
        slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        image_url: imageUrl || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format@fit=crop&q=80&w=800'
      });
      alert('Blog post created successfully!');
      router.push('/admin');
    } catch (err: any) {
      console.error('Blog creation error:', err);
      alert('Error creating blog post: ' + (err?.message || err?.error_description || JSON.stringify(err)));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="container admin-container"
    >
      <header className="admin-header">
        <div>
          <h1 className="gradient-text">Create New Post</h1>
          <p className="text-muted">Draft your next masterpiece.</p>
        </div>
        <div className="action-buttons">
          <button className="btn secondary" onClick={() => setPublished(!published)}>
            {published ? 'Unpublish' : 'Publish'}
          </button>
          <button className="btn primary" onClick={handleSave}>
            <Save size={18} /> Save Draft
          </button>
        </div>
      </header>

      <div className="editor-layout">
        <div className="main-editor-section">
          <input
            type="text"
            placeholder="Post Title"
            className="title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TiptapEditor content={content} onChange={setContent} />
        </div>

        <aside className="editor-settings-aside glass">
          <h3>Settings</h3>
          <div className="setting-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="tech">Technology</option>
              <option value="travel">Travel</option>
              <option value="chronicles">Chronicles</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="design">Design</option>
            </select>
          </div>

          <div className="setting-group">
            <label>Display Order (Lower = First)</label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              placeholder="999"
              style={{ padding: '0.4rem', borderRadius: '4px', background: 'var(--background)', color: 'white', border: '1px solid var(--glass-border)', width: '100%' }}
            />
          </div>

          <div className="setting-group">
            <label>Spotlight</label>
            <button
              type="button"
              onClick={() => setFeatured(f => !f)}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: '8px',
                border: featured ? '1px solid rgba(250,204,21,0.6)' : '1px solid var(--glass-border)',
                background: featured ? 'rgba(250,204,21,0.1)' : 'transparent',
                color: featured ? '#facc15' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s',
              }}
            >
              {featured ? '★ Featured Post' : '☆ Mark as Featured'}
            </button>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.4 }}>
              Featured posts appear in the spotlight section of each page.
            </p>
          </div>

          <ImageUpload
            value={imageUrl}
            onChange={setImageUrl}
            label="Featured Image"
          />
        </aside>
      </div>

      <style jsx>{`
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .action-buttons {
          display: flex;
          gap: 1rem;
        }
        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn.primary {
          background: var(--accent);
          color: white;
          border: none;
        }
        .btn.secondary {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          color: white;
        }
        .editor-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 2rem;
        }
        .title-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--glass-border);
          color: white;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 2rem;
          padding: 1rem 0;
          outline: none;
        }
        .title-input::placeholder {
          color: var(--glass-border);
        }
        .editor-settings-aside {
          padding: 1.5rem;
          height: fit-content;
        }
        .setting-group {
          margin-top: 1.5rem;
        }
        label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }
        select, input[type="text"] {
          width: 100%;
          background: var(--background);
          border: 1px solid var(--glass-border);
          color: white;
          padding: 0.5rem;
          border-radius: 4px;
        }
        @media (max-width: 1024px) {
          .editor-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
}
