import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SectionHeader } from '../../components/section-header/section-header';
import { supabase } from '../../../../core/supabase.client';

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// ─── Domain Types ───────────────────────────────────────────────────────────

export interface Setup {
  id: string;
  user_id: string;
  name: string;
  description: string;
  tags: string[];
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Rule {
  id: string;
  user_id: string;
  setup_id: string | null; // null = global rule
  title: string;
  description: string;
  category: 'entry' | 'exit' | 'risk' | 'mindset' | 'general';
  active: boolean;
  created_at: string;
  updated_at: string;
}

export type CategoryMeta = {
  value: Rule['category'];
  label: string;
  icon: string;
  color: string;
};

type ModalMode = 'none' | 'setup' | 'rule' | 'deleteSetup' | 'deleteRule';
type MainTab   = 'setups' | 'global-rules';

// ─── Component ──────────────────────────────────────────────────────────────

@Component({
  selector: 'app-setups-section',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionHeader],
  templateUrl: './setups-section.html',
  styleUrl:    './setups-section.css',
})
export class SetupsSection implements OnInit {

  // ── Data ──────────────────────────────────────────────────────────────────
  setups      = signal<Setup[]>([]);
  rules       = signal<Rule[]>([]);
  loading     = signal(true);
  saving      = signal(false);
  error       = signal('');

  // ── UI State ──────────────────────────────────────────────────────────────
  mainTab         = signal<MainTab>('setups');
  expandedSetupId = signal<string | null>(null);
  modalMode       = signal<ModalMode>('none');
  pendingDeleteId = signal<string>('');

  // ── Form – Setup ──────────────────────────────────────────────────────────
  editingSetup = signal<Setup | null>(null);
  setupForm    = signal({ name: '', description: '', tags: '', color: '#7c3aed' });

  // ── Form – Rule ───────────────────────────────────────────────────────────
  editingRule  = signal<Rule | null>(null);
  ruleForm     = signal({
    title:       '',
    description: '',
    category:    'general' as Rule['category'],
    setup_id:    null as string | null,   // null = global
  });

  // ── Static Config ─────────────────────────────────────────────────────────
  readonly categories: CategoryMeta[] = [
    { value: 'entry',   label: 'Einstieg',  icon: 'pi-sign-in',  color: '#22c55e' },
    { value: 'exit',    label: 'Ausstieg',  icon: 'pi-sign-out', color: '#ef4444' },
    { value: 'risk',    label: 'Risiko',    icon: 'pi-shield',   color: '#f59e0b' },
    { value: 'mindset', label: 'Mindset',   icon: 'pi-brain',    color: '#8b5cf6' },
    { value: 'general', label: 'Allgemein', icon: 'pi-list',     color: '#64748b' },
  ];

  readonly setupColors = [
    '#7c3aed','#22c55e','#ef4444','#f59e0b',
    '#3b82f6','#ec4899','#14b8a6','#f97316',
  ];

  // ── Computed ──────────────────────────────────────────────────────────────
  globalRules = computed(() => this.rules().filter(r => r.setup_id === null));

  rulesForSetup(setupId: string): Rule[] {
    return this.rules().filter(r => r.setup_id === setupId);
  }

  activeGlobalCount = computed(() => this.globalRules().filter(r => r.active).length);

  getCategoryMeta(cat: Rule['category']): CategoryMeta {
    return this.categories.find(c => c.value === cat) ?? this.categories[4];
  }

  getSetupById(id: string): Setup | undefined {
    return this.setups().find(s => s.id === id);
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  async ngOnInit() {
    await this.loadAll();
  }

  private async loadAll() {
    this.loading.set(true);
    this.error.set('');

    const [{ data: setupData, error: se }, { data: ruleData, error: re }] = await Promise.all([
      supabase.from('setups').select('*').order('created_at', { ascending: false }),
      supabase.from('rules').select('*').order('created_at',  { ascending: false }),
    ]);

    if (se || re) {
      this.error.set('Fehler beim Laden der Daten: ' + (se?.message ?? re?.message));
    } else {
      this.setups.set((setupData ?? []) as Setup[]);
      this.rules.set((ruleData  ?? []) as Rule[]);
    }

    this.loading.set(false);
  }

  // ── Setup CRUD ────────────────────────────────────────────────────────────

  openNewSetup() {
    this.editingSetup.set(null);
    this.setupForm.set({ name: '', description: '', tags: '', color: '#7c3aed' });
    this.modalMode.set('setup');
  }

  openEditSetup(s: Setup, event: Event) {
    event.stopPropagation();
    this.editingSetup.set(s);
    this.setupForm.set({
      name:        s.name,
      description: s.description,
      tags:        s.tags.join(', '),
      color:       s.color,
    });
    this.modalMode.set('setup');
  }

  async saveSetup() {
    const f = this.setupForm();
    if (!f.name.trim()) return;

    this.saving.set(true);
    const tags  = f.tags.split(',').map(t => t.trim()).filter(Boolean);
    const editing = this.editingSetup();

    if (editing) {
      const { error } = await supabase
        .from('setups')
        .update({ name: f.name.trim(), description: f.description.trim(), tags, color: f.color })
        .eq('id', editing.id);

      if (!error) {
        this.setups.update(list =>
          list.map(s => s.id === editing.id
            ? { ...s, name: f.name.trim(), description: f.description.trim(), tags, color: f.color }
            : s));
      }
    } else {
      const userId = await getCurrentUserId();
      if (!userId) { this.saving.set(false); return; }

      const { data, error } = await supabase
        .from('setups')
        .insert({ user_id: userId, name: f.name.trim(), description: f.description.trim(), tags, color: f.color })
        .select()
        .single();

      if (!error && data) {
        this.setups.update(list => [data as Setup, ...list]);
      }
    }

    this.saving.set(false);
    this.modalMode.set('none');
  }

  confirmDeleteSetup(id: string, event: Event) {
    event.stopPropagation();
    this.pendingDeleteId.set(id);
    this.modalMode.set('deleteSetup');
  }

  async deleteSetup() {
    const id = this.pendingDeleteId();
    const { error } = await supabase.from('setups').delete().eq('id', id);
    if (!error) {
      this.setups.update(list => list.filter(s => s.id !== id));
      // Rules are cascade-deleted by DB; remove locally too
      this.rules.update(list => list.filter(r => r.setup_id !== id));
      if (this.expandedSetupId() === id) this.expandedSetupId.set(null);
    }
    this.modalMode.set('none');
  }

  toggleSetupExpand(id: string) {
    this.expandedSetupId.update(v => v === id ? null : id);
  }

  // ── Rule CRUD ─────────────────────────────────────────────────────────────

  openNewRule(setupId: string | null = null) {
    this.editingRule.set(null);
    this.ruleForm.set({ title: '', description: '', category: 'general', setup_id: setupId });
    this.modalMode.set('rule');
  }

  openEditRule(r: Rule, event: Event) {
    event.stopPropagation();
    this.editingRule.set(r);
    this.ruleForm.set({
      title:       r.title,
      description: r.description,
      category:    r.category,
      setup_id:    r.setup_id,
    });
    this.modalMode.set('rule');
  }

  async saveRule() {
    const f = this.ruleForm();
    if (!f.title.trim()) return;

    this.saving.set(true);
    const editing = this.editingRule();

    if (editing) {
      const { error } = await supabase
        .from('rules')
        .update({
          title:       f.title.trim(),
          description: f.description.trim(),
          category:    f.category,
          setup_id:    f.setup_id,
        })
        .eq('id', editing.id);

      if (!error) {
        this.rules.update(list =>
          list.map(r => r.id === editing.id
            ? { ...r, title: f.title.trim(), description: f.description.trim(), category: f.category, setup_id: f.setup_id }
            : r));
      }
    } else {
      const userId = await getCurrentUserId();
      if (!userId) { this.saving.set(false); return; }

      const { data, error } = await supabase
        .from('rules')
        .insert({
          user_id:     userId,
          title:       f.title.trim(),
          description: f.description.trim(),
          category:    f.category,
          setup_id:    f.setup_id,
          active:      true,
        })
        .select()
        .single();

      if (!error && data) {
        this.rules.update(list => [data as Rule, ...list]);
      }
    }

    this.saving.set(false);
    this.modalMode.set('none');
  }

  confirmDeleteRule(id: string, event: Event) {
    event.stopPropagation();
    this.pendingDeleteId.set(id);
    this.modalMode.set('deleteRule');
  }

  async deleteRule() {
    const id = this.pendingDeleteId();
    const { error } = await supabase.from('rules').delete().eq('id', id);
    if (!error) {
      this.rules.update(list => list.filter(r => r.id !== id));
    }
    this.modalMode.set('none');
  }

  async toggleRule(id: string) {
    const rule = this.rules().find(r => r.id === id);
    if (!rule) return;
    const newActive = !rule.active;

    const { error } = await supabase
      .from('rules')
      .update({ active: newActive })
      .eq('id', id);

    if (!error) {
      this.rules.update(list =>
        list.map(r => r.id === id ? { ...r, active: newActive } : r));
    }
  }

  // ── Form Helpers ──────────────────────────────────────────────────────────
  closeModal() { this.modalMode.set('none'); }

  updateSetupForm(patch: Partial<{ name: string; description: string; tags: string; color: string }>) {
    this.setupForm.update(f => ({ ...f, ...patch }));
  }

  updateRuleForm(patch: Partial<{ title: string; description: string; category: Rule['category']; setup_id: string | null }>) {
    this.ruleForm.update(f => ({ ...f, ...patch }));
  }

  getRuleModalTitle(): string {
    const isGlobal = this.ruleForm().setup_id === null;
    const isEdit   = !!this.editingRule();
    if (isEdit)   return 'Regel bearbeiten';
    if (isGlobal) return 'Globale Regel erstellen';
    const setup = this.getSetupById(this.ruleForm().setup_id!);
    return `Regel für „${setup?.name ?? '...'}" erstellen`;
  }
}
