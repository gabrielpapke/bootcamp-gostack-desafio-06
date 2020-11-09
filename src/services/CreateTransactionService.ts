// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string,
  value: number,
  type: "income" | "outcome",
  category: string
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const balanceValue = await transactionsRepository.getBalance();

    if (type === 'outcome' &&  balanceValue.total - value < 0) {
      throw new AppError('You need to earn more money! :)');
    }

    let category_id;
    const categoryFinded = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (categoryFinded) {
      category_id = categoryFinded.id
    } else {
      const newCategory = categoriesRepository.create({
        title: category
      });

      await categoriesRepository.save(newCategory);

      category_id = newCategory.id;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id
    });

    await transactionsRepository.save(transaction);


    return transaction;

  }
}

export default CreateTransactionService;
