export type ISODate = string;

export interface Expense {
  id: number;
  title: string;
  description: string;
  amount: number;
  category: string;
  date: ISODate;
}

export type CreateExpenseRequest = Omit<Expense, 'id'>;

export type ExpensePatch = Partial<Omit<Expense, 'id'>>;

export type UpdateExpenseEvent = {
  id: number,
  patch: ExpensePatch
}

export type ExpensesList = Expense[];
