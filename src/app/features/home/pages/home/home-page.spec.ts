import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HomePage } from './home-page';
import { AuthService } from '../../../auth/services/auth.service';
import { environment } from '../../../../../environments/environment';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let token: WritableSignal<string | null>;

  beforeEach(async () => {
    token = signal<string | null>(null);
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([]), { provide: AuthService, useValue: { accessToken: token } }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('offers login and registration before accessing the workspace', () => {
    const content = fixture.nativeElement as HTMLElement;
    expect(content.querySelector('.home-actions a[href="/login"]')?.textContent).toContain('Accedi al tuo spazio');
    expect(content.querySelector('.home-actions a[href="/register"]')?.textContent).toContain('Registrati');
  });

  it('offers dashboard and movements after login', async () => {
    token.set('test-session');
    await fixture.whenStable();
    const content = fixture.nativeElement as HTMLElement;
    expect(content.querySelector('.home-actions a[href="/dashboard"]')?.textContent).toContain('Vai alla dashboard');
    expect(content.querySelector('.home-actions a[href="/add-transaction"]')?.textContent).toContain('Nuovo movimento');
  });

  it('shows login and registration as disabled buttons during maintenance', () => {
    const initial = environment.maintenance;
    environment.maintenance = true;
    try {
      fixture = TestBed.createComponent(HomePage);
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      const buttons = Array.from(el.querySelectorAll('.home-actions button')) as HTMLButtonElement[];
      expect(buttons.length).toBe(2);
      expect(buttons.every(b => b.disabled)).toBe(true);
      expect(el.querySelector('.home-actions a')).toBeNull();
    } finally {
      environment.maintenance = initial;
    }
  });
});
