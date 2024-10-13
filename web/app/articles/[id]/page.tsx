import { Metadata } from 'next';
import { getArticle } from '@/services/getArticle';
import ArticleDetailFeature from '@/components/article/article-detail-feature';

type PageProps = {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticle({ id: parseInt(params.id), token: null });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const articleUrl = `${baseUrl}/articles/${article.id}`;
  // TODO: update after image uploading implementation
  const imageUrl = `${baseUrl}/logo.png`;

  return {
    title: article.title,
    description: article.content?.substring(0, 160),
    openGraph: {
      title: article.title,
      description: article.content?.substring(0, 160),
      url: articleUrl,
      images: [
        {
          url: imageUrl,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.content?.substring(0, 160),
      images: [imageUrl],
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export default async function Page() {
  return <ArticleDetailFeature />;
}
