import { inject, Injectable, signal } from '@angular/core';
import { ExpenseApiService } from './expense-api.service';
import { finalize, Observable, tap } from 'rxjs';
import { CreateExpenseRequest, ExpensePage, ExpensesList, Expense, UpdateExpenseEvent } from '../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private readonly expenseApiService = inject(ExpenseApiService);

  private readonly expenses = signal<ExpensesList>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly currentPage = signal(0);
  readonly pageSize = signal(10);
  readonly totalElements = signal(0);
  readonly query = signal('');


  public readonly expensesList = this.expenses.asReadonly();

  public clearExpenses(): void {
    this.expenses.set([]);
    this.error.set(null);
    this.totalElements.set(0);
    this.currentPage.set(0);
    this.query.set('');
  }

  public loadExpenses(page = 0, query = this.query()): void {
    this.loading.set(true);
    this.error.set(null);
    this.currentPage.set(page);
    this.query.set(query);

    this.expenseApiService.searchExpenses(page, this.pageSize(), query)
            .pipe(
              finalize(() => this.loading.set(false))
            )
            .subscribe(
              {
                next: (result: ExpensePage) => {
                  this.expenses.set(result.content);
                  this.totalElements.set(result.totalElements);
                  this.currentPage.set(result.number);
                },
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
      tap(() => {
        this.loadExpenses(0, '');
      })
    );
  }

  putExpense(request: Expense): void {
    this.expenseApiService.putExpense(request)
    .subscribe(
      {
        next: () => this.loadExpenses(this.currentPage()),
      }
    )
  }

  patchExpense(patch: UpdateExpenseEvent): void {
    this.expenseApiService.patchExpense(patch)
    .subscribe(
      {
        next: () => this.loadExpenses(this.currentPage()),
      }
    )
  }

  removeExpenseById(id: number): void {
    this.expenseApiService.deleteExpense(id)
        .subscribe(
          {
            next: () => {
                const totalAfterDelete = Math.max(0, this.totalElements() - 1);
                const lastPage = Math.max(0, Math.ceil(totalAfterDelete / this.pageSize()) - 1);
                this.totalElements.set(totalAfterDelete);
                this.loadExpenses(Math.min(this.currentPage(), lastPage));
            },
                
            error: () => {
                this.error.set("Errore: rimozione annullata");
            }
          }
        )
  }
}
