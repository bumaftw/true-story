import { Metadata } from 'next';
import { getArticle } from '@/services/getArticle';
import ArticleDetailFeature from '@/components/article/article-detail-feature';

function stripHtmlTags(content: string): string {
  return content.replace(/<[^>]*>/g, '');
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const article = await getArticle({ id: parseInt(params.id), token: null });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const articleUrl = `${baseUrl}/articles/${article.id}`;

  // Strip HTML tags from the content
  const cleanContent = stripHtmlTags(article.content).substring(0, 160);

  return {
    title: article.title,
    description: cleanContent,
    openGraph: {
      title: article.title,
      description: cleanContent,
      url: articleUrl,
      images: [
        {
          // TODO: update after image uploading implementation
          url: `${baseUrl}/logo-square-black.png`,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: article.title,
      description: cleanContent,
      // TODO: update after image uploading implementation
      images: [`${baseUrl}/logo-square-white.png`],
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export default async function Page() {
  return <ArticleDetailFeature />;
}
