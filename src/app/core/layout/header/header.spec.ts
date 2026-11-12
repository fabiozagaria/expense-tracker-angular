import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { environment } from '../../../../environments/environment';

import { Header } from './header';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  const initialDemo = environment.demo;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    environment.demo = initialDemo;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps registration reachable in the demo', () => {
    environment.demo = true;
    fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a[href="/register"]') as HTMLAnchorElement;
    expect(link.textContent).toContain('Registrati');
    expect(link.title).toBe('Crea un account personale');
  });

  it('links to the settings page only for a logged-in user', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a[href="/settings"]')).toBeNull();

    TestBed.inject(AuthService).login('utente1', 'secret123').subscribe();
    TestBed.inject(HttpTestingController).expectOne(`${environment.apiBaseUrl}/auth/login`)
      .flush({ accessToken: 'h.e30.s' });
    fixture.detectChanges();
    const link = fixture.nativeElement.querySelector('a[href="/settings"]') as HTMLAnchorElement;
    expect(link.textContent).toContain('Impostazioni');
  });

  it('shows login and registration as disabled items during maintenance', () => {
    const initial = environment.maintenance;
    environment.maintenance = true;
    try {
      fixture = TestBed.createComponent(Header);
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      const disabled = el.querySelectorAll('.workspace-link.is-disabled[aria-disabled="true"]');
      expect(disabled.length).toBe(2);
      expect(el.querySelector('a[href="/login"], a[href="/register"]')).toBeNull();
    } finally {
      environment.maintenance = initial;
    }
  });
});
