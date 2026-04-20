import { Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';

export interface NoteFormData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-note-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './note-modal.html',
  styleUrl: './note-modal.css',
})
export class NoteModal {
  editNote     = input<Note | null>(null);
  categoryName = input<string>('');

  onSave   = output<NoteFormData>();
  onCancel = output<void>();

  title   = signal('');
  content = signal('');

  constructor() {
    effect(() => {
      const n = this.editNote();
      if (n) {
        this.title.set(n.title);
        this.content.set(n.content);
      } else {
        this.title.set('');
        this.content.set('');
      }
    });
  }

  get isEdit() { return !!this.editNote(); }
  get isValid() { return this.content().trim().length > 0; }

  save() {
    if (!this.isValid) return;
    this.onSave.emit({
      title: this.title().trim(),
      content: this.content().trim(),
    });
  }

  backdropClick() { this.onCancel.emit(); }
}
