import { Component } from '@angular/core';
import {LandingPageFooter} from '../components/footer/landing-page-footer';
import {LandingPageHero} from '../components/hero/landing-page-hero';
import {LandingPageHeader} from '../components/header/landing-page-header';
import {LandingPageFeatures} from '../components/features/landing-page-features';
import {LandingPageForWhom} from '../components/for-whom/landing-page-for-whom';
import {LandingPagePricing} from '../components/pricing/landing-page-pricing';

@Component({
  selector: 'app-landing-page',
  imports: [
    LandingPageHeader,
    LandingPageHero,
    LandingPageFooter,
    LandingPageFeatures,
    LandingPageForWhom,
    LandingPagePricing
  ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {}
