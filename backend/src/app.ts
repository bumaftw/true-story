import express, { Express } from 'express';
import morgan from 'morgan';
import router from './routes';
import logger from './shared/logger';
import { NotFoundError } from './shared/errors';
import { errorHandlerMiddleware } from './middlewares/errorMiddleware';
import { corsMiddleware } from './middlewares/corsMiddleware';

const app: Express = express();

// TODO: reduce limit after image uploading implemented
app.use(express.json({ limit: '10mb' }));
app.use(
  morgan('dev', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);
app.use(corsMiddleware);

app.use('/api', router);

app.use(() => {
  throw new NotFoundError('Endpoint not found');
});

app.use(errorHandlerMiddleware);

export default app;
