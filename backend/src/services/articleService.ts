import { Article, ArticleCreationAttributes, User, Payment } from '../models';
import { Op, Sequelize } from 'sequelize';
import { NotFoundError } from '../shared/errors';

export async function createArticle(
  articleData: ArticleCreationAttributes
): Promise<Article> {
  return Article.create(articleData);
}

export async function getArticleById(
  id: number,
  userId: number
): Promise<Article> {
  const article = await Article.findByPk(id, {
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'publicKey'],
        required: true,
      },
      {
        model: Payment,
        as: 'payments',
        where: { userId },
        required: false,
      },
    ],
  });

  if (!article) {
    throw new NotFoundError('Article not found');
  }

  if (!article.payments?.length && article.author?.id !== userId) {
    article.content = article.content.slice(0, 300);
  }

  return article;
}

export type GetArticlesParams = {
  limit?: number;
  offset?: number;
  searchQuery?: string | null;
};

export async function getArticles(
  params: GetArticlesParams = {}
): Promise<Article[]> {
  const { limit = 10, offset = 0, searchQuery = null } = params;

  const whereClause = searchQuery
    ? {
        [Op.or]: [
          { title: { [Op.iLike]: `%${searchQuery}%` } },
          { content: { [Op.iLike]: `%${searchQuery}%` } },
        ],
      }
    : {};

  return Article.findAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'username', 'publicKey'],
      },
    ],
    attributes: {
      include: [
        'id',
        'title',
        'imageUrl',
        'authorId',
        'createdAt',
        'updatedAt',
        [Sequelize.fn('LEFT', Sequelize.col('content'), 300), 'content'], // Limit content to 100 characters
      ],
    },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
}

export async function updateArticle(
  id: number,
  updates: Partial<Article>
): Promise<Article> {
  const article = await Article.findByPk(id);

  if (!article) {
    throw new NotFoundError('Article not found');
  }

  return article.update(updates);
}

export async function deleteArticle(id: number): Promise<boolean> {
  const article = await Article.findByPk(id);

  if (!article) {
    throw new NotFoundError('Article not found');
  }

  await article.destroy();

  return true;
}