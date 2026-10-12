import { Component, computed, inject, OnInit } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { RevealDirective } from '../../../../core/ui/reveal.directive';
import { ExpenseCard } from '../../components/expense-card/expense-card';
import { ExpenseService } from '../../services/expense.service';
import { UpdateExpenseEvent } from '../../models/expense.model';

@Component({
  selector: 'app-expense-summary',
  imports: [CurrencyPipe, DatePipe, RouterLink, ButtonModule, CardModule, MessageModule, SkeletonModule, TagModule, RevealDirective, ExpenseCard],
  templateUrl: './expense-summary.html',
  styleUrl: './expense-summary.css',
})
export class ExpenseSummary implements OnInit {
  private readonly expenseService = inject(ExpenseService);

  protected readonly expenseList = this.expenseService.expensesList;
  protected readonly loading = this.expenseService.loading;
  protected readonly error = this.expenseService.error;
  protected readonly totalExpense = computed(() => this.expenseList().reduce((total, expense) => total + expense.amount, 0));
  protected readonly latestExpenseDate = computed(() => this.expenseList().reduce((latest, expense) => expense.date > latest ? expense.date : latest, '') || null);
  protected readonly unavailable = computed(() => !!this.error() && this.expenseList().length === 0);

  ngOnInit(): void {
    this.reloadExpenses();
  }

  protected reloadExpenses(): void {
    this.expenseService.loadExpenses();
  }

  removeExpense(id: number): void {
    this.expenseService.removeExpenseById(id);
  }

  updateExpense(patch: UpdateExpenseEvent): void {
    this.expenseService.patchExpense(patch);
  }
}
