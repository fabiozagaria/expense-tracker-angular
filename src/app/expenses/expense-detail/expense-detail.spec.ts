import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { ExpenseDetail } from './expense-detail';
import { ExpenseService } from '../expense-service';
import { Expense, ExpenseCategory } from '../expense';

describe('ExpenseDetail', () => {
  let component: ExpenseDetail;
  let fixture: ComponentFixture<ExpenseDetail>;

  beforeEach(async () => {
    const expense: Expense = {
      id: 1,
      title: 'Spesa di prova',
      description: 'Descrizione di prova',
      amount: 10,
      category: ExpenseCategory.Other,
      date: '2026-08-11',
    };

    await TestBed.configureTestingModule({
      imports: [ExpenseDetail],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: '1' }) },
          },
        },
        {
          provide: ExpenseService,
          useValue: { getExpenseById: () => expense },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
