import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { ExpensePage } from '../../expenses/models/expense.model';
import { Income } from '../../income/models/income.model';

export interface DashboardSummary { totalIncome: number; totalExpense: number; balance: number; }
export interface DashboardMovement {
  id: number;
  kind: 'income' | 'expense';
  title: string;
  amount: number;
  category: string;
  date: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);
  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${environment.apiBaseUrl}/api/dashboard/summary`);
  }
  getMovements(): Observable<DashboardMovement[]> {
    return forkJoin({
      expenses: this.http.get<ExpensePage>(`${environment.apiBaseUrl}/api/expenses/search`, {
        params: { page: 0, size: 10, query: '', month: '', order: 'newest' },
      }),
      incomes: this.http.get<Income[]>(`${environment.apiBaseUrl}/api/incomes`),
    }).pipe(map(({ expenses, incomes }) => [
      ...expenses.content.map(item => ({ ...item, kind: 'expense' as const })),
      ...incomes.map(item => ({ ...item, kind: 'income' as const })),
    ].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)));
  }
}
