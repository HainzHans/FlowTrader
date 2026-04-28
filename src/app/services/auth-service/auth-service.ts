import { Injectable, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import {supabase} from '../../core/supabase.client';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _state = signal<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  readonly user    = computed(() => this._state().user);
  readonly session = computed(() => this._state().session);
  readonly loading = computed(() => this._state().loading);
  readonly isLoggedIn = computed(() => !!this._state().user);

  constructor(private router: Router) {
    // Restore session on app init
    supabase.auth.getSession().then(({ data }) => {
      this._state.set({
        user: data.session?.user ?? null,
        session: data.session ?? null,
        loading: false,
      });
    });

    // Listen to auth state changes (login, logout, token refresh)
    supabase.auth.onAuthStateChange((_event, session) => {
      this._state.update(s => ({
        ...s,
        user: session?.user ?? null,
        session: session ?? null,
        loading: false,
      }));
    });
  }

  async signUp(email: string, password: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  }

  async signIn(email: string, password: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      this.router.navigate(['/dashboard']);
    }
    return { error };
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    this.router.navigate(['/auth']);
  }
}
