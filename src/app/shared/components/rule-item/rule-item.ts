import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Rule } from '../../models/rule.model';
import { RulePriorityBadge } from '../rule-priority-badge/rule-priority-badge';

@Component({
  selector: 'app-rule-item',
  standalone: true,
  imports: [CommonModule, RulePriorityBadge],
  templateUrl: './rule-item.html',
  styleUrl: './rule-item.css',
})
export class RuleItem {
  rule     = input.required<Rule>();
  onEdit   = output<Rule>();
  onDelete = output<string>();

  menuOpen = signal(false);

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void { this.menuOpen.set(false); }

  edit(): void {
    this.onEdit.emit(this.rule());
    this.closeMenu();
  }

  delete(): void {
    this.onDelete.emit(this.rule().id);
    this.closeMenu();
  }
}
