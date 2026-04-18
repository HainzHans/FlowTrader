import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [],
  templateUrl: './empty-state.html',
  styleUrl: './empty-state.css',
})
export class EmptyState {
  icon    = input<string>('pi-list');
  title   = input<string>('Keine Einträge');
  message = input<string>('');
  cta     = input<string>('');
  onCta   = output<void>();
}
