import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getUserByPublicKey } from '../services/userService';
import { UserRole } from '../models';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'jwt-secret-key';

type JwtPayload = {
  publicKey: string;
  role: UserRole;
};

export const verifyToken = (
  { required }: { required: boolean } = { required: true }
) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      if (required) {
        res.status(403).json({ error: 'No token provided' });
        return;
      }
      return next();
    }

    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
      if (err || typeof decoded === 'string') {
        if (required) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
        return next();
      }

      try {
        req.user = await getUserByPublicKey((decoded as JwtPayload).publicKey);
        next();
      } catch (error) {
        next(error);
      }
    });
  };
};
