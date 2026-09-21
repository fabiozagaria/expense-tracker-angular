import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CreateIncomeRequest, Income, IncomesList } from '../models/income.model';
import { IncomeApiService } from './income-api.service';

@Injectable({ providedIn: 'root' })
export class IncomeService {
  private readonly incomeApiService = inject(IncomeApiService);
  private readonly incomes = signal<IncomesList>([]);

  readonly incomesList = this.incomes.asReadonly();

  loadIncomes(): void {
    this.incomeApiService.getIncomes().subscribe({
      next: incomes => this.incomes.set(incomes),
    });
  }

  addIncome(request: CreateIncomeRequest): Observable<Income> {
    return this.incomeApiService.postIncome(request).pipe(
      tap(response => this.incomes.update(previous => [...previous, response]))
    );
  }

  clearIncomes(): void {
    this.incomes.set([]);
  }
}
