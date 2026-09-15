import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home/home-page';
import { AddExpense } from './features/expenses/pages/add-expense/add-expense';
import { ExpenseSummary } from './features/expenses/pages/expense-summary/expense-summary';
import { ExpenseDetail } from './features/expenses/pages/expense-detail/expense-detail';
import { VerifyEmail } from './features/auth/pages/verify-email/verify-email';

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
    path: 'expenses/:id',
    component: ExpenseDetail,
    title: 'Dettaglio Spesa | Gestionale Spese'
  },
  {
    path: 'verify-email',
    component: VerifyEmail
  },
  {
    path: '**',
    redirectTo: ''
  }
];
