'use client';

import { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { IconNews } from '@tabler/icons-react';
import { getArticlesList } from '@/services/getArticlesList';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';

const ARTICLES_QUERY_KEY = 'articles_list_query_key';
const ARTICLES_PER_PAGE = 5;

export default function ArticleFeature() {
  const { connected } = useWallet();
  const { getToken } = useAuth();

  // Infinite query for loading more articles
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    {
      queryKey: [ARTICLES_QUERY_KEY],
      queryFn: async ({ pageParam = 0 }) => {
        const token = await getToken();
        return await getArticlesList({ token, limit: ARTICLES_PER_PAGE, offset: pageParam });
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < ARTICLES_PER_PAGE) return undefined;
        return allPages.flat().length;
      },
      enabled: connected,
    }
  );

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
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
    <div className="pt-10 pb-6">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center py-4">
            <IconNews size={40} className="text-primary mr-3" />
            <h1 className="text-4xl font-bold text-primary">Latest News</h1>
          </div>
          <p className="text-gray-500">Stay updated with the latest articles and news</p>
        </div>

        {/* Article Cards (Single Column) */}
        <div className="space-y-6">
          {articles.map((article, index) => (
            <div key={index} className="card bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <figure>
                <img
                  src={article.imageUrl || '/default-image.jpg'}
                  alt={article.title}
                  className="h-64 w-full object-cover rounded-t-lg"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-2xl font-semibold">{article.title}</h2>

                {/* Content preview limited to a few lines */}
                <p className="text-gray-700 line-clamp-3">
                  {article.content}
                </p>

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
