import {Component, input} from '@angular/core';
import {AccentButton} from '../../../../shared/components/button/accent-button/accent-button';

@Component({
  selector: 'app-section-header',
  imports: [
    AccentButton
  ],
  templateUrl: './section-header.html',
  styleUrl: './section-header.css',
})
export class SectionHeader {

  title = input<string>('');
  subTitle = input<string>('');

  primaryButtonText = input<string>('');
  primaryButtonIcon = input<string>('');

  iconButtonIcon = input<string>('');

}
