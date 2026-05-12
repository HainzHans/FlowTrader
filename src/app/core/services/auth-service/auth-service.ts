// src/app/core/services/auth.service.ts
//
// Verantwortlich für:
//   - Login, Register, Logout
//   - Session-State als Signal (reaktiv, kein BehaviorSubject-Boilerplate)
//   - UserProfile aus public.users laden
//   - onAuthStateChange lauschen → Guards und AppState bleiben automatisch aktuell

import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthChangeEvent, AuthError, Session } from '@supabase/supabase-js';
import {SupabaseService} from '../supabase/supabase.service';
import {AuthState, UserProfile} from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly router = inject(Router);

  // ── State ────────────────────────────────────────────────────────────────────
  // Signal statt BehaviorSubject — kein RxJS-Overhead für simplen Auth-State.
  // Components lesen: authService.authState() oder die computed shortcuts.

  private readonly _authState = signal<AuthState>({ status: 'loading' });

  /** Voller Auth-State — für die wenigen Stellen die alles brauchen */
  readonly authState = this._authState.asReadonly();

  /** true wenn Session aktiv — Guards und UI-Toggles verwenden das */
  readonly isAuthenticated = computed(() => this._authState().status === 'authenticated');

  /** Eingeloggter User oder null */
  readonly currentUser = computed(() => {
    const state = this._authState();
    return state.status === 'authenticated' ? state.user : null;
  });

  /** UserProfile (public.users) oder null */
  readonly currentProfile = computed(() => {
    const state = this._authState();
    return state.status === 'authenticated' ? state.profile : null;
  });

  // ── Initialisierung ───────────────────────────────────────────────────────────

  constructor() {
    // Beim Start: bestehende Session aus localStorage laden.
    // Dann onAuthStateChange subscriben — Supabase feuert das bei jedem
    // Login, Logout und Token-Refresh automatisch.
    this.initAuthState();
  }

  private async initAuthState(): Promise<void> {
    // Aktuelle Session prüfen (synchron aus lokalem Storage).
    const { data: { session } } = await this.supabase.auth.getSession();
    await this.updateStateFromSession(session);

    // Auth-Events lauschen — läuft für die gesamte App-Lebensdauer.
    this.supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        await this.updateStateFromSession(session);

        // Nach Logout immer auf Login-Seite.
        if (event === 'SIGNED_OUT') {
          this.router.navigate(['/auth/login']);
        }
      }
    );
  }

  private async updateStateFromSession(session: Session | null): Promise<void> {
    if (!session?.user) {
      this._authState.set({ status: 'unauthenticated' });
      return;
    }

    // User ist eingeloggt — Profil aus public.users laden.
    const profile = await this.loadUserProfile(session.user.id);
    this._authState.set({
      status: 'authenticated',
      user: session.user,
      profile,
    });
  }

  private async loadUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Profil fehlt noch (race condition direkt nach Registrierung, Trigger läuft noch).
      // Kein throw — App funktioniert trotzdem, Profil kommt beim nächsten Auth-Event.
      console.warn('[AuthService] Profil noch nicht verfügbar:', error.message);
      return null;
    }

    return data as UserProfile;
  }

  // ── Public API ────────────────────────────────────────────────────────────────

  /**
   * Registrierung mit Email + Password.
   * Trigger 3 in der DB legt automatisch public.users und subscriptions an.
   *
   * @returns AuthError wenn Registrierung fehlschlägt, sonst null
   */
  async register(email: string, password: string, displayName?: string): Promise<AuthError | null> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          // Wird in auth.users.raw_user_meta_data gespeichert.
          // Trigger 3 kann das in public.users.display_name schreiben.
          display_name: displayName ?? null,
        },
      },
    });

    if (error) return error;

    // Supabase schickt standardmäßig eine Bestätigungs-E-Mail.
    // Je nach Supabase-Einstellung (Email-Confirm deaktiviert) ist der User
    // sofort eingeloggt — onAuthStateChange handelt das automatisch.
    return null;
  }

  /**
   * Login mit Email + Password.
   *
   * @returns AuthError wenn Login fehlschlägt, sonst null
   */
  async login(email: string, password: string): Promise<AuthError | null> {
    const { error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    return error ?? null;
    // onAuthStateChange → updateStateFromSession → Router-Navigation passiert
    // im AuthGuard / GuestGuard, nicht hier.
  }

  /**
   * Logout. Löscht Session lokal und auf Supabase-Seite.
   * onAuthStateChange feuert SIGNED_OUT → Redirect auf /auth/login.
   */
  async logout(): Promise<void> {
    await this.supabase.auth.signOut();
  }

  /**
   * Password-Reset-Mail schicken.
   * Redirect-URL muss in Supabase Auth → URL Configuration erlaubt sein.
   */
  async sendPasswordResetEmail(email: string): Promise<AuthError | null> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return error ?? null;
  }
}
