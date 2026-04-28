import { Component } from '@angular/core';
import {AccentButton} from '../../../../shared/components/button/accent-button/accent-button';

@Component({
  selector: 'app-landing-page-footer',
  imports: [
    AccentButton
  ],
  templateUrl: './landing-page-footer.html',
  styleUrl: './landing-page-footer.css',
})
export class LandingPageFooter {}
