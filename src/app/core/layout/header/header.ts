import { finalize } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ThemeService } from '../../theme.service';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { ExpenseService } from '../../../features/expenses/services/expense.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly maintenance = environment.maintenance;
  protected readonly loggingOut = signal(false);
  protected readonly menuOpen = signal(false);
  readonly theme = inject(ThemeService);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly expenses = inject(ExpenseService);

  protected logout(): void {
    if (this.loggingOut()) return;
    this.loggingOut.set(true);
    this.menuOpen.set(false);
    this.auth.logout().pipe(finalize(() => this.loggingOut.set(false))).subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout(): void {
    this.expenses.clearExpenses();
    void this.router.navigateByUrl('/login');
  }
}

