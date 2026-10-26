import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './features/auth/services/auth.service';
import { environment } from '../environments/environment';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the application layout', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header a[href="/"]')?.textContent).toContain('Gestore Spese');
    expect(compiled.querySelector('footer')).toBeTruthy();
  });
  it('shows shared-account notices only for the demo session', () => {
    const fixture = TestBed.createComponent(App);
    const auth = TestBed.inject(AuthService);
    const http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.demo-notice')).toBeNull();
    auth.login('portfolio-demo', 'test').subscribe();
    http.expectOne(`${environment.apiBaseUrl}/auth/login`).flush({
      accessToken: `header.${btoa(JSON.stringify({ sub: 'portfolio-demo' }))}.signature`,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.demo-notice')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Spazio demo');
    auth.login('personal-user', 'test').subscribe();
    http.expectOne(`${environment.apiBaseUrl}/auth/login`).flush({
      accessToken: `header.${btoa(JSON.stringify({ sub: 'personal-user' }))}.signature`,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.demo-notice')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Spazio demo');
    http.verify();
  });

});
