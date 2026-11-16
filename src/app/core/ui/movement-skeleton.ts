import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';

/** Shared placeholders for the two movement lists and the recent movements table. */
@Component({
  selector: 'app-movement-skeleton',
  imports: [SkeletonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="ui-sr-only" role="status">Caricamento movimenti…</span>
    <div [class.table]="variant() === 'table'" aria-hidden="true">
      @if (variant() === 'table') {
        <div class="table-heading"><p-skeleton width="65%" height=".75rem" /></div>
      }
      @for (row of rows; track row) {
        <div class="placeholder" [class.ui-panel]="variant() === 'cards'">
          <div class="description">
            <p-skeleton width="55%" height="1.25rem" /><p-skeleton width="75%" height="1rem" />
          </div>
          @if (variant() === 'table') {
            <p-skeleton class="metadata" width="6rem" height="1rem" />
            <p-skeleton class="metadata" width="5rem" height="1rem" />
          }
          <p-skeleton width="7rem" height="1.5rem" />
          @if (variant() === 'cards') {
            <div class="actions">
              <p-skeleton width="6rem" height="2.75rem" /><p-skeleton
                width="6rem"
                height="2.75rem"
              />
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
      min-width: 0;
    }
    .placeholder {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
      min-height: 142px;
    }
    .description {
      flex: 1 1 200px;
      display: grid;
      gap: 12px;
    }
    .actions {
      display: flex;
      gap: 12px;
    }
    .table .description {
      min-width: 0;
      gap: 4px;
    }
    .table-heading {
      padding: 14px 24px;
    }
    .table .placeholder {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 6rem 5rem 7rem;
      min-height: 64px;
      padding: 12px 24px;
      margin: 0;
      border-bottom: 1px solid var(--ui-border);
    }
    @media (max-width: 700px) {
      .actions {
        flex-basis: 100%;
      }
      .table .placeholder {
        grid-template-columns: minmax(0, 1fr) 7rem;
        padding-inline: 16px;
      }
      .metadata {
        display: none;
      }
    }
  `,
})
export class MovementSkeleton {
  readonly variant = input<'cards' | 'table'>('cards');
  readonly rows = [0, 1, 2, 3, 4, 5];
}
