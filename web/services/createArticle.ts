import { request } from '@/api';
import { ARTICLES_ENDPOINT } from '@/constants';
import { ArticleAttributes } from '@/types';

export const createArticle = async ({
  data,
  token,
}: {
  data: Partial<ArticleAttributes>;
  token: string | null;
}): Promise<ArticleAttributes> => {
  const response = await request({
    path: `${ARTICLES_ENDPOINT}`,
    method: 'POST',
    token,
    body: data,
  });

  return response;
};
