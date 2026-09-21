import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, Observable, shareReplay, tap, throwError } from 'rxjs';

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
  private readonly apiUrl = 'http://localhost:8080/auth';
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
