// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import FundSplitIDL from '../target/idl/fund_split.json';
import type { FundSplit } from '../target/types/fund_split';

// Re-export the generated IDL and type
export { FundSplit, FundSplitIDL };

// The programId is imported from the program IDL.
export const FUND_SPLIT_PROGRAM_ID = new PublicKey(FundSplitIDL.address);

// This is a helper function to get the FundSplit Anchor program.
export function getFundSplitProgram(provider: AnchorProvider) {
  return new Program(FundSplitIDL as FundSplit, provider);
}

// This is a helper function to get the program ID for the FundSplit program depending on the cluster.
export function getFundSplitProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return FUND_SPLIT_PROGRAM_ID;
  }
}
