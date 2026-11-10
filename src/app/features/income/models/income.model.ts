import { ISODate } from '../../expenses/models/expense.model';

export enum IncomeCategory {
  Salary = 'salary',
  Freelance = 'freelance',
  Bonus = 'bonus',
  Refund = 'refund',
  Investment = 'investment',
  Gift = 'gift',
  Rental = 'rental',
  Other = 'other',
}

export interface Income {
  id: number;
  title: string;
  amount: number;
  category: IncomeCategory;
  /** Facoltativa nel backend: può arrivare null. */
  description: string | null;
  date: ISODate;
}
