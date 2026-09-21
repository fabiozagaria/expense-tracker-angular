import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith('http://localhost:8080/api/')) {
    return next(request);
  }

  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.accessToken();
  const authorized = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authorized).pipe(catchError(error => {
    if (!(error instanceof HttpErrorResponse) || error.status !== 401 || !token) {
      return throwError(() => error);
    }
    const currentToken = auth.accessToken();
    if (currentToken && currentToken !== token) {
      return next(request.clone({ setHeaders: { Authorization: `Bearer ${currentToken}` } }));
    }
    return auth.refresh().pipe(
      switchMap(response => next(request.clone({
        setHeaders: { Authorization: `Bearer ${response.accessToken}` },
      }))),
      catchError(refreshError => {
        auth.clearSession();
        void router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
        return throwError(() => refreshError);
      }),
    );
  }));
};
