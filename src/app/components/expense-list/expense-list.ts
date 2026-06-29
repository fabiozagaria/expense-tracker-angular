import { Component, inject, input, output, signal } from '@angular/core';
import { Expense, UpdateExpenseEvent } from '../../type/spesa';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { SpesaService } from '../../services/spesa-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-expense-list',
  imports: [CurrencyPipe, UpperCasePipe, RouterLink],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
  
    expense = input.required<Expense>();
    onRemove = output<string>();
    onUpdate = output<UpdateExpenseEvent>();

    protected isEditing = signal(false);
    protected editTitle = signal('');
    protected editDescrizione = signal('');

    protected startEdit(): void {
      const currentExpense = this.expense();

      this.editTitle.set(currentExpense.title);
      this.editDescrizione.set(currentExpense.descrizione);
      this.isEditing.set(true);
    }

    protected saveEdit(): void {
      const currentExpense = this.expense();

      this.onUpdate.emit({
        id: currentExpense.id,
        patch: {
          title: this.editTitle(),
          descrizione: this.editDescrizione()
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