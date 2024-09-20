import { getAssociatedTokenAddress } from '@solana/spl-token';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Payment, Article, User } from '../models';
import connection from './solana';
import { ValidationError, NotFoundError } from '../shared/errors';
import config from '../shared/config';

const TOKEN_MINT_ADDRESS = config.get('TOKEN_MINT_ADDRESS');
const TOKEN_DECIMALS = parseInt(config.get('TOKEN_MINT_ADDRESS'));

export async function verifyTokenPayment(
  articleId: number,
  userId: number,
  signature: string
): Promise<Payment> {
  const transaction = await connection.getTransaction(signature, {
    commitment: 'confirmed',
  });

  if (!transaction || !transaction.meta || !transaction.transaction.message) {
    throw new NotFoundError('Transaction not found');
  }

  const message = transaction.transaction.message;
  const accountKeys = message.accountKeys;

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

  const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
  const authorPublicKey = new PublicKey(article.author!.publicKey);

  const authorTokenAccountAddress = await getAssociatedTokenAddress(
    mintPublicKey,
    authorPublicKey
  );

  const recipientIndex = accountKeys.findIndex(
    (key) => key.toString() === authorTokenAccountAddress.toString()
  );

  if (recipientIndex === -1) {
    throw new ValidationError('Invalid payment recipient');
  }

  const preTokenBalances = transaction.meta.preTokenBalances || [];
  const postTokenBalances = transaction.meta.postTokenBalances || [];

  const preTokenBalanceEntry = preTokenBalances.find(
    (balance) =>
      balance.accountIndex === recipientIndex &&
      balance.mint === TOKEN_MINT_ADDRESS
  );

  const postTokenBalanceEntry = postTokenBalances.find(
    (balance) =>
      balance.accountIndex === recipientIndex &&
      balance.mint === TOKEN_MINT_ADDRESS
  );

  const preBalance = preTokenBalanceEntry
    ? parseFloat(preTokenBalanceEntry.uiTokenAmount.amount)
    : 0;

  const postBalance = postTokenBalanceEntry
    ? parseFloat(postTokenBalanceEntry.uiTokenAmount.amount)
    : 0;

  const balanceDifference =
    (postBalance - preBalance) / Math.pow(10, TOKEN_DECIMALS);

  if (balanceDifference < article.price) {
    throw new ValidationError('Insufficient payment amount');
  }

  const payment = await Payment.create({
    userId,
    articleId,
    amount: balanceDifference,
    transactionId: signature,
  });

  return payment;
}

export async function verifySolPayment(
  articleId: number,
  userId: number,
  signature: string
): Promise<Payment> {
  const transaction = await connection.getTransaction(signature, {
    commitment: 'confirmed',
  });

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

  const transferredAmount =
    (postBalances[recipientIndex] - preBalances[recipientIndex]) /
    LAMPORTS_PER_SOL;

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
