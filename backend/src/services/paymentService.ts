import { getAssociatedTokenAddress } from '@solana/spl-token';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Payment, Article, User } from '../models';
import connection from './solana';
import { ValidationError, NotFoundError } from '../shared/errors';
import config from '../shared/config';

const TOKEN_MINT_ADDRESS = config.get('TOKEN_MINT_ADDRESS');
const TOKEN_DECIMALS = parseInt(config.get('TOKEN_DECIMALS'));
const PLATFORM_PUBLIC_KEY = config.get('PLATFORM_PUBLIC_KEY');

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

  const user = await User.findByPk(userId, {
    attributes: ['id', 'publicKey'],
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
  const userPublicKey = new PublicKey(user.publicKey);

  const payerTokenAccountAddress = await getAssociatedTokenAddress(
    mintPublicKey,
    userPublicKey
  );

  const payerIndex = accountKeys.findIndex(
    (key) => key.toString() === payerTokenAccountAddress.toString()
  );

  if (payerIndex === -1) {
    throw new ValidationError('Invalid payer token account');
  }

  const preTokenBalances = transaction.meta.preTokenBalances || [];
  const postTokenBalances = transaction.meta.postTokenBalances || [];

  const prePayerBalanceEntry = preTokenBalances.find(
    (balance) =>
      balance.accountIndex === payerIndex && balance.mint === TOKEN_MINT_ADDRESS
  );

  const postPayerBalanceEntry = postTokenBalances.find(
    (balance) =>
      balance.accountIndex === payerIndex && balance.mint === TOKEN_MINT_ADDRESS
  );

  const prePayerBalance = prePayerBalanceEntry
    ? parseFloat(prePayerBalanceEntry.uiTokenAmount.amount)
    : 0;

  const postPayerBalance = postPayerBalanceEntry
    ? parseFloat(postPayerBalanceEntry.uiTokenAmount.amount)
    : 0;

  const payerBalanceDifference =
    (prePayerBalance - postPayerBalance) / Math.pow(10, TOKEN_DECIMALS);

  if (payerBalanceDifference < article.price) {
    throw new ValidationError('Insufficient payment amount');
  }

  const expectedAuthorAmount = payerBalanceDifference * 0.9;
  const expectedPlatformAmount = payerBalanceDifference * 0.1;

  const authorPublicKey = new PublicKey(article.author!.publicKey);
  const authorTokenAccountAddress = await getAssociatedTokenAddress(
    mintPublicKey,
    authorPublicKey
  );

  const authorIndex = accountKeys.findIndex(
    (key) => key.toString() === authorTokenAccountAddress.toString()
  );

  const preAuthorBalanceEntry = preTokenBalances.find(
    (balance) =>
      balance.accountIndex === authorIndex &&
      balance.mint === TOKEN_MINT_ADDRESS
  );

  const postAuthorBalanceEntry = postTokenBalances.find(
    (balance) =>
      balance.accountIndex === authorIndex &&
      balance.mint === TOKEN_MINT_ADDRESS
  );

  const preAuthorBalance = preAuthorBalanceEntry
    ? parseFloat(preAuthorBalanceEntry.uiTokenAmount.amount)
    : 0;

  const postAuthorBalance = postAuthorBalanceEntry
    ? parseFloat(postAuthorBalanceEntry.uiTokenAmount.amount)
    : 0;

  const authorBalanceDifference =
    (postAuthorBalance - preAuthorBalance) / Math.pow(10, TOKEN_DECIMALS);

  if (authorBalanceDifference < expectedAuthorAmount * 0.99) {
    // Allowing a small margin for rounding errors
    throw new ValidationError('Author did not receive correct amount');
  }

  const platformPublicKey = new PublicKey(PLATFORM_PUBLIC_KEY);
  const platformTokenAccountAddress = await getAssociatedTokenAddress(
    mintPublicKey,
    platformPublicKey
  );

  const platformIndex = accountKeys.findIndex(
    (key) => key.toString() === platformTokenAccountAddress.toString()
  );

  const prePlatformBalanceEntry = preTokenBalances.find(
    (balance) =>
      balance.accountIndex === platformIndex &&
      balance.mint === TOKEN_MINT_ADDRESS
  );

  const postPlatformBalanceEntry = postTokenBalances.find(
    (balance) =>
      balance.accountIndex === platformIndex &&
      balance.mint === TOKEN_MINT_ADDRESS
  );

  const prePlatformBalance = prePlatformBalanceEntry
    ? parseFloat(prePlatformBalanceEntry.uiTokenAmount.amount)
    : 0;

  const postPlatformBalance = postPlatformBalanceEntry
    ? parseFloat(postPlatformBalanceEntry.uiTokenAmount.amount)
    : 0;

  const platformBalanceDifference =
    (postPlatformBalance - prePlatformBalance) / Math.pow(10, TOKEN_DECIMALS);

  if (platformBalanceDifference < expectedPlatformAmount * 0.99) {
    // Allowing a small margin for rounding errors
    throw new ValidationError('Platform did not receive correct amount');
  }

  const payment = await Payment.create({
    userId,
    articleId,
    amount: payerBalanceDifference,
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
