/* eslint-disable camelcase */
import { getRepository } from 'typeorm';

import GetBalaceTransactionService from './GetBalaceTransactionService';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface ITransaction {
  id: string;
  title: string;
  category_id: string;
  type: string;
  value: number;
  created_at: Date;
  updated_at: Date;
  category:
    | {
        id: string;
        title: string;
        created_at: Date;
        updated_at: Date;
      }
    | undefined;
}

interface TransactionsResponse {
  transactions: ITransaction[];
  balance: {
    income: number;
    outcome: number;
    total: number;
  };
}

class ListTransactionsService {
  public async execute(): Promise<TransactionsResponse> {
    const getBalaceTransactionService = new GetBalaceTransactionService();
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    const transactions = await transactionRepository.find();

    const serializedTransactions: ITransaction[] = await Promise.all(
      transactions.map(async transaction => {
        const category = await categoryRepository.findOne(
          transaction.category_id,
        );
        const valueInReal = transaction.value / 100;
        return { ...transaction, category, value: valueInReal };
      }),
    );

    const totalBalance = getBalaceTransactionService.execute({ transactions });

    return { transactions: serializedTransactions, balance: totalBalance };
  }
}

export default ListTransactionsService;
