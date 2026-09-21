import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateIncomeRequest, Income, IncomesList } from '../models/income.model';

@Injectable({ providedIn: 'root' })
export class IncomeApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/incomes';

  getIncomes(): Observable<IncomesList> {
    return this.http.get<IncomesList>(this.apiUrl);
  }

  postIncome(income: CreateIncomeRequest): Observable<Income> {
    return this.http.post<Income>(this.apiUrl, income);
  }
}
