import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { AddIncome } from './add-income';
import { Income, IncomeCategory } from '../../models/income.model';
import { CreateIncomeRequest } from '../../services/income-api.service';
import { IncomeService } from '../../services/income.service';

describe('AddIncome', () => {
  let component: AddIncome;
  let fixture: ComponentFixture<AddIncome>;
  let response: Subject<Income>;
  const addIncome = vi.fn<(request: CreateIncomeRequest) => Observable<Income>>();

  beforeEach(async () => {
    response = new Subject<Income>();
    addIncome.mockReset().mockReturnValue(response);
    await TestBed.configureTestingModule({
      imports: [AddIncome],
      providers: [provideRouter([]), { provide: IncomeService, useValue: { addIncome } }],
    }).compileComponents();

    fixture = TestBed.createComponent(AddIncome);
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

    expect(addIncome).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('#income-title'));
    for (const field of ['title', 'amount', 'category', 'date']) {
      const input = fixture.nativeElement.querySelector(`#income-${field}`) as HTMLElement;
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(input.getAttribute('aria-describedby')).toBe(`income-${field}-error`);
    }
  });

  it('sends Italian decimals as a number and the date as ISO text, preventing duplicate saves', () => {
    component['incomeForm'].patchValue({ title: 'Entrata test', category: IncomeCategory.Salary, description: '' });
    fixture.detectChanges();
    const amount = fixture.nativeElement.querySelector('#income-amount') as HTMLInputElement;
    amount.value = '4,20 €';
    amount.dispatchEvent(new Event('input'));
    amount.dispatchEvent(new Event('blur'));
    const date = fixture.nativeElement.querySelector('#income-date') as HTMLInputElement;
    date.dispatchEvent(new KeyboardEvent('keydown', { key: '2' }));
    date.value = '2024-01-15';
    date.dispatchEvent(new Event('input'));
    date.dispatchEvent(new Event('blur'));

    submit();
    submit();

    const expected: CreateIncomeRequest = {
      title: 'Entrata test', amount: 4.2, category: IncomeCategory.Salary, description: '', date: '2024-01-15',
    };
    expect(addIncome).toHaveBeenCalledExactlyOnceWith(expected);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(true);

    response.next({ id: 1, ...expected });
    response.complete();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Entrata aggiunta correttamente.');
    expect(component['incomeForm'].getRawValue()).toEqual({ title: '', amount: null, category: '', description: '', date: '' });
  });

  it('preserves the form after a failed save and allows another attempt', () => {
    component['incomeForm'].setValue({ title: 'Entrata test', amount: 4.2, category: IncomeCategory.Other, description: '', date: '2024-01-15' });
    submit();
    response.error(new Error('Unavailable'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain("Impossibile salvare l'entrata. Riprova.");
    expect(component['incomeForm'].controls.amount.value).toBe(4.2);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBe(false);
  });
});
