import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ExpenseList } from './expense-list';
import { Expense, ExpenseCategory } from '../expense';

describe('ExpenseList', () => {
  let component: ExpenseList;
  let fixture: ComponentFixture<ExpenseList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseList],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseList);
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
