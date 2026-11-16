import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

/** Standalone section indicator. Buttons use PrimeNG's existing [loading] API. */
@Component({
  selector: 'app-loading-spinner',
  imports: [ProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p-progressspinner
    [style]="{ width: diameter(), height: diameter() }"
    [ariaLabel]="label()"
    strokeWidth="4"
  />`,
  styles: `
    :host {
      display: inline-flex;
      color: var(--ui-accent);
      --p-progressspinner-color-one: var(--ui-accent);
      --p-progressspinner-color-two: var(--ui-accent);
      --p-progressspinner-color-three: var(--ui-accent);
      --p-progressspinner-color-four: var(--ui-accent);
    }
  `,
})
export class LoadingSpinner {
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly label = input('Caricamento in corso');
  readonly diameter = computed(() => ({ sm: '1rem', md: '2rem', lg: '4rem' })[this.size()]);
}
