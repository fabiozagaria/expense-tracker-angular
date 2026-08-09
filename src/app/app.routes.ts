import { Routes } from '@angular/router';
import { HomePage } from './home/home-page/home-page';
import { AddExpense } from './expenses/add-expense/add-expense';
import { ExpenseSummary } from './expenses/expense-summary/expense-summary';
import { AddIncome } from './income/add-income/add-income';
import { ExpenseDetail } from './expenses/expense-detail/expense-detail';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'Home | Gestionale Spese'
  },
  {
    path: 'add-expense',
    component: AddExpense,
    title: 'Aggiungi Spesa | Gestionale Spese'
  },
  {
    path: 'summary',
    component: ExpenseSummary,
    title: 'Riepilogo | Gestionale Spese'
  },
  {
    path: 'add-income',
    component: AddIncome,
    title: 'Aggiungi Entrate | Gestionale Spese'
  },
  {
    path: 'expenses/:id',
    component: ExpenseDetail,
    title: 'Dettaglio Spesa | Gestionale Spese'

  }
];
