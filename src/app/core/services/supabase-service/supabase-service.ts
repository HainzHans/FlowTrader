import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/env';
import {Trade} from '../../../shared/models/trade.model';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  // ── Trades ────────────────────────────────────────────────

  /** Fetch all trades for the current user, sorted newest first */
  async getAllTrades(): Promise<Trade[]> {
    const { data, error } = await this.supabase
      .from('atas_trades')
      .select('*')
      .order('entry_time', { ascending: false });

    if (error) {
      console.error('[SupabaseService] getAllTrades:', error.message);
      return [];
    }
    return (data ?? []) as Trade[];
  }

  /** Fetch trades filtered by account */
  async getTradesByAccount(accountId: string): Promise<Trade[]> {
    const { data, error } = await this.supabase
      .from('atas_trades')
      .select('*')
      .eq('account_id', accountId)
      .order('entry_time', { ascending: false });

    if (error) {
      console.error('[SupabaseService] getTradesByAccount:', error.message);
      return [];
    }
    return (data ?? []) as Trade[];
  }

  /** Fetch trades filtered by symbol */
  async getTradesBySymbol(symbol: string): Promise<Trade[]> {
    const { data, error } = await this.supabase
      .from('atas_trades')
      .select('*')
      .eq('symbol', symbol)
      .order('entry_time', { ascending: false });

    if (error) {
      console.error('[SupabaseService] getTradesBySymbol:', error.message);
      return [];
    }
    return (data ?? []) as Trade[];
  }

  /** Fetch distinct account IDs available for the user */
  async getAccounts(): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('atas_trades')
      .select('account_id');

    if (error) {
      console.error('[SupabaseService] getAccounts:', error.message);
      return [];
    }

    const ids = (data ?? []).map((r: { account_id: string }) => r.account_id);
    return [...new Set(ids)];
  }

  /** Delete a trade by id */
  async deleteTrade(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('atas_trades')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[SupabaseService] deleteTrade:', error.message);
      return false;
    }
    return true;
  }
}
