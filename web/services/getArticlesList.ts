import { request } from '@/api';
import { ARTICLES_ENDPOINT } from '@/constants';
import { ArticleAttributes } from '@/types';

export const getArticlesList = async ({
  token,
  limit = 10,
  offset = 0,
  author,
}: {
  token: string | null;
  limit: number;
  offset: number;
  author?: string;
}): Promise<ArticleAttributes[]> => {
  const response = await request({
    path: `${ARTICLES_ENDPOINT}?limit=${limit}&offset=${offset}${
      author ? '&author=' + author : ''
    }`,
    method: 'GET',
    token,
  });

  return response;
};
