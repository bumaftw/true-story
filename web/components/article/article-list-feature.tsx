'use client';

import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getArticlesList } from '@/services/getArticlesList';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { WalletButton } from '@/components/solana/solana-provider';
import 'react-quill/dist/quill.snow.css';

const ARTICLES_QUERY_KEY = 'articles_list_query_key';
const ARTICLES_PER_PAGE = 5;

type ArticleListFeatureProps = {
  publicKey?: string;
};

export default function ArticleListFeature({
  publicKey,
}: ArticleListFeatureProps) {
  const { connected } = useWallet();
  const { getToken } = useAuth();

  // Infinite query for loading more articles
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [ARTICLES_QUERY_KEY, publicKey], // Add publicKey to the queryKey for caching
      queryFn: async ({ pageParam = 0 }) => {
        const token = await getToken();
        return await getArticlesList({
          token,
          limit: ARTICLES_PER_PAGE,
          offset: pageParam,
          author: publicKey,
        });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < ARTICLES_PER_PAGE) return undefined;
        return allPages.flat().length;
      },
      enabled: connected,
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

  if (!connected) {
    return (
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="relative pt-6 pb-4">
      <div className="max-w-3xl mx-auto">
        {/* Article Cards (Single Column) */}
        <div className="space-y-6">
          {articles.map((article, index) => (
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
                  {/* Read More Button to Navigate to Article Details */}
                  <Link href={`/articles/${article.id}`} passHref>
                    <button className="btn btn-outline btn-primary hover:btn-primary-focus">
                      Read More
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Loading more spinner */}
          {isFetchingNextPage && (
            <div className="text-center py-6">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
