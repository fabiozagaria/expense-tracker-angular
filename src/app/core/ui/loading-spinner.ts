import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Section/navigation indicator; buttons retain PrimeNG's local [loading] state. */
@Component({
  selector: 'app-loading-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'status' },
  template: `
    <span class="spinner" [style.--spinner-size]="diameter()" aria-hidden="true">
      <i class="pi pi-wallet"></i>
    </span>
    @if (showLabel()) {
      <strong class="brand">Expense Tracker</strong>
    }
    <span class="label" [class.ui-sr-only]="!showLabel()">{{ label() }}</span>
    @if (detail()) {
      <span class="detail">{{ detail() }}</span>
    }
  `,
  styles: `
    :host {
      display: inline-grid;
      justify-items: center;
      gap: 12px;
      color: var(--ui-accent);
    }
    .spinner {
      position: relative;
      display: grid;
      place-items: center;
      width: var(--spinner-size);
      height: var(--spinner-size);
    }
    .spinner::before,
    .spinner::after {
      content: '';
      position: absolute;
      inset: 0;
      border: 2px solid var(--ui-border);
      border-radius: 50%;
      border-top-color: var(--ui-accent);
      border-right-color: var(--ui-accent);
      animation: spinner-orbit 1.2s linear infinite;
    }
    .spinner::after {
      inset: 15%;
      border-color: transparent;
      border-bottom-color: var(--ui-expense-text);
      animation-direction: reverse;
      animation-duration: 1.8s;
    }
    .pi {
      font-size: calc(var(--spinner-size) * 0.28);
    }
    .brand {
      color: var(--ui-text);
      font-size: 15px;
      font-weight: 600;
    }
    .label {
      color: var(--ui-muted);
      font-size: 13px;
      text-align: center;
    }
    .detail {
      color: var(--ui-muted);
      font-size: 12px;
      line-height: 1.6;
      text-align: center;
    }
    @keyframes spinner-orbit {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .spinner::before,
      .spinner::after {
        animation: none !important;
      }
    }
  `,
})
export class LoadingSpinner {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly showLabel = input(false);
  readonly label = input('Caricamento in corso');
  readonly detail = input('');
  readonly diameter = computed(() => ({ sm: '1rem', md: '2rem', lg: '4rem' })[this.size()]);
}
