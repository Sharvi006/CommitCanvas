import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

/**
 * 1. Blob Background Layer (Fixed, z-index: -1)
 * Wrap the 5 blobs inside .blob-container with filter: blur(35px)
 * Colors: .blob-1 (#CDB4DB), .blob-2 (#FFC8DD), .blob-3 (#FFAFCC), .blob-4 (#BDE0FE), .blob-5 (#A2D2FF)
 * Uses mix-blend-mode: multiply and asymmetrical morphAndMove animation
 */
export function BlobBackground() {
  return (
    <div className="blob-container" aria-hidden="true">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />
      <div className="blob blob-5" />
    </div>
  );
}

/**
 * 2. Floating Pill Navbar (Fixed, top: 24px, z-index: 100)
 * Container: .navbar-wrapper (adds .shrunk when scrolled > 40px)
 * Inner Pill: .pill-nav with max-width: 800px, height: 56px, border-radius: 100px,
 *             background: rgba(22, 27, 34, 0.6), and backdrop-filter: blur(24px)
 * Logo: .logo-circle (36x36 white circle with SVG Git node icon)
 * Links: <NavLink> components styled like .nav-center button (active tab gets color: #fff)
 */
export function PillNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'shrunk' : ''}`}>
      <nav className={`pill-nav ${isScrolled ? 'shrunk' : ''}`} role="navigation" aria-label="Main navigation">
        {/* Logo */}
        <div className="nav-left">
          <NavLink to="/" className="logo-circle" aria-label="CommitCanvas Home">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="6" cy="18" r="3" />
              <circle cx="6" cy="6" r="3" />
              <circle cx="18" cy="18" r="3" />
              <line x1="6" y1="9" x2="6" y2="15" />
              <path d="M9 18h7a2 2 0 0 0 2-2V9" />
            </svg>
          </NavLink>
        </div>

        {/* Navigation Center Links */}
        <div className="nav-center">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Home
          </NavLink>
          <NavLink
            to="/playground"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Playground
          </NavLink>
          <NavLink
            to="/learning"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Learn
          </NavLink>
          <NavLink
            to="/challenges"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <span style={{ color: 'var(--accent-glow)', fontWeight: 600 }}>Challenges</span>
          </NavLink>
        </div>

        {/* CTA */}
        <div className="nav-right">
          <a href="/login" className="btn-login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
            Log In
          </a>
        </div>
      </nav>
    </header>
  );
}

/**
 * RootLayout wrapper that renders the floating background blobs and top pill navbar
 */
export default function RootLayout({ children }) {
  return (
    <>
      <BlobBackground />
      <PillNavbar />
      <main id="main-content" style={{ minHeight: '100vh', position: 'relative' }}>
        {children}
      </main>
    </>
  );
}
