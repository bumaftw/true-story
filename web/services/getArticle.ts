import { request } from '@/api';
import { ARTICLES_ENDPOINT } from '@/constants';
import { ArticleAttributes } from '@/types';

export const getArticle = async ({
  id,
  token,
  shareToken,
}: {
  id: number;
  token: string | null;
  shareToken?: string | null;
}): Promise<ArticleAttributes> => {
  const response = await request({
    path: `${ARTICLES_ENDPOINT}/${id}${
      shareToken ? '?share_token=' + shareToken : ''
    }`,
    method: 'GET',
    token,
  });

  return response;
};
