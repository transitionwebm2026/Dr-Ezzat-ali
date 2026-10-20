import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { articleMetadata, articleParams } from '@/lib/metadata';
import { ArticleDetailView, getArticle } from '@/views/ArticleDetailView';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = articleParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return articleMetadata('en', slug);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  if (!getArticle('en', slug)) notFound();
  return <ArticleDetailView locale="en" slug={slug} />;
}
