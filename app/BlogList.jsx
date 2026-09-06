'use client'

export function BlogList({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="blog-list">
        <p className="blog-list-empty">No posts yet — check back soon.</p>
      </div>
    )
  }

  return (
    <div className="blog-list">
      {posts.map((post) => {
        const date = post.publishedDate
          ? new Date(post.publishedDate).toLocaleDateString('en-GB', {
              day: '2-digit', month: 'short', year: 'numeric',
            })
          : null

        const coverUrl = post.coverImage?.url || null
        const href = `/blog/${post.slug}`

        return (
          <article key={post.id} className="blog-card">

            {/* Thumbnail */}
            <a href={href} className="blog-card-thumb" aria-hidden="true" tabIndex="-1">
              {coverUrl
                ? <img src={coverUrl} alt={post.title} className="blog-card-thumb-img" />
                : <div className="blog-card-thumb-placeholder" aria-hidden="true" />
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

            {/* CTA */}
            <a href={href} className="blog-card-cta" aria-label={`Read ${post.title}`}>
              <span aria-hidden="true">↗</span>
            </a>

          </article>
        )
      })}
    </div>
  )
}