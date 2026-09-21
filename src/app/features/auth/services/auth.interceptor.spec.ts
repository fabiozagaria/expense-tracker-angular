import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let auth: AuthService;
  let http: HttpClient;
  let requests: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpClient);
    requests = TestBed.inject(HttpTestingController);
  });

  afterEach(() => requests.verify());

  it('uses the login token for expenses and rotates it after a 401', () => {
    auth.login('utente', 'password').subscribe();
    const login = requests.expectOne('http://localhost:8080/auth/login');
    expect(login.request.withCredentials).toBe(true);
    login.flush({ accessToken: 'first-token' });

    let expenses: unknown;
    http.get('http://localhost:8080/api/expenses').subscribe(value => expenses = value);
    const first = requests.expectOne('http://localhost:8080/api/expenses');
    expect(first.request.headers.get('Authorization')).toBe('Bearer first-token');
    first.flush(null, { status: 401, statusText: 'Unauthorized' });

    const refresh = requests.expectOne('http://localhost:8080/auth/refresh');
    expect(refresh.request.withCredentials).toBe(true);
    expect(refresh.request.headers.has('Authorization')).toBe(false);
    refresh.flush({ accessToken: 'second-token' });

    const retried = requests.expectOne('http://localhost:8080/api/expenses');
    expect(retried.request.headers.get('Authorization')).toBe('Bearer second-token');
    retried.flush([]);
    expect(expenses).toEqual([]);
  });
});
