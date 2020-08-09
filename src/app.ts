import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';

import routes from './routes';

import errorsMiddleware from './middlewares/errors';
import logResquest from './middlewares/logResquest';
import createConnection from './database';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env.dev',
});

createConnection();
const app = express();

app.use(express.json());
app.use(logResquest);

app.use('/', routes);

app.use(errorsMiddleware);

export default app;
