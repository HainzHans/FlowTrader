// src/app/app.routes.ts
//
// Haupt-Routing der App.
// Alle Feature-Module sind lazy-geladen — der User lädt nur was er gerade braucht.
//
// Route-Struktur:
//   /                      → Redirect auf /app/dashboard
//   /auth/login            → Login (GuestGuard: eingeloggte User → /app/dashboard)
//   /auth/register         → Registrierung (GuestGuard)
//   /auth/reset-password   → Passwort-Reset (kein Guard)
//   /app/**                → Alle App-Routen (AuthGuard: nicht eingeloggte → /auth/login)
//   /app/dashboard         → Dashboard
//   /app/trades            → Trade-Liste & Erfassung
//   /app/accounts          → Konten-Verwaltung

import { Routes } from '@angular/router';
import {guestGuard} from './core/guards/guestGuard';
import {authGuard} from './core/guards/authGuard';

export const routes: Routes = [
  // ── Root Redirect ───────────────────────────────────────────────────────────
  {
    path: '',
    redirectTo: '/app/dashboard',
    pathMatch: 'full',
  },

  // ── Auth-Bereich (nur für nicht eingeloggte User) ───────────────────────────
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
        title: 'Einloggen — TradingJournal',
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
        title: 'Registrieren — TradingJournal',
      },
      {
        path: 'reset-password',
        // Kein Guard — Reset-Link kommt per E-Mail, User ist noch nicht eingeloggt
        loadComponent: () =>
          import('./features/auth/reset-password/reset-password.component').then(
            (m) => m.ResetPasswordComponent
          ),
        title: 'Passwort zurücksetzen — TradingJournal',
      },
    ],
  },

  // ── App-Bereich (nur für eingeloggte User) ──────────────────────────────────
  {
    path: 'app',
    canActivate: [authGuard],
    // Shell-Component: enthält Navigation + Router-Outlet für die Sub-Routen.
    // Wird in Phase 0 Schritt 4 als minimaler Platzhalter angelegt.
    loadComponent: () =>
      import('./features/shell/shell.component').then(
        (m) => m.ShellComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        title: 'Dashboard — TradingJournal',
      },
      {
        path: 'trades',
        loadComponent: () =>
          import('./features/trades/trades.component').then(
            (m) => m.TradesComponent
          ),
        title: 'Trades — TradingJournal',
      },
      {
        path: 'accounts',
        loadComponent: () =>
          import('./features/accounts/accounts.component').then(
            (m) => m.AccountsComponent
          ),
        title: 'Konten — TradingJournal',
      },
    ],
  },

  // ── 404 Fallback ────────────────────────────────────────────────────────────
  {
    path: '**',
    redirectTo: '/app/dashboard',
  },
];
