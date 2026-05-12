// src/app/core/guards/guest.guard.ts
//
// Schützt /auth/** vor eingeloggten Usern.
// Wenn bereits eingeloggt → direkt auf /app/dashboard.
//
// Verhindert dass ein eingeloggter User die Login-Seite sieht.
// Spiegelbild des AuthGuard.

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {AuthService} from '../services/auth-service/auth-service';

export const guestGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Ebenfalls auf Loading-State warten (gleiche Logik wie im AuthGuard).
  await waitForAuthReady(authService);

  if (!authService.isAuthenticated()) {
    return true; // Nicht eingeloggt → Login/Register-Seite erlaubt
  }

  // Bereits eingeloggt → auf Dashboard umleiten
  return router.createUrlTree(['/app/dashboard']);
};

function waitForAuthReady(authService: AuthService): Promise<void> {
  return new Promise((resolve) => {
    if (authService.authState().status !== 'loading') {
      resolve();
      return;
    }
    const interval = setInterval(() => {
      if (authService.authState().status !== 'loading') {
        clearInterval(interval);
        resolve();
      }
    }, 20);
  });
}
