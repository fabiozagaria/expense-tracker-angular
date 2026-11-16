import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { App } from './app';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './features/auth/services/auth.service';
import { environment } from '../environments/environment';

@Component({ template: '<h1>Pagina di prova</h1>' })
class TestPage {}

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
    expect(compiled.querySelector('header a[href="/"]')?.textContent).toContain('Expense Tracker');
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

  it('keeps navigation busy during session checks and clears it after cancellation', async () => {
    const gate = new Subject<boolean>();
    let entered!: () => void;
    const guardEntered = new Promise<void>((resolve) => (entered = resolve));
    const router = TestBed.inject(Router);
    router.resetConfig([
      {
        path: 'guarded',
        component: TestPage,
        canActivate: [
          () => {
            entered();
            return gate;
          },
        ],
      },
      { path: 'ready', component: TestPage },
    ]);
    const fixture = TestBed.createComponent(App);
    const pending = router.navigateByUrl('/guarded');
    await guardEntered;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.route-loading')?.textContent).toContain(
      'Expense Tracker',
    );
    expect(fixture.nativeElement.querySelector('main').getAttribute('aria-busy')).toBe('true');
    await router.navigateByUrl('/ready');
    expect(await pending).toBe(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.route-loading')).toBeNull();
    expect(fixture.nativeElement.querySelector('main').getAttribute('aria-busy')).toBe('false');
  });

  it('clears the navigation spinner after a lazy route failure and recovers on retry', async () => {
    const router = TestBed.inject(Router);
    router.resetConfig([
      { path: 'broken', loadComponent: () => Promise.reject(new Error('Chunk unavailable')) },
    ]);
    const fixture = TestBed.createComponent(App);
    await expect(router.navigateByUrl('/broken')).rejects.toThrow('Chunk unavailable');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.route-loading')).toBeNull();
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain(
      'Impossibile aprire la pagina',
    );
    router.resetConfig([{ path: 'broken', component: TestPage }]);
    await router.navigateByUrl('/broken');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });
});
