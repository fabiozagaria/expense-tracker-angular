import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Income } from '../models/income.model';
import { CreateIncomeRequest, IncomeApiService } from './income-api.service';

@Injectable({ providedIn: 'root' })
export class IncomeService {
  private readonly api = inject(IncomeApiService);
  private readonly incomes = signal<Income[]>([]);

  readonly incomesList = this.incomes.asReadonly();

  loadIncomes(): void {
    this.api.getIncomes().subscribe({ next: incomes => this.incomes.set(incomes) });
  }

  addIncome(request: CreateIncomeRequest): Observable<Income> {
    return this.api.postIncome(request).pipe(
      tap(income => this.incomes.update(previous => [...previous, income]))
    );
  }

  clearIncomes(): void {
    this.incomes.set([]);
  }
}
