import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PortfolioClient } from '../PortfolioClient';

async function getBlogPosts() {
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedDate',
      limit: 8,
      depth: 1,
    })
    // Prefer an explicitly featured post; fall back to the most recent one.
    const featuredPost = docs.find((doc) => doc.featured) || docs[0] || null
    const posts = docs.filter((doc) => doc.id !== featuredPost?.id).slice(0, 5)
    return { posts, featuredPost }
  } catch {
    return { posts: [], featuredPost: null }
  }
}

export const metadata = {
  title: 'Shashinda \u2014 Creative Visionary',
  description: 'Designer, innovator and digital creative building bold ideas into reality.',
};

export const revalidate = 60

export default async function Home() {
  const { posts, featuredPost } = await getBlogPosts();
  return <PortfolioClient blogPosts={posts} featuredPost={featuredPost} />;
}
