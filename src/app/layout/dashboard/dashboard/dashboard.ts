import {Component, computed, signal} from '@angular/core';
import {NoteSection} from '../components/note-section/note-section';
import {RulesComponent} from '../components/rules-component/rules-component';

export interface NavItem {
  icon:      string;
  label:     string;
  key:       string;
  active?:   boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    NoteSection,
    RulesComponent,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  isExpanded  = signal(true);
  activeKey   = signal<string>('admin-overview');

  userItems: NavItem[] = [
    { icon: 'pi-pencil',    label: 'Notizen', key: 'notes'     },
    { icon: 'pi-verified', label: 'Regeln',   key: 'rules' },
    { icon: 'pi-arrow-right-arrow-left', label: 'Trades',   key: 'arrow-right-arrow-left' },
  ];

  learnItems: NavItem[] = [
    { icon: 'pi-chart-bar',    label: 'Analyse', key: 'chart-bar'     },
    { icon: 'pi-globe', label: 'News lesen',   key: 'globe' },
    { icon: 'pi-sliders-h', label: 'Setup',   key: 'sliders-h' },
    { icon: 'pi-arrow-right-arrow-left', label: 'Trades',   key: 'arrw-right-arrow-left' },
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

  }
}
