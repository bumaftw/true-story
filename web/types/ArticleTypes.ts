export type ArticleAttributes = {
  id: number;
  title: string;
  content: string;
  imageUrl?: string;
  authorId?: number;
  createdAt: Date;
  updatedAt: Date;
};
