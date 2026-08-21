import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CreateExpenseRequest, ExpenseCategory } from '../expense';
import { ExpenseService } from '../expense-service';
import { RouterLink } from '@angular/router';
import { formatDate } from '@angular/common';
import { MaxValidationError, ValidationError } from '@angular/forms/signals';


@Component({
  selector: 'app-add-expense',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css',
})
export class AddExpense {
  private readonly expenseService = inject(ExpenseService);

  protected readonly ExpenseCategory = ExpenseCategory;
  protected readonly expenseAddedNoticeVisible = signal(false);
  protected readonly maxDate = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

  protected readonly expenseForm = new FormGroup({
    title: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(15),
    ]),
    amount: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
    ]),
    category: new FormControl<ExpenseCategory | ''>('', [
      Validators.required,
    ]),
    description: new FormControl<string>('', [
      Validators.maxLength(30),
    ]),
    date: new FormControl<string>('', [
      Validators.required,
    ]),
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

  protected hasFutureDate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if(!value) return null

    const today: string = new Date().toLocaleDateString('en-CA');

    if(value > today) { 
      return { futureDate: true };
    } else {
      return null;
    }
  }
  

  protected onSubmit(): void {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
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

    this.expenseService.addExpense(newExpense);
    this.showSuccessNotice();
    this.expenseForm.reset({
      title: '',
      amount: null,
      category: '',
      description: '',
      date: '',
    });
  }

  private showSuccessNotice(): void {
    this.expenseAddedNoticeVisible.set(true);

    setTimeout(() => {
      this.expenseAddedNoticeVisible.set(false);
    }, 2000);
  }
}
