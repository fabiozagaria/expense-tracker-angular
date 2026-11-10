import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Income } from '../models/income.model';
import { CreateIncomeRequest, IncomeApiService } from './income-api.service';

@Injectable({ providedIn: 'root' })
export class IncomeService {
  private readonly api = inject(IncomeApiService);

  addIncome(request: CreateIncomeRequest): Observable<Income> {
    return this.api.postIncome(request);
  }
}
