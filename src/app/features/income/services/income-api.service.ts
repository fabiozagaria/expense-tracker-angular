import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Income } from '../models/income.model';

export type CreateIncomeRequest = Omit<Income, 'id'>;

@Injectable({ providedIn: 'root' })
export class IncomeApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/incomes`;

  getIncomes(): Observable<Income[]> {
    return this.http.get<Income[]>(this.apiUrl);
  }

  postIncome(income: CreateIncomeRequest): Observable<Income> {
    return this.http.post<Income>(this.apiUrl, income);
  }
}

