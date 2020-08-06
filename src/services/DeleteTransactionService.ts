/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import HTTPStatusCode from 'http-status-codes';

import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface Request {
  transactionId: string;
}

class DeleteTransactionService {
  public async execute({ transactionId }: Request): Promise<void> {
    const transactionRepository = getRepository(Transaction);
    const checkTransaction = await transactionRepository.findOne(transactionId);
    if (!checkTransaction) {
      throw new AppError('Transaction not found', HTTPStatusCode.NOT_FOUND);
    }
    await transactionRepository.delete({
      id: transactionId,
    });
  }
}

export default DeleteTransactionService;
