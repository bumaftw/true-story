'use client';

import { useQuery } from '@tanstack/react-query';
import { getArticle } from '@/services/getArticle';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ExplorerLink } from '../cluster/cluster-ui';

export const ARTICLE_QUERY_KEY = 'article_query_key';

export default function ArticleDetailFeature() {
  const { id } = useParams();
  const { connected } = useWallet();
  const { getToken } = useAuth();

  const articleId = Array.isArray(id) ? id[0] : id;

  const { data: article } = useQuery({
    queryKey: [ARTICLE_QUERY_KEY, articleId],
    queryFn: async () => {
      const token = await getToken();
      return await getArticle({ id: parseInt(articleId), token });
    },
    enabled: connected && !!articleId,
  });

  if (!article) {
    return <div className="text-center py-20">Loading article...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Article Image */}
      {article.imageUrl && (
        <figure className="mb-8">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="rounded-lg shadow-lg w-full"
          />
        </figure>
      )}

      {/* Article Title */}
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

      {/* Author and Created Date */}
      <div className="flex justify-between items-center mb-6">
        {/* Author's Public Key linked to Solana Explorer */}
        <div className="text-sm text-gray-500">
          Author: <ExplorerLink
              path={`address/${article.author!.publicKey}`}
              label={article.author!.publicKey}
              className="text-primary underline"
            />
        </div>
        <div className="text-sm text-gray-500">
          Published on: {format(new Date(article.createdAt), 'MMMM dd, yyyy')}
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <p>{article.content}</p>
      </div>

      {/* Updated Date */}
      {article.updatedAt && (
        <div className="mt-6 text-sm text-gray-500">
          Updated on: {format(new Date(article.updatedAt), 'MMMM dd, yyyy')}
        </div>
      )}
    </div>
  );
}
