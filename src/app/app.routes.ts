import { Routes } from '@angular/router';
import {LandingPage} from './features/landing/landing-page/landing-page';
import {Dashboard} from './features/dashboard/dashboard/dashboard';
import {AuthPage} from './features/auth/auth-page/auth-page';
import {authGuard, publicGuard} from './core/guard/auth-guard';

export const routes: Routes = [
  { path: '', component: LandingPage},
  { path: 'auth',      component: AuthPage,    canActivate: [publicGuard] },
  { path: 'dashboard', component: Dashboard,   canActivate: [authGuard]   },
  { path: '**',        redirectTo: '' },
];
