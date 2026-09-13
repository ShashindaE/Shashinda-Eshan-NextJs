'use client'

import { useState } from 'react'

const sections = ['home', 'about', 'services', 'work', 'testimonials', 'blog', 'contact'];

export function ArrowLink({ children, href = '#', onClick }) {
  return (
    <a className="arrow-link" href={href} onClick={onClick}>
      {children}<span>&#8599;</span>
    </a>
  );
}

export function Header({ activeSection, mobileMenuOpen, onToggleMenu, isHome = false }) {
  const getHref = (section) => isHome ? `#${section}` : `/#${section}`;
  
  return (
    <header className={`site-header ${(!isHome || activeSection > 0) ? 'is-solid' : ''}`}>
      <a className="brand" href={isHome ? "#home" : "/"}>
        <img src="/logo-dark.png" alt="Shashinda Eshan" />
      </a>
      <nav aria-label="Main navigation">
        {sections.map((section, index) => (
          <a className={isHome && activeSection === index ? 'active' : ''} href={getHref(section)} key={section}>{section}</a>
        ))}
      </nav>
      <a className="phone" href="tel:+94769415015">+94 76 941 5015</a>
      <button
        type="button"
        className={`hamburger ${mobileMenuOpen ? 'is-active' : ''}`}
        aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileMenuOpen}
        onClick={onToggleMenu}
      >
        <span /><span /><span />
      </button>
    </header>
  );
}

export function MobileMenu({ isOpen, activeSection, onClose, isHome = false }) {
  const getHref = (section) => isHome ? `#${section}` : `/#${section}`;

  return (
    <div className={`mobile-menu ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
      <nav aria-label="Mobile navigation">
        {sections.map((section, index) => (
          <a className={isHome && activeSection === index ? 'active' : ''} href={getHref(section)} key={section} onClick={onClose}>{section}</a>
        ))}
      </nav>
      <div className="mobile-menu-footer">
        <a className="mobile-menu-phone" href="tel:+94769415015">+94 76 941 5015</a>
        <div className="mobile-menu-socials">
          <a href="https://www.facebook.com/shashindaesh/" aria-label="Facebook">f</a>
          <a href="https://www.linkedin.com/in/shashinda-eshan" aria-label="LinkedIn">in</a>
          <a href="https://www.instagram.com/shashindaeshan" aria-label="Instagram">&#9678;</a>
        </div>
      </div>
    </div>
  );
}

export function FixedUI({ activeSection, isHome = false }) {
  return (
    <>
      <aside className="social-sidebar" aria-hidden="true">
        <span className="sidebar-line" />
        <a href="https://www.facebook.com/shashindaesh/" aria-label="Facebook">f</a>
        <a href="https://www.linkedin.com/in/shashinda-eshan" aria-label="LinkedIn">in</a>
        <a href="https://www.instagram.com/shashindaeshan" aria-label="Instagram">&#9678;</a>
        <span className="sidebar-line" />
      </aside>
      <div className="copyright">&#169; Shashinda.2025</div>
      <div className="language"><span>&#127468;&#127463;</span> EN <b>&#8963;</b></div>
      {isHome && (
        <div className="progress-rail">
          <span style={{ height: `${((activeSection + 1) / sections.length) * 100}%` }} />
        </div>
      )}
    </>
  );
}

export function SiteShell({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Header
        activeSection={-1}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMenu={() => setMobileMenuOpen((open) => !open)}
        isHome={false}
      />
      <MobileMenu
        isOpen={mobileMenuOpen}
        activeSection={-1}
        onClose={() => setMobileMenuOpen(false)}
        isHome={false}
      />
      <FixedUI activeSection={-1} isHome={false} />
      
      {/* 
        On the shop, we want standard vertical scrolling.
        We wrap the content in a div that fills the viewport and allows scroll, 
        giving space for the FixedUI overlays.
      */}
      <div className="experience-shell">
        <main className="site-content" style={{ overflowY: 'auto', height: '100vh', width: '100%' }}>
          {children}
        </main>
      </div>
    </>
  )
}
