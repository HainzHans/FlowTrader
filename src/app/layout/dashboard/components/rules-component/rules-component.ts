import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FolderFormData, RuleFolderModal} from '../../../../shared/components/rule-folder-modal/rule-folder-modal';
import {RuleFolderComponent} from '../../../../shared/components/cards/rule-folder/rule-folder';
import {EmptyState} from '../../../../shared/components/empty-state/empty-state';
import {RulesService} from '../../../../services/rules-service/rules-service';
import {PRIORITY_CONFIG, RuleFolderModel} from '../../../../shared/models/rule.model';
import {RuleFormData} from '../../../../shared/components/rule-create-modal/rule-create-modal';

@Component({
  selector: 'app-rules-component',
  standalone: true,
  imports: [CommonModule, RuleFolderComponent, RuleFolderModal, EmptyState],
  templateUrl: './rules-component.html',
  styleUrl: './rules-component.css',
})
export class RulesComponent {
  private rulesService = inject(RulesService);

  readonly folders       = this.rulesService.folders;
  readonly totalRules    = this.rulesService.totalRules;
  readonly criticalRules = this.rulesService.criticalRules;

  folderModalOpen = signal(false);
  editingFolder   = signal<RuleFolderModel | null>(null);

  readonly priorityConfig = PRIORITY_CONFIG;

  readonly prioritySummary = computed(() => {
    const all = this.folders().flatMap(f => f.rules);
    return {
      critical: all.filter(r => r.priority === 'critical').length,
      high:     all.filter(r => r.priority === 'high').length,
      medium:   all.filter(r => r.priority === 'medium').length,
      low:      all.filter(r => r.priority === 'low').length,
    };
  });

  // ── Folder actions ───────────────────────────────────────────────
  openFolderModal(): void {
    this.editingFolder.set(null);
    this.folderModalOpen.set(true);
  }

  handleEditFolder(folderId: string): void {
    const folder = this.folders().find(f => f.id === folderId) ?? null;
    this.editingFolder.set(folder);
    this.folderModalOpen.set(true);
  }

  handleSaveFolder(data: FolderFormData): void {
    const editing = this.editingFolder();
    if (editing) {
      this.rulesService.updateFolder(editing.id, data);
    } else {
      this.rulesService.addFolder(data);
    }
    this.folderModalOpen.set(false);
    this.editingFolder.set(null);
  }

  handleCancelFolder(): void {
    this.folderModalOpen.set(false);
    this.editingFolder.set(null);
  }

  handleDeleteFolder(folderId: string): void {
    this.rulesService.deleteFolder(folderId);
  }

  handleToggleFolder(folderId: string): void {
    this.rulesService.toggleFolder(folderId);
  }

  // ── Rule actions ─────────────────────────────────────────────────
  handleAddRule(event: { folderId: string; data: RuleFormData }): void {
    this.rulesService.addRule(event.folderId, event.data);
  }

  handleEditRule(event: { folderId: string; ruleId: string; data: RuleFormData }): void {
    this.rulesService.updateRule(event.folderId, event.ruleId, event.data);
  }

  handleDeleteRule(event: { folderId: string; ruleId: string }): void {
    this.rulesService.deleteRule(event.folderId, event.ruleId);
  }
}
