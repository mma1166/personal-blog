'use client';

import { Github, Linkedin, Mail, Facebook, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-minimal glass">
      <div className="container footer-content">
        <div className="footer-links">
          <a href="https://portfolio.muntasiramit.me" target="_blank" rel="noopener noreferrer" className="portfolio-link">
            Portfolio <ExternalLink size={14} />
          </a>
          <div className="divider" />
          <div className="social-row">
            <a href="https://facebook.com/mma1166" target="_blank" rel="noopener noreferrer" title="Facebook"><Facebook size={18} /></a>
            <a href="https://github.com/mma1166" target="_blank" rel="noopener noreferrer" title="GitHub"><Github size={18} /></a>
            <a href="https://linkedin.com/in/muntasiramit" target="_blank" rel="noopener noreferrer" title="LinkedIn"><Linkedin size={18} /></a>
            <a href="mailto:muntasir145@gmail.com" title="Email"><Mail size={18} /></a>
          </div>
        </div>
        <p className="copyright">&copy; {new Date().getFullYear()} Muntasir Amit</p>
      </div>

      <style jsx>{`
        .footer-minimal {
          margin-top: 4rem;
          padding: 2rem 0;
          border-radius: 30px 30px 0 0;
          border-bottom: none;
        }
        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .portfolio-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          color: var(--accent);
          font-size: 0.9rem;
          letter-spacing: 0.5px;
          transition: transform 0.3s;
        }
        .portfolio-link:hover {
          transform: translateY(-2px);
        }
        .divider {
          width: 1px;
          height: 15px;
          background: rgba(255,255,255,0.1);
        }
        .social-row {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .social-row a {
          color: var(--text-muted);
          transition: all 0.3s;
        }
        .social-row a:hover {
          color: white;
          transform: translateY(-2px);
        }
        .copyright {
          color: var(--text-muted);
          font-size: 0.8rem;
          font-weight: 500;
          opacity: 0.6;
        }
        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
            gap: 1.5rem;
            text-align: center;
          }
          .footer-links {
            flex-direction: column;
            gap: 1rem;
          }
          .divider { display: none; }
        }
      `}</style>
    </footer>
  );
}
