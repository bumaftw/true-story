import { Metadata } from 'next';
import { getArticle } from '@/services/getArticle';
import ArticleDetailFeature from '@/components/article/article-detail-feature';

type PageProps = {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = await getArticle({ id: parseInt(params.id), token: null });

  if (!article) {
    return {
      title: 'Article not found',
      description: 'The requested article does not exist.',
    };
  }

  return {
    title: article.title,
    description: article.content?.substring(0, 160),
    openGraph: {
      title: article.title,
      description: article.content?.substring(0, 160),
      images: [
        {
          url: article.imageUrl || '/logo.png',
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.content?.substring(0, 160),
      images: [article.imageUrl || '/logo.png'],
    },
  };
}

export default async function Page() {
  return <ArticleDetailFeature />;
}
