import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LoadingSpinner } from './loading-spinner';

/** Shared viewport indicator for navigation and explicit authentication requests. */
@Component({
  selector: 'app-loading-panel',
  imports: [LoadingSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'route-loading' },
  template: `<app-loading-spinner
    size="lg"
    [showLabel]="true"
    [label]="label()"
    [detail]="detail()"
  />`,
  styles: `
    :host {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1100;
      display: grid;
      justify-items: center;
      width: max-content;
      max-width: min(22rem, calc(100vw - 2rem));
      padding: 24px 32px;
      border: 1px solid var(--ui-border);
      border-radius: 16px;
      background: var(--ui-surface);
      background: color-mix(in srgb, var(--ui-surface) 96%, transparent);
      box-shadow: 0 12px 40px rgb(0 0 0 / 0.18);
      backdrop-filter: blur(12px);
      pointer-events: none;
    }
  `,
})
export class LoadingPanel {
  readonly label = input('Caricamento pagina…');
  readonly detail = input('');
}
