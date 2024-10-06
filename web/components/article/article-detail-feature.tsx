'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { getArticle } from '@/services/getArticle';
import { verifyPayment } from '@/services/verifyPayment';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { PublicKey } from '@solana/web3.js';
import { useState } from 'react';
import { useTransferToken } from '@/components/account/account-data-access';
import { WalletButton } from '@/components/solana/solana-provider';
import { ProfileLabel } from '@/components/profile/profile-ui';
import 'react-quill/dist/quill.snow.css';

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

  if (!connected) {
    return (
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    );
  }

  if (!article) {
    return <div className="text-center py-20">Loading article...</div>;
  }

  const isAuthor = article.author?.publicKey === publicKey?.toString();

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
      <h1 className="text-3xl font-bold mb-5">{article.title}</h1>

      {/* Author and Created Date */}
      <div className="flex justify-between items-center mb-5">
        <ProfileLabel author={article.author!} />
        <div className="text-sm text-gray-500">
          Published on: {format(new Date(article.createdAt), 'MMMM dd, yyyy')}
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <div
          className={`ql-editor ${
            article.price > 0 && !isAuthor && !article.payments?.length ? 'line-clamp-3' : ''
          }`}
          style={{
            padding: 0,
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        ></div>
      </div>

      {/* Show pay button if user hasn't paid and user is not the author */}
      {article.price > 0 && !article.payments?.length && !isAuthor && (
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
