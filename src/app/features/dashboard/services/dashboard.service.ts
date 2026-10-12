import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly http = inject(HttpClient);

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${environment.apiBaseUrl}/api/dashboard/summary`);
  }
}

