import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TimeoutError } from 'rxjs';
import { vi } from 'vitest';
import { environment } from '../../../../environments/environment';
import { AuthService } from './auth.service';

describe('AuthService demo wake-up', () => {
  let auth: AuthService;
  let requests: HttpTestingController;
  const healthUrl = `${environment.apiBaseUrl}/health`;
  const initialDemo = environment.demo;
  const demoUrl = `${environment.apiBaseUrl}/auth/demo`;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    auth = TestBed.inject(AuthService);
    requests = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    environment.demo = initialDemo;
    requests.verify();
    vi.useRealTimers();
  });

  it('waits through an unavailable server and creates one session after health succeeds', async () => {
    let accessToken: string | undefined;
    auth.demoLogin().subscribe(response => accessToken = response.accessToken);
    const firstHealth = requests.expectOne(healthUrl);
    expect(firstHealth.request.method).toBe('GET');
    firstHealth.flush(null, { status: 503, statusText: 'Service Unavailable' });
    requests.expectNone(demoUrl);

    await vi.advanceTimersByTimeAsync(5000);
    requests.expectOne(healthUrl).flush({ status: 'up' });
    const login = requests.expectOne(demoUrl);
    expect(login.request.method).toBe('POST');
    expect(login.request.withCredentials).toBe(true);
    login.flush({ accessToken: 'demo-token' });

    await vi.advanceTimersByTimeAsync(10000);
    requests.expectNone(demoUrl);
    requests.expectNone(healthUrl);
    expect(accessToken).toBe('demo-token');
    expect(auth.accessToken()).toBe('demo-token');
  });

  it('does not accept a loading page or an unexpected health response as readiness', async () => {
    auth.demoLogin().subscribe();
    requests.expectOne(healthUrl).flush('<html>Starting server...</html>');
    requests.expectNone(demoUrl);
    await vi.advanceTimersByTimeAsync(5000);
    requests.expectOne(healthUrl).flush({ status: 'starting' });
    requests.expectNone(demoUrl);
    await vi.advanceTimersByTimeAsync(5000);
    requests.expectOne(healthUrl).flush({ status: 'up' });
    requests.expectOne(demoUrl).flush({ accessToken: 'demo-token' });
  });

  it('cancels a stalled health request after 15 seconds and checks again', async () => {
    auth.demoLogin().subscribe();
    const stalled = requests.expectOne(healthUrl);
    await vi.advanceTimersByTimeAsync(15000);
    expect(stalled.cancelled).toBe(true);
    requests.expectNone(demoUrl);
    await vi.advanceTimersByTimeAsync(5000);
    requests.expectOne(healthUrl).flush({ status: 'up' });
    requests.expectOne(demoUrl).flush({ accessToken: 'demo-token' });
  });

  it('ends the wake-up after four minutes without sending a login request', async () => {
    let error: unknown;
    auth.demoLogin().subscribe({ error: value => error = value });
    await vi.advanceTimersByTimeAsync(240000);
    requests.match(healthUrl).forEach(request => expect(request.cancelled).toBe(true));
    requests.expectNone(demoUrl);
    expect(error).toBeInstanceOf(TimeoutError);
    expect(auth.accessToken()).toBeNull();
  });

  it('does not retry a failed login after the server is ready', async () => {
    let error: unknown;
    auth.demoLogin().subscribe({ error: value => error = value });
    requests.expectOne(healthUrl).flush({ status: 'up' });
    requests.expectOne(demoUrl).flush(null, { status: 503, statusText: 'Service Unavailable' });
    await vi.advanceTimersByTimeAsync(10000);
    requests.expectNone(healthUrl);
    requests.expectNone(demoUrl);
    expect(error).toBeInstanceOf(HttpErrorResponse);
    expect(auth.accessToken()).toBeNull();
  });
  it('wakes the deployed server before registration and never retries a rejected email', async () => {
    environment.demo = true;
    const registerUrl = `${environment.apiBaseUrl}/auth/register`;
    let error: unknown;
    auth.register({ username: 'personal1', email: 'personal@example.test', password: 'secret123' })
      .subscribe({ error: value => error = value });
    requests.expectOne(healthUrl).flush(null, { status: 503, statusText: 'Unavailable' });
    requests.expectNone(registerUrl);
    await vi.advanceTimersByTimeAsync(5000);
    requests.expectOne(healthUrl).flush({ status: 'up' });
    const registration = requests.expectOne(registerUrl);
    expect(registration.request.method).toBe('POST');
    expect(registration.request.body.username).toBe('personal1');
    registration.flush({ errorName: 'EMAIL_DELIVERY_UNAVAILABLE' }, { status: 503, statusText: 'Unavailable' });
    await vi.advanceTimersByTimeAsync(10000);
    requests.expectNone(registerUrl);
    requests.expectNone(healthUrl);
    expect(error).toBeInstanceOf(HttpErrorResponse);
    expect(auth.accessToken()).toBeNull();
  });

  it('does not create an account when wake-up expires', async () => {
    environment.demo = true;
    let error: unknown;
    auth.register({ username: 'personal1', email: 'personal@example.test', password: 'secret123' })
      .subscribe({ error: value => error = value });
    await vi.advanceTimersByTimeAsync(240000);
    requests.match(healthUrl).forEach(request => expect(request.cancelled).toBe(true));
    requests.expectNone(`${environment.apiBaseUrl}/auth/register`);
    expect(error).toBeInstanceOf(TimeoutError);
  });

});
