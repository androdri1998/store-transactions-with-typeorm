/* eslint-disable camelcase */
import { getRepository } from 'typeorm';

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
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    const transactions = await transactionRepository.find();

    const serializedTransactions: ITransaction[] = await Promise.all(
      transactions.map(async transaction => {
        const category = await categoryRepository.findOne(
          transaction.category_id,
        );
        return { ...transaction, category };
      }),
    );

    const initialValue = {
      income: 0,
      outcome: 0,
      total: 0,
    };
    const totalBalance = transactions.reduce((accumulator, transaction) => {
      return {
        income:
          transaction.type === 'income'
            ? accumulator.income + transaction.value
            : accumulator.income,
        outcome:
          transaction.type === 'outcome'
            ? accumulator.outcome + transaction.value
            : accumulator.outcome,
        total:
          transaction.type === 'income'
            ? accumulator.total + transaction.value
            : accumulator.total - transaction.value,
      };
    }, initialValue);

    return { transactions: serializedTransactions, balance: totalBalance };
  }
}

export default ListTransactionsService;
