import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Rule, RulePriority, PRIORITY_CONFIG } from '../../models/rule.model';

export interface RuleFormData {
  title: string;
  description: string;
  priority: RulePriority;
}

@Component({
  selector: 'app-rule-create-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-create-modal.html',
  styleUrl: './rule-create-modal.css',
})
export class RuleCreateModal {
  visible    = input<boolean>(false);
  editRule   = input<Rule | null>(null);
  folderName = input<string>('');

  onSave   = output<RuleFormData>();
  onCancel = output<void>();

  title       = signal('');
  description = signal('');
  priority    = signal<RulePriority>('medium');

  readonly priorities: RulePriority[] = ['critical', 'high', 'medium', 'low'];
  readonly priorityConfig = PRIORITY_CONFIG;

  constructor() {
    // Pre-fill form when editRule changes
    effect(() => {
      const rule = this.editRule();
      if (rule) {
        this.title.set(rule.title);
        this.description.set(rule.description ?? '');
        this.priority.set(rule.priority);
      }
    });

    // Reset when modal closes
    effect(() => {
      if (!this.visible()) {
        this.reset();
      }
    });
  }

  setPriority(p: RulePriority): void { this.priority.set(p); }

  save(): void {
    const t = this.title().trim();
    if (!t) return;
    this.onSave.emit({ title: t, description: this.description().trim(), priority: this.priority() });
    this.reset();
  }

  cancel(): void {
    this.reset();
    this.onCancel.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.cancel();
    }
  }

  get isEdit(): boolean  { return !!this.editRule(); }
  get isValid(): boolean { return this.title().trim().length > 0; }

  private reset(): void {
    this.title.set('');
    this.description.set('');
    this.priority.set('medium');
  }
}
