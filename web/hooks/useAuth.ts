import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { request } from '@/api';
import bs58 from 'bs58';
import { TOKEN_STORAGE_KEY } from '../constants';

export function useAuth() {
  const { publicKey, signMessage } = useWallet();
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<Error | null>(null);

  const getTokenKey = (publicKey: string) =>
    `${TOKEN_STORAGE_KEY}_${publicKey}`;

  const authenticate = async () => {
    setIsAuthenticating(true);
    setAuthError(null);

    try {
      if (!publicKey || !signMessage) {
        return null;
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

      const tokenKey = getTokenKey(publicKey.toBase58());
      localStorage.setItem(tokenKey, token);
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
    if (!publicKey) return null;

    const tokenKey = getTokenKey(publicKey.toBase58());
    const token = localStorage.getItem(tokenKey);

    if (token) {
      return token;
    }

    await authenticate();

    return localStorage.getItem(tokenKey);
  };

  return { getToken, isAuthenticating, authError };
}
