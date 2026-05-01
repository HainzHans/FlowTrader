import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {SectionHeader} from '../../components/section-header/section-header';

export interface Setup {
  id: string;
  name: string;
  description: string;
  tags: string[];
  color: string;
  createdAt: string;
}

export interface Rule {
  id: string;
  title: string;
  description: string;
  category: 'entry' | 'exit' | 'risk' | 'mindset' | 'general';
  setups: string[]; // Setup IDs
  active: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-setups-section',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionHeader],
  templateUrl: './setups-section.html',
  styleUrl: './setups-section.css',
})
export class SetupsSection {
  activeTab = signal<'rules' | 'setups'>('setups');

  // ── Setups ──
  setups = signal<Setup[]>([
    {
      id: 's1',
      name: 'Liquiditätszone',
      description: 'Trade an bekannten Liquiditätszonen nach Sweep',
      tags: ['SMC', 'Institutional'],
      color: '#7c3aed',
      createdAt: '2025-04-01',
    },
    {
      id: 's2',
      name: 'Pullback im Trend',
      description: 'Einstieg bei Rücksetzern in etablierten Trends',
      tags: ['Trend', 'Momentum'],
      color: '#22c55e',
      createdAt: '2025-04-03',
    },
  ]);

  showSetupModal = signal(false);
  editingSetup = signal<Setup | null>(null);
  setupForm = signal({ name: '', description: '', tags: '', color: '#7c3aed' });

  setupColors = ['#7c3aed', '#22c55e', '#ef4444', '#f59e0b', '#3b82f6', '#ec4899', '#14b8a6'];

  // ── Rules ──
  rules = signal<Rule[]>([
    {
      id: 'r1',
      title: 'Mindestens 1:2 R:R',
      description: 'Kein Trade ohne mindestens 1:2 Risiko-Ertrags-Verhältnis eingehen.',
      category: 'risk',
      setups: ['s1', 's2'],
      active: true,
      createdAt: '2025-04-01',
    },
    {
      id: 'r2',
      title: 'Nicht gegen den Trend traden',
      description: 'Im H4 muss der Trend klar erkennbar sein, bevor ein Einstieg erfolgt.',
      category: 'entry',
      setups: ['s2'],
      active: true,
      createdAt: '2025-04-02',
    },
    {
      id: 'r3',
      title: 'Kein Revenge Trading',
      description: 'Nach einem Verlust mindestens 30 Minuten Pause einlegen.',
      category: 'mindset',
      setups: [],
      active: false,
      createdAt: '2025-04-05',
    },
  ]);

  showRuleModal = signal(false);
  editingRule = signal<Rule | null>(null);
  ruleForm = signal({
    title: '',
    description: '',
    category: 'general' as Rule['category'],
    setups: [] as string[],
  });

  categories: { value: Rule['category']; label: string; icon: string; color: string }[] = [
    { value: 'entry',   label: 'Einstieg',  icon: 'pi-sign-in',         color: '#22c55e' },
    { value: 'exit',    label: 'Ausstieg',  icon: 'pi-sign-out',        color: '#ef4444' },
    { value: 'risk',    label: 'Risiko',    icon: 'pi-shield',          color: '#f59e0b' },
    { value: 'mindset', label: 'Mindset',   icon: 'pi-brain',           color: '#8b5cf6' },
    { value: 'general', label: 'Allgemein', icon: 'pi-list',            color: '#64748b' },
  ];

  getCategoryMeta(cat: Rule['category']) {
    return this.categories.find(c => c.value === cat)!;
  }

  getSetupById(id: string) {
    return this.setups().find(s => s.id === id);
  }

  getSetupName(id: string) {
    return this.setups().find(s => s.id === id)?.name ?? id;
  }

  activeRulesCount = computed(() => this.rules().filter(r => r.active).length);

  // ── Setup CRUD ──
  openNewSetup() {
    this.editingSetup.set(null);
    this.setupForm.set({ name: '', description: '', tags: '', color: '#7c3aed' });
    this.showSetupModal.set(true);
  }

  openEditSetup(s: Setup) {
    this.editingSetup.set(s);
    this.setupForm.set({ name: s.name, description: s.description, tags: s.tags.join(', '), color: s.color });
    this.showSetupModal.set(true);
  }

  saveSetup() {
    const f = this.setupForm();
    if (!f.name.trim()) return;
    const tags = f.tags.split(',').map(t => t.trim()).filter(Boolean);
    const editing = this.editingSetup();
    if (editing) {
      this.setups.update(list => list.map(s => s.id === editing.id
        ? { ...s, name: f.name, description: f.description, tags, color: f.color }
        : s));
    } else {
      const newSetup: Setup = {
        id: 's' + Date.now(),
        name: f.name,
        description: f.description,
        tags,
        color: f.color,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      this.setups.update(list => [...list, newSetup]);
    }
    this.showSetupModal.set(false);
  }

  deleteSetup(id: string) {
    this.setups.update(list => list.filter(s => s.id !== id));
    this.rules.update(list => list.map(r => ({ ...r, setups: r.setups.filter(sid => sid !== id) })));
  }

  // ── Rule CRUD ──
  openNewRule() {
    this.editingRule.set(null);
    this.ruleForm.set({ title: '', description: '', category: 'general', setups: [] });
    this.showRuleModal.set(true);
  }

  openEditRule(r: Rule) {
    this.editingRule.set(r);
    this.ruleForm.set({ title: r.title, description: r.description, category: r.category, setups: [...r.setups] });
    this.showRuleModal.set(true);
  }

  saveRule() {
    const f = this.ruleForm();
    if (!f.title.trim()) return;
    const editing = this.editingRule();
    if (editing) {
      this.rules.update(list => list.map(r => r.id === editing.id
        ? { ...r, title: f.title, description: f.description, category: f.category, setups: f.setups }
        : r));
    } else {
      const newRule: Rule = {
        id: 'r' + Date.now(),
        title: f.title,
        description: f.description,
        category: f.category,
        setups: f.setups,
        active: true,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      this.rules.update(list => [...list, newRule]);
    }
    this.showRuleModal.set(false);
  }

  deleteRule(id: string) {
    this.rules.update(list => list.filter(r => r.id !== id));
  }

  toggleRule(id: string) {
    this.rules.update(list => list.map(r => r.id === id ? { ...r, active: !r.active } : r));
  }

  toggleSetupInRule(setupId: string) {
    const current = this.ruleForm().setups;
    const next = current.includes(setupId)
      ? current.filter(id => id !== setupId)
      : [...current, setupId];
    this.ruleForm.update(f => ({ ...f, setups: next }));
  }

  isSetupSelected(setupId: string) {
    return this.ruleForm().setups.includes(setupId);
  }


  // Helper
  rulerFilter() {
    return this.rules().filter(r => r.setups.includes(r.id)).length
  }

  ruleUpdateTitle(event: any) {
    this.ruleForm.update(f => ({...f, title: event}))
  }

  ruleUpdateDesc(event: any) {
    this.ruleForm.update(f => ({...f, description: event}))
  }

  ruleUpdateCategory(value: any) {
    this.ruleForm.update(f => ({...f, category: value}))
  }

  setupUpdateName(event: any){
    this.setupForm.update(f => ({...f, name: event}))
  }

  setupUpdateDesc(event: any){
    this.setupForm.update(f => ({...f, description: event}))
  }

  setupUpdateTags(event: any){
    this.setupForm.update(f => ({...f, tags: event}))
  }

  setupUpdateColor(color: any){
    this.setupForm.update(f => ({...f, color: color}))
  }

}
