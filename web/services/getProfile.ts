import { request } from '@/api';
import { PROFILE_ENDPOINT } from '@/constants';
import { UserAttributes } from '@/types';

export const getProfile = async ({
  publicKey,
  token,
}: {
  publicKey?: string | null;
  token: string | null;
}): Promise<UserAttributes> => {
  const response = await request({
    path: `${PROFILE_ENDPOINT}${publicKey ? '/' + publicKey : ''}`,
    method: 'GET',
    token,
  });

  return response;
};
