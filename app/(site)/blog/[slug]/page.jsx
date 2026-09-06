import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

async function getPost(slug) {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'posts',
      where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
      depth: 3,
      limit: 1,
    })
    return docs[0] ?? null
  } catch {
    return null
  }
}

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: `${post.title} \u2014 Shashinda Eshan`,
    description: post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      images: post.coverImage?.thumbnailURL ? [{ url: post.coverImage.thumbnailURL }] : post.coverImage?.url ? [{ url: post.coverImage.url }] : [],
    },
  }
}

export default async function BlogPost({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const publishedDate = post.publishedDate
    ? new Date(post.publishedDate).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric',
      })
    : null

  return (
    <div className="blog-post-page">

      {/* ── Site header (matches portfolio header) ── */}
      <header className="blog-site-header">
        <a className="blog-site-brand" href="/">
          <img
            src="https://shashinda.com/wp-content/uploads/2024/12/Untitled-December-22-2024-at-21.28.33-2.png"
            alt="Shashinda Eshan"
            className="blog-site-logo"
          />
        </a>
        <nav className="blog-site-nav" aria-label="Site navigation">
          <a href="/#home">Home</a>
          <a href="/#about">About</a>
          <a href="/#projects">Projects</a>
          <a href="/#work">Work</a>
          <a href="/#blog" className="active">Blog</a>
          <a href="/#contact">Contact</a>
        </nav>
        <a className="blog-site-phone" href="tel:+94769415015">+94 76 941 5015</a>
      </header>

      {/* ── Article: header + cover + content ── */}
      {/*
          Layout inspired by Mark Manson, ProBlogger, Oliver Emberton.

          Laws applied:
          - Jakob's Law: mirrors standard blog reading convention (title → date → image → body)
          - Peak-End Rule: powerful title above fold creates strong first impression
          - Aesthetic-Usability Effect: clean typographic hierarchy earns trust immediately
          - Von Restorff: bold, large title is the unique, memorable element
          - Miller's Law: max ~7 visual chunks above the fold (nav / label / title / meta / excerpt / image / first para)
          - Hick's Law: single primary CTA per screen (read the article)
      */}
      <article className="blog-article">

        {/* ─ Header: ALWAYS visible above the fold ─ */}
        <header className="blog-header">
          <div className="blog-label">
            <span className="blog-label-dot" aria-hidden="true" />
            Essay
          </div>

          <h1 className="blog-title">{post.title}</h1>

          {post.excerpt && (
            <p className="blog-subtitle">{post.excerpt}</p>
          )}

          <div className="blog-meta-row">
            {publishedDate && (
              <time className="blog-meta-item">{publishedDate}</time>
            )}
            {post.readingTime && (
              <span className="blog-meta-sep" aria-hidden="true">·</span>
            )}
            {post.readingTime && (
              <span className="blog-meta-item blog-meta-readtime">{post.readingTime}</span>
            )}
          </div>
        </header>

        {/* ─ Cover image: shown only if author opted in via admin checkbox ─ */}
        {post.showCoverInArticle && (post.coverImage?.thumbnailURL || post.coverImage?.url) && (
          <figure className="blog-cover-figure">
            <img
              src={post.coverImage.thumbnailURL || post.coverImage.url}
              alt={post.coverImage.alt || post.title}
              className="blog-cover-img"
            />
          </figure>
        )}


        {/* ─ Body copy ─ */}
        <div className="blog-body">
          <RichTextRenderer content={post.content} />
        </div>

        {/* ─ Inline share nudge (Peak-End Rule: good end) ─ */}
        <div className="blog-end-cta">
          <div className="blog-end-rule" />
          <p className="blog-end-label">Enjoyed this? Share it.</p>
          <div className="blog-share-links">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://shashindaeshan.com/blog/${slug}`)}`}
              target="_blank" rel="noopener noreferrer"
            >
              Twitter / X
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://shashindaeshan.com/blog/${slug}`)}&title=${encodeURIComponent(post.title)}`}
              target="_blank" rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>

      </article>

      {/* ── Footer ── */}
      <footer className="blog-footer">
        <div className="blog-footer-inner">
          <div className="blog-footer-top">
            <div>
              <p className="blog-footer-brand">Shashinda Eshan</p>
              <p className="blog-footer-tagline">Creative Visionary &middot; Designer &middot; Innovator</p>
            </div>
            <nav className="blog-footer-links" aria-label="Footer navigation">
              <a href="/">Home</a>
              <a href="/#blog">Blog</a>
              <a href="/#contact">Contact</a>
              <a href="https://www.instagram.com/shashindaeshan" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://www.linkedin.com/in/shashinda-eshan" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </nav>
          </div>
          <p className="blog-footer-copy">
            &copy; {new Date().getFullYear()} Shashinda Eshan. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}

/* ─── Rich text renderer ─────────────────────────────────────────────────
   Handles Payload CMS lexical editor output.
   Inline images: Payload stores them as 'upload' nodes with the media
   document populated at depth >= 1. The populated doc lives at node.value
   (which is the media collection document), so node.value.url is the src.
   We also handle the fallback where value might be an ID or missing.
──────────────────────────────────────────────────────────────────────── */
function RichTextRenderer({ content }) {
  if (!content?.root?.children) {
    return <p style={{ color: '#aaa', fontStyle: 'italic' }}>No content yet.</p>
  }
  return <>{content.root.children.map((node, i) => renderNode(node, i))}</>
}

function renderNode(node, key) {
  if (!node) return null

  switch (node.type) {

    case 'heading': {
      const Tag = node.tag || 'h2'
      return <Tag key={key}>{node.children?.map((c, i) => renderNode(c, i))}</Tag>
    }

    case 'paragraph': {
      const children = node.children?.map((c, i) => renderNode(c, i))
      // empty paragraph = spacer
      const hasContent = node.children?.some(c => c.text?.trim() || c.type !== 'text')
      if (!hasContent) return <p key={key} style={{ margin: '0 0 10px' }} aria-hidden />
      return <p key={key}>{children}</p>
    }

    case 'horizontalrule':
      return <hr key={key} />

    case 'quote':
      return <blockquote key={key}>{node.children?.map((c, i) => renderNode(c, i))}</blockquote>

    case 'list':
      return node.listType === 'number'
        ? <ol key={key}>{node.children?.map((c, i) => renderNode(c, i))}</ol>
        : <ul key={key}>{node.children?.map((c, i) => renderNode(c, i))}</ul>

    case 'listitem':
      return <li key={key}>{node.children?.map((c, i) => renderNode(c, i))}</li>

    case 'link': {
      const href = node.fields?.url || node.url || '#'
      const isExternal = href.startsWith('http')
      return (
        <a key={key} href={href}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {node.children?.map((c, i) => renderNode(c, i))}
        </a>
      )
    }

    case 'upload': {
      // Payload lexical: populated media doc is at node.value
      // node.value can be: a full media object {id, url, alt, width, height}
      // or just an id number if depth was too shallow.
      const media = node.value
      const src = typeof media === 'object' ? (media?.thumbnailURL || media?.url) : null
      const alt = typeof media === 'object' ? (media?.alt || '') : ''
      const width = typeof media === 'object' ? media?.width : undefined
      const height = typeof media === 'object' ? media?.height : undefined

      if (!src) return null

      return (
        <figure key={key} className="blog-inline-figure">
          <img
            className="blog-inline-img"
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading="lazy"
          />
          {alt && <figcaption className="blog-inline-caption">{alt}</figcaption>}
        </figure>
      )
    }

    case 'text': {
      const text = node.text
      if (text === undefined || text === null) return null
      if (!text) return ''
      // format is a bitmask: 1=bold, 2=italic, 4=strikethrough, 8=underline, 16=code, 32=subscript, 64=superscript
      let el = <>{text}</>
      if (node.format & 8)  el = <u>{el}</u>
      if (node.format & 4)  el = <s>{el}</s>
      if (node.format & 16) el = <code>{el}</code>
      if (node.format & 32) el = <sub>{el}</sub>
      if (node.format & 64) el = <sup>{el}</sup>
      if (node.format & 2)  el = <em>{el}</em>
      if (node.format & 1)  el = <strong>{el}</strong>
      // If no formatting, just return plain text (avoids wrapping in extra elements)
      if (!node.format) return text
      return <span key={key}>{el}</span>
    }

    default:
      return node.children?.length
        ? <div key={key}>{node.children.map((c, i) => renderNode(c, i))}</div>
        : null
  }
}
