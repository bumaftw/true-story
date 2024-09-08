import { Request, Response } from 'express';
import { Article } from '../models';
import * as ArticleService from '../services/ArticleService';

export async function getArticles(
  req: Request,
  res: Response<Article[]>,
): Promise<Response> {
  const offset = Number(req.query.offset) || 0;
  const limit = Number(req.query.limit) || 10;
  const searchQuery = req.query.search ? String(req.query.search) : null;

  const articles = await ArticleService.getArticles({
    limit,
    offset,
    searchQuery,
  });

  return res.json(articles);
}

export async function getArticleById(
  req: Request,
  res: Response<Article>,
): Promise<Response> {
  const article = await ArticleService.getArticleById(parseInt(req.params.id));

  return res.json(article);
}
