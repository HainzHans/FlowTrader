import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../services/auth-service/auth-service';

export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn$.pipe(
    map(loggedIn => loggedIn ? true : router.createUrlTree(['/auth']))
  );
};

export const publicGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn$.pipe(
    map(loggedIn => loggedIn ? router.createUrlTree(['/dashboard']) : true)
  );
};
