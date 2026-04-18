import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RuleItem} from '../../rule-item/rule-item';
import {RuleCreateModal, RuleFormData} from '../../rule-create-modal/rule-create-modal';
import {EmptyState} from '../../empty-state/empty-state';
import {Rule, RuleFolderModel} from '../../../models/rule.model';

@Component({
  selector: 'app-rule-folder',
  standalone: true,
  imports: [CommonModule, RuleItem, RuleCreateModal, EmptyState],
  templateUrl: './rule-folder.html',
  styleUrl: './rule-folder.css',
})
export class RuleFolderComponent {
  folder = input.required<RuleFolderModel>();

  onToggle       = output<string>();
  onAddRule      = output<{ folderId: string; data: RuleFormData }>();
  onEditRule     = output<{ folderId: string; ruleId: string; data: RuleFormData }>();
  onDeleteRule   = output<{ folderId: string; ruleId: string }>();
  onEditFolder   = output<string>();
  onDeleteFolder = output<string>();

  addModalOpen = signal(false);
  editingRule  = signal<Rule | null>(null);
  menuOpen     = signal(false);

  get criticalCount(): number {
    return this.folder().rules.filter(r => r.priority === 'critical').length;
  }

  toggleFolder(): void {
    this.onToggle.emit(this.folder().id);
  }

  openAddModal(): void {
    this.addModalOpen.set(true);
  }

  handleEditRule(rule: Rule): void {
    this.editingRule.set(rule);
  }

  handleDeleteRule(ruleId: string): void {
    this.onDeleteRule.emit({ folderId: this.folder().id, ruleId });
  }

  handleSaveRule(data: RuleFormData): void {
    const editRule = this.editingRule();
    if (editRule) {
      this.onEditRule.emit({ folderId: this.folder().id, ruleId: editRule.id, data });
      this.editingRule.set(null);
    } else {
      this.onAddRule.emit({ folderId: this.folder().id, data });
      this.addModalOpen.set(false);
    }
  }

  handleCancelModal(): void {
    this.addModalOpen.set(false);
    this.editingRule.set(null);
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  editFolder(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen.set(false);
    this.onEditFolder.emit(this.folder().id);
  }

  deleteFolder(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen.set(false);
    this.onDeleteFolder.emit(this.folder().id);
  }
}
