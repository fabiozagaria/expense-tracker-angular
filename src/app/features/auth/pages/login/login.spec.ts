import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../../environments/environment';

import { Login } from './login';
import { vi } from 'vitest';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  const initialDemo = environment.demo;
  const initialMaintenance = environment.maintenance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    environment.demo = initialDemo;
    environment.maintenance = initialMaintenance;
    TestBed.inject(HttpTestingController).verify();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('links to the registration form in the demo and explains online availability', () => {
    environment.demo = true;
    fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a[href="/register"]')?.textContent).toContain('Registrati');
    expect(fixture.nativeElement.textContent).toContain('registrati e conferma il link ricevuto via email');
    expect(fixture.nativeElement.textContent).toContain('Prova la demo');
  });

  it('submits credentials to the backend and shows an invalid credentials error', () => {
    const username = fixture.nativeElement.querySelector('#login-username') as HTMLInputElement;
    const password = fixture.nativeElement.querySelector('#login-password') as HTMLInputElement;
    username.value = 'verticaluser1';
    username.dispatchEvent(new Event('input'));
    password.value = 'wrongpass';
    password.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

    const request = TestBed.inject(HttpTestingController).expectOne('http://localhost:8080/auth/login');
    expect(request.request.body).toEqual({ username: 'verticaluser1', password: 'wrongpass' });
    expect(request.request.withCredentials).toBe(true);
    request.flush(null, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Username o password non corretti.');
    TestBed.inject(HttpTestingController).verify();
  });

  it('offers the forgot-password page and a new verification link after 403 EMAIL_NOT_VERIFIED', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('a[href="/forgot-password"]')).toBeTruthy();
    const username = fixture.nativeElement.querySelector('#login-username') as HTMLInputElement;
    const password = fixture.nativeElement.querySelector('#login-password') as HTMLInputElement;
    username.value = 'unverified1';
    username.dispatchEvent(new Event('input'));
    password.value = 'secret123';
    password.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    TestBed.inject(HttpTestingController).expectOne('http://localhost:8080/auth/login')
      .flush({ errorName: 'EMAIL_NOT_VERIFIED' }, { status: 403, statusText: 'Forbidden' });
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Verifica prima la tua email');
    expect(fixture.nativeElement.querySelector('a[href="/resend-verification"]')).toBeTruthy();
  });

  it('disables the shared demo button during maintenance and sends nothing', () => {
    environment.demo = true;
    environment.maintenance = true;
    fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.demo-button') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    button.click();
    TestBed.inject(HttpTestingController).expectNone(() => true);
  });

  it('disables the login submit during maintenance and sends nothing', () => {
    environment.maintenance = true;
    fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('.login-submit') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    TestBed.inject(HttpTestingController).expectNone(() => true);
  });
  it('shows the central panel while credentials are pending and releases it after HTTP 401', () => {
    const requests = TestBed.inject(HttpTestingController);
    component['form'].setValue({ username: 'personaluser', password: 'wrongpass' });
    component['submit']();
    component['submit']();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-loading-panel app-loading-spinner')).toBeTruthy();
    const submit = fixture.nativeElement.querySelector('.login-submit') as HTMLButtonElement;
    expect(submit.disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('form').getAttribute('aria-busy')).toBe('true');
    requests.expectOne(`${environment.apiBaseUrl}/auth/login`).flush(null, { status: 401, statusText: 'Unauthorized' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-loading-panel')).toBeNull();
    expect(submit.disabled).toBe(false);
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('Username o password non corretti.');
  });

  it('removes the credentials panel on success and navigates once', () => {
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
    component['form'].setValue({ username: 'personaluser', password: 'secret123' });
    component['submit']();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-loading-panel')).toBeTruthy();
    TestBed.inject(HttpTestingController).expectOne(`${environment.apiBaseUrl}/auth/login`).flush({ accessToken: 'fixture-token' });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-loading-panel')).toBeNull();
    expect(navigate).toHaveBeenCalledExactlyOnceWith('/dashboard');
  });

  it('keeps the demo panel through wake-up retries and sends only one login POST', async () => {
    vi.useFakeTimers();
    try {
      environment.demo = true;
      fixture = TestBed.createComponent(Login);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const requests = TestBed.inject(HttpTestingController);
      const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
      component['tryDemo']();
      component['tryDemo']();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-loading-panel app-loading-spinner')).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.demo-button').disabled).toBe(true);
      expect(fixture.nativeElement.querySelector('.login-submit').disabled).toBe(true);
      requests.expectOne(`${environment.apiBaseUrl}/health`).flush(null, { status: 503, statusText: 'Unavailable' });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-loading-panel')).toBeTruthy();
      requests.expectNone(`${environment.apiBaseUrl}/auth/demo`);
      await vi.advanceTimersByTimeAsync(5000);
      requests.expectOne(`${environment.apiBaseUrl}/health`).flush({ status: 'up' });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-loading-panel')).toBeTruthy();
      const login = requests.expectOne(`${environment.apiBaseUrl}/auth/demo`);
      expect(login.request.method).toBe('POST');
      login.flush({ accessToken: 'fixture-token' });
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-loading-panel')).toBeNull();
      expect(navigate).toHaveBeenCalledExactlyOnceWith('/dashboard');
      await vi.advanceTimersByTimeAsync(10000);
      requests.expectNone(`${environment.apiBaseUrl}/auth/demo`);
      requests.expectNone(`${environment.apiBaseUrl}/health`);
    } finally {
      vi.useRealTimers();
    }
  });

  it('ends the demo panel with an error when wake-up expires', async () => {
    vi.useFakeTimers();
    try {
      component['tryDemo']();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-loading-panel')).toBeTruthy();
      await vi.advanceTimersByTimeAsync(240000);
      const requests = TestBed.inject(HttpTestingController);
      requests.match(`${environment.apiBaseUrl}/health`).forEach(request => expect(request.cancelled).toBe(true));
      requests.expectNone(`${environment.apiBaseUrl}/auth/demo`);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('app-loading-panel')).toBeNull();
      expect(fixture.nativeElement.querySelector('.login-submit').disabled).toBe(false);
      expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toContain('Il server demo non è ancora disponibile');
    } finally {
      vi.useRealTimers();
    }
  });

  it('cancels a pending health check when leaving login and never logs in later', async () => {
    vi.useFakeTimers();
    try {
      const requests = TestBed.inject(HttpTestingController);
      component['tryDemo']();
      const health = requests.expectOne(`${environment.apiBaseUrl}/health`);
      fixture.destroy();
      expect(health.cancelled).toBe(true);
      await vi.advanceTimersByTimeAsync(300000);
      requests.expectNone(`${environment.apiBaseUrl}/health`);
      requests.expectNone(`${environment.apiBaseUrl}/auth/demo`);
    } finally {
      vi.useRealTimers();
    }
  });

});
