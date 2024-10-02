import sequelize from './sequelize';
import './associations';
import { User, UserAttributes, UserCreationAttributes } from './User';
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
  UserAttributes,
  UserCreationAttributes,
  Article,
  ArticleAttributes,
  ArticleCreationAttributes,
  FactCheck,
  Payment,
  PaymentAttributes,
};
