import { Injectable, signal, computed } from '@angular/core';
import {Note, NoteCategory} from '../../shared/models/note.model';

const MOCK: NoteCategory[] = [
  {
    id: 'cat-1',
    label: 'NQ Analyse',
    icon: 'pi-chart-bar',
    color: '#7c3aed',
    createdAt: new Date().toISOString(),
    notes: [
      {
        id: 'n1', categoryId: 'cat-1',
        title: 'BIAS für KW17',
        content: 'Übergeordneter Trend bullisch. Higher Highs auf dem Daily. Kaufzonen bei 17.800–17.850 im Blick behalten. News Donnerstag beachten (CPI).',
        pinned: true,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'n2', categoryId: 'cat-1',
        title: 'Liquiditätszonen April',
        content: 'Equal Highs bei 18.120 — Magnet für Preis. Darunter: Lücke aus dem 12. April noch offen. POC des letzten Monats: 17.640.',
        pinned: false,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ],
  },
  {
    id: 'cat-2',
    label: 'Setup Notizen',
    icon: 'pi-bolt',
    color: '#2563eb',
    createdAt: new Date().toISOString(),
    notes: [
      {
        id: 'n3', categoryId: 'cat-2',
        title: 'Pullback Entry Regeln',
        content: 'Nur einsteigen wenn: 1) Trend klar definiert 2) Retest einer strukturellen Zone 3) Volumen abnimmt beim Pullback 4) Kerze schließt über/unter dem Niveau.',
        pinned: true,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
      },
    ],
  },
  {
    id: 'cat-3',
    label: 'Tagesreflexion',
    icon: 'pi-pencil',
    color: '#16a34a',
    createdAt: new Date().toISOString(),
    notes: [
      {
        id: 'n4', categoryId: 'cat-3',
        title: '18. April 2025',
        content: 'Guter Trade morgens NQ Long. Hätte länger halten sollen — TP zu früh. Nachmittags übertrieben und 2 schlechte Setups getraded. Morgen: Geduld üben.',
        pinned: false,
        createdAt: new Date(Date.now() - 43200000).toISOString(),
        updatedAt: new Date(Date.now() - 43200000).toISOString(),
      },
    ],
  },
];

@Injectable({ providedIn: 'root' })
export class NoteService {
  private _categories = signal<NoteCategory[]>(MOCK);

  readonly categories = this._categories.asReadonly();

  readonly stats = computed(() => {
    const cats = this._categories();
    const allNotes = cats.flatMap(c => c.notes);
    return {
      totalCategories: cats.length,
      totalNotes: allNotes.length,
      pinnedNotes: allNotes.filter(n => n.pinned).length,
    };
  });

  // ── Categories ──────────────────────────────
  addCategory(data: { label: string; icon: string; color: string }): void {
    const cat: NoteCategory = {
      id: crypto.randomUUID(),
      ...data,
      notes: [],
      createdAt: new Date().toISOString(),
    };
    this._categories.update(cs => [...cs, cat]);
  }

  updateCategory(id: string, data: { label: string; icon: string; color: string }): void {
    this._categories.update(cs =>
      cs.map(c => c.id === id ? { ...c, ...data } : c)
    );
  }

  deleteCategory(id: string): void {
    this._categories.update(cs => cs.filter(c => c.id !== id));
  }

  // ── Notes ────────────────────────────────────
  addNote(categoryId: string, data: { title: string; content: string }): void {
    const note: Note = {
      id: crypto.randomUUID(),
      categoryId,
      title: data.title.trim() || 'Neue Notiz',
      content: data.content,
      pinned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this._categories.update(cs =>
      cs.map(c => c.id === categoryId
        ? { ...c, notes: [note, ...c.notes] }
        : c
      )
    );
  }

  updateNote(categoryId: string, noteId: string, data: { title: string; content: string }): void {
    this._categories.update(cs =>
      cs.map(c => c.id === categoryId
        ? {
          ...c,
          notes: c.notes.map(n =>
            n.id === noteId
              ? { ...n, ...data, updatedAt: new Date().toISOString() }
              : n
          ),
        }
        : c
      )
    );
  }

  togglePin(categoryId: string, noteId: string): void {
    this._categories.update(cs =>
      cs.map(c => c.id === categoryId
        ? { ...c, notes: c.notes.map(n => n.id === noteId ? { ...n, pinned: !n.pinned } : n) }
        : c
      )
    );
  }

  deleteNote(categoryId: string, noteId: string): void {
    this._categories.update(cs =>
      cs.map(c => c.id === categoryId
        ? { ...c, notes: c.notes.filter(n => n.id !== noteId) }
        : c
      )
    );
  }

  getNotesForCategory(categoryId: string): Note[] {
    const cat = this._categories().find(c => c.id === categoryId);
    if (!cat) return [];
    return [...cat.notes].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }
}
