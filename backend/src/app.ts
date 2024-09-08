import express, { Express } from 'express';
import morgan from 'morgan';
import router from './routes';
import logger from './shared/logger';
import { NotFoundError } from './shared/errors';
import { errorHandlerMiddleware } from './middlewares/error.middleware';
import { corsMiddleware } from './middlewares/cors.middleware';

const app: Express = express();

app.use(express.json());
app.use(
  morgan('dev', {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);
app.use(corsMiddleware);

app.use('/api', router);

app.use(() => {
  throw new NotFoundError('Endpoint not found');
});

app.use(errorHandlerMiddleware);

export default app;
