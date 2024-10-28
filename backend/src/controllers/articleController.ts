import { Request, Response } from 'express';
import {
  ArticleAttributes,
  ArticleCreationAttributes,
  SharableLinkAttributes,
} from '../models';
import * as articleService from '../services/articleService';

export async function getArticles(
  req: Request,
  res: Response<ArticleAttributes[]>
): Promise<void> {
  const offset = Number(req.query.offset) || 0;
  const limit = Number(req.query.limit) || 10;
  const searchQuery = req.query.search ? String(req.query.search) : null;
  const author = req.query.author ? String(req.query.author) : null;
  const userId = req.user?.id;

  const articles = await articleService.getArticles({
    limit,
    offset,
    searchQuery,
    author,
    userId,
  });

  res.json(articles);
}

export async function getArticleById(
  req: Request<
    { id: string },
    ArticleAttributes,
    object,
    { share_token?: string }
  >,
  res: Response<ArticleAttributes>
): Promise<void> {
  const article = await articleService.getArticleById(
    parseInt(req.params.id),
    req.user?.id,
    req.query.share_token
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
  };
  if (req.body.imageUrl) {
    // TODO: implement image uploading
    updates.imageUrl = req.body.imageUrl;
  }

  const article = await articleService.updateArticle(id, updates);

  res.json(article);
}

export async function deleteArticle(
  req: Request<{ id: string }>,
  res: Response<boolean>
): Promise<void> {
  const id: number = parseInt(req.params.id);

  await articleService.deleteArticle(id, req.user!);

  res.json(true);
}

export async function pinArticle(
  req: Request<{ id: string }>,
  res: Response<boolean>
): Promise<void> {
  const id: number = parseInt(req.params.id);

  await articleService.updateArticlePinedStatus(id, new Date(), req.user!);

  res.json(true);
}

export async function unpinArticle(
  req: Request<{ id: string }>,
  res: Response<boolean>
): Promise<void> {
  const id: number = parseInt(req.params.id);

  await articleService.updateArticlePinedStatus(id, null, req.user!);

  res.json(true);
}

export async function generateSharableLink(
  req: Request<
    { id: string },
    SharableLinkAttributes,
    { signature?: string | null }
  >,
  res: Response<SharableLinkAttributes>
): Promise<void> {
  const id: number = parseInt(req.params.id);
  const { signature } = req.body;
  const userId = req.user!.id;

  const sharableLink = await articleService.shareArticle(id, userId, signature);

  res.json(sharableLink);
}
