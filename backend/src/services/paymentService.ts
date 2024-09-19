import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Payment, Article, User } from '../models';
import connection from './solana';
import { ValidationError, NotFoundError } from '../shared/errors';

export async function verifyTokenPayment(
  articleId: number,
  userId: number,
  signature: string
): Promise<Payment> {
  const transaction = await connection.getTransaction(signature, { commitment: 'confirmed' });

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

export async function verifySolPayment(
  articleId: number,
  userId: number,
  signature: string
): Promise<Payment> {
  const transaction = await connection.getTransaction(signature, { commitment: 'confirmed' });

  if (!transaction || !transaction.meta || !transaction.transaction.message) {
    throw new NotFoundError('Transaction not found');
  }

  const message = transaction.transaction.message;
  const accountKeys = message.staticAccountKeys;

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

  const authorPublicKey = article.author!.publicKey;
  const postBalances = transaction.meta.postBalances;
  const preBalances = transaction.meta.preBalances;

  const recipientIndex = accountKeys.findIndex(
    (key) => key.toString() === authorPublicKey
  );

  if (recipientIndex === -1) {
    throw new ValidationError('Invalid payment recipient');
  }

  const transferredAmount = (postBalances[recipientIndex] - preBalances[recipientIndex]) / LAMPORTS_PER_SOL;

  if (transferredAmount < article.price) {
    throw new ValidationError('Insufficient payment amount');
  }

  const payment = await Payment.create({
    userId,
    articleId,
    amount: transferredAmount,
    transactionId: signature,
  });

  return payment;
}
