import { Injectable } from '@angular/core';
import { supabase } from '../../supabase.client';
import { Setup, Rule } from '../../../features/dashboard/sections/setups-section/setups-section';

@Injectable({ providedIn: 'root' })
export class SetupsService {

  // ─── Setups ────────────────────────────────────────────────────────────────

  /**
   * Alle Setups des Nutzers laden, neueste zuerst.
   */
  async getAllSetups(): Promise<{ data: Setup[]; error: string | null }> {
    const { data, error } = await supabase
      .from('setups')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SetupsService] getAllSetups:', error.message);
      return { data: [], error: error.message };
    }
    return { data: (data ?? []) as Setup[], error: null };
  }

  /**
   * Einzelnes Setup per ID laden.
   */
  async getSetupById(id: string): Promise<{ data: Setup | null; error: string | null }> {
    const { data, error } = await supabase
      .from('setups')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[SetupsService] getSetupById:', error.message);
      return { data: null, error: error.message };
    }
    return { data: data as Setup, error: null };
  }

  /**
   * Neues Setup anlegen.
   */
  async createSetup(
    userId: string,
    payload: Pick<Setup, 'name' | 'description' | 'tags' | 'color'>
  ): Promise<{ data: Setup | null; error: string | null }> {
    const { data, error } = await supabase
      .from('setups')
      .insert({ user_id: userId, ...payload })
      .select()
      .single();

    if (error) {
      console.error('[SetupsService] createSetup:', error.message);
      return { data: null, error: error.message };
    }
    return { data: data as Setup, error: null };
  }

  /**
   * Bestehendes Setup aktualisieren.
   */
  async updateSetup(
    id: string,
    patch: Partial<Pick<Setup, 'name' | 'description' | 'tags' | 'color'>>
  ): Promise<{ error: string | null }> {
    const { error } = await supabase
      .from('setups')
      .update(patch)
      .eq('id', id);

    if (error) {
      console.error('[SetupsService] updateSetup:', error.message);
      return { error: error.message };
    }
    return { error: null };
  }

  /**
   * Setup löschen (Rules werden per DB-Cascade mitgelöscht).
   */
  async deleteSetup(id: string): Promise<{ error: string | null }> {
    const { error } = await supabase
      .from('setups')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[SetupsService] deleteSetup:', error.message);
      return { error: error.message };
    }
    return { error: null };
  }

  // ─── Rules ─────────────────────────────────────────────────────────────────

  /**
   * Alle Rules des Nutzers laden (setup-spezifisch + global), neueste zuerst.
   */
  async getAllRules(): Promise<{ data: Rule[]; error: string | null }> {
    const { data, error } = await supabase
      .from('rules')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SetupsService] getAllRules:', error.message);
      return { data: [], error: error.message };
    }
    return { data: (data ?? []) as Rule[], error: null };
  }

  /**
   * Alle Rules für ein bestimmtes Setup laden.
   */
  async getRulesBySetup(setupId: string): Promise<{ data: Rule[]; error: string | null }> {
    const { data, error } = await supabase
      .from('rules')
      .select('*')
      .eq('setup_id', setupId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SetupsService] getRulesBySetup:', error.message);
      return { data: [], error: error.message };
    }
    return { data: (data ?? []) as Rule[], error: null };
  }

  /**
   * Alle globalen Rules laden (setup_id IS NULL).
   */
  async getGlobalRules(): Promise<{ data: Rule[]; error: string | null }> {
    const { data, error } = await supabase
      .from('rules')
      .select('*')
      .is('setup_id', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SetupsService] getGlobalRules:', error.message);
      return { data: [], error: error.message };
    }
    return { data: (data ?? []) as Rule[], error: null };
  }

  /**
   * Neue Rule anlegen.
   */
  async createRule(
    userId: string,
    payload: Pick<Rule, 'title' | 'description' | 'category' | 'setup_id'>
  ): Promise<{ data: Rule | null; error: string | null }> {
    const { data, error } = await supabase
      .from('rules')
      .insert({ user_id: userId, ...payload, active: true })
      .select()
      .single();

    if (error) {
      console.error('[SetupsService] createRule:', error.message);
      return { data: null, error: error.message };
    }
    return { data: data as Rule, error: null };
  }

  /**
   * Bestehende Rule aktualisieren.
   */
  async updateRule(
    id: string,
    patch: Partial<Pick<Rule, 'title' | 'description' | 'category' | 'setup_id' | 'active'>>
  ): Promise<{ error: string | null }> {
    const { error } = await supabase
      .from('rules')
      .update(patch)
      .eq('id', id);

    if (error) {
      console.error('[SetupsService] updateRule:', error.message);
      return { error: error.message };
    }
    return { error: null };
  }

  /**
   * Active-Status einer Rule toggeln.
   */
  async toggleRuleActive(id: string, currentActive: boolean): Promise<{ error: string | null }> {
    return this.updateRule(id, { active: !currentActive });
  }

  /**
   * Rule löschen.
   */
  async deleteRule(id: string): Promise<{ error: string | null }> {
    const { error } = await supabase
      .from('rules')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[SetupsService] deleteRule:', error.message);
      return { error: error.message };
    }
    return { error: null };
  }

  // ─── Convenience: Setups + Rules in einem Call ─────────────────────────────

  /**
   * Alle Setups und alle Rules parallel laden.
   */
  async loadAll(): Promise<{
    setups: Setup[];
    rules:  Rule[];
    error:  string | null;
  }> {
    const [setupResult, ruleResult] = await Promise.all([
      this.getAllSetups(),
      this.getAllRules(),
    ]);

    if (setupResult.error || ruleResult.error) {
      return {
        setups: [],
        rules:  [],
        error:  setupResult.error ?? ruleResult.error,
      };
    }

    return {
      setups: setupResult.data,
      rules:  ruleResult.data,
      error:  null,
    };
  }
}
