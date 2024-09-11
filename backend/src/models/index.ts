import sequelize from './sequelize';
import './associations';
import { User } from './User';
import {
  Article,
  ArticleAttributes,
  ArticleCreationAttributes,
} from './Article';
import { FactCheck } from './FactCheck';
import { Payment, PaymentAttributes } from './Payment';

export {
  sequelize,
  User,
  Article,
  ArticleAttributes,
  ArticleCreationAttributes,
  FactCheck,
  Payment,
  PaymentAttributes,
};
