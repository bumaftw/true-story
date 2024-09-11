import { UniqueConstraintError } from 'sequelize';
import { User, UserCreationAttributes } from '../models/User';
import { AlreadyExistsError, NotFoundError } from '../shared/errors';

export async function createUser(
  userAttributes: UserCreationAttributes
): Promise<User> {
  try {
    return await User.create(userAttributes);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new AlreadyExistsError('User already exists');
    }
    throw error;
  }
}

export async function getUserByPublicKey(
  publicKey: string
): Promise<User | null> {
  return User.findOne({
    where: { publicKey },
  });
}

export async function updateUserByPublicKey(
  publicKey: string,
  userAttributes: Partial<UserCreationAttributes>
): Promise<[number, User[]]> {
  return User.update(userAttributes, {
    where: { publicKey },
    returning: true,
  });
}
