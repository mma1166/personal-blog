'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, PlusCircle, Settings, LogOut, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) {
        // For development without supabase, check local storage for a mock session
        const mockSession = typeof window !== 'undefined' ? localStorage.getItem('admin_mock_session') : null;
        setIsAuthenticated(!!mockSession);
        setLoading(false);

        if (!mockSession && pathname !== '/admin/login') {
          router.push('/admin/login');
        }
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);

      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase?.auth.onAuthStateChange((_event: any, session: any) => {
      setIsAuthenticated(!!session);
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    }) || { data: { subscription: null } };

    return () => {
      subscription?.unsubscribe();
    };
  }, [pathname, router]);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('admin_mock_session');
    }
    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <Loader2 className="animate-spin" size={40} color="var(--accent)" />
        <style jsx>{`
                    .admin-loading {
                        height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
      </div>
    );
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar glass">
        <div className="sidebar-content">
          <h2 className="gradient-text">Studio</h2>
          <nav className="sidebar-nav">
            <Link href="/admin" className={pathname === '/admin' ? 'active' : ''}>
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link href="/admin/new" className={pathname === '/admin/new' ? 'active' : ''}>
              <PlusCircle size={20} /> New Post
            </Link>
            <Link href="/admin/settings" className={pathname === '/admin/settings' ? 'active' : ''}>
              <Settings size={20} /> Settings
            </Link>
          </nav>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
      <div className="admin-main">
        {children}
      </div>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          gap: 2rem;
          padding-bottom: 2rem;
          padding-top: 8rem;
        }
        .admin-sidebar {
          width: 260px;
          height: fit-content;
          position: sticky;
          top: 6rem;
          padding: 2rem;
          border-radius: 20px;
        }
        .sidebar-content {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          min-height: 400px;
        }
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .sidebar-nav :global(a) {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-muted);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          font-weight: 500;
          transition: all 0.3s;
        }
        .sidebar-nav :global(a:hover), .sidebar-nav :global(a.active) {
          color: var(--foreground);
          background: rgba(255, 255, 255, 0.05);
        }
        .sidebar-nav :global(a.active) {
          color: var(--accent);
          background: rgba(124, 58, 237, 0.1);
          border: 1px solid rgba(124, 58, 237, 0.2);
        }
        .admin-main {
          flex: 1;
        }
        .logout-btn {
          margin-top: auto;
          background: transparent;
          border: 1px solid var(--glass-border);
          color: var(--text-muted);
          padding: 0.75rem 1rem;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s;
        }
        .logout-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border-color: rgba(239, 68, 68, 0.2);
        }
        @media (max-width: 992px) {
          .admin-layout {
            flex-direction: column;
          }
          .admin-sidebar {
            width: 100%;
            position: relative;
            top: 0;
          }
          .sidebar-content {
            min-height: auto;
          }
        }
      `}</style>
    </div>
  );
}
