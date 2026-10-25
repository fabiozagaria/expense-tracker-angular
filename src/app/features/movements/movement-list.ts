import { Component, inject, signal, DestroyRef } from '@angular/core';
import { CurrencyPipe, DatePipe, formatDate } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, switchMap, catchError, of, finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ExpenseCategory } from '../expenses/models/expense.model';
import { IncomeCategory } from '../income/models/income.model';
import { Movement, MovementApiService, MovementKind, MovementPage } from './movement-api.service';
@Component({
  selector: 'app-movement-list',
  imports: [CurrencyPipe, DatePipe, RouterLink, ReactiveFormsModule, ButtonModule, InputTextModule, MessageModule],
  templateUrl: './movement-list.html', styleUrl: './movement-list.css',
})
export class MovementList {
  private readonly api = inject(MovementApiService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly kind = inject(ActivatedRoute).snapshot.data['kind'] as MovementKind;
  protected readonly income = this.kind === 'incomes';
  protected readonly label = this.income ? 'entrate' : 'spese';
  protected readonly categories = Object.values(this.income ? IncomeCategory : ExpenseCategory);
  protected readonly categoryLabels: Record<string, string> = { salary: 'Stipendio', freelance: 'Lavoro autonomo', bonus: 'Bonus', refund: 'Rimborso', investment: 'Investimenti', gift: 'Regalo', rental: 'Affitto', other: 'Altro', groceries: 'Spesa alimentare', car: 'Auto', gifts: 'Regali', installments: 'Rate', loan: 'Prestito', health: 'Salute', transport: 'Trasporti', bills: 'Bollette', housing: 'Casa', leisure: 'Tempo libero' };
  protected readonly result = signal<MovementPage | null>(null);
  protected readonly loading = signal(false);
  protected readonly busy = signal(false);
  protected readonly error = signal('');
  protected readonly editing = signal<Movement | null>(null);
  protected readonly deleting = signal<number | null>(null);
  protected readonly today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  protected readonly filters = new FormGroup({
    month: new FormControl('', {nonNullable: true}), query: new FormControl('', {nonNullable: true, validators: Validators.maxLength(100)}),
    order: new FormControl('newest', {nonNullable: true}),
  });
  protected readonly form = new FormGroup({
    title: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3), Validators.maxLength(15), Validators.pattern(/\S/)]}),
    amount: new FormControl(0, {nonNullable: true, validators: [Validators.required, Validators.min(0.01)]}),
    description: new FormControl('', {nonNullable: true, validators: Validators.maxLength(30)}),
    category: new FormControl('', {nonNullable: true, validators: Validators.required}),
    date: new FormControl('', {nonNullable: true, validators: [Validators.required, c => c.value && c.value > this.today ? { future: true } : null]}),
  });
  private readonly pages = new Subject<number>();
  constructor() {
    this.pages.pipe(switchMap(page => {
      this.loading.set(true); this.error.set(''); this.result.set(null);
      return this.api.search(this.kind, { ...this.filters.getRawValue(), page, size: 10 }).pipe(
        catchError(() => { this.error.set('Caricamento non riuscito. Riprova.'); return of(null); })
      );
    }), takeUntilDestroyed(this.destroyRef)).subscribe(result => { this.result.set(result); this.loading.set(false); });
    this.reload();
  }
  protected reload(page = 0) { if (!this.busy() && this.filters.valid) this.pages.next(page); }
  protected reset() { this.filters.reset({ month: '', query: '', order: 'newest' }); this.reload(); }
  protected edit(item: Movement) { this.deleting.set(null); this.error.set(''); this.editing.set(item); this.form.reset({ ...item, description: item.description ?? '' }); }
  protected save() {
    const item = this.editing();
    if (!item || this.busy()) return;
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.busy.set(true); this.error.set('');
    this.api.update(this.kind, {id: item.id, ...this.form.getRawValue()}).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.busy.set(false))).subscribe({
      next: () => { this.editing.set(null); this.busy.set(false); this.reload(); },
      error: () => this.error.set('Modifica non salvata. Controlla i campi e riprova.'),
    });
  }
  protected remove(id: number) {
    if (this.busy()) return;
    this.busy.set(true); this.error.set('');
    this.api.remove(this.kind, id).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.busy.set(false))).subscribe({
      next: () => { this.deleting.set(null); this.busy.set(false); this.reload(); },
      error: () => this.error.set('Eliminazione non riuscita. Riprova.'),
    });
  }
}
