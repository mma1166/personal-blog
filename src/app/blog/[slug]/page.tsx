import prisma from '@/lib/prisma';
import { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';
import { notFound } from 'next/navigation';

type BlogRecord = {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  published: boolean;
  created_at: string;
  image_url: string;
  sort_order: number;
};

const MOCK_POSTS: Record<string, BlogRecord> = {
  'ai-web-dev': {
    id: 'mock-1',
    title: 'The Future of AI in Web Development',
    slug: 'ai-web-dev',
    content: '<p>Artificial Intelligence is no longer a buzzword...</p>',
    category: 'Technology',
    published: true,
    created_at: new Date('2026-02-12').toISOString(),
    image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
    sort_order: 1,
  },
};

async function safeFindPost(slug: string): Promise<BlogRecord | null> {
  if (!process.env.POSTGRES_PRISMA_URL) {
    return MOCK_POSTS[slug] ?? null;
  }

  try {
    const post = await prisma.blog.findUnique({
      where: { slug },
    });

    return post ? (JSON.parse(JSON.stringify(post)) as BlogRecord) : MOCK_POSTS[slug] ?? null;
  } catch {
    return MOCK_POSTS[slug] ?? null;
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await safeFindPost(slug);

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
  const post = await safeFindPost(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient blogData={JSON.parse(JSON.stringify(post))} />;
}
