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
      limit: 5,
      depth: 1,
    })
    return docs
  } catch {
    return []
  }
}

export const metadata = {
  title: 'Shashinda \u2014 Creative Visionary',
  description: 'Designer, innovator and digital creative building bold ideas into reality.',
};

export const revalidate = 60

export default async function Home() {
  const blogPosts = await getBlogPosts();
  return <PortfolioClient blogPosts={blogPosts} />;
}
