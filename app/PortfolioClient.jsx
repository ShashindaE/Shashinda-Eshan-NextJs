'use client';

import { useState } from 'react';
import ScrollExperience from './ScrollExperience';

const sections = ['home', 'about', 'services', 'work', 'testimonials', 'blog', 'contact'];
const experiences = [
  ['2025 - Present', 'Alpha Wellness Sensations', 'Social Media Manager & Strategist / Paid Marketing Specialist', 'Develop and manage digital & social strategies for European markets; plan content and lead-generation campaigns; achieved ~EUR 0.71 cost-per-lead through optimisation; performance marketing, campaign design, conversion tracking.','Digital Marketing Strategy, Paid Marketing, Lead Generation, Performance Marketing, GA4, GTM, Conversion Tracking'],
  ['2023 - 2025', 'Cristal Colombo', 'Social Media Manager & Paid Marketing Specialist', 'Promoted to Digital Media Manager responsibilities; led paid marketing and digital media across multiple brands; helped deliver Lia Sri Lanka’s highest-ever sales day through integrated campaigns and audience optimisation.', 'Paid Media, Social Media Strategy, Campaign Management, Creative Direction, Audience Growth'],
  ['2022 - 2024', 'MTV Channel Pvt. Ltd. (Sirasa TV)', 'Assistant Producer - Digital Content (FTC)', 'Managed YouTube, TikTok, Facebook and Instagram channels; launched and grew TikTok from 0 to ~500k followers; contributed to The Voice Sri Lanka S2 with concepts, content, program promotion and animations.', 'TikTok Marketing, YouTube Growth, Content Strategy, Motion Graphics, Social-First Storytelling'],
  ['2020 - 2022', 'TechnoB Apps', 'Graphic Designer & Video Editor', 'Produced video and visual content; grew YouTube from ~50k to 300k+ subscribers through content strategy and production; created conversion-focused advertising creatives and channel optimisation.', 'Video Production, YouTube Growth, Motion Graphics, Video Editing, Creative Strategy'],
  ['2019 - 2020', 'Luwise Design Agency', 'Brand Identity Designer & Animator', 'Delivered high-volume brand identity, logo and illustration work (estimated 900–1,100 projects in 8–10 months); created brand assets and supported web projects.', 'Brand Identity, Logo Design, Illustration, High-Volume Production, Visual Systems'],
  ['2019', 'Orel IT Pvt. Ltd.', 'Associate Image Processor / AI Data Annotation', 'Worked on AI data annotation and image-processing tasks for Mobilely; achieved 300% of assigned KPI and regularly earned performance-based commissions.', 'AI Data Annotation, Image Processing, KPI Optimisation, Data Quality'],
  ['2018', 'Printex Lanka Pvt. Ltd.', 'Junior Graphic Designer', 'Designed 700+ projects for the marketing and production teams; delivered print and digital assets at scale.', 'Graphic Design, Print Production, Marketing Collateral, Batch Production'],
];
const testimonials = [
  ['As a photographer, visuals are everything to me. Your creativity and attention to detail elevated my brand.', 'Nimash Malshan', "7's Studio"],
  ['The paid campaigns and creative strategies brought incredible results and helped us reach a broader audience.', 'Shashika Ravindra', 'SS Accessories'],
  ['The social media campaigns and motion graphics created amazing engagement and visibility for my apps.', 'Shanika Tharanga', 'Technob Apps'],
];

const servicesData = [
  {
    key: 'brand',
    num: '01',
    category: 'BRAND',
    title: 'Build a brand people remember.',
    description:
      'A strong brand is more than a logo. I help shape the strategy, identity and visual language that make a business recognizable and meaningful.',
    items: [
      'Brand strategy',
      'Visual identity',
      'Logo & identity systems',
      'Creative direction',
      'Brand guidelines',
    ],
    badge: 'Brand Strategy & Identity',
    metric: '900+ Brand Assets Delivered',
  },
  {
    key: 'digital',
    num: '02',
    category: 'DIGITAL',
    title: 'Turn your brand into a digital experience.',
    description:
      'From focused landing pages to complete business websites, I design and develop digital experiences that look great, communicate clearly and work for the people using them.',
    items: [
      'Web design',
      'WordPress development',
      'Next.js websites',
      'Landing pages',
      'E-commerce',
      'UI/UX',
    ],
    badge: 'Websites & Digital Experiences',
    metric: 'Performance & Conversion Focused',
  },
  {
    key: 'growth',
    num: '03',
    category: 'GROWTH',
    title: 'Put your brand in front of the right people.',
    description:
      'I combine creative thinking with digital marketing to help brands reach their audience, generate leads and turn attention into measurable results.',
    items: [
      'Digital marketing',
      'Social media strategy',
      'Paid advertising',
      'Lead generation',
      'Conversion optimization',
      'Analytics',
    ],
    badge: 'Digital Marketing & Growth',
    metric: '~EUR 0.71 Cost-Per-Lead Achieved',
  },
  {
    key: 'create',
    num: '04',
    category: 'CREATE',
    title: 'Make people stop scrolling.',
    description:
      'From campaign visuals to social content, I create visual communication designed to capture attention while staying connected to the bigger brand.',
    items: [
      'Graphic design',
      'Campaign creatives',
      'Video editing',
      'Motion graphics',
      'Social content',
      'Advertising creatives',
    ],
    badge: 'Creative & Graphic Design',
    metric: 'Conversion-Driven Visuals',
  },
  {
    key: '3d',
    num: '05',
    category: '3D',
    title: 'Make products and ideas feel real.',
    description:
      'I use 3D to create visuals that would be difficult, expensive or impossible to capture traditionally, from product visualization to animated brand experiences.',
    items: [
      '3D modeling',
      'Product visualization',
      '3D animation',
      'CGI',
      'Product renders',
      '3D web experiences',
    ],
    badge: '3D Design & Motion',
    metric: 'Photorealistic & Interactive',
  },
  {
    key: 'content',
    num: '06',
    category: 'CONTENT',
    title: 'Tell stories worth paying attention to.',
    description:
      'Good content isn\'t just about making something look good. It\'s about having something worth saying and presenting it in a way people want to watch.',
    items: [
      'Content strategy',
      'Short-form video',
      'Brand storytelling',
      'YouTube content',
      'Promotional videos',
      'Social-first content',
    ],
    badge: 'Content & Video Production',
    metric: '500k+ Followers & Audience Growth',
  },
];

function ServiceVisual({ index }) {
  if (index === 0) {
    return (
      <div className="service-visual-box visual-brand">
        <div className="visual-grid-bg" />
        <div className="visual-brand-circle" />
        <div className="visual-brand-square" />
        <div className="visual-brand-mark">SE</div>
        <div className="visual-brand-palette">
          <span style={{ background: '#941908' }} />
          <span style={{ background: '#eee9df' }} />
          <span style={{ background: '#252628' }} />
        </div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="service-visual-box visual-digital">
        <div className="visual-browser-bar">
          <span /><span /><span />
          <div className="visual-browser-url">shashinda.design</div>
        </div>
        <div className="visual-browser-content">
          <div className="visual-wire-hero" />
          <div className="visual-wire-cards">
            <span /><span /><span />
          </div>
          <div className="visual-code-pill">&lt;Next.js /&gt;</div>
        </div>
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="service-visual-box visual-growth">
        <div className="visual-chart-wrap">
          <div className="visual-chart-bars">
            <div className="bar" style={{ height: '35%' }} />
            <div className="bar" style={{ height: '55%' }} />
            <div className="bar" style={{ height: '75%' }} />
            <div className="bar highlight" style={{ height: '100%' }} />
          </div>
          <div className="visual-trend-line" />
        </div>
        <div className="visual-stat-pill">
          <span className="stat-value">+300%</span>
          <span className="stat-label">Conversion &amp; Reach</span>
        </div>
      </div>
    );
  }
  if (index === 3) {
    return (
      <div className="service-visual-box visual-create">
        <div className="visual-canvas-layer layer-back" />
        <div className="visual-canvas-layer layer-front">
          <div className="visual-timeline-track">
            <div className="track-head" />
            <div className="track-keyframes">
              <span /><span /><span /><span />
            </div>
          </div>
        </div>
        <div className="visual-tool-pill">Motion &amp; Visual Design</div>
      </div>
    );
  }
  if (index === 4) {
    return (
      <div className="service-visual-box visual-3d">
        <div className="visual-3d-scene">
          <div className="cube-wireframe">
            <div className="cube-face front" />
            <div className="cube-face back" />
            <div className="cube-face right" />
            <div className="cube-face left" />
            <div className="cube-face top" />
            <div className="cube-face bottom" />
          </div>
          <div className="visual-3d-axis" />
        </div>
        <div className="visual-cgi-pill">CGI &bull; 3D Modeling</div>
      </div>
    );
  }
  return (
    <div className="service-visual-box visual-content">
      <div className="visual-phone-frame">
        <div className="visual-phone-notch" />
        <div className="visual-soundwaves">
          <span style={{ animationDelay: '0.1s' }} />
          <span style={{ animationDelay: '0.3s' }} />
          <span style={{ animationDelay: '0.2s' }} />
          <span style={{ animationDelay: '0.4s' }} />
          <span style={{ animationDelay: '0.15s' }} />
        </div>
        <div className="visual-video-badge">500k+ Views</div>
      </div>
    </div>
  );
}

function ServicesSection({ pageClass, onSelectService }) {
  const [activeService, setActiveService] = useState(0);

  const handleServiceClick = (serviceKey, index) => {
    setActiveService(index);
    if (onSelectService) {
      onSelectService(serviceKey);
    }
  };

  return (
    <section className={`${pageClass} services`} id="services">
      <div className="section-label"><span>02</span> Services</div>

      <div className="services-heading">
        <div>
          <p className="services-eyebrow">SERVICES</p>
          <h2>
            What I can<br />
            <em>build with you.</em>
          </h2>
        </div>
        <p className="services-lead">
          I combine strategy, design, technology and marketing to turn ideas into brands,
          digital experiences and content that actually have a purpose.
        </p>
      </div>

      <div className="services-layout">
        <div className="services-list" role="list">
          {servicesData.map((service, index) => {
            const isActive = activeService === index;
            return (
              <a
                key={service.num}
                href="#contact"
                className={`service-row ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveService(index)}
                onClick={() => handleServiceClick(service.key, index)}
                role="listitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleServiceClick(service.key, index);
                  }
                }}
              >
                <div className="service-row-header">
                  <span className="service-num">{service.num}</span>
                  <span className="service-cat">{service.category}</span>
                  <h3 className="service-title">{service.title}</h3>
                  <span className="service-arrow" aria-hidden="true">&#8599;</span>
                </div>

                <div className="service-expanded">
                  <p className="service-desc">{service.description}</p>
                  <div className="service-tags">
                    {service.items.map((item) => (
                      <span className="service-tag" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="service-row-cta">
                    <span>Inquire about {service.category.toLowerCase()}</span>
                    <span className="service-cta-arrow" aria-hidden="true">&#8599;</span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        <aside className="services-preview-panel" aria-live="polite">
          <div className="preview-watermark" aria-hidden="true">
            {servicesData[activeService].num}
          </div>
          <div className="preview-header">
            <div className="preview-badge">
              <span className="preview-dot" aria-hidden="true" />
              {servicesData[activeService].badge}
            </div>
            <h4 className="preview-title">{servicesData[activeService].title}</h4>
            <p className="preview-desc">{servicesData[activeService].description}</p>
          </div>

          <div className="preview-visual-area">
            <ServiceVisual index={activeService} />
          </div>

          <div className="preview-footer">
            <div className="preview-metric">
              <span className="metric-dot" />
              <span>{servicesData[activeService].metric}</span>
            </div>
            <ArrowLink
              href="#contact"
              onClick={() => handleServiceClick(servicesData[activeService].key, activeService)}
            >
              Discuss this service
            </ArrowLink>
          </div>
        </aside>
      </div>

      <div className="services-footer">
        <div className="services-footer-copy">
          <h3>Let&apos;s build something.</h3>
          <p>Have an idea, a problem to solve, or a brand that needs a new direction?</p>
        </div>
        <ArrowLink href="#contact">Start a conversation</ArrowLink>
      </div>
    </section>
  );
}

function ArrowLink({ children, href = '#', onClick }) {
  return (
    <a className="arrow-link" href={href} onClick={onClick}>
      {children}<span>&#8599;</span>
    </a>
  );
}

function Header({ activeSection, mobileMenuOpen, onToggleMenu }) {
  return (
    <header className={`site-header ${activeSection > 0 ? 'is-solid' : ''}`}>
      <a className="brand" href="#home">
        <img src="https://shashinda.com/wp-content/uploads/2024/12/Untitled-December-22-2024-at-21.28.33-2.png" alt="Shashinda Eshan" />
      </a>
      <nav aria-label="Main navigation">
        {sections.map((section, index) => (
          <a className={activeSection === index ? 'active' : ''} href={`#${section}`} key={section}>{section}</a>
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

function MobileMenu({ isOpen, activeSection, onClose }) {
  return (
    <div className={`mobile-menu ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
      <nav aria-label="Mobile navigation">
        {sections.map((section, index) => (
          <a className={activeSection === index ? 'active' : ''} href={`#${section}`} key={section} onClick={onClose}>{section}</a>
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

function FixedUI({ activeSection }) {
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
      <div className="progress-rail">
        <span style={{ height: `${((activeSection + 1) / sections.length) * 100}%` }} />
      </div>
    </>
  );
}

function BlogList({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="blog-list">
        <p style={{ opacity: 0.5, fontStyle: 'italic' }}>No posts published yet. Check back soon.</p>
      </div>
    );
  }
  return (
    <div className="blog-list">
      {posts.map((post) => {
        const date = post.publishedDate
          ? new Date(post.publishedDate).toLocaleDateString('en-GB', {
              day: '2-digit', month: 'short', year: 'numeric',
            })
          : '';
        const coverUrl = post.coverImage?.thumbnailURL || post.coverImage?.url || null;
        const href = `/blog/${post.slug}`;
        return (
          <article key={post.id} className="blog-card">
            {/* Thumbnail */}
            <a href={href} className="blog-card-thumb" aria-hidden="true" tabIndex="-1">
              {coverUrl
                ? <img src={coverUrl} alt={post.title} className="blog-card-thumb-img" />
                : <div className="blog-card-thumb-placeholder" />
              }
            </a>
            {/* Text */}
            <div className="blog-card-body">
              {date && <time className="blog-card-date">{date}</time>}
              <h3 className="blog-card-title">
                <a href={href}>{post.title}</a>
              </h3>
              {post.excerpt && (
                <p className="blog-card-excerpt">{post.excerpt}</p>
              )}
            </div>
            {/* Arrow */}
            <a href={href} className="blog-card-cta" aria-label={`Read ${post.title}`}>
              <span aria-hidden="true">↗</span>
            </a>
          </article>
        );
      })}
      <div className="blog-list-more">
        <a className="blog-more-link" href="/blog">
          View all stories &amp; notes <span>&#8599;</span>
        </a>
      </div>
    </div>
  );
}


function FeaturedPost({ post }) {
  if (!post) return null;
  const coverUrl = post.coverImage?.thumbnailURL || post.coverImage?.url || null;
  const categoryNames = (post.categories || []).map((c) => c?.name).filter(Boolean);
  const meta = categoryNames.length ? categoryNames.join(' • ') : 'Featured';
  const tagNames = (post.tags || []).map((t) => t?.name).filter(Boolean);
  return (
    <aside className="featured-post" aria-labelledby="featured-title">
      {coverUrl && <img src={coverUrl} alt={post.title} />}
      <div className="featured-body">
        <div className="featured-meta">{meta}</div>
        <h3 id="featured-title">{post.title}</h3>
        {post.excerpt && <p className="featured-excerpt">{post.excerpt}</p>}
        {tagNames.length > 0 && (
          <p className="featured-tags">{tagNames.map((tag) => `#${tag}`).join('  ')}</p>
        )}
        <a className="featured-cta" href={`/blog/${post.slug}`}>Read case study &#8599;</a>
      </div>
    </aside>
  );
}

function PageContent({ activeSection, incomingSection, isTransitioning, blogPosts, featuredPost }) {
  const pageClass = (index) =>
    `slide-page ${activeSection === index ? 'is-current' : ''} ${isTransitioning && activeSection === index ? 'is-leaving' : ''} ${isTransitioning && incomingSection === index ? 'is-incoming' : ''}`;
  const [contactImageExpanded, setContactImageExpanded] = useState(false);
  const [contactPurpose, setContactPurpose] = useState('');
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);

  const handleSelectService = (serviceKey) => {
    setContactPurpose(serviceKey);
  };

  return (
    <>
      <section className={`${pageClass(0)} hero`} id="home" data-scrollable="false">
        <div className="hero-copy">
          <p className="eyebrow">Creative visionary <i /> Designer <i /> Innovator</p>
          <h1>Building<br /><em>bold ideas</em><br />into reality.</h1>
          <p className="hero-intro">From immersive websites to captivating designs and seamless brand strategies, I transform concepts into experiences that inspire and grow businesses.</p>
          <ArrowLink href="#about">Discover my story</ArrowLink>
        </div>
        <div className="hero-image-wrap">
          <div className="hero-image">
            <img src="https://shashinda.com/wp-content/uploads/2020/12/home.jpg" alt="Shashinda Eshan" />
          </div>
          <div className="hero-stamp">SCROLL<br /><span>&#8595;</span></div>
        </div>
        <div className="hero-name" aria-hidden="true">ESHAN</div>
      </section>

      <section className={`${pageClass(1)} intro`} id="about">
        <div className="section-label"><span>01</span> About me</div>
        <div className="intro-content">
          <h2>Innovative designs.<br /><em>Smarter solutions.</em><br />Proven strategies.</h2>
          <div className="intro-side">
            <p>I specialize in 3D design, AI-driven web solutions, and branding strategies to create impactful experiences that drive results and elevate brands.</p>
            <ArrowLink href="#services">Explore what I do</ArrowLink>
          </div>
        </div>
        <div className="metrics">
          <div><strong>06</strong><span>Years experience</span></div>
          <div><strong>40<span>+</span></strong><span>Projects delivered</span></div>
          <div><strong>12</strong><span>Brands elevated</span></div>
        </div>
      </section>

      {/* Projects section preserved for future updates */}
      {/*
      <section className={`${pageClass(2)} projects`} id="projects">
        <div className="section-label"><span>02</span> Selected projects</div>
        <div className="project-intro">
          <h2>Ideas made<br /><em>visible.</em></h2>
          <p>A selection of identities, digital experiences, and visual systems built to make brands impossible to ignore.</p>
        </div>
        <div className="project-grid">
          <article><span>01 / Brand identity</span><h3>SS Accessories</h3><b>&#8599;</b></article>
          <article><span>02 / Motion + digital</span><h3>Technob Apps</h3><b>&#8599;</b></article>
          <article><span>03 / Campaign design</span><h3>7&apos;s Studio</h3><b>&#8599;</b></article>
        </div>
      </section>
      */}

      <ServicesSection pageClass={pageClass(2)} onSelectService={handleSelectService} />

      <section className={`${pageClass(3)} work`} id="work">
        <div className="section-label"><span>03</span> Professional background</div>
        <div className="work-heading">
          <h2>Where ideas<br /><em>found a home.</em></h2>
          <a className="download" href="#contact">Download resume &#8595;</a>
        </div>
        <div className="timeline">
          {experiences.map(([year, company, role, detail, keywords], index) => (
            <article className="experience" key={company}>
              <span>0{index + 1}</span>
              <time>{year}</time>
              <div>
                <h3>{company}</h3>
                <p className="role">{role}</p>
                <p>{detail}</p>
                {keywords && <p className="exp-keywords">{keywords}</p>}
              </div>
              <b>&#8599;</b>
            </article>
          ))}
        </div>
      </section>

      <section className={`${pageClass(4)} testimonials`} id="testimonials">
        <div className="section-label"><span>04</span> Kind words</div>
        <h2>Bringing creativity,<br /><em>strategy, and dedication</em><br />to every success story.</h2>
        <div className="testimonial-grid">
          {testimonials.map(([quote, name, company]) => (
            <blockquote key={name}>
              <span className="quote-mark">&#8220;</span>
              <p>{quote}</p>
              <footer><strong>{name}</strong><span>{company}</span></footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className={`${pageClass(5)} blog`} id="blog">
        <div className="section-label"><span>05</span> Recent thinking</div>
        <div className="blog-heading">
          <h2>Notes from<br /><em>the studio.</em></h2>
          <ArrowLink href="/blog">View all stories</ArrowLink>
        </div>
        <div className="blog-content">
          <BlogList posts={blogPosts} />
          <FeaturedPost post={featuredPost} />
        </div>
      </section>

      <section className={`${pageClass(6)} contact ${contactImageExpanded ? 'image-expanded' : ''}`} id="contact" data-scrollable="false">
        <div className="contact-layout">
          <div className="contact-info">
            <div className="contact-top">
              <p className="eyebrow">06 / Get in touch</p>
              <h2>Let&apos;s make<br /><em>something real.</em></h2>
              <ArrowLink href="mailto:shashindaesh@gmail.com">Start a conversation</ArrowLink>
            </div>
            <div className="contact-bottom">
              <div>
                <span className="small-label">Based in</span>
                <p>167/1, Mulatiyana, Kapugoda<br />Western Province, Sri Lanka</p>
              </div>
              <div>
                <span className="small-label">Reach me</span>
                <p>+94 76 941 5015<br />shashindaesh@gmail.com</p>
              </div>
            </div>
          </div>
          <form
            className="contact-form"
            onSubmit={async (event) => {
                event.preventDefault();
                if (sending) return;
                setSending(true);
                setSendStatus(null);
                const form = event.currentTarget;
                try {
                  const formData = new FormData(form);
                const body = Object.fromEntries(formData.entries());
                console.info('[contact] Sending', body)
                const res = await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(body),
                });
                const text = await res.text().catch(() => '')
                let parsed
                try { parsed = JSON.parse(text) } catch (e) { parsed = null }
                console.info('[contact] Response', { status: res.status, ok: res.ok, text, parsed })
                const success = parsed && parsed.ok === true
                if (success) {
                  setSendStatus('success');
                  form.reset();
                  setContactPurpose('');
                } else {
                  setSendStatus('error');
                }
              } catch (err) {
                console.error('[contact] Fetch error', err)
                setSendStatus('error');
              } finally {
                setSending(false);
              }
            }}
          >
            <p className="form-title">Let&apos;s grab a coffee and turn ideas<br />into reality <span>chat with me.</span></p>
            <div className="form-row">
              <label>Name<input name="name" type="text" placeholder="Your name" /></label>
              <label>Email<input name="email" type="email" placeholder="Your email" /></label>
            </div>
            <label>Purpose
              <select
                name="purpose"
                value={contactPurpose}
                onChange={(event) => setContactPurpose(event.target.value)}
              >
                <option value="" disabled>What&apos;s this about?</option>
                <option value="brand">01 / Brand Strategy &amp; Identity</option>
                <option value="digital">02 / Websites &amp; Digital Experiences</option>
                <option value="growth">03 / Digital Marketing &amp; Growth</option>
                <option value="create">04 / Creative &amp; Graphic Design</option>
                <option value="3d">05 / 3D Design &amp; Motion</option>
                <option value="content">06 / Content &amp; Video</option>
                <option value="project">Project inquiry</option>
                <option value="job">Job opportunity</option>
                <option value="collaboration">Collaboration</option>
                <option value="general">General question</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>Message<textarea name="message" placeholder="Message" rows="2" /></label>
            <button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Contact me'} <span>&#8599;</span></button>
            {sendStatus === 'success' && <p className="form-note">Thanks — your message was sent.</p>}
            {sendStatus === 'error' && <p className="form-note error">Sorry — something went wrong. Try again later.</p>}
          </form>
        </div>
        <button className="contact-image-hint" type="button" onClick={() => setContactImageExpanded((expanded) => !expanded)}>
          Tap the image to reveal more <span>&#8599;</span>
        </button>
      </section>
    </>
  );
}

export function PortfolioClient({ blogPosts, featuredPost }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ScrollExperience sections={sections}>
      {(activeSection, incomingSection, isTransitioning) => (
        <>
          <Header
            activeSection={incomingSection ?? activeSection}
            mobileMenuOpen={mobileMenuOpen}
            onToggleMenu={() => setMobileMenuOpen((open) => !open)}
          />
          <MobileMenu
            isOpen={mobileMenuOpen}
            activeSection={incomingSection ?? activeSection}
            onClose={() => setMobileMenuOpen(false)}
          />
          <FixedUI activeSection={incomingSection ?? activeSection} />
          <PageContent
            activeSection={activeSection}
            incomingSection={incomingSection}
            isTransitioning={isTransitioning}
            blogPosts={blogPosts}
            featuredPost={featuredPost}
          />
        </>
      )}
    </ScrollExperience>
  );
}
