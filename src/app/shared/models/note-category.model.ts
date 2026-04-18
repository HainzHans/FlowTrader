import {Note} from './note.model';

export interface NoteCategory {
  id: number,
  label: string,
  primaryLabel: string,
  primaryCounter: string,
  secondaryLabel: string,
  secondaryCounter: string,
  lastUpdated: string,
  notes: Note[]
}
