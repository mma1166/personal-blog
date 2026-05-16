'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, Cpu, Home, User, BookOpen } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="nav-container"
    >
      <div className="nav-content glass">
        <Link href="/" className="nav-logo gradient-text">
          MUNTASIR
        </Link>
        <div className="nav-links">
          <Link href="/"><Home size={20} /><span>Home</span></Link>
          <Link href="/tech"><Cpu size={20} /><span>Tech</span></Link>
          <Link href="/travel"><Compass size={20} /><span>Travel</span></Link>
          <Link href="/chronicles"><BookOpen size={20} /><span>Chronicles</span></Link>
          <Link href="/admin"><User size={20} /><span>Admin</span></Link>
        </div>
      </div>

      <style jsx>{`
        .nav-container {
          position: fixed;
          top: 1rem;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          z-index: 1000;
        }
        .nav-content {
          display: flex;
          align-items: center;
          gap: 3rem;
          padding: 0.5rem 1.75rem;
        }
        .nav-logo {
          font-weight: 800;
          font-size: 1.25rem;
          letter-spacing: 2px;
        }
        .nav-links {
          display: flex;
          gap: 1.5rem;
        }
        .nav-links :global(a) {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-muted);
          transition: all 0.3s ease;
        }
        .nav-links :global(a:hover) {
          color: var(--foreground);
          transform: translateY(-1px);
        }
        @media (max-width: 640px) {
          .nav-content {
            gap: 1rem;
            padding: 0.75rem 1rem;
          }
          .nav-links span {
            display: none;
          }
        }
      `}</style>
    </motion.nav>
  );
}
