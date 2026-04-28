import {Component, computed, inject, signal} from '@angular/core';
import {TradesSection} from '../sections/trades-section/trades-section';
import {AuthService} from '../../../core/services/auth-service/auth-service';

export interface NavItem {
  icon:      string;
  label:     string;
  key:       string;
  active?:   boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    TradesSection,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private authService = inject(AuthService);

  isExpanded  = signal(true);
  activeKey   = signal<string>('admin-overview');

  userItems: NavItem[] = [
    { icon: 'pi-chart-line',    label: 'Dashboard', key: 'dashboard' },
    { icon: 'pi-verified', label: 'Regeln',   key: 'rules' },
    { icon: 'pi-arrow-right-arrow-left', label: 'Trades',   key: 'trades' },
  ];

  learnItems: NavItem[] = [
    { icon: 'pi-chart-bar',    label: 'Analyse', key: 'chart-bar'     },
  ];

  adminItems: NavItem[] = [
    { icon: 'pi-users',    label: 'Übersicht', key: 'admin-overview'     },
    { icon: 'pi-calendar', label: 'Termine',   key: 'admin-appointments' },
  ];

  constructor() {

  }


  toggle() {
    this.isExpanded.update(v => !v);
  }

  setActive(item: NavItem) {
    [...this.userItems, ...this.adminItems].forEach(i => (i.active = false));
    item.active = true;
    this.activeKey.set(item.key);
  }

  logout() {
    this.authService.signOut().then();
  }
}
