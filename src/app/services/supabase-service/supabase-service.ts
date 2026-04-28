import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {environment} from '../../../enviroments/env';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    // Initialisiert die Verbindung zu deinem Supabase-Projekt
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // Methode zum Abrufen der Daten
  async getDaten() {
    // Ersetze 'deine_tabellen_name' mit dem echten Namen deiner Tabelle
    const { data, error } = await this.supabase
      .from('atas_trades')
      .select('*');

    if (error) {
      console.error('Fehler beim Laden der Daten aus Supabase:', error.message);
      return [];
    }

    return data;
  }
}
