import { request } from '@/api';
import { ARTICLES_ENDPOINT } from '@/constants';

export const unpinArticle = async ({
  id,
  token,
}: {
  id: number;
  token: string | null;
}): Promise<boolean> => {
  const response = await request({
    path: `${ARTICLES_ENDPOINT}/${id}/unpin`,
    method: 'PUT',
    token,
  });

  return response;
};
