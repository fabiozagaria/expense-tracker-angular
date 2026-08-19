import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ExpenseList } from '../expense-list/expense-list';
import { ExpenseService } from '../expense-service';
import { Expense } from '../expense';


@Component({
  selector: 'app-expense-summary',
  imports: [ExpenseList],
  templateUrl: './expense-summary.html',
  styleUrl: './expense-summary.css',
})
export class ExpenseSummary implements OnInit {
  private expenseService = inject(ExpenseService);

  protected expenseList = this.expenseService.expensesList;

  ngOnInit(): void {
    this.expenseService.loadExpenses();
  }


  removeExpense(id: number): void {
    this.expenseService.removeExpenseById(id);

  }

  

  
}
