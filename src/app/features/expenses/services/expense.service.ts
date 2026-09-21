import { inject, Injectable, signal } from '@angular/core';
import { ExpenseApiService } from './expense-api.service';
import { finalize, Observable, tap } from 'rxjs';
import { CreateExpenseRequest, ExpensesList, Expense, UpdateExpenseEvent } from '../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private readonly expenseApiService = inject(ExpenseApiService);

  private readonly expenses = signal<ExpensesList>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);


  public readonly expensesList = this.expenses.asReadonly();

  public clearExpenses(): void {
    this.expenses.set([]);
    this.error.set(null);
  }

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

  public getExpenseById(id: number): Expense | undefined {
    return this.expenses().find(expense => expense.id === id);
  }

  public loadExpenseById(id: number): Observable<Expense> {
    return this.expenseApiService.getExpense(id);
  }

  addExpense(request: CreateExpenseRequest): Observable<Expense> {
    return this.expenseApiService.postExpense(request).pipe(
      tap(response => this.expenses.update(previous => [...previous, response]))
    );
  }

  putExpense(request: Expense): void {
    this.expenseApiService.putExpense(request)
    .subscribe(
      {
        next: response => {
            this.expenses.update(
              prev => 
              prev.map(exp => exp.id === response.id ? response : exp)
            );
          },
      }
    )
  }

  patchExpense(patch: UpdateExpenseEvent): void {
    this.expenseApiService.patchExpense(patch)
    .subscribe(
      {
        next: response => {
            this.expenses.update(
              prev => 
              prev.map(exp => exp.id === response.id ? response : exp)
            );
          },
      }
    )
  }

  removeExpenseById(id: number): void {
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
