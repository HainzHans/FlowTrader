export type RulePriority = 'critical' | 'high' | 'medium' | 'low';

export interface Rule {
  id: string;
  folderId: string;
  title: string;
  description?: string;
  priority: RulePriority;
  createdAt: Date;
  updatedAt: Date;
}

export interface RuleFolderModel {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  rules: Rule[];
  isCollapsed: boolean;
  createdAt: Date;
}

export const FOLDER_COLORS = [
  { label: 'Violet', value: '#7c3aed' },
  { label: 'Blue',   value: '#2563eb' },
  { label: 'Cyan',   value: '#0891b2' },
  { label: 'Green',  value: '#16a34a' },
  { label: 'Amber',  value: '#d97706' },
  { label: 'Red',    value: '#dc2626' },
  { label: 'Pink',   value: '#db2777' },
];

export const FOLDER_ICONS = [
  'pi-folder', 'pi-shield', 'pi-chart-bar', 'pi-bolt',
  'pi-star',   'pi-flag',   'pi-lock',      'pi-bookmark',
  'pi-briefcase', 'pi-list', 'pi-sliders-h', 'pi-check-circle',
];

export const PRIORITY_CONFIG: Record<RulePriority, {
  label: string; color: string; bg: string; border: string; order: number;
}> = {
  critical: { label: 'Kritisch', color: '#ef4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.30)',  order: 1 },
  high:     { label: 'Hoch',     color: '#f97316', bg: 'rgba(249,115,22,0.10)', border: 'rgba(249,115,22,0.30)', order: 2 },
  medium:   { label: 'Mittel',   color: '#eab308', bg: 'rgba(234,179,8,0.10)',  border: 'rgba(234,179,8,0.30)',  order: 3 },
  low:      { label: 'Niedrig',  color: '#22c55e', bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.25)',  order: 4 },
};
