import { Request, Response } from 'express';
import { ArticleAttributes, ArticleCreationAttributes } from '../models';
import * as articleService from '../services/articleService';

export async function getArticles(
  req: Request,
  res: Response<ArticleAttributes[]>
): Promise<Response> {
  const offset = Number(req.query.offset) || 0;
  const limit = Number(req.query.limit) || 10;
  const searchQuery = req.query.search ? String(req.query.search) : null;

  const articles = await articleService.getArticles({
    limit,
    offset,
    searchQuery,
  });

  return res.json(articles);
}

export async function getArticleById(
  req: Request,
  res: Response<ArticleAttributes>
): Promise<Response> {
  const article = await articleService.getArticleById(
    parseInt(req.params.id),
    req.user!.id
  );

  return res.json(article);
}

export async function createArticle(
  req: Request<object, ArticleAttributes, ArticleCreationAttributes>,
  res: Response<ArticleAttributes>
): Promise<Response> {
  const article = await articleService.createArticle({
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.body.imageUrl,
    authorId: req.user!.id,
    price: req.body.price,
  });

  return res.json(article);
}
