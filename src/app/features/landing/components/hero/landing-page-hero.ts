import { Component } from '@angular/core';
import {PrimaryButton} from '../../../../shared/components/button/primary-button/primary-button';
import {SecondaryButton} from '../../../../shared/components/button/secondary-button/secondary-button';

@Component({
  selector: 'app-landing-page-hero',
  imports: [
    PrimaryButton,
    SecondaryButton
  ],
  templateUrl: './landing-page-hero.html',
  styleUrl: './landing-page-hero.css',
})
export class LandingPageHero {}
