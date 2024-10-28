import sequelize from './sequelize';
import './associations';
import { User, UserRole, UserAttributes, UserCreationAttributes } from './User';
import {
  Article,
  ArticleAttributes,
  ArticleCreationAttributes,
} from './Article';
import { FactCheck } from './FactCheck';
import { Payment, PaymentAttributes } from './Payment';
import { SharableLink, SharableLinkAttributes } from './SharableLink';

export {
  sequelize,
  User,
  UserRole,
  UserAttributes,
  UserCreationAttributes,
  Article,
  ArticleAttributes,
  ArticleCreationAttributes,
  FactCheck,
  Payment,
  PaymentAttributes,
  SharableLink,
  SharableLinkAttributes,
};
