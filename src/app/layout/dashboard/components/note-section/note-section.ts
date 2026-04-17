import { Component } from '@angular/core';
import {FolderCard} from '../../../../shared/components/cards/folder-card/folder-card';
import {AccentButton} from '../../../../shared/components/button/accent-button/accent-button';

@Component({
  selector: 'app-note-section',
  imports: [
    FolderCard,
    AccentButton
  ],
  templateUrl: './note-section.html',
  styleUrl: './note-section.css',
})
export class NoteSection {}
