import {Component, input} from '@angular/core';

@Component({
  selector: 'app-folder-card',
  imports: [],
  templateUrl: './folder-card.html',
  styleUrl: './folder-card.css',
})
export class FolderCard {

  folderId = input<string>('');
  folderLabel = input<string>('');
  folderPrimaryLabel = input<string>('');
  folderPrimaryCounter = input<string>('');
  folderSecondaryLabel = input<string>('');
  folderSecondaryCounter = input<string>('');
  folderLastUpdated = input<string>('');

}
