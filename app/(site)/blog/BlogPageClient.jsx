'use client';

import { useState, useMemo } from 'react';

export default function BlogPageClient({ posts = [], categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extract unique category names from posts or passed categories
  const categoryList = useMemo(() => {
    const map = new Map();
    categories.forEach((cat) => {
      if (cat?.slug && cat?.name) {
        map.set(cat.slug, cat.name);
      }
    });
    // Also include any categories directly assigned on posts
    posts.forEach((post) => {
      (post.categories || []).forEach((cat) => {
        if (typeof cat === 'object' && cat?.slug && cat?.name) {
          map.set(cat.slug, cat.name);
        }
      });
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [posts, categories]);

  // Filter posts based on category and search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Category check
      if (selectedCategory !== 'all') {
        const postCatSlugs = (post.categories || []).map((c) =>
          typeof c === 'object' ? c?.slug : c
        );
        if (!postCatSlugs.includes(selectedCategory)) {
          return false;
        }
      }

      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = (post.title || '').toLowerCase().includes(q);
        const excerptMatch = (post.excerpt || '').toLowerCase().includes(q);
        const tagMatch = (post.tags || []).some((t) =>
          (typeof t === 'object' ? t?.name : t || '').toLowerCase().includes(q)
        );
        const catMatch = (post.categories || []).some((c) =>
          (typeof c === 'object' ? c?.name : c || '').toLowerCase().includes(q)
        );
        if (!titleMatch && !excerptMatch && !tagMatch && !catMatch) {
          return false;
        }
      }

      return true;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Featured spotlight post: prefer explicitly featured when on "all" and no search query
  const featuredPost = useMemo(() => {
    if (selectedCategory === 'all' && !searchQuery.trim() && filteredPosts.length > 0) {
      return filteredPosts.find((p) => p.featured) || filteredPosts[0];
    }
    return null;
  }, [filteredPosts, selectedCategory, searchQuery]);

  // Remaining posts (excluding spotlight if spotlight is shown)
  const gridPosts = useMemo(() => {
    if (featuredPost) {
      return filteredPosts.filter((p) => p.id !== featuredPost.id);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost]);

  const navLinks = [
    { label: 'Home', href: '/#home' },
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Work', href: '/#work' },
    { label: 'Blog', href: '/blog', active: true },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <div className="blog-page">
      {/* ── Site Header ── */}
      <header className="blog-site-header">
        <a className="blog-site-brand" href="/">
          <img
            src="/logo-light.png"
            alt="Shashinda Eshan"
            className="blog-site-logo"
          />
        </a>

        <nav className="blog-site-nav" aria-label="Site navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={link.active ? 'active' : ''}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a className="blog-site-phone" href="tel:+94769415015">
          +94 76 941 5015
        </a>

        <button
          type="button"
          className={`hamburger ${mobileMenuOpen ? 'is-active' : ''}`}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>
      </header>

      {/* ── Mobile Menu ── */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'is-open' : ''}`} aria-hidden={!mobileMenuOpen}>
        <nav aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={link.active ? 'active' : ''}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mobile-menu-footer">
          <a className="mobile-menu-phone" href="tel:+94769415015">
            +94 76 941 5015
          </a>
          <div className="mobile-menu-socials">
            <a href="https://www.facebook.com/shashindaesh/" aria-label="Facebook">f</a>
            <a href="https://www.linkedin.com/in/shashinda-eshan" aria-label="LinkedIn">in</a>
            <a href="https://www.instagram.com/shashindaeshan" aria-label="Instagram">&#9678;</a>
          </div>
        </div>
      </div>

      <main>
        {/* ── Hero Section ── */}
        <section className="blog-hero">
          <div className="blog-hero-eyebrow">
            <span /> 05 / Thoughts &amp; Perspectives
          </div>

          <div className="blog-hero-top">
            <div>
              <h1 className="blog-hero-title">
                Notes from<br />
                <em>the studio.</em>
              </h1>
              <p className="blog-hero-desc">
                A collection of essays, case studies, insights, and design thinking on building
                memorable brands, digital experiences, and creative strategies.
              </p>
            </div>
          </div>

          {/* ── Filters & Search ── */}
          <div className="blog-controls">
            <div className="blog-categories" role="tablist" aria-label="Filter by category">
              <button
                type="button"
                className={`blog-cat-btn ${selectedCategory === 'all' ? 'is-active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Stories ({posts.length})
              </button>
              {categoryList.map((cat) => {
                const count = posts.filter((p) =>
                  (p.categories || []).some((c) => (typeof c === 'object' ? c?.slug : c) === cat.slug)
                ).length;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    className={`blog-cat-btn ${selectedCategory === cat.slug ? 'is-active' : ''}`}
                    onClick={() => setSelectedCategory(cat.slug)}
                  >
                    {cat.name} {count > 0 ? `(${count})` : ''}
                  </button>
                );
              })}
            </div>

            <div className="blog-search-box">
              <span className="blog-search-icon" aria-hidden="true">&#9906;</span>
              <input
                type="text"
                className="blog-search-input"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search articles"
              />
            </div>
          </div>
        </section>

        {/* ── Spotlight Featured Post ── */}
        {featuredPost && (
          <section className="blog-spotlight" aria-label="Featured Story">
            {(() => {
              const coverUrl = featuredPost.coverImage?.thumbnailURL || featuredPost.coverImage?.url || null;
              const date = featuredPost.publishedDate
                ? new Date(featuredPost.publishedDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                : null;
              const categoryNames = (featuredPost.categories || [])
                .map((c) => (typeof c === 'object' ? c?.name : c))
                .filter(Boolean);
              const tagNames = (featuredPost.tags || [])
                .map((t) => (typeof t === 'object' ? t?.name : t))
                .filter(Boolean);

              return (
                <a href={`/blog/${featuredPost.slug}`} className="blog-spotlight-card">
                  <div className="blog-spotlight-media">
                    {coverUrl ? (
                      <img src={coverUrl} alt={featuredPost.title} />
                    ) : (
                      <div className="blog-grid-thumb-placeholder">Editorial</div>
                    )}
                  </div>
                  <div className="blog-spotlight-content">
                    <div className="blog-spotlight-badge">
                      <span>&#9679;</span> Featured Story
                    </div>
                    <h2 className="blog-spotlight-title">{featuredPost.title}</h2>
                    {featuredPost.excerpt && (
                      <p className="blog-spotlight-excerpt">{featuredPost.excerpt}</p>
                    )}
                    <div className="blog-spotlight-meta">
                      {date && <span>{date}</span>}
                      {featuredPost.readingTime && (
                        <>
                          <span>&middot;</span>
                          <span>{featuredPost.readingTime}</span>
                        </>
                      )}
                      {categoryNames.length > 0 && (
                        <>
                          <span>&middot;</span>
                          <span className="blog-grid-cat">{categoryNames.join(', ')}</span>
                        </>
                      )}
                    </div>
                    {tagNames.length > 0 && (
                      <div className="featured-tags" style={{ marginBottom: '20px' }}>
                        {tagNames.map((tag) => `#${tag}`).join('  ')}
                      </div>
                    )}
                    <div className="blog-spotlight-cta">
                      Read full story <span>&#8599;</span>
                    </div>
                  </div>
                </a>
              );
            })()}
          </section>
        )}

        {/* ── Articles Grid ── */}
        <section className="blog-grid-section">
          <div className="blog-grid-header">
            <span className="blog-grid-count">
              {filteredPosts.length === 0
                ? 'No matching articles'
                : `Showing ${filteredPosts.length} ${filteredPosts.length === 1 ? 'article' : 'articles'}`}
            </span>
            {(selectedCategory !== 'all' || searchQuery.trim()) && (
              <button
                type="button"
                className="blog-clear-btn"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                Reset filters &times;
              </button>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="blog-empty-state">
              <p className="blog-empty-title">No articles found</p>
              <p className="blog-empty-desc">
                We couldn&apos;t find any stories matching your current filter or search criteria.
              </p>
              <button
                type="button"
                className="blog-cat-btn is-active"
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
              >
                View all stories
              </button>
            </div>
          ) : (
            <div className="blog-posts-grid">
              {gridPosts.map((post) => {
                const coverUrl = post.coverImage?.thumbnailURL || post.coverImage?.url || null;
                const date = post.publishedDate
                  ? new Date(post.publishedDate).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : null;
                const categoryNames = (post.categories || [])
                  .map((c) => (typeof c === 'object' ? c?.name : c))
                  .filter(Boolean);
                const tagNames = (post.tags || [])
                  .map((t) => (typeof t === 'object' ? t?.name : t))
                  .filter(Boolean);

                return (
                  <a key={post.id || post.slug} href={`/blog/${post.slug}`} className="blog-grid-card">
                    <div className="blog-grid-thumb">
                      {coverUrl ? (
                        <img src={coverUrl} alt={post.title} loading="lazy" />
                      ) : (
                        <div className="blog-grid-thumb-placeholder">SE</div>
                      )}
                    </div>
                    <div className="blog-grid-body">
                      <div className="blog-grid-meta">
                        {categoryNames.length > 0 && (
                          <span className="blog-grid-cat">{categoryNames[0]}</span>
                        )}
                        {categoryNames.length > 0 && date && <span>&middot;</span>}
                        {date && <time>{date}</time>}
                        {post.readingTime && (
                          <>
                            <span>&middot;</span>
                            <span>{post.readingTime}</span>
                          </>
                        )}
                      </div>

                      <h3 className="blog-grid-card-title">{post.title}</h3>

                      {post.excerpt && (
                        <p className="blog-grid-card-excerpt">{post.excerpt}</p>
                      )}

                      {tagNames.length > 0 && (
                        <p className="featured-tags" style={{ marginBottom: '14px', fontSize: '9px' }}>
                          {tagNames.slice(0, 3).map((t) => `#${t}`).join('  ')}
                        </p>
                      )}

                      <div className="blog-grid-footer">
                        <span className="blog-grid-read-link">Read article</span>
                        <span className="blog-grid-arrow" aria-hidden="true">&#8599;</span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Bottom CTA ── */}
        <section className="blog-cta-section">
          <div className="blog-cta-box">
            <div>
              <h3>
                Let&apos;s make<br />
                <em>something real.</em>
              </h3>
              <p>
                Have an exciting project, collaboration, or opportunity?
                Let&apos;s grab a coffee and turn bold ideas into reality.
              </p>
            </div>
            <a href="/#contact" className="blog-cta-btn">
              Start a conversation <span>&#8599;</span>
            </a>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="blog-footer">
        <div className="blog-footer-inner">
          <div className="blog-footer-top">
            <div>
              <p className="blog-footer-brand">Shashinda Eshan</p>
              <p className="blog-footer-tagline">
                Creative Visionary &middot; Designer &middot; Innovator
              </p>
            </div>
            <nav className="blog-footer-links" aria-label="Footer navigation">
              <a href="/">Home</a>
              <a href="/#about">About</a>
              <a href="/#services">Services</a>
              <a href="/#work">Work</a>
              <a href="/blog">Blog</a>
              <a href="/#contact">Contact</a>
              <a href="https://www.instagram.com/shashindaeshan" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
              <a href="https://www.linkedin.com/in/shashinda-eshan" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href="https://www.facebook.com/shashindaesh/" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </nav>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <p className="blog-footer-copy">&#169; Shashinda.2025</p>
            <p className="blog-footer-copy" style={{ color: '#555' }}>Colombo, Sri Lanka</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
