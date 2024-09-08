import sequelize from './sequelize';
import './associations';
import { User } from './User';
import { Article } from './Article';
import { FactCheck } from './FactCheck';
import { Payment } from './Payment';

export {
  sequelize,
  User,
  Article,
  FactCheck,
  Payment,
};
