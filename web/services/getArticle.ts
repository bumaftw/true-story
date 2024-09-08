import { request } from '@/api';
import { ARTICLES_ENDPOINT } from '@/constants';
import { ArticleAttributes } from '@/types';

export const getArticle = async ({
  id,
  token,
}: {
  id: number,
  token: string | null;
}): Promise<ArticleAttributes> => {
  const response = await request({
    path: `${ARTICLES_ENDPOINT}/${id}`,
    method: 'GET',
    token,
  });

  return response;
};
