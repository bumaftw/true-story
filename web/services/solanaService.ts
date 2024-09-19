import {
  Connection,
  PublicKey,
  Transaction,
  TransactionSignature,
  SystemProgram,
  Keypair,
} from '@solana/web3.js';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
} from '@solana/spl-token';

type PaymentTransactionParams = {
  recipient: PublicKey,
  sender: PublicKey | null,
  amount: number,
  connection: Connection,
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<TransactionSignature>
}

export async function initiateUSDTPayment({
  recipient,
  sender,
  amount,
  connection,
  sendTransaction,
}: PaymentTransactionParams): Promise<TransactionSignature> {
  if (!sender || !sendTransaction) {
    throw new WalletNotConnectedError();
  }

  const usdtMintAddress = new PublicKey('Es9vMFrzaC7eZThALzXz5u2XBYRgfNDspTGgP57mz2B'); // USDT mint address

  const recipientTokenAddress = await getAssociatedTokenAddress(
    usdtMintAddress,
    recipient
  );

  const senderTokenAddress = await getAssociatedTokenAddress(usdtMintAddress, sender);

  const transaction = new Transaction();

  const recipientTokenAccountInfo = await connection.getAccountInfo(recipientTokenAddress);
  if (!recipientTokenAccountInfo) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        sender,
        recipientTokenAddress,
        recipient,
        usdtMintAddress,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      )
    );
  }

  const senderTokenAccountInfo = await connection.getAccountInfo(senderTokenAddress);
  if (!senderTokenAccountInfo) {
    transaction.add(
      createAssociatedTokenAccountInstruction(
        sender,
        senderTokenAddress,
        sender,
        usdtMintAddress,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      )
    );
  }

  transaction.add(
    createTransferInstruction(
      senderTokenAddress,
      recipientTokenAddress,
      sender,
      amount * 1e6, // Amount in smallest denomination (USDT uses 6 decimal places)
      [],
      TOKEN_PROGRAM_ID,
    )
  );

  const signature = await sendTransaction(transaction, connection);

  // await connection.confirmTransaction(signature, "processed");

  return signature;
}

export async function initiateSolPayment({
  recipient,
  sender,
  amount,
  connection,
  sendTransaction,
}: PaymentTransactionParams): Promise<TransactionSignature> {
  if (!sender || !sendTransaction) {
    throw new WalletNotConnectedError();
  }

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: recipient,
      lamports: amount * 1e9,
    })
  );

  const signature = await sendTransaction(transaction, connection);

  const confirmation = await connection.confirmTransaction(signature, 'finalized');
  console.log(confirmation);

  return signature;
}
