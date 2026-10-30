import { environment } from '../../../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { CreateExpenseRequest, Expense, ExpensePage, UpdateExpenseEvent } from '../models/expense.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/expenses`;

  public searchExpenses(page = 0, size = 10, query = '', month = '', order = 'newest'): Observable<ExpensePage> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('query', query)
      .set('month', month)
      .set('order', order);
    return this.http.get<ExpensePage>(`${this.apiUrl}/search`, { params });
  }

  public getExpense(id: number): Observable<Expense> {
    return this.http.get<Expense>(
      `${this.apiUrl}/${id}`
    );
  }

  public postExpense(expense: CreateExpenseRequest): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  public putExpense(expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(
      `${this.apiUrl}/${expense.id}`,
      expense
    );
  }

  public patchExpense(patchRequest: UpdateExpenseEvent): Observable<Expense> {
    return this.http.patch<Expense>(
      `${this.apiUrl}/${patchRequest.id}`,
      patchRequest.patch
    );
  }

  public deleteExpense(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}

