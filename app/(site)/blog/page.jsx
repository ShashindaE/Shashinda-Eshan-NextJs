import { getPayload } from 'payload'
import configPromise from '@payload-config'
import BlogPageClient from './BlogPageClient'

export const metadata = {
  title: 'Blog & Articles — Shashinda Eshan',
  description: 'Notes, essays, case studies, and insights on design, digital experiences, branding, and creative strategy by Shashinda Eshan.',
}

export const revalidate = 60

export default async function BlogPage() {
  let posts = []
  let categories = []

  try {
    const payload = await getPayload({ config: configPromise })
    const postsRes = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedDate',
      limit: 100,
      depth: 2,
    })
    posts = postsRes.docs || []

    const catsRes = await payload.find({
      collection: 'categories',
      limit: 50,
      depth: 1,
    })
    categories = catsRes.docs || []
  } catch (err) {
    console.error('Failed to load blog posts in BlogPage:', err)
  }

  return <BlogPageClient posts={posts} categories={categories} />
}
