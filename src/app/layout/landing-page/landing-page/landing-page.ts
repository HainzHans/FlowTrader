import { Component } from '@angular/core';
import {LandingPageFooter} from '../components/landing-page-footer/landing-page-footer';
import {LandingPageHero} from '../components/landing-page-hero/landing-page-hero';
import {LandingPageHeader} from '../components/landing-page-header/landing-page-header';

@Component({
  selector: 'app-landing-page',
  imports: [
    LandingPageHeader,
    LandingPageHero,
    LandingPageFooter
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {}
