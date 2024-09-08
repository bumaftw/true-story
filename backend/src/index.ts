import config from './shared/config';
import logger from './shared/logger';
import app from './app';
import { sequelize } from './models';

const port = config.get('PORT');

sequelize
  .authenticate()
  .then(() => {
    logger.info('Database connection has been established successfully.');
  })
  .catch((error: Error) => {
    logger.error('Unable to connect to the database.', { error });
    throw error;
  });

app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});
