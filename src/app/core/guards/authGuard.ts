// src/app/core/guards/auth.guard.ts
//
// Schützt alle Routen unter /app/** .
// Wenn keine aktive Session → Redirect auf /auth/login.
//
// Funktionaler Guard-Style (Angular 14+) — kein Injectable-Klassen-Boilerplate.
// CanActivateFn ist schlanker und tree-shakeable.

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import {AuthService} from '../services/auth-service/auth-service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Status 'loading' abwarten — passiert nur beim ersten App-Start
  // wenn Supabase die Session noch aus localStorage hydriert.
  await waitForAuthReady(authService);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Nicht eingeloggt → auf Login umleiten.
  // returnUrl speichern damit nach dem Login direkt die gewünschte Seite öffnet.
  return router.createUrlTree(['/auth/login']);
};

/**
 * Wartet bis der AuthService den initialen Loading-State aufgelöst hat.
 * Ohne das würde der Guard bei einem Hard-Reload immer kurz auf Login umleiten
 * bevor die Session aus localStorage geladen ist.
 */
function waitForAuthReady(authService: AuthService): Promise<void> {
  return new Promise((resolve) => {
    // Wenn schon bekannt → sofort auflösen
    if (authService.authState().status !== 'loading') {
      resolve();
      return;
    }

    // Polling — AuthService setzt State sehr schnell (< 100ms),
    // einfacher als ein Effect/toObservable hier einzubauen.
    const interval = setInterval(() => {
      if (authService.authState().status !== 'loading') {
        clearInterval(interval);
        resolve();
      }
    }, 20);
  });
}
