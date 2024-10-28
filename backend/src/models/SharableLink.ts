import { DataTypes, Model, Optional, NonAttribute } from 'sequelize';
import sequelize from './sequelize';
import { Article } from './Article';

export type SharableLinkAttributes = {
  id: number;
  articleId: number;
  uuid: string;
  createdAt: Date;
  expiresAt: Date | null;
};

export type SharableLinkCreationAttributes = Optional<
  SharableLinkAttributes,
  'id' | 'uuid' | 'createdAt' | 'expiresAt'
>;

export class SharableLink
  extends Model<SharableLinkAttributes, SharableLinkCreationAttributes>
  implements SharableLinkAttributes
{
  declare id: number;
  declare articleId: number;
  declare uuid: string;
  declare readonly createdAt: Date;
  declare expiresAt: Date | null;
  declare article?: NonAttribute<Article>;
}

SharableLink.init(
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
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'expires_at',
    },
  },
  {
    sequelize,
    tableName: 'sharable_links',
    timestamps: false,
  }
);

export default SharableLink;
