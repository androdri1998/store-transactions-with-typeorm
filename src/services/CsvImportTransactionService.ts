/* eslint-disable camelcase */
import { getRepository } from 'typeorm';
import csvParser from 'csv-parser';
import fs from 'fs';

import Category from '../models/Category';
import Transaction from '../models/Transaction';

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

interface Request {
  pathName: string;
}

interface IParamsCreateTransaction {
  category: string;
  title: string;
  type: string;
  value: number;
}

interface Response {
  transactions: ITransaction[];
}

class CsvImportTransactionService {
  public async execute({ pathName }: Request): Promise<Response> {
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);
    const parsers = csvParser();

    const transactions: IParamsCreateTransaction[] = [];
    const parseCSV = fs
      .createReadStream(pathName)
      .pipe(parsers)
      .on('data', transactionRow => {
        const serilializeTransaction: IParamsCreateTransaction = {} as IParamsCreateTransaction;
        Object.keys(transactionRow).map(key => {
          Object.assign(serilializeTransaction, {
            [key.trim()]: transactionRow[key].trim(),
          });
          return true;
        });

        const { category, type, title, value } = serilializeTransaction;
        if (!category || !type || !title || !value) return;

        transactions.push({ category, type, title, value });
      });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const categoriesIncludeds: string[] = [];
    transactions.map(transaction => {
      if (!categoriesIncludeds.includes(transaction.category.toUpperCase())) {
        categoriesIncludeds.push(transaction.category.toUpperCase());
      }
      return true;
    });

    const categories = await Promise.all(
      categoriesIncludeds.map(async category => {
        const checkCategory = await categoryRepository.findOne({
          where: { title: category },
        });
        const newCategory = categoryRepository.create({ title: category });
        if (!checkCategory) {
          await categoryRepository.save(newCategory);
        }

        return checkCategory || newCategory;
      }),
    );

    const transactionsCreateds = await Promise.all(
      transactions.map(async transaction => {
        const categoryTransaction = categories.find(
          category => category?.title === transaction.category.toUpperCase(),
        );

        const valueInCents = transaction.value * 100;
        const newTransaction = transactionRepository.create({
          category_id: categoryTransaction?.id,
          title: transaction.title,
          type: transaction.type,
          value: valueInCents,
        });
        await transactionRepository.save(newTransaction);
        return { ...newTransaction, category: categoryTransaction };
      }),
    );

    fs.promises.unlink(pathName);
    return { transactions: transactionsCreateds };
  }
}

export default CsvImportTransactionService;
