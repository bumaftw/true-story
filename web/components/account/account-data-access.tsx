'use client';

import { BN, Program } from '@coral-xyz/anchor';
import { getFundSplitProgram, FundSplit } from '@true-story/anchor';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionMessage,
  TransactionSignature,
  VersionedTransaction,
} from '@solana/web3.js';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useTransactionToast } from '../ui/ui-layout';
import { useAnchorProvider } from '../solana/solana-provider';

const TOKEN_MINT_ADDRESS = new PublicKey(
  process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS!
);
const TOKEN_DECIMALS = parseInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS!);
const PLATFORM_PUBLIC_KEY = new PublicKey(process.env.NEXT_PUBLIC_PLATFORM_PUBLIC_KEY!);

export function useGetBalance({ address }: { address: PublicKey }) {
  const { connection } = useConnection();

  return useQuery({
    queryKey: ['get-balance', { endpoint: connection.rpcEndpoint, address }],
    queryFn: () => connection.getBalance(address),
  });
}

export function useGetSignatures({ address }: { address: PublicKey }) {
  const { connection } = useConnection();

  return useQuery({
    queryKey: ['get-signatures', { endpoint: connection.rpcEndpoint, address }],
    queryFn: () => connection.getSignaturesForAddress(address),
  });
}

export function useGetTokenAccounts({ address }: { address: PublicKey }) {
  const { connection } = useConnection();

  return useQuery({
    queryKey: [
      'get-token-accounts',
      { endpoint: connection.rpcEndpoint, address },
    ],
    queryFn: async () => {
      const [tokenAccounts, token2022Accounts] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(address, {
          programId: TOKEN_PROGRAM_ID,
        }),
        connection.getParsedTokenAccountsByOwner(address, {
          programId: TOKEN_2022_PROGRAM_ID,
        }),
      ]);
      return [...tokenAccounts.value, ...token2022Accounts.value];
    },
  });
}

export function useTransferSol({ address }: { address: PublicKey }) {
  const { connection } = useConnection();
  const transactionToast = useTransactionToast();
  const wallet = useWallet();
  const client = useQueryClient();

  return useMutation({
    mutationKey: [
      'transfer-sol',
      { endpoint: connection.rpcEndpoint, address },
    ],
    mutationFn: async (input: { destination: PublicKey; amount: number }) => {
      const { transaction, latestBlockhash } = await createTransaction({
        publicKey: address,
        destination: input.destination,
        amount: input.amount,
        connection,
      });

      const signature: TransactionSignature = await wallet.sendTransaction(
        transaction,
        connection
      );

      await connection.confirmTransaction(
        { signature, ...latestBlockhash },
        'confirmed'
      );

      return signature;
    },
    onSuccess: (signature) => {
      if (signature) {
        transactionToast(signature);
      }
      return Promise.all([
        client.invalidateQueries({
          queryKey: [
            'get-balance',
            { endpoint: connection.rpcEndpoint, address },
          ],
        }),
        client.invalidateQueries({
          queryKey: [
            'get-signatures',
            { endpoint: connection.rpcEndpoint, address },
          ],
        }),
      ]);
    },
    onError: (error) => {
      toast.error(`Transaction failed! ${error}`);
    },
  });
}

export function useRequestAirdrop({ address }: { address: PublicKey }) {
  const { connection } = useConnection();
  const transactionToast = useTransactionToast();
  const client = useQueryClient();

  return useMutation({
    mutationKey: ['airdrop', { endpoint: connection.rpcEndpoint, address }],
    mutationFn: async (amount: number = 1) => {
      const [latestBlockhash, signature] = await Promise.all([
        connection.getLatestBlockhash(),
        connection.requestAirdrop(address, amount * LAMPORTS_PER_SOL),
      ]);

      await connection.confirmTransaction(
        { signature, ...latestBlockhash },
        'confirmed'
      );
      return signature;
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return Promise.all([
        client.invalidateQueries({
          queryKey: [
            'get-balance',
            { endpoint: connection.rpcEndpoint, address },
          ],
        }),
        client.invalidateQueries({
          queryKey: [
            'get-signatures',
            { endpoint: connection.rpcEndpoint, address },
          ],
        }),
      ]);
    },
  });
}

async function createTransaction({
  publicKey,
  destination,
  amount,
  connection,
}: {
  publicKey: PublicKey;
  destination: PublicKey;
  amount: number;
  connection: Connection;
}): Promise<{
  transaction: VersionedTransaction;
  latestBlockhash: { blockhash: string; lastValidBlockHeight: number };
}> {
  const latestBlockhash = await connection.getLatestBlockhash();

  const instructions = [
    SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: destination,
      lamports: amount * LAMPORTS_PER_SOL,
    }),
  ];

  const messageLegacy = new TransactionMessage({
    payerKey: publicKey,
    recentBlockhash: latestBlockhash.blockhash,
    instructions,
  }).compileToLegacyMessage();

  const transaction = new VersionedTransaction(messageLegacy);

  return {
    transaction,
    latestBlockhash,
  };
}

export function useTransferToken({ address }: { address: PublicKey }) {
  const { connection } = useConnection();
  const transactionToast = useTransactionToast();
  const client = useQueryClient();
  const provider = useAnchorProvider();
  const program = getFundSplitProgram(provider);

  return useMutation({
    mutationKey: [
      'transfer-token',
      { endpoint: connection.rpcEndpoint, address },
    ],
    mutationFn: async (input: { destination: PublicKey; amount: number }) => {
      const { transaction } = await createTokenTransferTransaction({
        publicKey: address,
        destination: input.destination,
        amount: input.amount,
        connection,
        program,
      });

      const signature: TransactionSignature = await provider.sendAndConfirm(
        transaction
      );

      return signature;
    },
    onSuccess: (signature) => {
      if (signature) {
        transactionToast(signature);
      }
      return Promise.all([
        client.invalidateQueries({
          queryKey: [
            'get-token-accounts',
            { endpoint: connection.rpcEndpoint, address },
          ],
        }),
        client.invalidateQueries({
          queryKey: [
            'get-signatures',
            { endpoint: connection.rpcEndpoint, address },
          ],
        }),
      ]);
    },
    onError: (error) => {
      toast.error(`Transaction failed! ${error}`);
    },
  });
}

async function createTokenTransferTransaction({
  publicKey,
  destination,
  amount,
  connection,
  program,
}: {
  publicKey: PublicKey;
  destination: PublicKey;
  amount: number;
  connection: Connection;
  program: Program<FundSplit>;
}): Promise<{
  transaction: Transaction;
}> {
  const payerTokenAccount = await getAssociatedTokenAddress(
    TOKEN_MINT_ADDRESS,
    publicKey
  );

  const authorTokenAccount = await getAssociatedTokenAddress(
    TOKEN_MINT_ADDRESS,
    destination
  );

  const platformTokenAccount = await getAssociatedTokenAddress(
    TOKEN_MINT_ADDRESS,
    PLATFORM_PUBLIC_KEY
  );

  const instructions = [];

  const authorAccountInfo = await connection.getAccountInfo(authorTokenAccount);
  if (!authorAccountInfo) {
    const createAuthorATA = createAssociatedTokenAccountInstruction(
      publicKey,
      authorTokenAccount,
      destination,
      TOKEN_MINT_ADDRESS
    );
    instructions.push(createAuthorATA);
  }

  const platformAccountInfo = await connection.getAccountInfo(platformTokenAccount);
  if (!platformAccountInfo) {
    const createPlatformATA = createAssociatedTokenAccountInstruction(
      publicKey,
      platformTokenAccount,
      PLATFORM_PUBLIC_KEY,
      TOKEN_MINT_ADDRESS
    );
    instructions.push(createPlatformATA);
  }

  const amountInTokens = amount * Math.pow(10, TOKEN_DECIMALS);

  const splitFundsInstruction = await program.methods
    .splitFunds(new BN(amountInTokens))
    .accounts({
      payer: publicKey,
      payerTokenAccount,
      authorTokenAccount,
      platformTokenAccount,
    })
    .instruction();

  instructions.push(splitFundsInstruction);

  const transaction = new Transaction().add(...instructions);

  return { transaction };
}
