export type ISODate = string;

export enum ExpenseCategory {
  Groceries = 'groceries',
  Car = 'car',
  Gifts = 'gifts',
  Installments = 'installments',
  Loan = 'loan',
  Health = 'health',
  Transport = 'transport',
  Bills = 'bills',
  Housing = 'housing',
  Leisure = 'leisure',
  Other = 'other',
}

export interface Expense {
  id: number;
  title: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: ISODate;
}

export type CreateExpenseRequest = Omit<Expense, 'id'>;

export type ExpensePatch = Partial<Omit<Expense, 'id'>>;

export type UpdateExpenseEvent = {
  id: number,
  patch: ExpensePatch
}

export type ExpensesList = Expense[];
