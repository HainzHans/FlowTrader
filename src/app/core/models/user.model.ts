// src/app/core/models/user.model.ts
// Typen die im gesamten Projekt für Auth-State verwendet werden

import type { User, Session } from '@supabase/supabase-js';

/** Supabase User — direkt re-exportiert für einfachen Import überall */
export type { User, Session };

/**
 * Erweiterung des Auth-Users um unsere public.users-Tabelle.
 * Wird nach dem Login aus der DB geladen.
 */
export interface UserProfile {
  id: string;           // = auth.users.id
  email: string;
  display_name: string | null;
  timezone: string;     // z.B. 'Europe/Berlin' — wichtig für Session-Erkennung
  currency: string;     // z.B. 'EUR'
  created_at: string;
  updated_at: string;
}

/** Auth-State den die App kennt */
export type AuthState =
  | { status: 'loading' }
  | { status: 'authenticated'; user: User; profile: UserProfile | null }
  | { status: 'unauthenticated' };
