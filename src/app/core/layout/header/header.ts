import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { ExpenseService } from '../../../features/expenses/services/expense.service';
import { IncomeService } from '../../../features/incomes/services/income.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly expenses = inject(ExpenseService);
  private readonly incomes = inject(IncomeService);

  protected logout(): void {
    this.auth.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout(): void {
    this.expenses.clearExpenses();
    this.incomes.clearIncomes();
    void this.router.navigateByUrl('/login');
  }
}
