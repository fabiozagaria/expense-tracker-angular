import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { Expense, ExpenseCategory } from '../../expenses/models/expense.model';
import { Income, IncomeCategory } from '../../income/models/income.model';
import { DashboardMovement, DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DashboardService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('combines expenses and incomes, identifies their kind, and orders newest dates first', () => {
    const expenses: Expense[] = [
      { id: 1, title: 'Alimentari', description: '', amount: 80, category: ExpenseCategory.Groceries, date: '2026-09-30' },
      { id: 3, title: 'Biglietto treno', description: '', amount: 25, category: ExpenseCategory.Transport, date: '2026-10-12' },
    ];
    const incomes: Income[] = [
      { id: 2, title: 'Stipendio', description: '', amount: 2000, category: IncomeCategory.Salary, date: '2026-10-01' },
    ];
    let movements: DashboardMovement[] | undefined;

    service.getMovements().subscribe(result => movements = result);
    http.expectOne(request => request.url === `${environment.apiBaseUrl}/api/expenses/search`
      && request.params.get('page') === '0'
      && request.params.get('size') === '10')
      .flush({ content: expenses, number: 0, size: 10, totalElements: expenses.length, totalPages: 1 });
    expect(movements).toBeUndefined();
    http.expectOne(`${environment.apiBaseUrl}/api/incomes`).flush(incomes);

    expect(movements?.map(({ id, kind, title, amount, category, date }) => ({ id, kind, title, amount, category, date }))).toEqual([
      { id: 3, kind: 'expense', title: 'Biglietto treno', amount: 25, category: ExpenseCategory.Transport, date: '2026-10-12' },
      { id: 2, kind: 'income', title: 'Stipendio', amount: 2000, category: IncomeCategory.Salary, date: '2026-10-01' },
      { id: 1, kind: 'expense', title: 'Alimentari', amount: 80, category: ExpenseCategory.Groceries, date: '2026-09-30' },
    ]);
  });
});
