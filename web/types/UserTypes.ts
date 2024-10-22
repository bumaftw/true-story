export type UserRole = 'journalist' | 'reader' | 'admin' | 'moderator';

export type UserAttributes = {
  id: number;
  publicKey: string;
  role: UserRole;
  username?: string | null;
  nonce?: string | null;
  avatar?: string | null;
  xLink?: string | null;
  bio?: string | null;
  createdAt: Date;
  updatedAt: Date;
};
