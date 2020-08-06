/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import HTTPStatusCode from 'http-status-codes';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: string;
  category: string;
}

interface Response {
  id: string;
  title: string;
  category_id: string;
  type: string;
  value: number;
  created_at: Date;
  updated_at: Date;
  category: {
    id: string;
    title: string;
    created_at: Date;
    updated_at: Date;
  };
}

class CreateTransactionService {
  public async execute({
    category,
    title,
    type,
    value,
  }: Request): Promise<Response> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    const transactions = await transactionRepository.find();

    const initialValue = 0;
    const totalIncome = transactions.reduce((amount, transaction) => {
      return transaction.type === 'income'
        ? amount + transaction.value
        : amount - transaction.value;
    }, initialValue);

    const valueInCents = value * 100;

    if (type === 'outcome' && totalIncome - valueInCents < 0) {
      throw new AppError('No have money enough', HTTPStatusCode.BAD_REQUEST);
    }

    const findCategory = await categoryRepository.findOne({
      where: { title: category.toUpperCase() },
    });

    let categoryToSaveTransaction;
    const newCategory = categoryRepository.create({
      title: category.toUpperCase(),
    });
    if (!findCategory) {
      await categoryRepository.save(newCategory);
      categoryToSaveTransaction = { ...newCategory };
    } else {
      categoryToSaveTransaction = { ...findCategory };
    }

    const transaction = transactionRepository.create({
      title,
      value: valueInCents,
      category_id: categoryToSaveTransaction.id,
      type,
    });
    await transactionRepository.save(transaction);

    return { ...transaction, category: categoryToSaveTransaction };
  }
}

export default CreateTransactionService;
