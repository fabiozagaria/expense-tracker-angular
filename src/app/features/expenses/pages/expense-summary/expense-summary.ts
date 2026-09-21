import { Component, inject, OnInit } from '@angular/core';
import { ExpenseCard } from '../../components/expense-card/expense-card';
import { ExpenseService } from '../../services/expense.service';
import { UpdateExpenseEvent } from '../../models/expense.model';


@Component({
  selector: 'app-expense-summary',
  imports: [ExpenseCard],
  templateUrl: './expense-summary.html',
  styleUrl: './expense-summary.css',
})
export class ExpenseSummary implements OnInit {
  private expenseService = inject(ExpenseService);

  protected expenseList = this.expenseService.expensesList;
  protected loading = this.expenseService.loading;
  protected error = this.expenseService.error;

  ngOnInit(): void {
    this.expenseService.loadExpenses();
  }

  


  removeExpense(id: number): void {
    this.expenseService.removeExpenseById(id);

  }

  updateExpense(patch: UpdateExpenseEvent): void {
    this.expenseService.patchExpense(patch);
  }

  

  
}
