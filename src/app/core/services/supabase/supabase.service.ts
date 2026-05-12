// src/app/core/services/supabase.service.ts
//
// WICHTIG: Dies ist der einzige Ort im gesamten Projekt wo createClient() aufgerufen wird.
// Alle anderen Services und Components importieren diesen Service — nie direkt @supabase/supabase-js.
//
// Grund: Supabase verwaltet intern Session-State und Websocket-Verbindungen.
// Mehrere Client-Instanzen führen zu Race Conditions bei Token-Refresh.

import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root', // Singleton — eine Instanz für die gesamte App
})
export class SupabaseService {
  readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabase.url,
      environment.supabase.anonKey,
      {
        auth: {
          // Supabase persistiert die Session automatisch in localStorage.
          // Session-Refresh läuft automatisch im Hintergrund.
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true, // Für Magic Link / OAuth Callbacks
        },
      }
    );
  }
}
