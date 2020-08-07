import { Router, Request, Response } from 'express';
import HTTPStatusCode from 'http-status-codes';
import multer from 'multer';
import path from 'path';

import uploadConfig from '../config/upload';

import CreateTransactionService from '../services/CreateTransactionService';
import ListTransactionsService from '../services/ListTransactionsService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import CsvImportTransactionService from '../services/CsvImportTransactionService';

import validateRequest from '../middlewares/validate-request';
import { createTransaction, deleteTransaction } from '../schemas/transaction';

const routes = Router();
const upload = multer(uploadConfig);

routes.post(
  '/',
  validateRequest(createTransaction, 'body'),
  async (req: Request, res: Response) => {
    const { category, title, type, value } = req.body;
    const createTransactionService = new CreateTransactionService();
    const transaction = await createTransactionService.execute({
      category,
      title,
      type,
      value,
    });

    return res.status(HTTPStatusCode.CREATED).json({ transaction });
  },
);

routes.post(
  '/import',
  upload.single('file'),
  async (req: Request, res: Response) => {
    const { filename } = req.file;
    const csvImportTransactionService = new CsvImportTransactionService();

    const pathName = path.join(__dirname, '..', '..', 'tmp', filename);
    const transactions = await csvImportTransactionService.execute({
      pathName,
    });

    return res.status(HTTPStatusCode.CREATED).json({ transactions });
  },
);

routes.get('/', async (req: Request, res: Response) => {
  const listTransactionsService = new ListTransactionsService();
  const transactions = await listTransactionsService.execute();
  return res.status(HTTPStatusCode.OK).json(transactions);
});

routes.delete(
  '/:transactionId',
  validateRequest(deleteTransaction, 'params'),
  async (req: Request, res: Response) => {
    const { transactionId } = req.params;
    const deleteTransactionService = new DeleteTransactionService();
    await deleteTransactionService.execute({ transactionId });
    return res.status(HTTPStatusCode.NO_CONTENT).json({});
  },
);

export default routes;
