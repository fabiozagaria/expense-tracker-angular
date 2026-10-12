import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, retry, shareReplay, switchMap, tap, throwError, timeout, timer } from 'rxjs';

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

  register(request: RegistrationRequest): Observable<{ msg: string }> {
    return this.http.post<{ msg: string }>(`${this.apiUrl}/register`, request);
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { username, password }, {
      withCredentials: true,
    }).pipe(tap(response => this.token.set(response.accessToken)));
  }

  demoLogin(): Observable<AuthResponse> {
    return this.warmDemoServer().pipe(
      // Retry only the health check; repeating login could create another session.
      switchMap(() => this.http.post<AuthResponse>(`${this.apiUrl}/demo`, null, {
        withCredentials: true,
      })),
      tap(response => this.token.set(response.accessToken)),
    );
  }

  private warmDemoServer(): Observable<void> {
    return this.http.get<unknown>(`${environment.apiBaseUrl}/health`).pipe(
      timeout(15000),
      map(response => {
        if (typeof response !== 'object' || response === null || Array.isArray(response)
          || !('status' in response) || response.status !== 'up') {
          throw new Error('Il server demo non è ancora pronto.');
        }
      }),
      retry({ delay: () => timer(5000) }),
      timeout(240000),
    );
  }

  refresh(): Observable<AuthResponse> {
    if (!this.refreshRequest) {
      this.refreshRequest = this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, null, {
        withCredentials: true,
      }).pipe(
        tap(response => this.token.set(response.accessToken)),
        catchError(error => {
          this.token.set(null);
          return throwError(() => error);
        }),
        finalize(() => this.refreshRequest = undefined),
        shareReplay({ bufferSize: 1, refCount: false }),
      );
    }
    return this.refreshRequest;
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, null, {
      withCredentials: true,
    }).pipe(finalize(() => this.token.set(null)));
  }

  clearSession(): void {
    this.token.set(null);
  }
}

