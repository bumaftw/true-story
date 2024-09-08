import { request } from '@/api';
import { ARTICLES_ENDPOINT } from '@/constants';
import { ArticleAttributes } from '@/types';

export const getArticlesList = async ({
  token,
  limit = 10,
  offset = 0,
}: {
  token: string | null;
  limit: number;
  offset: number;
}): Promise<ArticleAttributes[]> => {
  const response = await request({
    path: `${ARTICLES_ENDPOINT}?limit=${limit}&offset=${offset}`,
    method: 'GET',
    token,
  });

  return response;
};
