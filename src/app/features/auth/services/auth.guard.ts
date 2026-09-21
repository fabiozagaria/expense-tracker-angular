import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const login = () => router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });

  if (auth.accessToken()) return true;
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return login();

  return auth.refresh().pipe(
    map(() => true),
    catchError(() => of(login())),
  );
};
