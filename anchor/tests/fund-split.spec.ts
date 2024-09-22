import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, createAccount, mintTo } from '@solana/spl-token';
import { FundSplit } from '../target/types/fund_split';

describe('fund-split', () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.FundSplit as Program<FundSplit>;
  const payer = provider.wallet as anchor.Wallet;

  let mint: PublicKey;
  let payerTokenAccount: PublicKey;
  let authorTokenAccount: PublicKey;
  let platformTokenAccount: PublicKey;

  beforeAll(async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        payer.publicKey,
        2 * LAMPORTS_PER_SOL
      ),
      'confirmed'
    );

    mint = await createMint(
      provider.connection,
      payer.payer,
      payer.publicKey,
      null,
      6
    );

    payerTokenAccount = await createAccount(
      provider.connection,
      payer.payer,
      mint,
      payer.publicKey
    );

    authorTokenAccount = await createAccount(
      provider.connection,
      payer.payer,
      mint,
      Keypair.generate().publicKey
    );

    platformTokenAccount = await createAccount(
      provider.connection,
      payer.payer,
      mint,
      Keypair.generate().publicKey
    );

    await mintTo(
      provider.connection,
      payer.payer,
      mint,
      payerTokenAccount,
      payer.payer.publicKey,
      1000 * 10 ** 6 // 1000 tokens
    );
  });

  it('splits funds correctly', async () => {
    const amountToSplit = new anchor.BN(100 * 10 ** 6); // 100 tokens

    await program.methods
      .splitFunds(amountToSplit)
      .accounts({
        payer: payer.publicKey,
        payerTokenAccount,
        authorTokenAccount,
        platformTokenAccount,
      })
      .signers([])
      .rpc();

    const payerBalance = (
      await provider.connection.getTokenAccountBalance(payerTokenAccount)
    ).value.amount;
    const authorBalance = (
      await provider.connection.getTokenAccountBalance(authorTokenAccount)
    ).value.amount;
    const platformBalance = (
      await provider.connection.getTokenAccountBalance(platformTokenAccount)
    ).value.amount;

    const expectedAuthorBalance = (100 * 0.9 * 10 ** 6).toString(); // 90 tokens
    const expectedPlatformBalance = (100 * 0.1 * 10 ** 6).toString(); // 10 tokens

    console.log(`Payer balance: ${payerBalance}`);
    console.log(`Author balance: ${authorBalance}`);
    console.log(`Platform balance: ${platformBalance}`);

    expect(authorBalance).toBe(expectedAuthorBalance);
    expect(platformBalance).toBe(expectedPlatformBalance);
  });
});
