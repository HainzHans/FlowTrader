import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../../supabase.client';

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

  readonly user      = computed(() => this._state().user);
  readonly session   = computed(() => this._state().session);
  readonly loading   = computed(() => this._state().loading);
  readonly isLoggedIn = computed(() => !!this._state().user);

  // Observable that emits only once loading is done
  readonly isLoggedIn$ = toObservable(this._state).pipe(
    filter(s => !s.loading),
    map(s => !!s.user),
    take(1),
  );

  constructor(private router: Router) {
    supabase.auth.getSession().then(({ data }) => {
      this._state.set({
        user: data.session?.user ?? null,
        session: data.session ?? null,
        loading: false,
      });
    });

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
      await this.router.navigate(['/dashboard']);
    }
    return { error };
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
    await this.router.navigate(['/auth']);
  }
}
