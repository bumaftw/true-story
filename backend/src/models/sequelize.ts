import { Sequelize } from 'sequelize';
import config from '../shared/config';

const sslConfig = process.env.NODE_ENV !== 'local' &&
  process.env.NODE_ENV !== 'test' && {
    ssl: {
      require: true,
      rejectUnauthorized: true,
      ca: process.env.CA_CERT,
    },
  };

export const sequelize = new Sequelize(config.get('DATABASE_URL'), {
  dialect: 'postgres',
  dialectOptions: sslConfig
    ? {
        ssl: sslConfig.ssl,
      }
    : {},
  logging: false,
});

export default sequelize;
