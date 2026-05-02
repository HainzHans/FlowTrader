import { Injectable } from '@angular/core';
import { supabase } from '../../supabase.client';
import { Account } from '../../../features/dashboard/sections/accounts-section/accounts-section';

@Injectable({ providedIn: 'root' })
export class AccountsService {

  /**
   * Alle Konten des Nutzers laden, neueste zuerst.
   */
  async getAll(): Promise<{ data: Account[]; error: string | null }> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[AccountsService] getAll:', error.message);
      return { data: [], error: error.message };
    }
    return { data: (data ?? []) as Account[], error: null };
  }

  /**
   * Einzelnes Konto per ID laden.
   */
  async getById(id: string): Promise<{ data: Account | null; error: string | null }> {
    const { data, error } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[AccountsService] getById:', error.message);
      return { data: null, error: error.message };
    }
    return { data: data as Account, error: null };
  }

  /**
   * Neues Konto anlegen.
   */
  async create(
    userId: string,
    payload: Pick<Account, 'name' | 'broker' | 'type' | 'currency' | 'startBalance' | 'color'>
  ): Promise<{ data: Account | null; error: string | null }> {
    const now = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from('accounts')
      .insert({
        user_id:        userId,
        name:           payload.name,
        broker:         payload.broker,
        type:           payload.type,
        currency:       payload.currency,
        start_balance:  payload.startBalance,
        current_balance: payload.startBalance,
        color:          payload.color,
        created_at:     now,
      })
      .select()
      .single();

    if (error) {
      console.error('[AccountsService] create:', error.message);
      return { data: null, error: error.message };
    }
    return { data: data as Account, error: null };
  }

  /**
   * Bestehendes Konto aktualisieren.
   */
  async update(
    id: string,
    patch: Partial<Pick<Account, 'name' | 'broker' | 'type' | 'currency' | 'startBalance' | 'currentBalance' | 'color'>>
  ): Promise<{ error: string | null }> {
    // Felder auf snake_case mappen wie in der DB
    const dbPatch: Record<string, unknown> = {};
    if (patch.name            !== undefined) dbPatch['name']            = patch.name;
    if (patch.broker          !== undefined) dbPatch['broker']          = patch.broker;
    if (patch.type            !== undefined) dbPatch['type']            = patch.type;
    if (patch.currency        !== undefined) dbPatch['currency']        = patch.currency;
    if (patch.startBalance    !== undefined) dbPatch['start_balance']   = patch.startBalance;
    if (patch.currentBalance  !== undefined) dbPatch['current_balance'] = patch.currentBalance;
    if (patch.color           !== undefined) dbPatch['color']           = patch.color;

    const { error } = await supabase
      .from('accounts')
      .update(dbPatch)
      .eq('id', id);

    if (error) {
      console.error('[AccountsService] update:', error.message);
      return { error: error.message };
    }
    return { error: null };
  }

  /**
   * Konto löschen.
   */
  async delete(id: string): Promise<{ error: string | null }> {
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[AccountsService] delete:', error.message);
      return { error: error.message };
    }
    return { error: null };
  }
}
