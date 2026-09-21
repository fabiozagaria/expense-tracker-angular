export type ISODate = string;

export enum IncomeCategory {
  Salary = 'salary',
  Refund = 'refund',
  Gift = 'gift',
  Bonus = 'bonus',
  Sale = 'sale',
  Other = 'other',
}

export interface Income {
  id: number;
  title: string;
  description: string;
  amount: number;
  category: IncomeCategory;
  date: ISODate;
}

export type CreateIncomeRequest = Omit<Income, 'id'>;
export type IncomesList = Income[];
