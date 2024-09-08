import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize';

export class FactCheck extends Model {
  public id!: number;
  public articleId!: number;
  public userId!: number;
  public isAccurate!: boolean;
  public readonly createdAt!: Date;
}

FactCheck.init(
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
    isAccurate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: 'is_accurate',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  },
  {
    sequelize,
    tableName: 'fact_checks',
    timestamps: false,
  }
);
