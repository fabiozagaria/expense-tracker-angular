import { ISODate } from "../expenses/expense";

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
  description: string;
  date: ISODate;
}
