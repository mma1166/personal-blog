'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail, Facebook, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <Link href="/" className="brand-logo gradient-text">MUNTASIR</Link>
          </div>
          
          <nav className="footer-center">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/tech" className="nav-link">Tech</Link>
            <Link href="/travel" className="nav-link">Travel</Link>
            <Link href="/chronicles" className="nav-link">Chronicles</Link>
          </nav>
          
          <div className="footer-right">
            <div className="social-links">
              <a href="https://github.com/mma1166" target="_blank" rel="noopener noreferrer"><Github size={16} /></a>
              <a href="https://linkedin.com/in/muntasiramit" target="_blank" rel="noopener noreferrer"><Linkedin size={16} /></a>
              <a href="https://facebook.com/mma1166" target="_blank" rel="noopener noreferrer"><Facebook size={16} /></a>
              <a href="mailto:muntasir145@gmail.com"><Mail size={16} /></a>
            </div>
            <span className="footer-divider" />
            <a href="https://portfolio.muntasiramit.me" target="_blank" rel="noopener noreferrer" className="portfolio-cta">
              Portfolio <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-section {
          width: 100%;
          background: rgba(10, 10, 15, 0.9);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-top: 1px solid var(--glass-border);
          padding: 1rem 0;
          margin-top: 4rem;
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }
        .footer-left, .footer-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .brand-logo {
          font-size: 1rem;
          font-weight: 900;
          letter-spacing: 1.5px;
        }
        .footer-divider {
          width: 1px;
          height: 14px;
          background: var(--glass-border);
        }
        .footer-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          opacity: 0.8;
          white-space: nowrap;
        }
        .footer-center {
          display: flex;
          gap: 1.5rem;
        }
        .nav-link {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: white;
        }
        .social-links {
          display: flex;
          gap: 0.75rem;
        }
        .social-links a {
          color: var(--text-muted);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }
        .social-links a:hover {
          color: white;
          transform: translateY(-2px);
        }
        .portfolio-cta {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--accent);
          display: flex;
          align-items: center;
          gap: 0.4rem;
          white-space: nowrap;
        }
        @media (max-width: 900px) {
          .footer-center {
            display: none;
          }
        }
        @media (max-width: 600px) {
          .footer-content {
            flex-direction: column;
            gap: 1.5rem;
            padding: 1rem 0;
          }
          .footer-left {
            order: 1;
          }
          .footer-right {
            order: 2;
            flex-direction: column;
            gap: 1rem;
          }
          .footer-divider {
            display: none;
          }
          .social-links {
            gap: 1.25rem;
          }
          .social-links a {
            padding: 0.5rem;
            background: rgba(255,255,255,0.05);
            border-radius: 50%;
          }
        }
      `}</style>
    </footer>
  );
}
