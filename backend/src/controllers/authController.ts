import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import config from '../shared/config';
import logger from '../shared/logger';
import { NotFoundError } from '../shared/errors';
import * as userService from '../services/userService';

const JWT_SECRET_KEY = config.get('JWT_SECRET_KEY');

function generateNonce(): string {
  return Math.floor(Math.random() * 1000000).toString();
}

export const getNonce = async (req: Request, res: Response) => {
  const publicKey = req.body.publicKey;
  if (!publicKey) {
    res.status(400).json({ error: 'Public key is required' });
    return;
  }

  const nonce = generateNonce();

  try {
    await userService.updateUserByPublicKey(publicKey, {
      nonce,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      await userService.createUser({
        publicKey,
        role: 'reader',
        nonce,
      });

      logger.debug('New user created', { publicKey, nonce });
    }

    throw error;
  }

  res.status(200).json({ nonce });
};

export const verifySignature = async (req: Request, res: Response) => {
  const { publicKey, signature } = req.body;

  if (!publicKey || !signature) {
    res.status(400).json({ error: 'Public key and signature are required' });
    return;
  }

  const user = await userService.getUserByPublicKey(publicKey);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  if (!user.nonce) {
    res.status(400).json({ error: 'No nonce found for this public key' });
    return;
  }

  try {
    const message = new TextEncoder().encode(user.nonce);
    const publicKeyInstance = new PublicKey(publicKey).toBytes();
    const signatureBuffer = bs58.decode(signature);

    const isValid = nacl.sign.detached.verify(
      message,
      signatureBuffer,
      publicKeyInstance
    );

    if (!isValid) {
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    const token = jwt.sign({ publicKey, role: user.role }, JWT_SECRET_KEY);

    user.nonce = null;
    await user.save();

    res.status(200).json({ token });
  } catch (error) {
    logger.error('Error verifying signature', error);
    res.status(500).json({ error: 'Server error' });
  }
};
