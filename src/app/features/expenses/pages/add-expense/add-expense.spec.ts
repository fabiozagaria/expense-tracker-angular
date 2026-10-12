import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { AddExpense } from './add-expense';
import { CreateExpenseRequest, Expense, ExpenseCategory } from '../../models/expense.model';
import { ExpenseService } from '../../services/expense.service';

describe('AddExpense', () => {
  let component: AddExpense;
  let fixture: ComponentFixture<AddExpense>;
  let response: Subject<Expense>;
  const addExpense = vi.fn<(request: CreateExpenseRequest) => Observable<Expense>>();

  beforeEach(async () => {
    response = new Subject<Expense>();
    addExpense.mockReset().mockReturnValue(response);
    await TestBed.configureTestingModule({
      imports: [AddExpense],
      providers: [provideRouter([]), { provide: ExpenseService, useValue: { addExpense } }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddExpense);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  function submit(): void {
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('blocks an empty form, focuses the first invalid field and associates widget errors', async () => {
    submit();
    await fixture.whenStable();

    expect(addExpense).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#expense-title'));
    for (const field of ['title', 'amount', 'category', 'date']) {
      const input = fixture.nativeElement.querySelector(`#expense-${field}`) as HTMLElement;
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(input.getAttribute('aria-describedby')).toBe(`expense-${field}-error`);
    }
  });

  it('sends Italian decimals as a number and the date as ISO text, preventing duplicate saves', () => {
    component['expenseForm'].patchValue({ title: 'Spesa test', category: ExpenseCategory.Groceries, description: '' });
    fixture.detectChanges();
    const amount = fixture.nativeElement.querySelector('#expense-amount') as HTMLInputElement;
    amount.value = '4,20 €';
    amount.dispatchEvent(new Event('input'));
    amount.dispatchEvent(new Event('blur'));
    const date = fixture.nativeElement.querySelector('#expense-date') as HTMLInputElement;
    date.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }));
    date.value = '2024-01-15';
    date.dispatchEvent(new Event('input'));
    date.dispatchEvent(new Event('blur'));

    submit();
    submit();

    const expected: CreateExpenseRequest = {
      title: 'Spesa test', amount: 4.2, category: ExpenseCategory.Groceries, description: '', date: '2024-01-15',
    };
    expect(addExpense).toHaveBeenCalledExactlyOnceWith(expected);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(true);

    response.next({ id: 1, ...expected });
    response.complete();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Spesa aggiunta correttamente.');
    expect(component['expenseForm'].getRawValue()).toEqual({ title: '', amount: null, category: '', description: '', date: '' });
  });

  it('preserves the form after a failed save and allows another attempt', () => {
    component['expenseForm'].setValue({ title: 'Spesa test', amount: 4.2, category: ExpenseCategory.Other, description: '', date: '2024-01-15' });
    submit();
    response.error(new Error('Unavailable'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Impossibile salvare la spesa. Riprova.');
    expect(component['expenseForm'].controls.amount.value).toBe(4.2);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(false);
  });
});
