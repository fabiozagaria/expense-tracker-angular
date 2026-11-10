import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { MovementPage } from '../../movements/movement-api.service';

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
      expenses: this.http.get<MovementPage>(`${environment.apiBaseUrl}/api/expenses/search`, {
        params: { page: 0, size: 10, query: '', month: '', order: 'newest' },
      }),
      // Stessa pagina per entrambi: GET /api/incomes restituirebbe fino a 1000 elementi.
      incomes: this.http.get<MovementPage>(`${environment.apiBaseUrl}/api/incomes/search`, {
        params: { page: 0, size: 10, query: '', month: '', order: 'newest' },
      }),
    }).pipe(map(({ expenses, incomes }) => [
      ...expenses.content.map(item => ({ ...item, kind: 'expense' as const })),
      ...incomes.content.map(item => ({ ...item, kind: 'income' as const })),
    ].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)));
  }
}
