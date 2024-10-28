import { request } from '@/api';
import { ARTICLES_ENDPOINT } from '@/constants';
import { SharableLinkAttributes } from '@/types';

export const generateSharableLink = async ({
  articleId,
  signature,
  token,
}: {
  articleId: number;
  signature: string | null;
  token: string | null;
}): Promise<SharableLinkAttributes> => {
  const response = await request({
    path: `${ARTICLES_ENDPOINT}/${articleId}/share`,
    method: 'POST',
    token,
    body: { signature },
  });

  return response;
};
