import { Router } from 'express';

import transactionsRoutes from './transactions.routes';

const routes = Router();

routes.use('/transactions', transactionsRoutes);

export default routes;
