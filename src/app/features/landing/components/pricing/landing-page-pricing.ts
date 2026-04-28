import { Component } from '@angular/core';
import {AccentButton} from '../../../../shared/components/button/accent-button/accent-button';
import {SecondaryButton} from '../../../../shared/components/button/secondary-button/secondary-button';

@Component({
  selector: 'app-landing-page-pricing',
  imports: [
    AccentButton,
    SecondaryButton
  ],
  templateUrl: './landing-page-pricing.html',
  styleUrl: './landing-page-pricing.css',
})
export class LandingPagePricing {}
