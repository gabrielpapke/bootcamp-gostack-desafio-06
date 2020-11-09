import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const allTransactions = await this.find();
    const balance: Balance = allTransactions.reduce((acc, { type, value }) => (
      {
        ...acc,
        [type]: acc[type] += value,
        total: type === 'income' ? acc.total += value : acc.total -= value
      }
    ), {
      "income": 0,
      "outcome": 0,
      "total": 0
    })

    return balance;
  }
}

export default TransactionsRepository;
