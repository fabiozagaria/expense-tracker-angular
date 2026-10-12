import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { RevealDirective } from '../../../../core/ui/reveal.directive';
import { ExpenseService } from '../../services/expense.service';
import { Expense, ExpenseCategory } from '../../models/expense.model';

@Component({
  selector: 'app-expense-detail',
  imports: [CurrencyPipe, DatePipe, RouterLink, ButtonModule, CardModule, MessageModule, SkeletonModule, TagModule, RevealDirective],
  templateUrl: './expense-detail.html',
  styleUrl: './expense-detail.css',
})
export class ExpenseDetail implements OnInit {
  readonly expense = signal<Expense | undefined>(undefined);
  readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly notFound = signal(false);
  private readonly categoryLabels: Record<ExpenseCategory, string> = {
    groceries: 'Alimentari', car: 'Auto', gifts: 'Regali', installments: 'Rate',
    loan: 'Prestito', health: 'Salute', transport: 'Trasporti', bills: 'Bollette',
    housing: 'Casa', leisure: 'Tempo libero', other: 'Altro',
  };

  constructor(
    private readonly expenseService: ExpenseService,
    protected readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadExpense();
  }

  protected categoryLabel(category: ExpenseCategory): string {
    return this.categoryLabels[category] ?? category;
  }

  protected loadExpense(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.expense.set(undefined);
    this.error.set(null);
    this.notFound.set(false);
    if (!Number.isInteger(id) || id <= 0) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.expenseService.loadExpenseById(id).subscribe({
      next: expense => {
        this.expense.set(expense);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.notFound.set(true);
        } else {
          this.error.set('Impossibile caricare la spesa. Il server potrebbe essere momentaneamente non disponibile.');
        }
        this.loading.set(false);
      },
    });
  }
}
