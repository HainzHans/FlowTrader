import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TradesSection } from '../sections/trades-section/trades-section';
import { AuthService } from '../../../core/services/auth-service/auth-service';
import {SetupsSection} from '../sections/setups-section/setups-section';
import {AccountsSection} from '../sections/accounts-section/accounts-section';
import {DashboardSection} from '../sections/dashboard-section/dashboard-section';

export interface NavItem {
  icon:    string;
  label:   string;
  key:     string;
  active?: boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [TradesSection, SetupsSection, AccountsSection, DashboardSection],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private authService = inject(AuthService);
  private router      = inject(Router);

  isExpanded = signal(true);
  activeKey  = signal<string>('setups');

  userItems: NavItem[] = [
    { icon: 'pi-chart-line', label: 'Dashboard', key: 'dashboard' },
    { icon: 'pi-wallet', label: 'Konten', key: 'accounts' },
    { icon: 'pi-objects-column', label: 'Setups', key: 'setups' },
    { icon: 'pi-arrow-right-arrow-left', label: 'Trades', key: 'trades' },
  ];

  learnItems: NavItem[] = [
    { icon: 'pi-trophy', label: 'Rangliste', key: 'chart-bar' },
  ];

  adminItems: NavItem[] = [
    { icon: 'pi-users',    label: 'Übersicht', key: 'admin-overview' },
    { icon: 'pi-calendar', label: 'Termine',   key: 'admin-appointments' },
  ];

  toggle() {
    this.isExpanded.update(v => !v);
  }

  setActive(item: NavItem) {
    [...this.userItems, ...this.adminItems].forEach(i => (i.active = false));
    item.active = true;
    this.activeKey.set(item.key);
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.signOut().then();
  }
}
