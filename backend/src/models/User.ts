import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from './sequelize';

export type UserRole = 'journalist' | 'reader';

export type UserAttributes = {
  id: number;
  publicKey: string;
  role: UserRole;
  username?: string | null;
  nonce?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserCreationAttributes = Optional<
  UserAttributes,
  | 'id'
  | 'username'
  | 'nonce'
  | 'createdAt'
  | 'updatedAt'
>;

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare publicKey: string;
  declare role: 'journalist' | 'reader';
  declare username: string | null;
  declare nonce: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    publicKey: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'public_key',
    },
    role: {
      type: DataTypes.ENUM('journalist', 'reader'),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    nonce: DataTypes.STRING,
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
    tableName: 'users',
    timestamps: true,
  }
);
