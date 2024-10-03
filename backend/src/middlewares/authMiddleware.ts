import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../shared/config';
import { getUserByPublicKey } from '../services/userService';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

interface JwtPayload {
  publicKey: string;
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(403).json({ error: 'No token provided' });
    return;
  }

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err || typeof decoded === 'string') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      req.user = await getUserByPublicKey((decoded as JwtPayload).publicKey);
      next();
    } catch (error) {
      next(error);
    }
  });
};
