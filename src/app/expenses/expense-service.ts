import { inject, Injectable, signal } from '@angular/core';
import { ExpenseApiService } from './expense-api-service';
import { finalize, Observable } from 'rxjs';
import { CreateExpenseRequest, ExpensesList, Expense } from './expense';
import fa from '@angular/common/locales/fa';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expenseApiService = inject(ExpenseApiService);

  protected expenses = signal<ExpensesList>([]);
  loading = signal(false);
  error = signal<string | null>(null);


  public readonly expensesList = this.expenses.asReadonly();

  public loadExpenses(): void {
    this.loading.set(true);
    this.error.set(null);

    this.expenseApiService.getExpenses()
            .pipe(
              finalize(() => this.loading.set(false))
            )
            .subscribe(
              {
                next: expensesList => this.expenses.set(expensesList),
                error: () => this.error.set(
                  "Errore: Caricamento delle spese annullato"
                )
              }
            );
  }

  getExpenseById(id: number): Expense | undefined {
      let expense = this.expenses().find(
      expense => expense.id == id
    );
    if (expense !== undefined) {
      return expense;
    }

    return undefined;
  }

  addExpense(request: CreateExpenseRequest): void {
    this.expenseApiService.postExpense(request)
        .subscribe(
        {
          next: response => {
            this.expenses.update(
              prev => 
              [...prev,
                response
              ]
            );
          },
          error: () => {
            this.error.set(
              "Errore: Spesa non aggiunta"
            );
          }
        }
        )
  }

  removeExpense(id: number): void {
    this.expenseApiService.deleteExpense(id)
        .subscribe(
          {
            next: () => {
                this.expenses.update(expenses =>
                expenses.filter(expense => expense.id !== id)
        )},
                
            error: () => {
                this.error.set("Errore: rimozione annullata");
            }
          }
        )
  }
}
