import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { Dashboard } from './dashboard';
import { DashboardService } from '../../services/dashboard.service';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        {
          provide: DashboardService,
          useValue: {
            getSummary: () => of({ totalIncome: 1000, totalExpense: 250, balance: 750 }),
            getMovements: () => of([
              { id: 2, kind: 'income', title: 'Stipendio', amount: 1000, category: 'salary', date: '2026-10-12' },
              { id: 1, kind: 'expense', title: 'Spesa settimanale', amount: 250, category: 'groceries', date: '2026-10-11' },
            ]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders income and expense movements with the expense detail link', () => {
    const content = fixture.nativeElement as HTMLElement;
    expect(content.textContent).toContain('Stipendio');
    expect(content.textContent).toContain('Spesa settimanale');
    expect(content.querySelector('a[href="/expenses/1"]')?.textContent).toContain('Spesa settimanale');
  });

  it('shows unavailable amounts after a summary error while keeping movements visible', async () => {
    vi.spyOn(TestBed.inject(DashboardService), 'getSummary').mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 503, statusText: 'Service Unavailable' })),
    );
    fixture = TestBed.createComponent(Dashboard);
    await fixture.whenStable();

    const content = fixture.nativeElement as HTMLElement;
    expect(content.querySelector('[role="alert"]')?.textContent).toContain('Impossibile caricare il riepilogo.');
    expect(Array.from(content.querySelectorAll('.metric h2'), amount => amount.textContent?.trim())).toEqual(['—', '—', '—']);
    expect(content.querySelector('a[href="/expenses/1"]')?.textContent).toContain('Spesa settimanale');
    expect(content.querySelector('.transactions-panel')?.textContent).toContain('Stipendio');
  });
});
