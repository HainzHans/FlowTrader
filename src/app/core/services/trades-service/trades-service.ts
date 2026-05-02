import { Injectable } from '@angular/core';
import { supabase } from '../../supabase.client';
import { UserTrade } from '../../../shared/models/trade.model';

@Injectable({ providedIn: 'root' })
export class TradesService {

  /**
   * Alle Trades des eingeloggten Nutzers laden, neueste zuerst.
   */
  async getAll(): Promise<{ data: UserTrade[]; error: string | null }> {
    const { data, error } = await supabase
      .from('user_trades')
      .select('*')
      .order('entry_time', { ascending: false });

    if (error) {
      console.error('[TradesService] getAll:', error.message);
      return { data: [], error: error.message };
    }
    return { data: (data ?? []) as UserTrade[], error: null };
  }

  /**
   * Trades nach Konto filtern.
   */
  async getByAccount(accountId: string): Promise<{ data: UserTrade[]; error: string | null }> {
    const { data, error } = await supabase
      .from('user_trades')
      .select('*')
      .eq('account_id', accountId)
      .order('entry_time', { ascending: false });

    if (error) {
      console.error('[TradesService] getByAccount:', error.message);
      return { data: [], error: error.message };
    }
    return { data: (data ?? []) as UserTrade[], error: null };
  }

  /**
   * Trades nach Symbol filtern.
   */
  async getBySymbol(symbol: string): Promise<{ data: UserTrade[]; error: string | null }> {
    const { data, error } = await supabase
      .from('user_trades')
      .select('*')
      .eq('symbol', symbol)
      .order('entry_time', { ascending: false });

    if (error) {
      console.error('[TradesService] getBySymbol:', error.message);
      return { data: [], error: error.message };
    }
    return { data: (data ?? []) as UserTrade[], error: null };
  }

  /**
   * Einzelnen Trade per ID laden.
   */
  async getById(id: string): Promise<{ data: UserTrade | null; error: string | null }> {
    const { data, error } = await supabase
      .from('user_trades')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[TradesService] getById:', error.message);
      return { data: null, error: error.message };
    }
    return { data: data as UserTrade, error: null };
  }

  /**
   * Neuen Trade anlegen.
   */
  async create(trade: Omit<UserTrade, 'id' | 'created_at'>): Promise<{ data: UserTrade | null; error: string | null }> {
    const { data, error } = await supabase
      .from('user_trades')
      .insert(trade)
      .select()
      .single();

    if (error) {
      console.error('[TradesService] create:', error.message);
      return { data: null, error: error.message };
    }
    return { data: data as UserTrade, error: null };
  }

  /**
   * Bestehenden Trade aktualisieren.
   */
  async update(id: string, patch: Partial<UserTrade>): Promise<{ error: string | null }> {
    const { error } = await supabase
      .from('user_trades')
      .update(patch)
      .eq('id', id);

    if (error) {
      console.error('[TradesService] update:', error.message);
      return { error: error.message };
    }
    return { error: null };
  }

  /**
   * Trade löschen.
   */
  async delete(id: string): Promise<{ error: string | null }> {
    const { error } = await supabase
      .from('user_trades')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[TradesService] delete:', error.message);
      return { error: error.message };
    }
    return { error: null };
  }

  /**
   * Alle eindeutigen Account-IDs des Nutzers liefern.
   */
  async getAccountIds(): Promise<string[]> {
    const { data, error } = await supabase
      .from('user_trades')
      .select('account_id');

    if (error) {
      console.error('[TradesService] getAccountIds:', error.message);
      return [];
    }
    const ids = (data ?? []).map((r: { account_id: string }) => r.account_id);
    return [...new Set(ids)];
  }
}
