import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateExpenseRequest, Expense } from '../expense';
import { ExpenseService } from '../expense-service';
import { RouterLink } from '@angular/router';
import 'tslib';


@Component({
  selector: 'app-add-expense',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './add-expense.html',
  styleUrl: './add-expense.css',
})
export class AddExpense {
 private expenseService = inject(ExpenseService);
 
 protected expenseAddedNoticeVisible = signal(false);
 
 

 protected expenseForm = new FormGroup({
      amount: new FormControl<number | null>(null, [
          Validators.required, 
          Validators.min(0.01)
    ],
      ),
      title: new FormControl<string>('', [
        Validators.required,
        Validators.maxLength(15),
        Validators.minLength(3)
      ]),
      category: new FormControl<string>('', [
          Validators.required
        ]
      ),
      description: new FormControl<string>('', [
        Validators.maxLength(30)
      ]),
      date: new FormControl<string>('', 
        [
          Validators.required
        ])
    });


    protected isInvalidField(fieldName: keyof typeof this.expenseForm.controls): boolean {
      const control = this.expenseForm.controls[fieldName];

      return control.invalid && control.touched;
    }

    protected hasFieldError(fieldName: keyof typeof this.expenseForm.controls, errorName: string): boolean {
      const control = this.expenseForm.controls[fieldName];

      return control.hasError(errorName) && control.touched;
    }
    
    protected showSuccessNotice(): void {
      this.expenseAddedNoticeVisible.set(true);
      setTimeout(() => {
        this.expenseAddedNoticeVisible.set(false);
      },2000)
    }



    onSubmit(): void {
      if(this.expenseForm.invalid) {
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
        date: formValue.date
      };

      this.expenseService.addExpense(newExpense);

      this.showSuccessNotice();


      this.expenseForm.reset({
        amount: null,
        title: '',
        category: '',
        description: '',
        date: ''
      })
    }


}
