import { UserAttributes } from './UserTypes';
import { PaymentAttributes } from './PaymentTypes';

export type ArticleAttributes = {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  authorId?: number | null;
  price: number;
  pinnedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author?: UserAttributes;
  payments?: PaymentAttributes[];
};
