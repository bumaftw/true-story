'use client';

import { useQuery } from '@tanstack/react-query';
import { IconNews } from '@tabler/icons-react';
import { getArticlesList } from '@/services/getArticlesList';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';

export const ARTICLES_QUERY_KEY = 'articles_list_query_key';

export default function ArticleFeature() {
  const { connected } = useWallet();
  const { getToken } = useAuth();
  const { data: articles } = useQuery({
    queryKey: [ARTICLES_QUERY_KEY],
    queryFn: async () => {
      const token = await getToken();
      return await getArticlesList({ token });
    },
    enabled: connected,
  });

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
          {articles?.map((article, index) => (
            <div key={index} className="card bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <figure>
                <img
                  src={article.imageUrl || '/default-image.jpg'} // Default image if no imageUrl
                  alt={article.title}
                  className="h-64 w-full object-cover rounded-t-lg"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title text-2xl font-semibold">{article.title}</h2>
                <p className="text-gray-700 line-clamp-3">{article.content}</p> {/* Limiting content preview */}
                <div className="card-actions justify-end mt-4">
                  <Link href={`/articles/${article.id}`} passHref>
                    <button className="btn btn-outline btn-primary hover:btn-primary-focus">Read More</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No articles fallback */}
        {!articles?.length && (
          <div className="text-center mt-10">
            <p className="text-gray-500">No articles available at the moment. Check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}
