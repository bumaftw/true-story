import { Request, Response } from 'express';
import { PaymentAttributes } from '../models';
import * as paymentService from '../services/paymentService';

export async function verifyPayment(
  req: Request<
    object,
    PaymentAttributes,
    { articleId: string; signature: string }
  >,
  res: Response<PaymentAttributes>
) {
  const { articleId, signature } = req.body;
  const userId = req.user!.id;

  const payment = await paymentService.verifyPayment(
    Number(articleId),
    userId,
    signature
  );

  return res.json(payment);
}
