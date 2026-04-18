import { Injectable, signal, computed } from '@angular/core';
import {Rule, RuleFolderModel, RulePriority} from '../../shared/models/rule.model';

@Injectable({ providedIn: 'root' })
export class RulesService {
  private _folders = signal<RuleFolderModel[]>([
    {
      id: '1',
      name: 'Risikomanagement',
      icon: 'pi-shield',
      color: '#7c3aed',
      description: 'Regeln zum Schutz meines Kapitals',
      isCollapsed: false,
      createdAt: new Date(),
      rules: [
        {
          id: 'r1', folderId: '1',
          title: 'Maximal 1% Risiko pro Trade',
          description: 'Ich riskiere niemals mehr als 1% meines Gesamtkapitals in einem einzigen Trade.',
          priority: 'critical', createdAt: new Date(), updatedAt: new Date(),
        },
        {
          id: 'r2', folderId: '1',
          title: 'Stop-Loss immer setzen',
          description: 'Kein Trade ohne definierten Stop-Loss. Keine Ausnahmen.',
          priority: 'critical', createdAt: new Date(), updatedAt: new Date(),
        },
        {
          id: 'r3', folderId: '1',
          title: 'Maximal 3 offene Positionen',
          description: 'Nicht mehr als 3 Trades gleichzeitig offen halten.',
          priority: 'high', createdAt: new Date(), updatedAt: new Date(),
        },
      ],
    },
    {
      id: '2',
      name: 'Einstiegsregeln',
      icon: 'pi-chart-bar',
      color: '#2563eb',
      description: 'Kriterien für einen validen Trade-Einstieg',
      isCollapsed: false,
      createdAt: new Date(),
      rules: [
        {
          id: 'r4', folderId: '2',
          title: 'Nur mit dem Trend handeln',
          description: 'Einstiege nur in Trendrichtung auf dem Higher Timeframe.',
          priority: 'high', createdAt: new Date(), updatedAt: new Date(),
        },
        {
          id: 'r5', folderId: '2',
          title: 'Mindest-RRR von 2:1',
          description: 'Kein Trade eingehen, wenn das Risk/Reward-Verhältnis unter 2:1 liegt.',
          priority: 'medium', createdAt: new Date(), updatedAt: new Date(),
        },
      ],
    },
  ]);

  readonly folders       = this._folders.asReadonly();
  readonly totalRules    = computed(() => this._folders().reduce((a, f) => a + f.rules.length, 0));
  readonly criticalRules = computed(() =>
    this._folders().reduce((a, f) => a + f.rules.filter(r => r.priority === 'critical').length, 0)
  );

  // ── Folder ──────────────────────────────────────────────────────
  addFolder(data: Omit<RuleFolderModel, 'id' | 'rules' | 'createdAt' | 'isCollapsed'>): void {
    const folder: RuleFolderModel = {
      ...data, id: crypto.randomUUID(), rules: [], isCollapsed: false, createdAt: new Date(),
    };
    this._folders.update(fs => [...fs, folder]);
  }

  updateFolder(id: string, data: Partial<Pick<RuleFolderModel, 'name' | 'icon' | 'color' | 'description'>>): void {
    this._folders.update(fs => fs.map(f => f.id === id ? { ...f, ...data } : f));
  }

  deleteFolder(id: string): void {
    this._folders.update(fs => fs.filter(f => f.id !== id));
  }

  toggleFolder(id: string): void {
    this._folders.update(fs => fs.map(f => f.id === id ? { ...f, isCollapsed: !f.isCollapsed } : f));
  }

  // ── Rules ────────────────────────────────────────────────────────
  addRule(folderId: string, data: Omit<Rule, 'id' | 'folderId' | 'createdAt' | 'updatedAt'>): void {
    const rule: Rule = {
      ...data, id: crypto.randomUUID(), folderId, createdAt: new Date(), updatedAt: new Date(),
    };
    this._folders.update(fs =>
      fs.map(f => f.id === folderId ? { ...f, rules: this.sortRules([...f.rules, rule]) } : f)
    );
  }

  updateRule(folderId: string, ruleId: string, data: Partial<Pick<Rule, 'title' | 'description' | 'priority'>>): void {
    this._folders.update(fs =>
      fs.map(f => f.id === folderId
        ? { ...f, rules: this.sortRules(f.rules.map(r => r.id === ruleId ? { ...r, ...data, updatedAt: new Date() } : r)) }
        : f
      )
    );
  }

  deleteRule(folderId: string, ruleId: string): void {
    this._folders.update(fs =>
      fs.map(f => f.id === folderId ? { ...f, rules: f.rules.filter(r => r.id !== ruleId) } : f)
    );
  }

  private sortRules(rules: Rule[]): Rule[] {
    const order: Record<RulePriority, number> = { critical: 1, high: 2, medium: 3, low: 4 };
    return [...rules].sort((a, b) => order[a.priority] - order[b.priority]);
  }
}
