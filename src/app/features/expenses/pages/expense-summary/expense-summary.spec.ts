import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';

import { ExpenseSummary } from './expense-summary';
import { ExpenseService } from '../../services/expense.service';

describe('ExpenseSummary', () => {
  let component: ExpenseSummary;
  let fixture: ComponentFixture<ExpenseSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseSummary],
      providers: [
        provideRouter([]),
        {
          provide: ExpenseService,
          useValue: {
            expensesList: signal([]),
            loading: signal(false),
            error: signal<string | null>(null),
            currentPage: signal(0),
            pageSize: signal(10),
            totalElements: signal(0),
            query: signal(''),
            loadExpenses: () => undefined,
            removeExpenseById: () => undefined,
            patchExpense: () => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
