import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { categoryLabel } from '../../../core/api/categories';
import { RevealDirective } from '../../../core/ui/reveal.directive';
import { Movement, MovementApiService, MovementKind } from '../movement-api.service';

/** Dettaglio di una spesa (`/expenses/:id`) o di un'entrata (`/incomes/:id`). */
@Component({
  selector: 'app-movement-detail',
  imports: [CurrencyPipe, DatePipe, RouterLink, ButtonModule, CardModule, MessageModule, SkeletonModule, TagModule, RevealDirective],
  templateUrl: './movement-detail.html',
  styleUrl: './movement-detail.css',
})
export class MovementDetail implements OnInit {
  private readonly api = inject(MovementApiService);
  private readonly route = inject(ActivatedRoute);

  protected readonly kind: MovementKind = this.route.snapshot.data['kind'] === 'incomes' ? 'incomes' : 'expenses';
  protected readonly income = this.kind === 'incomes';
  protected readonly noun = this.income ? 'entrata' : 'spesa';
  protected readonly listUrl = this.income ? '/incomes' : '/summary';
  readonly movement = signal<Movement | undefined>(undefined);
  readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly notFound = signal(false);
  protected readonly categoryLabel = categoryLabel;

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.movement.set(undefined);
    this.error.set(null);
    this.notFound.set(false);
    if (!Number.isInteger(id) || id <= 0) {
      this.notFound.set(true);
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.api.get(this.kind, id).subscribe({
      next: movement => {
        this.movement.set(movement);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        // 404 NOT_FOUND_EXPENSE / NOT_FOUND_INCOME: inesistente o di un altro utente.
        if (error.status === 404) {
          this.notFound.set(true);
        } else {
          this.error.set(`Impossibile caricare ${this.income ? 'l’entrata' : 'la spesa'}. Il server potrebbe essere momentaneamente non disponibile.`);
        }
        this.loading.set(false);
      },
    });
  }
}
