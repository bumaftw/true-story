'use client';

import { useQuery } from '@tanstack/react-query';
import { IconNews } from '@tabler/icons-react';
import { getArticles } from '@/services/getArticles';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@solana/wallet-adapter-react';

export const ARTICLES_QUERY_KEY = 'articles_query_key';

export default function DashboardFeature() {
  const { connected } = useWallet();
  const { getToken } = useAuth();
  const { data: articles } = useQuery({
    queryKey: [ARTICLES_QUERY_KEY],
    queryFn: async () => {
      const token = await getToken();
      return await getArticles({ token });
    },
    enabled: connected,
  });

  return (
    <div>
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <div className="space-y-2">
          <div className="flex items-center justify-center py-4">
            <IconNews size={32} className="text-primary mr-2" />
            <h1 className="text-3xl text-primary">Latest News</h1>
          </div>
          {articles?.map((article, index) => (
            <div key={index}>
              <div className="card lg:card-side bg-base-100 shadow-xl">
                <figure>
                  <img src={article.imageUrl} />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{article.title}</h2>
                  <p>{article.content}</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Read</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
