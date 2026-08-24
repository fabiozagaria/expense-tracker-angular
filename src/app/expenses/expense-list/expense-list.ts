import { Component, input, output, signal } from '@angular/core';
import { Expense, UpdateExpenseEvent } from '../expense';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense-list',
  imports: [CurrencyPipe, UpperCasePipe, RouterLink, ReactiveFormsModule],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
    expense = input.required<Expense>();
    onRemove = output<number>();
    onUpdate = output<UpdateExpenseEvent>();

    protected isEditing = signal(false);
    protected editTitle = signal('');
    protected editDescription = signal('');

    protected readonly summeryForm = new FormGroup({
    title: new FormControl<string>('', 
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)
      ]
    ),
    description: new FormControl<string>('', [
      Validators.maxLength(30),
    ])
  })

    protected startEdit(): void {
      const currentExpense = this.expense();

      this.summeryForm.setValue({
          title: currentExpense.title,
          description: currentExpense.description
      });

      this.isEditing.set(true);
    }

    protected saveEdit(): void {
      const currentExpense = this.expense();

      this.onUpdate.emit({
        id: currentExpense.id,
        patch: {
          title: this.editTitle(),
          description: this.editDescription()
        }
      });

      this.isEditing.set(false);
    }

    protected cancelEdit(): void {
      this.isEditing.set(false);
    }

    protected removeExpense(): void {
      this.onRemove.emit(this.expense().id);
    }

    }
