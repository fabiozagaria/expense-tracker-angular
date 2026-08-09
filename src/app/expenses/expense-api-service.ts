import { Injectable, inject } from '@angular/core';
import { CreateExpenseRequest, Expense, ExpensePatch, ExpensesList, UpdateExpenseEvent } from './expense';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/expenses';

  public getExpenses(): Observable<ExpensesList> {
    return this.http.get<ExpensesList>(this.apiUrl);
  }

  public getExpense(id: number): Observable<Expense> {
    return this.http.get<Expense>(
      `${this.apiUrl}/${id}`
    );
  }

  public postExpense(expense: CreateExpenseRequest): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  public putExpense(expense: CreateExpenseRequest, id: number): Observable<Expense> {
    return this.http.put<Expense>(
      `${this.apiUrl}/${id}`,
      expense
    );

    
  }

  public patchExpense(patchExpense: ExpensePatch, id: number): Observable<Expense> {
      return this.http.patch<Expense>(
        `${this.apiUrl}/${id}`,
        patchExpense
      );
    }

  public deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
 
  


 
