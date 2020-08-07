/* eslint-disable camelcase */
interface ITransaction {
  id: string;
  title: string;
  category_id: string;
  type: string;
  value: number;
  created_at: Date;
  updated_at: Date;
  category?:
    | {
        id: string;
        title: string;
        created_at: Date;
        updated_at: Date;
      }
    | undefined;
}

interface Request {
  transactions: ITransaction[];
}

interface Response {
  income: number;
  outcome: number;
  total: number;
}

class CsvImportTransactionService {
  public execute({ transactions }: Request): Response {
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

    return {
      income: totalBalance.income / 100,
      outcome: totalBalance.outcome / 100,
      total: totalBalance.total / 100,
    };
  }
}

export default CsvImportTransactionService;
