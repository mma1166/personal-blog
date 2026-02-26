'use client';

import { useBlogs } from '@/hooks/useBlogs';
import { Edit3, Trash2, Eye, ExternalLink, MoreVertical } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const { blogs, loading, deleteBlog, updateBlog } = useBlogs();

    const togglePublish = (id: string, currentStatus: boolean) => {
        updateBlog(id, { published: !currentStatus });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this post?')) {
            deleteBlog(id);
        }
    };

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h1 className="gradient-text">Dashboard</h1>
                <p className="text-muted">You have {blogs.length} published stories.</p>
            </header>

            <div className="stats-grid">
                <div className="stat-card glass">
                    <span className="stat-label">Total Views</span>
                    <span className="stat-value">12.4K</span>
                </div>
                <div className="stat-card glass">
                    <span className="stat-label">Total Blogs</span>
                    <span className="stat-value">{blogs.length}</span>
                </div>
                <div className="stat-card glass">
                    <span className="stat-label">Avg. Reading Time</span>
                    <span className="stat-value">5 min</span>
                </div>
            </div>

            <div className="blogs-table-container glass">
                <table className="blogs-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4}>Loading blogs...</td></tr>
                        ) : blogs.length === 0 ? (
                            <tr><td colSpan={4}>No blogs found. Create your first post!</td></tr>
                        ) : blogs.map((blog) => (
                            <tr key={blog.id}>
                                <td>
                                    <div className="blog-id-cell">
                                        <span className="blog-title">{blog.title}</span>
                                        <span className="blog-slug">/{blog.slug}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge ${blog.published ? 'published' : 'draft'}`}>
                                        {blog.published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td>{new Date(blog.created_at).toLocaleDateString()}</td>
                                <td className="actions-cell">
                                    <div className="action-btns">
                                        <Link href={`/blog/${blog.slug}`} target="_blank" title="View"><ExternalLink size={18} /></Link>
                                        <Link href={`/admin/edit/${blog.id}`} title="Edit"><Edit3 size={18} /></Link>
                                        <button onClick={() => togglePublish(blog.id, blog.published)} title={blog.published ? 'Unpublish' : 'Publish'}>
                                            <Eye size={18} />
                                        </button>
                                        <button className="delete" onClick={() => handleDelete(blog.id)} title="Delete"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
        .admin-dashboard {
          padding-top: 1rem;
        }
        .dashboard-header {
          margin-bottom: 2.5rem;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .stat-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          margin-top: 0.5rem;
        }
        .blogs-table-container {
          overflow-x: auto;
        }
        .blogs-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }
        .blogs-table th, .blogs-table td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--glass-border);
        }
        .blogs-table th {
          font-size: 0.8rem;
          text-transform: uppercase;
          color: var(--text-muted);
        }
        .blog-id-cell {
          display: flex;
          flex-direction: column;
        }
        .blog-title {
          font-weight: 600;
        }
        .blog-slug {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .status-badge.published {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
        }
        .status-badge.draft {
          background: rgba(234, 179, 8, 0.2);
          color: #facc15;
        }
        .actions-cell {
          text-align: right;
        }
        .action-btns {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }
        .action-btns :global(a), .action-btns button {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s;
        }
        .action-btns :global(a:hover), .action-btns button:hover {
          color: var(--accent);
        }
        .action-btns button.delete:hover {
          color: #ef4444;
        }
      `}</style>
        </div>
    );
}
