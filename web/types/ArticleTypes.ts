import { UserAttributes } from './UserTypes'

export type ArticleAttributes = {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  authorId?: number;
  author?: UserAttributes;
  createdAt: Date;
  updatedAt: Date;
};
