import { User } from './User';
import { Article } from './Article';
import { FactCheck } from './FactCheck';
import { Payment } from './Payment';
import { SharableLink } from './SharableLink';

User.hasMany(Article, {
  foreignKey: 'authorId',
  as: 'articles',
});
Article.belongsTo(User, {
  foreignKey: 'authorId',
  as: 'author',
});

User.hasMany(FactCheck, {
  foreignKey: 'userId',
  as: 'factChecks',
});
FactCheck.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

User.hasMany(Payment, {
  foreignKey: 'userId',
  as: 'payments',
});
Payment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Article.hasMany(FactCheck, {
  foreignKey: 'articleId',
  as: 'factChecks',
});
FactCheck.belongsTo(Article, {
  foreignKey: 'articleId',
  as: 'article',
});

Article.hasMany(Payment, {
  foreignKey: 'articleId',
  as: 'payments',
});
Payment.belongsTo(Article, {
  foreignKey: 'articleId',
  as: 'article',
});

Article.hasMany(SharableLink, {
  foreignKey: 'articleId',
  as: 'sharableLinks',
});
SharableLink.belongsTo(Article, {
  foreignKey: 'articleId',
  as: 'article',
});
