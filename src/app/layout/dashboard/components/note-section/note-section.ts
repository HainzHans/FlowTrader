import {Component, OnInit} from '@angular/core';
import {FolderCard} from '../../../../shared/components/cards/folder-card/folder-card';
import {AccentButton} from '../../../../shared/components/button/accent-button/accent-button';
import {NoteService} from '../../../../services/note-service/note-service';
import {NoteCategory} from '../../../../shared/models/note-category.model';

@Component({
  selector: 'app-note-section',
  imports: [
    FolderCard,
    AccentButton
  ],
  templateUrl: './note-section.html',
  styleUrl: './note-section.css',
})
export class NoteSection implements OnInit{

  noteCategories: NoteCategory[] = [];

  constructor(private noteService: NoteService) {}

  ngOnInit(): void {
    this.noteCategories = this.noteService.getAllNoteCategories()
  }


}
