import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ExpenseList } from '../../components/expense-list/expense-list';
import { ExpenseService } from '../../services/expense-service';
import { Expense } from '../../type/expense';


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
    this.expenseService.removeExpense(id);

  }

  

  
}
