'use client';

import { useEffect } from 'react';
import { format } from 'date-fns';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { getArticlesList } from '@/services/getArticlesList';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { ProfileLabel } from '@/components/profile/profile-ui';
import { IconLockOpen2, IconLockFilled } from '@tabler/icons-react';
import 'react-quill/dist/quill.snow.css';

const ARTICLES_QUERY_KEY = 'articles_list_query_key';
const ARTICLES_PER_PAGE = 5;

type ArticleListFeatureProps = {
  authorPublicKey?: string;
};

export default function ArticleListFeature({
  authorPublicKey,
}: ArticleListFeatureProps) {
  const { getToken } = useAuth();
  const { connecting, connected, publicKey } = useWallet();

  // Infinite query for loading more articles
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [ARTICLES_QUERY_KEY, authorPublicKey],
      queryFn: async ({ pageParam = 0 }) => {
        const token = await getToken();
        return await getArticlesList({
          token,
          limit: ARTICLES_PER_PAGE,
          offset: pageParam,
          author: authorPublicKey,
        });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < ARTICLES_PER_PAGE) return undefined;
        return allPages.flat().length;
      },
      enabled: !connecting || connected,
    });

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const articles = data?.pages.flat() || [];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Article Cards */}
      <div className="space-y-6">
        {/* Initial Loading Spinner */}
        {!data && !isFetchingNextPage && (
          <div className="text-center py-24">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {/* No Articles Message */}
        {data && articles.length === 0 && !isFetchingNextPage && (
          <div className="text-center text-gray-600 py-24">
            No articles found.
          </div>
        )}

        {/* Articles List */}
        {articles.map((article, index) => {
          const isAuthor = article.author?.publicKey === publicKey?.toString();
          const isPaid = article.payments && article.payments.length > 0;

          return (
            <div
              key={index}
              className="card bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {article.imageUrl ? (
                <figure>
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="h-64 w-full object-cover rounded-t-lg"
                  />
                </figure>
              ) : null}
              <div className="card-body">
                <h2 className="card-title text-2xl font-semibold">
                  {article.title}
                </h2>

                <div className="flex justify-between items-center my-2">
                  {!authorPublicKey ? (
                    <ProfileLabel author={article.author!} />
                  ) : null}
                  <div className="text-sm text-gray-500">
                    {format(new Date(article.createdAt), 'MMMM dd, yyyy')}
                  </div>
                </div>

                <div className="prose prose-lg max-w-none">
                  <div
                    className="ql-editor line-clamp-3"
                    style={{
                      padding: 0,
                      overflow: 'hidden',
                    }}
                    dangerouslySetInnerHTML={{ __html: article.content }}
                  ></div>
                </div>

                <div className="card-actions justify-end mt-4">
                  <Link href={`/articles/${article.id}`} passHref>
                    <button className="btn btn-outline btn-primary hover:btn-primary-focus flex items-center">
                      {isAuthor || isPaid || article.price == 0 ? (
                        <IconLockOpen2 size={20} />
                      ) : (
                        <IconLockFilled size={20} />
                      )}

                      {article.price > 0
                        ? isPaid
                          ? 'Read Unlocked'
                          : `Read for ${article.price}$`
                        : 'Read for free'}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading more spinner for pagination */}
        {isFetchingNextPage && (
          <div className="text-center py-6">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
      </div>
    </div>
  );
}
