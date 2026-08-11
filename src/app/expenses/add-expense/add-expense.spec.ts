import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AddExpense } from './add-expense';
import { ExpenseService } from '../expense-service';

describe('AddExpense', () => {
  let component: AddExpense;
  let fixture: ComponentFixture<AddExpense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExpense],
      providers: [
        provideRouter([]),
        {
          provide: ExpenseService,
          useValue: { addExpense: () => undefined },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddExpense);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
