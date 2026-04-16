import { Component } from '@angular/core';
import {GhostButton} from '../../../../shared/components/button/ghost-button/ghost-button';
import {PrimaryButton} from '../../../../shared/components/button/primary-button/primary-button';

@Component({
  selector: 'app-landing-page-header',
  imports: [
    GhostButton,
    PrimaryButton
  ],
  templateUrl: './landing-page-header.html',
  styleUrl: './landing-page-header.css',
})
export class LandingPageHeader {}
