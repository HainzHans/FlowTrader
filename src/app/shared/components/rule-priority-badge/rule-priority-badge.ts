import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RulePriority, PRIORITY_CONFIG } from '../../models/rule.model';

@Component({
  selector: 'app-rule-priority-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rule-priority-badge.html',
  styleUrl: './rule-priority-badge.css',
})
export class RulePriorityBadge {
  priority = input.required<RulePriority>();
  readonly config = PRIORITY_CONFIG;

  get cfg() { return this.config[this.priority()]; }
}
