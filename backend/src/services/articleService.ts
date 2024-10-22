import {
  Article,
  ArticleCreationAttributes,
  User,
  UserRole,
  Payment,
} from '../models';
import { Op, Sequelize } from 'sequelize';
import { NotFoundError, ForbiddenError } from '../shared/errors';

export async function createArticle(
  articleData: ArticleCreationAttributes
): Promise<Article> {
  return Article.create(articleData);
}

export async function getArticleById(
  id: number,
  userId?: number
): Promise<Article> {
  const article = await Article.findByPk(id, {
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'publicKey', 'username', 'avatar'],
        required: true,
      },
      ...(userId
        ? [
            {
              model: Payment,
              as: 'payments',
              where: { userId },
              required: false,
            },
          ]
        : []),
    ],
  });

  if (!article) {
    throw new NotFoundError('Article not found');
  }

  if (article.price > 0) {
    if (userId) {
      const userHasAccess =
        article.payments?.length || article.author?.id === userId;
      if (!userHasAccess) {
        article.content = article.content.slice(0, 300);
      }
    } else {
      article.content =
        article.price > 0 ? article.content.slice(0, 300) : article.content;
    }
  }

  return article;
}

export type GetArticlesParams = {
  limit?: number;
  offset?: number;
  searchQuery?: string | null;
  author?: string | null;
  userId?: number | null;
};

export async function getArticles(
  params: GetArticlesParams = {}
): Promise<Article[]> {
  const {
    limit = 10,
    offset = 0,
    searchQuery = null,
    author = null,
    userId = null,
  } = params;

  const whereClause = {
    ...(searchQuery && {
      [Op.or]: [
        { title: { [Op.iLike]: `%${searchQuery}%` } },
        { content: { [Op.iLike]: `%${searchQuery}%` } },
      ],
    }),
    ...(author && {
      '$author.public_key$': author,
    }),
  };

  return Article.findAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'publicKey', 'username', 'avatar'],
      },
      ...(userId
        ? [
            {
              model: Payment,
              as: 'payments',
              where: { userId },
              required: false,
              attributes: ['userId'],
            },
          ]
        : []),
    ],
    attributes: {
      include: [
        'id',
        'title',
        'imageUrl',
        'authorId',
        'createdAt',
        'updatedAt',
        [Sequelize.fn('LEFT', Sequelize.col('content'), 300), 'content'], // Limit content to 300 characters
      ],
    },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });
}

export async function updateArticle(
  id: number,
  updates: Partial<ArticleCreationAttributes>
): Promise<Article> {
  const article = await Article.findByPk(id);

  if (!article) {
    throw new NotFoundError('Article not found');
  }

  if (article.authorId !== updates.authorId) {
    throw new ForbiddenError('Only article author can update the article');
  }

  return article.update(updates);
}

export async function deleteArticle(id: number, user: User): Promise<void> {
  const article = await Article.findByPk(id);

  if (!article) {
    throw new NotFoundError('Article not found');
  }

  if (
    user.role !== 'admin' &&
    user.role !== 'moderator' &&
    user.id !== article.authorId
  ) {
    throw new ForbiddenError(
      'Only admin, moderator or article author can delete the article'
    );
  }

  return article.destroy();
}
