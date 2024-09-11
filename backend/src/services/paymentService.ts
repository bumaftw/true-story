import { Payment, Article, User } from '../models';
import connection from './solana';
import { ValidationError, NotFoundError } from '../shared/errors';

export async function verifyPayment(articleId: number, userId: number, signature: string) {
  const transaction = await connection.getTransaction(signature, {
    maxSupportedTransactionVersion: 0,
  });

  if (!transaction || !transaction.meta) {
    throw new NotFoundError('Transaction not found');
  }

  const article = await Article.findByPk(articleId, {
    attributes: ['id'],
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'publicKey'],
        required: true,
      },
    ],
  });

  if (!article) {
    throw new NotFoundError('Article not found');
  }

  const recipient = transaction.transaction.message.getAccountKeys().get(1)?.toString()

  if (recipient !== article.author!.publicKey) {
    throw new ValidationError('Invalid payment recipient');
  }

  const payment = await Payment.create({
    userId,
    articleId,
    amount: transaction.meta.postBalances[0],
    transactionId: signature,
  });

  return payment;
}
