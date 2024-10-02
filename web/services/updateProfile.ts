import { request } from '@/api';
import { PROFILE_ENDPOINT } from '@/constants';
import { UserAttributes } from '@/types';

export const updateProfile = async ({
  data,
  token,
}: {
  data: Partial<UserAttributes>;
  token: string | null;
}): Promise<UserAttributes> => {
  const response = await request({
    path: `${PROFILE_ENDPOINT}`,
    method: 'PUT',
    token,
    body: data,
  });

  return response;
};
