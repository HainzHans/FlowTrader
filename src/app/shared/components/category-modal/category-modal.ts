import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteCategory, CATEGORY_COLORS, CATEGORY_ICONS } from '../../models/note.model';

export interface CategoryFormData {
  label: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-modal.html',
  styleUrl: './category-modal.css',
})
export class CategoryModal {
  editCategory = input<NoteCategory | null>(null);

  onSave   = output<CategoryFormData>();
  onCancel = output<void>();

  label = signal('');
  icon  = signal('pi-folder');
  color = signal('#7c3aed');

  readonly colors = CATEGORY_COLORS;
  readonly icons  = CATEGORY_ICONS;

  constructor() {
    effect(() => {
      const c = this.editCategory();
      if (c) {
        this.label.set(c.label);
        this.icon.set(c.icon);
        this.color.set(c.color);
      } else {
        this.label.set('');
        this.icon.set('pi-folder');
        this.color.set('#7c3aed');
      }
    });
  }

  get isEdit()  { return !!this.editCategory(); }
  get isValid() { return this.label().trim().length > 0; }

  save() {
    if (!this.isValid) return;
    this.onSave.emit({ label: this.label().trim(), icon: this.icon(), color: this.color() });
  }

  backdropClick() { this.onCancel.emit(); }
}
