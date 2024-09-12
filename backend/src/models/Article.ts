import { DataTypes, Model, Optional, NonAttribute } from 'sequelize';
import sequelize from './sequelize';
import { User } from './User';
import { Payment } from './Payment';

export type ArticleAttributes = {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  authorId?: number | null;
  price: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ArticleCreationAttributes = Optional<
  ArticleAttributes,
  'id' | 'imageUrl' | 'createdAt' | 'updatedAt'
>;

export class Article
  extends Model<ArticleAttributes, ArticleCreationAttributes>
  implements ArticleAttributes
{
  declare id: number;
  declare title: string;
  declare content: string;
  declare imageUrl: string | null;
  declare authorId: number | null;
  declare price: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare author?: NonAttribute<User>;
  declare payments?: NonAttribute<Payment[]>;
}

Article.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image_url',
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      field: 'author_id',
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'articles',
    timestamps: true,
  }
);
