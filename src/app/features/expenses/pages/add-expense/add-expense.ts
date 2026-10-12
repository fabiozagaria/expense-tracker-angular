import { Component, ElementRef, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CreateExpenseRequest, ExpenseCategory } from '../../models/expense.model';
import { ExpenseService } from '../../services/expense.service';
import { RouterLink } from '@angular/router';
import { formatDate } from '@angular/common';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { RevealDirective } from '../../../../core/ui/reveal.directive';

@Component({
  selector: 'app-add-expense',
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, CardModule, DatePickerModule, InputNumberModule, InputTextModule, MessageModule, SelectModule, TextareaModule, RevealDirective],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css',
})
export class AddExpense {
  private readonly expenseService = inject(ExpenseService);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly categories: { label: string; value: ExpenseCategory }[] = [
    { label: 'Alimentari', value: ExpenseCategory.Groceries },
    { label: 'Auto', value: ExpenseCategory.Car },
    { label: 'Regali', value: ExpenseCategory.Gifts },
    { label: 'Rate', value: ExpenseCategory.Installments },
    { label: 'Prestito', value: ExpenseCategory.Loan },
    { label: 'Salute', value: ExpenseCategory.Health },
    { label: 'Trasporti', value: ExpenseCategory.Transport },
    { label: 'Bollette', value: ExpenseCategory.Bills },
    { label: 'Casa', value: ExpenseCategory.Housing },
    { label: 'Tempo libero', value: ExpenseCategory.Leisure },
    { label: 'Altro', value: ExpenseCategory.Other },
  ];
  protected readonly expenseAddedNoticeVisible = signal(false);
  protected readonly saveError = signal('');
  protected readonly saving = signal(false);
  protected readonly maxDate = new Date();

  protected readonly expenseForm = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
    ] }),
    amount: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
    ]),
    category: new FormControl<ExpenseCategory | ''>('', { nonNullable: true, validators: [
      Validators.required,
    ] }),
    description: new FormControl('', { nonNullable: true, validators: [
      Validators.maxLength(30),
    ] }),
    date: new FormControl('', { nonNullable: true, validators: [
      Validators.required,
      this.hasFutureDate,
    ] }),
  });

  protected isInvalidField(fieldName: keyof typeof this.expenseForm.controls): boolean {
    const control = this.expenseForm.controls[fieldName];

    return control.invalid && control.touched;
  }

  protected hasFieldError(
    fieldName: keyof typeof this.expenseForm.controls,
    errorName: string,
  ): boolean {
    const control = this.expenseForm.controls[fieldName];

    return control.hasError(errorName) && control.touched;
  }

  protected fieldAria(fieldName: keyof typeof this.expenseForm.controls) {
    const invalid = this.isInvalidField(fieldName);
    return {
      'aria-invalid': invalid,
      'aria-describedby': invalid ? `expense-${fieldName}-error` : undefined,
    };
  }

  protected hasFutureDate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

    if (value > today) {
      return { futureDate: true };
    }

    return null;
  }
  

  protected onSubmit(): void {
    if (this.saving()) return;

    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
      const fieldName = (Object.keys(this.expenseForm.controls) as (keyof typeof this.expenseForm.controls)[])
        .find(name => this.expenseForm.controls[name].invalid);
      this.element.nativeElement.querySelector<HTMLElement>(`#expense-${fieldName}`)?.focus();
      return;
    }

    const formValue = this.expenseForm.getRawValue();

    if (!formValue.title || formValue.amount === null || !formValue.category || !formValue.date) {
      return;
    }

    const newExpense: CreateExpenseRequest = {
      title: formValue.title,
      amount: formValue.amount,
      category: formValue.category,
      description: formValue.description ?? '',
      date: formValue.date,
    };

    this.saving.set(true);
    this.saveError.set('');
    this.expenseService.addExpense(newExpense).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.showSuccessNotice();
        this.expenseForm.reset({ title: '', amount: null, category: '', description: '', date: '' });
      },
      error: () => this.saveError.set('Impossibile salvare la spesa. Riprova.'),
    });
  }

  private showSuccessNotice(): void {
    this.expenseAddedNoticeVisible.set(true);

    setTimeout(() => {
      this.expenseAddedNoticeVisible.set(false);
    }, 2000);
  }
}
