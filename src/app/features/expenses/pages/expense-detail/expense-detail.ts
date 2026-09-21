import { Component, OnInit, signal } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Expense } from '../../models/expense.model';
import { CurrencyPipe, DatePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-expense-detail',
  imports: [CurrencyPipe, DatePipe, UpperCasePipe, RouterLink],
  templateUrl: './expense-detail.html',
  styleUrl: './expense-detail.css',
})
export class ExpenseDetail implements OnInit {
  expense = signal<Expense | undefined>(undefined)
  loading = signal(true);
  constructor(
    private expenseService: ExpenseService,
    protected route: ActivatedRoute
  ) {};

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.loading.set(false);
      return;
    }
    this.expenseService.loadExpenseById(id).subscribe({
      next: expense => {
        this.expense.set(expense);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
    
  }
}
