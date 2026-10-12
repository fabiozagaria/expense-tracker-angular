import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { RevealDirective } from '../../../../core/ui/reveal.directive';
import { DashboardMovement, DashboardService, DashboardSummary } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe, FormsModule, ButtonModule, TableModule, SelectButtonModule, SkeletonModule, MessageModule, RevealDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  protected readonly summary = signal<DashboardSummary | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly movements = signal<DashboardMovement[]>([]);
  protected readonly movementsLoading = signal(true);
  protected readonly movementsError = signal('');
  protected readonly filter = signal<'all' | 'income' | 'expense'>('all');
  protected readonly filterOptions = [{ label: 'Tutti', value: 'all' }, { label: 'Entrate', value: 'income' }, { label: 'Spese', value: 'expense' }];
  protected readonly visibleMovements = computed(() => this.movements().filter(item => this.filter() === 'all' || item.kind === this.filter()).slice(0, 6));
  protected readonly incomeShare = computed(() => {
    const { totalIncome = 0, totalExpense = 0 } = this.summary() ?? {};
    return totalIncome + totalExpense > 0 ? totalIncome / (totalIncome + totalExpense) * 100 : 0;
  });
  private readonly categories: Record<string, string> = { groceries: 'Alimentari', car: 'Auto', gifts: 'Regali', installments: 'Rate', loan: 'Prestito', health: 'Salute', transport: 'Trasporti', bills: 'Bollette', housing: 'Casa', leisure: 'Tempo libero', other: 'Altro', salary: 'Stipendio', freelance: 'Lavoro autonomo', bonus: 'Bonus', refund: 'Rimborso', investment: 'Investimenti', gift: 'Regalo', rental: 'Affitto' };

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: summary => { this.summary.set(summary); this.loading.set(false); },
      error: () => { this.error.set('Impossibile caricare il riepilogo.'); this.loading.set(false); },
    });
    this.dashboardService.getMovements().subscribe({
      next: items => { this.movements.set(items); this.movementsLoading.set(false); },
      error: () => { this.movementsError.set('Impossibile caricare i movimenti.'); this.movementsLoading.set(false); },
    });
  }
  protected euro(value: number | null | undefined): string {
    return value == null ? '—' : new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
  }
  protected category(value: string): string { return this.categories[value] ?? value; }
}
