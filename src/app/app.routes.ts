import { Routes } from '@angular/router';
import {LandingPage} from './layout/landing-page/landing-page/landing-page';
import {Dashboard} from './layout/dashboard/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: LandingPage},
  { path: 'dashboard', component: Dashboard}
];
