import { request } from '@/api';
import { PAYMENTS_ENDPOINT } from '@/constants';
import { PaymentAttributes } from '@/types';

export const verifyPayment = async ({
  articleId,
  signature,
  token,
}: {
  articleId: number;
  signature: string;
  token: string | null;
}): Promise<PaymentAttributes> => {
  const response = await request({
    path: `${PAYMENTS_ENDPOINT}/verify`,
    method: 'POST',
    token,
    body: {
      articleId,
      signature,
    },
  });

  return response;
};
