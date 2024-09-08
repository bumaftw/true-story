import { request } from '@/api';
import { ARTICLES_ENDPOINT } from '@/constants';
import { ArticleAttributes } from '@/types';

export const getArticlesList = async ({
  token,
}: {
  token: string | null;
}): Promise<ArticleAttributes[]> => {
  const response = await request({
    path: `${ARTICLES_ENDPOINT}`,
    method: 'GET',
    token,
  });

  return response;
};
