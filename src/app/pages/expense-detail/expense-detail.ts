import { Component, OnInit, signal } from '@angular/core';
import { ExpenseService } from '../../services/expense-service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Expense } from '../../type/expense';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-expense-detail',
  imports: [CurrencyPipe, DatePipe, UpperCasePipe, RouterLink],
  templateUrl: './expense-detail.html',
  styleUrl: './expense-detail.css',
})
export class ExpenseDetail implements OnInit {
  expense = signal<Expense | undefined>(undefined)
  constructor(
    private expenseService: ExpenseService,
    protected route: ActivatedRoute
  ) {};

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if(!id) {
      throw new Error('Error: ID not found!')
    }
    const expense = this.expenseService.getExpenseById(id);
    this.expense.set(expense);
    
  }
}
