import { Routes } from '@angular/router';
import { authGuard } from './features/auth/services/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home/home-page').then(m => m.HomePage),
    title: 'Home | Expense Tracker'
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard').then(m => m.Dashboard),
    title: 'Dashboard | Expense Tracker'
  },
  {
    path: 'add-transaction',
    canActivate: [authGuard],
    loadComponent: () => import('./features/transactions/pages/add-transaction/add-transaction').then(m => m.AddTransaction),
    title: 'Nuovo movimento | Expense Tracker'
  },
  {
    path: 'add-income',
    canActivate: [authGuard],
    loadComponent: () => import('./features/income/pages/add-income/add-income').then(m => m.AddIncome),
    title: 'Aggiungi Entrata | Expense Tracker'
  },
  {
    path: 'add-expense',
    canActivate: [authGuard],
    loadComponent: () => import('./features/expenses/pages/add-expense/add-expense').then(m => m.AddExpense),
    title: 'Aggiungi Spesa | Expense Tracker'
  },
  {
    path: 'summary',
    canActivate: [authGuard],
    loadComponent: () => import('./features/movements/movement-list').then(m => m.MovementList),
    data: {kind: 'expenses'},
    title: 'Riepilogo | Expense Tracker'
  },
  {
    path: 'incomes', canActivate: [authGuard],
    loadComponent: () => import('./features/movements/movement-list').then(m => m.MovementList),
    data: {kind: 'incomes'}, title: 'Entrate | Expense Tracker'
  },
  {
    path: 'expenses/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/movements/movement-detail/movement-detail').then(m => m.MovementDetail),
    data: { kind: 'expenses' },
    title: 'Dettaglio Spesa | Expense Tracker'
  },
  {
    path: 'incomes/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/movements/movement-detail/movement-detail').then(m => m.MovementDetail),
    data: { kind: 'incomes' },
    title: 'Dettaglio Entrata | Expense Tracker'
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/settings/pages/settings/settings').then(m => m.Settings),
    title: 'Impostazioni | Expense Tracker'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login),
    title: 'Accedi | Expense Tracker'
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/pages/register/register').then(m => m.Register),
    title: 'Registrati | Expense Tracker'
  },
  {
    path: 'registrati',
    redirectTo: 'register',
    pathMatch: 'full'
  },
  {
    path: 'verify-email',
    title: 'Verifica email | Expense Tracker',
    loadComponent: () => import('./features/auth/pages/verify-email/verify-email').then(m => m.VerifyEmail),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/pages/email-request/email-request').then(m => m.EmailRequest),
    data: { mode: 'password' },
    title: 'Password dimenticata | Expense Tracker',
  },
  {
    path: 'resend-verification',
    loadComponent: () => import('./features/auth/pages/email-request/email-request').then(m => m.EmailRequest),
    data: { mode: 'verification' },
    title: 'Nuovo link di verifica | Expense Tracker',
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./features/auth/pages/reset-password/reset-password').then(m => m.ResetPassword),
    title: 'Nuova password | Expense Tracker',
  },
  {
    path: '**',
    redirectTo: ''
  }
];

