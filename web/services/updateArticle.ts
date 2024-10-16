import { request } from '@/api';
import { ARTICLES_ENDPOINT } from '@/constants';
import { ArticleAttributes } from '@/types';

export const updateArticle = async ({
  id,
  data,
  token,
}: {
  id: number;
  data: Partial<ArticleAttributes>;
  token: string | null;
}): Promise<ArticleAttributes> => {
  const response = await request({
    path: `${ARTICLES_ENDPOINT}/${id}`,
    method: 'PUT',
    token,
    body: data,
  });

  return response;
};
