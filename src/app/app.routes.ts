import { Routes } from '@angular/router';
import { authGuard } from './features/auth/services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home/home-page').then(m => m.HomePage),
    title: 'Home | Gestionale Spese'
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard').then(m => m.Dashboard),
    title: 'Dashboard | Gestionale Spese'
  },
  {
    path: 'add-transaction',
    canActivate: [authGuard],
    loadComponent: () => import('./features/transactions/pages/add-transaction/add-transaction').then(m => m.AddTransaction),
    title: 'Nuovo movimento | Gestionale Spese'
  },
  {
    path: 'add-income',
    canActivate: [authGuard],
    loadComponent: () => import('./features/income/pages/add-income/add-income').then(m => m.AddIncome),
    title: 'Aggiungi Entrata | Gestionale Spese'
  },
  {
    path: 'add-expense',
    canActivate: [authGuard],
    loadComponent: () => import('./features/expenses/pages/add-expense/add-expense').then(m => m.AddExpense),
    title: 'Aggiungi Spesa | Gestionale Spese'
  },
  {
    path: 'summary',
    canActivate: [authGuard],
    loadComponent: () => import('./features/movements/movement-list').then(m => m.MovementList),
    data: {kind: 'expenses'},
    title: 'Riepilogo | Gestionale Spese'
  },
  {
    path: 'incomes', canActivate: [authGuard],
    loadComponent: () => import('./features/movements/movement-list').then(m => m.MovementList),
    data: {kind: 'incomes'}, title: 'Entrate | Gestionale Spese'
  },
  {
    path: 'expenses/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/expenses/pages/expense-detail/expense-detail').then(m => m.ExpenseDetail),
    title: 'Dettaglio Spesa | Gestionale Spese'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login),
    title: 'Accedi | Gestionale Spese'
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register').then(m => m.Register),
    title: 'Registrati | Gestionale Spese'
  },
  {
    path: 'registrati',
    redirectTo: 'register',
    pathMatch: 'full'
  },
  {
    path: 'verify-email',
    title: 'Verifica email | Gestionale Spese',
    loadComponent: () => import('./features/auth/pages/verify-email/verify-email').then(m => m.VerifyEmail),
  },
  {
    path: '**',
    redirectTo: ''
  }
];

