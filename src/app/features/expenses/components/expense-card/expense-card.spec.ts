import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ExpenseCard } from './expense-card';
import { Expense, ExpenseCategory } from '../../models/expense.model';

describe('ExpenseCard', () => {
  let component: ExpenseCard;
  let fixture: ComponentFixture<ExpenseCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseCard);
    const expense: Expense = {
      id: 1,
      title: 'Spesa di prova',
      description: 'Descrizione di prova',
      amount: 10,
      category: ExpenseCategory.Other,
      date: '2026-08-11',
    };
    fixture.componentRef.setInput('expense', expense);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
