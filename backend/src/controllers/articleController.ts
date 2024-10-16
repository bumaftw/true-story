import { Request, Response } from 'express';
import { ArticleAttributes, ArticleCreationAttributes } from '../models';
import * as articleService from '../services/articleService';

export async function getArticles(
  req: Request,
  res: Response<ArticleAttributes[]>
): Promise<void> {
  const offset = Number(req.query.offset) || 0;
  const limit = Number(req.query.limit) || 10;
  const searchQuery = req.query.search ? String(req.query.search) : null;
  const author = req.query.author ? String(req.query.author) : null;

  const articles = await articleService.getArticles({
    limit,
    offset,
    searchQuery,
    author,
  });

  res.json(articles);
}

export async function getArticleById(
  req: Request,
  res: Response<ArticleAttributes>
): Promise<void> {
  const article = await articleService.getArticleById(
    parseInt(req.params.id),
    req.user?.id
  );

  res.json(article);
}

export async function createArticle(
  req: Request<object, ArticleAttributes, ArticleCreationAttributes>,
  res: Response<ArticleAttributes>
): Promise<void> {
  const article = await articleService.createArticle({
    title: req.body.title,
    content: req.body.content,
    // TODO: implement image uploading
    imageUrl: req.body.imageUrl,
    authorId: req.user!.id,
    price: req.body.price,
  });

  res.json(article);
}

export async function updateArticle(
  req: Request<{ id: string }, ArticleAttributes, ArticleCreationAttributes>,
  res: Response<ArticleAttributes>
): Promise<void> {
  const id: number = parseInt(req.params.id);
  const updates: Partial<ArticleCreationAttributes> = {
    title: req.body.title,
    content: req.body.content,
    authorId: req.user!.id,
    price: req.body.price,
  }
  if (req.body.imageUrl) {
    // TODO: implement image uploading
    updates.imageUrl = req.body.imageUrl;
  }

  const article = await articleService.updateArticle(id, updates);

  res.json(article);
}
