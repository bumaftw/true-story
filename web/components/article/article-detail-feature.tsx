'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { getArticle } from '@/services/getArticle';
import { deleteArticle } from '@/services/deleteArticle';
import { verifyPayment } from '@/services/verifyPayment';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@solana/wallet-adapter-react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { PublicKey } from '@solana/web3.js';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTransferToken } from '@/components/account/account-data-access';
import { WalletButton } from '@/components/solana/solana-provider';
import { ProfileLabel } from '@/components/profile/profile-ui';
import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
  FacebookIcon,
  LinkedinIcon,
  RedditIcon,
  XIcon,
} from 'react-share';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import 'react-quill/dist/quill.snow.css';

export const ARTICLE_QUERY_KEY = 'article_query_key';

export default function ArticleDetailFeature() {
  const { id } = useParams();
  const { connected, publicKey } = useWallet();
  const router = useRouter();
  const transferTokenMutation = useTransferToken({ address: publicKey! });
  const { getToken, getUserRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  const articleId = Array.isArray(id) ? id[0] : id;

  const { data: article, refetch } = useQuery({
    queryKey: [ARTICLE_QUERY_KEY, articleId, connected],
    queryFn: async () => {
      const token = await getToken();
      return await getArticle({ id: parseInt(articleId), token });
    },
    enabled: !!articleId,
  });

  const verifyPaymentMutation = useMutation({
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

      await verifyPaymentMutation.mutateAsync({
        articleId: article!.id,
        signature,
      });

      await refetch();

      setLoading(false);
    } catch (error) {
      console.error('Payment failed:', error);
      setLoading(false);
    }
  };

  const deleteArticleMutation = useMutation({
    mutationFn: async ({ articleId }: { articleId: number }) => {
      const token = await getToken();
      return await deleteArticle({ id: articleId, token });
    },
    onSuccess: () => {
      toast.success('Article deleted successfully!');
      router.push('/articles');
    },
    onError: (error) => {
      toast.error(`Failed to delete article: ${error.message}`);
      setLoading(false);
    },
  });

  const handleDelete = () => {
    setShowModal(true);
  };

  const confirmDelete = () => {
    setLoading(true);
    deleteArticleMutation.mutate({ articleId: parseInt(articleId) });
    setShowModal(false);
  };

  if (!article) {
    return <div className="text-center py-20">Loading article...</div>;
  }

  const isAuthor = article.author?.publicKey === publicKey?.toString();
  const userRole = getUserRole();
  const isAdminOrModerator = userRole === 'admin' || userRole === 'moderator';
  const articleUrl = window.location.href;

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

      {/* Article Title and Edit/Delete Buttons */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-5">{article.title}</h1>
        <div className="flex gap-2">
          {isAuthor && (
            <button
              onClick={() => router.push(`/articles/${article.id}/edit`)}
              className="btn btn-sm btn-outline btn-secondary input-bordered mb-2"
            >
              <IconEdit />
              Edit
            </button>
          )}
          {(isAuthor || isAdminOrModerator) && (
            <button
              onClick={handleDelete}
              className="btn btn-sm btn-outline btn-error mb-2"
              disabled={loading}
            >
              {loading ? (
                <div className="loading loading-spinner"></div>
              ) : (
                <>
                  <IconTrash />
                  Delete
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Author and Created Date */}
      <div className="flex justify-between items-center mb-5">
        <ProfileLabel author={article.author!} />
        <div className="text-sm text-gray-500">
          {format(new Date(article.createdAt), 'MMMM dd, yyyy')}
        </div>
      </div>

      {/* Article Content */}
      <div className="prose prose-lg max-w-none">
        <div
          className={`ql-editor ${
            article.price > 0 && !isAuthor && !article.payments?.length
              ? 'line-clamp-3'
              : ''
          }`}
          style={{
            padding: 0,
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        ></div>
      </div>

      {/* Updated Date and Social Share Buttons */}
      {article.updatedAt && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Updated on: {format(new Date(article.updatedAt), 'MMMM dd, yyyy')}
          </div>
          <div className="flex gap-3">
            <TwitterShareButton url={articleUrl} title={article.title}>
              <XIcon size={32} round />
            </TwitterShareButton>

            <FacebookShareButton url={articleUrl} hashtag={'#truestory'}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>

            <LinkedinShareButton url={articleUrl}>
              <LinkedinIcon size={32} round />
            </LinkedinShareButton>

            <RedditShareButton url={articleUrl} title={article.title}>
              <RedditIcon size={32} round />
            </RedditShareButton>
          </div>
        </div>
      )}

      {/* Show pay button if user hasn't paid and user is not the author */}
      {article.price > 0 && !article.payments?.length && !isAuthor && (
        <div className="mt-6">
          {loading ? (
            <button className="btn btn-primary btn-outline" disabled>
              <div className="loading"></div>
              Processing Payment...
            </button>
          ) : connected ? (
            <button className="btn btn-primary" onClick={handlePayment}>
              Pay {article.price}$ to read full article
            </button>
          ) : (
            <WalletButton />
          )}
        </div>
      )}

      {/* Modal for delete confirmation */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete this article?
            </p>
            <div className="modal-action">
              <button className="btn btn-error" onClick={confirmDelete}>
                Delete
              </button>
              <button
                className="btn"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
