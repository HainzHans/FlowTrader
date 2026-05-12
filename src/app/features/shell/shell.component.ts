// src/app/features/shell/shell.component.ts
//
// App-Shell für alle /app/**-Routen.
// Enthält die Haupt-Navigation und das RouterOutlet für Sub-Routen.
// Jetzt minimaler Platzhalter — wird in Phase 1 mit echtem Layout befüllt.

import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import {AuthService} from '../../core/services/auth-service/auth-service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div style="display: flex; min-height: 100vh;">

      <!-- Sidebar Placeholder — wird in Phase 1 durch PrimeNG-Layout ersetzt -->
      <nav style="width: 220px; background: #111318; padding: 1.5rem; border-right: 1px solid #1f2430; display: flex; flex-direction: column; gap: 0.5rem;">
        <div style="font-family: monospace; font-size: 12px; color: #5a6278; letter-spacing: 0.1em; margin-bottom: 1rem;">
          TRADING JOURNAL
        </div>

        <a routerLink="/app/dashboard" routerLinkActive="active-link"
           style="color: #5a6278; text-decoration: none; padding: 0.5rem; border-radius: 6px; font-size: 14px;">
          Dashboard
        </a>
        <a routerLink="/app/trades" routerLinkActive="active-link"
           style="color: #5a6278; text-decoration: none; padding: 0.5rem; border-radius: 6px; font-size: 14px;">
          Trades
        </a>
        <a routerLink="/app/accounts" routerLinkActive="active-link"
           style="color: #5a6278; text-decoration: none; padding: 0.5rem; border-radius: 6px; font-size: 14px;">
          Konten
        </a>

        <!-- Spacer -->
        <div style="flex: 1;"></div>

        <div style="font-size: 12px; color: #5a6278; font-family: monospace;">
          {{ authService.currentUser()?.email }}
        </div>
        <button (click)="logout()"
                style="background: none; border: 1px solid #1f2430; color: #5a6278; padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 13px; text-align: left;">
          Abmelden
        </button>
      </nav>

      <!-- Main Content Area -->
      <main style="flex: 1; background: #0a0b0d; overflow-y: auto;">
        <router-outlet />
      </main>

    </div>
  `,
  styles: [`
    .active-link {
      color: #e8eaf0 !important;
      background: #181c24;
    }
  `],
})
export class ShellComponent {
  readonly authService = inject(AuthService);

  async logout(): Promise<void> {
    await this.authService.logout();
    // Redirect auf /auth/login passiert automatisch via onAuthStateChange im AuthService
  }
}
