/* eslint-disable camelcase */
import csvParser from 'csv-parser';
import fs from 'fs';

import CreateTransactionService from './CreateTransactionService';

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
    const createTransactionService = new CreateTransactionService();
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

    const transactionsCreateds = await Promise.all(
      transactions.map(async transaction => {
        const transactionCreated = await createTransactionService.execute({
          category: transaction.category,
          title: transaction.title,
          type: transaction.type,
          value: transaction.value,
          validateBalance: false,
        });

        return transactionCreated;
      }),
    );

    fs.promises.unlink(pathName);
    return { transactions: transactionsCreateds };
  }
}

export default CsvImportTransactionService;
