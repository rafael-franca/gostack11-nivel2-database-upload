import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const balance = await transactionRepository.getBalance();

    if (type == 'outcome' && balance.total < value) {
      throw new AppError('You don\'t have enough balance!');
    }

    const categoryRepository = getRepository(Category);

    const hasCategory = await categoryRepository.findOne({
      where: {
        title: category
      }
    });

    let categoryModel: Category;

    if (!hasCategory) {
      const newCategory = categoryRepository.create({
        title: category
      })

      await categoryRepository.save(newCategory);

      categoryModel = newCategory;
    } else {
      categoryModel = hasCategory;
    }

    if (!categoryModel) {
      throw new AppError('Oops!');
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: categoryModel
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
