import { request } from '@/api';
import { PROFILE_ENDPOINT } from '@/constants';
import { UserAttributes } from '@/types';

export const getProfile = async ({
  token,
}: {
  token: string | null;
}): Promise<UserAttributes> => {
  const response = await request({
    path: `${PROFILE_ENDPOINT}`,
    method: 'GET',
    token,
  });

  return response;
};
