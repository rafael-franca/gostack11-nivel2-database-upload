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
    const { transactionsIncome } = await this.createQueryBuilder('transactions').select('SUM(value)', 'transactionsIncome').where("type = 'income'").getRawOne();
    const { transactionsOutcome } = await this.createQueryBuilder('transactions').select('SUM(value)', 'transactionsOutcome').where("type = 'outcome'").getRawOne();

    return {
      income: Number(transactionsIncome),
      outcome: Number(transactionsOutcome),
      total: (transactionsIncome - transactionsOutcome)
    }
  }
}

export default TransactionsRepository;
