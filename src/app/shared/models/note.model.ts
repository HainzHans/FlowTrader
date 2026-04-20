export interface Note {
  id: string;
  categoryId: string;
  title: string;
  content: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NoteCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  notes: Note[];
  createdAt: string;
}

export const CATEGORY_ICONS = [
  'pi-folder', 'pi-star', 'pi-bookmark', 'pi-chart-bar',
  'pi-bolt', 'pi-shield', 'pi-briefcase', 'pi-list',
  'pi-flag', 'pi-pencil', 'pi-book', 'pi-globe',
];

export const CATEGORY_COLORS = [
  { label: 'Violet',  value: '#7c3aed' },
  { label: 'Blue',    value: '#2563eb' },
  { label: 'Cyan',    value: '#0891b2' },
  { label: 'Green',   value: '#16a34a' },
  { label: 'Amber',   value: '#d97706' },
  { label: 'Red',     value: '#dc2626' },
  { label: 'Pink',    value: '#db2777' },
  { label: 'Slate',   value: '#475569' },
];
