import { Component } from '@angular/core';
import {LandingPageFooter} from '../components/landing-page-footer/landing-page-footer';
import {LandingPageHero} from '../components/landing-page-hero/landing-page-hero';
import {LandingPageHeader} from '../components/landing-page-header/landing-page-header';
import {LandingPageFeatures} from '../components/landing-page-features/landing-page-features';
import {LandingPageForWhom} from '../components/landing-page-for-whom/landing-page-for-whom';

@Component({
  selector: 'app-landing-page',
  imports: [
    LandingPageHeader,
    LandingPageHero,
    LandingPageFooter,
    LandingPageFeatures,
    LandingPageForWhom
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {}
