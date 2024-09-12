import { Payment, Article, User } from '../models';
import connection from './solana';
import { ValidationError, NotFoundError } from '../shared/errors';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

export async function verifyPayment(
  articleId: number,
  userId: number,
  signature: string
): Promise<Payment> {
  const transaction = await connection.getTransaction(signature, {
    maxSupportedTransactionVersion: 0,
  });

  if (!transaction || !transaction.meta || !transaction.transaction.message) {
    throw new NotFoundError('Transaction not found');
  }

  const message = transaction.transaction.message;
  const compiledInstructions = message.compiledInstructions;

  const tokenTransferInstruction = compiledInstructions.find(
    (ix) =>
      ix.programIdIndex ===
      message.staticAccountKeys.findIndex(
        (key) => key.toString() === TOKEN_PROGRAM_ID.toString()
      )
  );

  if (!tokenTransferInstruction) {
    throw new ValidationError('No token transfer found');
  }

  const recipientIndex = tokenTransferInstruction.accountKeyIndexes[1];
  const recipient = message.staticAccountKeys[recipientIndex].toString();

  const article = await Article.findByPk(articleId, {
    attributes: ['id', 'price'],
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

  if (recipient !== article.author!.publicKey) {
    throw new ValidationError('Invalid payment recipient');
  }

  const transferAmount =
    transaction.meta?.postTokenBalances?.[0]?.uiTokenAmount?.uiAmount;
  if (!transferAmount || transferAmount < article.price) {
    throw new ValidationError('Insufficient payment amount');
  }

  const payment = await Payment.create({
    userId,
    articleId,
    amount: transferAmount,
    transactionId: signature,
  });

  return payment;
}
