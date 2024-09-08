import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { request } from '@/api';
import bs58 from 'bs58';
import { TOKEN_STORAGE_KEY } from '../constants';

export function useAuth() {
  const { publicKey, signMessage } = useWallet();
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<Error | null>(null);

  const authenticate = async () => {
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      if (!publicKey || !signMessage) {
        throw new Error('Wallet not connected or signing not supported');
      }

      const { nonce } = await request({
        path: '/auth/nonce',
        method: 'POST',
        body: { publicKey: publicKey.toBase58() },
      });

      const encodedNonce = new TextEncoder().encode(nonce);

      const signature = await signMessage(encodedNonce);

      const { token } = await request({
        path: '/auth/verify',
        method: 'POST',
        body: {
          publicKey: publicKey.toBase58(),
          signature: bs58.encode(signature),
        },
      });

      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } catch (error) {
      console.error('Authentication error:', error);
      if (error instanceof Error) {
        setAuthError(error);
      } else {
        setAuthError(new Error('An unknown error occurred'));
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getToken = async () => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      return token;
    }

    await authenticate();

    return localStorage.getItem(TOKEN_STORAGE_KEY);
  };

  return { getToken, isAuthenticating, authError };
}
