import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RuleFolderModel, FOLDER_COLORS, FOLDER_ICONS } from '../../models/rule.model';

export interface FolderFormData {
  name: string;
  icon: string;
  color: string;
  description: string;
}

@Component({
  selector: 'app-rule-folder-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-folder-modal.html',
  styleUrl: './rule-folder-modal.css',
})
export class RuleFolderModal {
  visible    = input<boolean>(false);
  editFolder = input<RuleFolderModel | null>(null);

  onSave   = output<FolderFormData>();
  onCancel = output<void>();

  name        = signal('');
  description = signal('');
  icon        = signal('pi-folder');
  color       = signal('#7c3aed');

  readonly colors = FOLDER_COLORS;
  readonly icons  = FOLDER_ICONS;

  constructor() {
    // Pre-fill when editing
    effect(() => {
      const folder = this.editFolder();
      if (folder) {
        this.name.set(folder.name);
        this.description.set(folder.description ?? '');
        this.icon.set(folder.icon);
        this.color.set(folder.color);
      }
    });

    // Reset on close
    effect(() => {
      if (!this.visible()) {
        this.reset();
      }
    });
  }

  save(): void {
    const n = this.name().trim();
    if (!n) return;
    this.onSave.emit({ name: n, description: this.description().trim(), icon: this.icon(), color: this.color() });
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

  get isEdit(): boolean  { return !!this.editFolder(); }
  get isValid(): boolean { return this.name().trim().length > 0; }

  private reset(): void {
    this.name.set('');
    this.description.set('');
    this.icon.set('pi-folder');
    this.color.set('#7c3aed');
  }
}
