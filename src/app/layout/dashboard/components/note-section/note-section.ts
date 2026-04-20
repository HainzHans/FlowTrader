import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note, NoteCategory } from '../../../../shared/models/note.model';
import {NoteFormData, NoteModal} from '../../../../shared/components/note-modal/note-modal';
import {CategoryFormData, CategoryModal} from '../../../../shared/components/category-modal/category-modal';
import {NoteService} from '../../../../services/note-service/note-service';

@Component({
  selector: 'app-note-section',
  standalone: true,
  imports: [CommonModule, NoteModal, CategoryModal],
  templateUrl: './note-section.html',
  styleUrl: './note-section.css',
})
export class NoteSection {
  private svc = inject(NoteService);

  readonly categories = this.svc.categories;
  readonly stats      = this.svc.stats;

  // ── View state ──────────────────────────────
  activeCategoryId = signal<string | null>(null);
  searchQuery      = signal('');

  // ── Category modal ──────────────────────────
  showCategoryModal   = signal(false);
  editingCategory     = signal<NoteCategory | null>(null);

  // ── Note modal ──────────────────────────────
  showNoteModal   = signal(false);
  editingNote     = signal<Note | null>(null);

  // ── Delete confirms ─────────────────────────
  deleteNoteId     = signal<{ catId: string; noteId: string } | null>(null);
  deleteCategoryId = signal<string | null>(null);

  // ── Derived ─────────────────────────────────
  activeCategory = computed(() => {
    const id = this.activeCategoryId();
    return id ? this.categories().find(c => c.id === id) ?? null : null;
  });

  visibleNotes = computed(() => {
    const cat = this.activeCategory();
    if (!cat) return [];
    const notes = this.svc.getNotesForCategory(cat.id);
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return notes;
    return notes.filter(n =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q)
    );
  });

  // ── Category actions ────────────────────────
  selectCategory(id: string) {
    this.activeCategoryId.set(id);
    this.searchQuery.set('');
  }

  openNewCategory() {
    this.editingCategory.set(null);
    this.showCategoryModal.set(true);
  }

  openEditCategory(cat: NoteCategory, event: MouseEvent) {
    event.stopPropagation();
    this.editingCategory.set(cat);
    this.showCategoryModal.set(true);
  }

  saveCategoryHandler(data: CategoryFormData) {
    const editing = this.editingCategory();
    if (editing) {
      this.svc.updateCategory(editing.id, data);
    } else {
      this.svc.addCategory(data);
      // auto-select new category
      const cats = this.categories();
      this.activeCategoryId.set(cats[cats.length - 1]?.id ?? null);
    }
    this.showCategoryModal.set(false);
    this.editingCategory.set(null);
  }

  requestDeleteCategory(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.deleteCategoryId.set(id);
  }

  confirmDeleteCategory() {
    const id = this.deleteCategoryId();
    if (id) {
      this.svc.deleteCategory(id);
      if (this.activeCategoryId() === id) {
        this.activeCategoryId.set(this.categories()[0]?.id ?? null);
      }
    }
    this.deleteCategoryId.set(null);
  }

  // ── Note actions ────────────────────────────
  openNewNote() {
    this.editingNote.set(null);
    this.showNoteModal.set(true);
  }

  openEditNote(note: Note, event: MouseEvent) {
    event.stopPropagation();
    this.editingNote.set(note);
    this.showNoteModal.set(true);
  }

  saveNoteHandler(data: NoteFormData) {
    const catId = this.activeCategoryId();
    if (!catId) return;
    const editing = this.editingNote();
    if (editing) {
      this.svc.updateNote(catId, editing.id, data);
    } else {
      this.svc.addNote(catId, data);
    }
    this.showNoteModal.set(false);
    this.editingNote.set(null);
  }

  togglePin(note: Note, event: MouseEvent) {
    event.stopPropagation();
    const catId = this.activeCategoryId();
    if (catId) this.svc.togglePin(catId, note.id);
  }

  requestDeleteNote(note: Note, event: MouseEvent) {
    event.stopPropagation();
    const catId = this.activeCategoryId();
    if (catId) this.deleteNoteId.set({ catId, noteId: note.id });
  }

  confirmDeleteNote() {
    const d = this.deleteNoteId();
    if (d) this.svc.deleteNote(d.catId, d.noteId);
    this.deleteNoteId.set(null);
  }

  // ── Helpers ─────────────────────────────────
  formatDate(iso: string): string {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1)  return 'Gerade eben';
    if (mins < 60) return `Vor ${mins} Min.`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Vor ${hours} Std.`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Gestern';
    if (days < 7)  return `Vor ${days} Tagen`;
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short' });
  }

  preview(content: string): string {
    return content.length > 120 ? content.slice(0, 120) + '…' : content;
  }
}
