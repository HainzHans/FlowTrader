import { Routes } from '@angular/router';
import {LandingPage} from './layout/landing-page/landing-page/landing-page';
import {Dashboard} from './layout/dashboard/dashboard/dashboard';
import {AuthPage} from './layout/auth-page/auth-page';
import {authGuard, publicGuard} from './guard/auth-guard';

export const routes: Routes = [
  { path: '', component: LandingPage},
  { path: 'auth',      component: AuthPage,    canActivate: [publicGuard] },
  { path: 'dashboard', component: Dashboard,   canActivate: [authGuard]   },
  { path: '**',        redirectTo: '' },
];
