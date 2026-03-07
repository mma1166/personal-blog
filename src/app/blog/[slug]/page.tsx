import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blog.findUnique({
    where: { slug },
  });

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.muntasiramit.me';
  const description = post.content.replace(/<[^>]*>/g, '').substring(0, 160);

  return {
    title: `${post.title} | Muntasir's Blog`,
    description,
    openGraph: {
      title: post.title,
      description,
      url: `${siteUrl}/blog/${slug}`,
      siteName: "Muntasir's Blog",
      images: [
        {
          url: post.image_url || '/default-og-image.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      authors: ['Md Muntasir Mahmud Amit'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [post.image_url || '/default-og-image.png'],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  // Try Prisma first
  let post = await prisma.blog.findUnique({
    where: { slug },
  });

  // Fallback for mock posts (though in a real app these should be in the DB)
  if (!post) {
      const MOCK_POSTS: any = {
        'ai-web-dev': {
          id: 'mock-1',
          title: 'The Future of AI in Web Development',
          slug: 'ai-web-dev',
          content: '<p>Artificial Intelligence is no longer a buzzword...</p>',
          category: 'Technology',
          published: true,
          created_at: new Date('2026-02-12').toISOString(),
          image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
          sort_order: 1
        }
      };
      post = MOCK_POSTS[slug];
  }

  if (!post) {
    notFound();
  }

  return <BlogPostClient blogData={JSON.parse(JSON.stringify(post))} />;
}
