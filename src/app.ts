import express from 'express';

import './database';
import routes from './routes';

import errorsMiddleware from './middlewares/errors';
import logResquest from './middlewares/logResquest';

const app = express();

app.use(logResquest);

app.use('/', routes);

app.use(errorsMiddleware);

export default app;
