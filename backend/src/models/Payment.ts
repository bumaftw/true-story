import { DataTypes, Model, Optional, NonAttribute } from 'sequelize';
import sequelize from './sequelize';
import { Article } from './Article';
import { User } from './User';

export type PaymentAttributes = {
  id: number;
  articleId: number;
  userId: number;
  amount: number;
  transactionId: string;
  createdAt: Date;
};

export type PaymentCreationAttributes = Optional<PaymentAttributes, 'id' | 'createdAt'>;

export class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  declare id: number;
  declare articleId: number;
  declare userId: number;
  declare amount: number;
  declare transactionId: string;
  declare readonly createdAt: Date;
  declare article?: NonAttribute<Article>;
  declare user?: NonAttribute<User>;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'articles',
        key: 'id',
      },
      onDelete: 'CASCADE',
      field: 'article_id',
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      field: 'user_id',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'transaction_id',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: false,
  }
);

export default Payment;
