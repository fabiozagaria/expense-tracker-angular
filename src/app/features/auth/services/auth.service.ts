import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  catchError,
  finalize,
  map,
  Observable,
  retry,
  shareReplay,
  switchMap,
  tap,
  throwError,
  timeout,
  timer,
} from 'rxjs';

export interface RegistrationRequest {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/auth`;
  private readonly token = signal<string | null>(null);
  private refreshRequest?: Observable<AuthResponse>;

  readonly accessToken = this.token.asReadonly();
  // Presentation only: the backend remains responsible for validating JWTs.
  readonly isDemoSession = computed(() => {
    const payload = this.token()?.split('.')[1];
    if (!payload) return false;
    try {
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
      const claims: unknown = JSON.parse(new TextDecoder().decode(bytes));
      return (
        typeof claims === 'object' &&
        claims !== null &&
        'sub' in claims &&
        claims.sub === 'portfolio-demo'
      );
    } catch {
      return false;
    }
  });

  register(request: RegistrationRequest): Observable<{ msg: string }> {
    return this.afterWakeUp(() =>
      this.http.post<{ msg: string }>(`${this.apiUrl}/register`, request, { timeout: 15000 }),
    );
  }

  /** `POST /auth/resend-verification`: 202 anche se l'email non esiste o è già verificata. */
  resendVerification(email: string): Observable<void> {
    return this.afterWakeUp(() =>
      this.http.post<void>(`${this.apiUrl}/resend-verification`, { email }, { timeout: 15000 }),
    );
  }

  /** `POST /auth/forgot-password`: 202 anche se l'email non esiste. */
  forgotPassword(email: string): Observable<void> {
    return this.afterWakeUp(() =>
      this.http.post<void>(`${this.apiUrl}/forgot-password`, { email }, { timeout: 15000 }),
    );
  }

  /** `POST /auth/reset-password`: 204; il server chiude tutte le sessioni dell'utente. */
  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.afterWakeUp(() =>
      this.http.post<void>(`${this.apiUrl}/reset-password`, { token, newPassword }, { timeout: 15000 }),
    );
  }

  // Retry only the safe health check; never repeat a POST that sends email or consumes a token.
  private afterWakeUp<T>(send: () => Observable<T>): Observable<T> {
    return environment.demo ? this.warmDemoServer().pipe(switchMap(send)) : send();
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/login`,
        { username, password },
        {
          withCredentials: true,
        },
      )
      .pipe(tap((response) => this.token.set(response.accessToken)));
  }

  demoLogin(): Observable<AuthResponse> {
    return this.warmDemoServer().pipe(
      // Retry only the health check; repeating login could create another session.
      switchMap(() =>
        this.http.post<AuthResponse>(`${this.apiUrl}/demo`, null, {
          withCredentials: true,
        }),
      ),
      tap((response) => this.token.set(response.accessToken)),
    );
  }

  private warmDemoServer(): Observable<void> {
    return this.http.get<unknown>(`${environment.apiBaseUrl}/health`).pipe(
      timeout(15000),
      map((response) => {
        if (
          typeof response !== 'object' ||
          response === null ||
          Array.isArray(response) ||
          !('status' in response) ||
          response.status !== 'up'
        ) {
          throw new Error('Il server demo non è ancora pronto.');
        }
      }),
      retry({ delay: () => timer(5000) }),
      timeout(240000),
    );
  }

  refresh(): Observable<AuthResponse> {
    if (!this.refreshRequest) {
      this.refreshRequest = this.http
        .post<AuthResponse>(`${this.apiUrl}/refresh`, null, {
          withCredentials: true,
        })
        .pipe(
          tap((response) => this.token.set(response.accessToken)),
          catchError((error) => {
            this.token.set(null);
            return throwError(() => error);
          }),
          finalize(() => (this.refreshRequest = undefined)),
          shareReplay({ bufferSize: 1, refCount: false }),
        );
    }
    return this.refreshRequest;
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${this.apiUrl}/logout`, null, {
        withCredentials: true,
      })
      .pipe(finalize(() => this.token.set(null)));
  }

  clearSession(): void {
    this.token.set(null);
  }
}
