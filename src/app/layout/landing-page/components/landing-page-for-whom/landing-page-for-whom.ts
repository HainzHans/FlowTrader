import { Component } from '@angular/core';
import {PrimaryButton} from '../../../../shared/components/button/primary-button/primary-button';
import {AccentButton} from '../../../../shared/components/button/accent-button/accent-button';

@Component({
  selector: 'app-landing-page-for-whom',
  imports: [
    PrimaryButton,
    AccentButton
  ],
  templateUrl: './landing-page-for-whom.html',
  styleUrl: './landing-page-for-whom.css',
})
export class LandingPageForWhom {}
