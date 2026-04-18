import { Injectable } from '@angular/core';
import {NoteCategory} from '../../shared/models/note-category.model';

@Injectable({
  providedIn: 'root',
})
export class NoteService {

  getAllNoteCategories(): NoteCategory[] {
    return testNoteCategories;
  }

}


export const testNoteCategories: NoteCategory[] = [
  {
    id: 1,
    label: 'NQ',
    notes: [],
    primaryLabel: 'Notizen',
    primaryCounter: '7',
    secondaryLabel: 'Markierte Notizen',
    secondaryCounter: '2',
    lastUpdated: 'Heute'
  },
  {
    id: 2,
    label: 'Setup',
    notes: [],
    primaryLabel: 'Notizen',
    primaryCounter: '3',
    secondaryLabel: 'Markierte Notizen',
    secondaryCounter: '1',
    lastUpdated: 'Heute'
  },
]
