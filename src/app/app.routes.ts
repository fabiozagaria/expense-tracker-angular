import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { AddExpense } from './pages/add-expense/add-expense';
import { ExpenseSummary } from './pages/expense-summary/expense-summary';
import { AddIncome } from './pages/add-income/add-income';
import { ExpenseDetail } from './pages/expense-detail/expense-detail';

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
