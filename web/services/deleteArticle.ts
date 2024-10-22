import { request } from '@/api';
import { ARTICLES_ENDPOINT } from '@/constants';

export const deleteArticle = async ({
  id,
  token,
}: {
  id: number;
  token: string | null;
}): Promise<boolean> => {
  const response = await request({
    path: `${ARTICLES_ENDPOINT}/${id}`,
    method: 'DELETE',
    token,
  });

  return response;
};
