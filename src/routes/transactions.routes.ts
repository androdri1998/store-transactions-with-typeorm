import { Router, Request, Response } from 'express';
import HTTPStatusCode from 'http-status-codes';

const routes = Router();

routes.post('/', (req: Request, res: Response) => {
  return res
    .status(HTTPStatusCode.CREATED)
    .json({ message: 'new transaction' });
});

routes.get('/', (req: Request, res: Response) => {
  return res.status(HTTPStatusCode.OK).json({ message: 'new transaction' });
});

export default routes;
