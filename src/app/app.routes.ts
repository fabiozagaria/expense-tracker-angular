import { Routes } from '@angular/router';
import { HomePage } from './features/home/pages/home/home-page';
import { AddExpense } from './features/expenses/pages/add-expense/add-expense';
import { ExpenseSummary } from './features/expenses/pages/expense-summary/expense-summary';
import { ExpenseDetail } from './features/expenses/pages/expense-detail/expense-detail';
import { VerifyEmail } from './features/auth/pages/verify-email/verify-email';
import { Login } from './features/auth/pages/login/login';
import { Register } from './features/auth/pages/register/register';
import { authGuard } from './features/auth/services/auth.guard';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';
import { AddTransaction } from './features/transactions/pages/add-transaction/add-transaction';
import { AddIncome } from './features/incomes/pages/add-income/add-income';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    title: 'Home | Gestionale Spese'
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: Dashboard,
    title: 'Dashboard | Gestionale Spese'
  },
  {
    path: 'add-transaction',
    canActivate: [authGuard],
    component: AddTransaction,
    title: 'Nuovo movimento | Gestionale Spese'
  },
  {
    path: 'add-income',
    canActivate: [authGuard],
    component: AddIncome,
    title: 'Aggiungi Entrata | Gestionale Spese'
  },
  {
    path: 'add-expense',
    canActivate: [authGuard],
    component: AddExpense,
    title: 'Aggiungi Spesa | Gestionale Spese'
  },
  {
    path: 'summary',
    canActivate: [authGuard],
    component: ExpenseSummary,
    title: 'Riepilogo | Gestionale Spese'
  },
  {
    path: 'expenses/:id',
    canActivate: [authGuard],
    component: ExpenseDetail,
    title: 'Dettaglio Spesa | Gestionale Spese'
  },
  {
    path: 'login',
    component: Login,
    title: 'Accedi | Gestionale Spese'
  },
  {
    path: 'register',
    component: Register,
    title: 'Registrati | Gestionale Spese'
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
