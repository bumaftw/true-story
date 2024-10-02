import { Request, Response } from 'express';
import { User, UserAttributes } from '../models';
import * as userService from '../services/userService';

export async function getProfile(
  req: Request,
  res: Response<User>
): Promise<Response> {
  const profile = await userService.getUserByPublicKey(req.user!.publicKey);

  return res.json(profile);
}

export async function getProfileByPublicKey(
  req: Request,
  res: Response<User>
): Promise<Response> {
  const profile = await userService.getUserByPublicKey(req.params.publicKey);

  return res.json(profile);
}

export async function updateProfile(
  req: Request<object, User, Partial<UserAttributes>>,
  res: Response<User>
): Promise<Response> {
  const profile = await userService.updateUserByPublicKey(req.user!.publicKey, {
    username: req.body.username,
    avatar: req.body.avatar,
    xLink: req.body.xLink,
  });

  return res.json(profile);
}