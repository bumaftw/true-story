'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { getArticle } from '@/services/getArticle';
import { verifyPayment } from '@/services/verifyPayment';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { ExplorerLink } from '../cluster/cluster-ui';
import { PublicKey } from '@solana/web3.js';
import { useState } from 'react';
import { useTransferToken } from '../account/account-data-access';

export const ARTICLE_QUERY_KEY = 'article_query_key';

export default function ArticleDetailFeature() {
  const { id } = useParams();
  const { connected, publicKey } = useWallet();
  const transferTokenMutation = useTransferToken({ address: publicKey! });
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const articleId = Array.isArray(id) ? id[0] : id;

  const { data: article, refetch } = useQuery({
    queryKey: [ARTICLE_QUERY_KEY, articleId],
    queryFn: async () => {
      const token = await getToken();
      return await getArticle({ id: parseInt(articleId), token });
    },
    enabled: connected && !!articleId,
  });

  const mutation = useMutation({
    mutationFn: async ({
      articleId,
      signature,
    }: {
      articleId: number;
      signature: string;
    }) => {
      const token = await getToken();
      return await verifyPayment({ articleId, signature, token });
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handlePayment = async () => {
    try {
      if (!article) {
        throw new Error('No article loaded');
      }
      setLoading(true);

      const signature = await transferTokenMutation.mutateAsync({
        destination: new PublicKey(article.author!.publicKey),
        amount: article.price,
      });

      await mutation.mutateAsync({ articleId: article!.id, signature });
      setLoading(false);
    } catch (error) {
      console.error('Payment failed:', error);
      setLoading(false);
    }
  };

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
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

      {/* Author and Created Date */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-500">
          Author:{' '}
          <ExplorerLink
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

      {/* Show pay button if user hasn't paid */}
      {!article.payments?.length && (
        <div className="mt-6">
          {loading ? (
            <button className="btn btn-primary btn-outline" disabled>
              <div className="loading"></div>
              Processing Payment...
            </button>
          ) : (
            <button className="btn btn-primary" onClick={handlePayment}>
              Pay {article.price} to read full article
            </button>
          )}
        </div>
      )}

      {/* Updated Date */}
      {article.updatedAt && (
        <div className="mt-6 text-sm text-gray-500">
          Updated on: {format(new Date(article.updatedAt), 'MMMM dd, yyyy')}
        </div>
      )}
    </div>
  );
}
