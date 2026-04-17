import {Component, signal} from '@angular/core';
import {FolderCard} from '../../../shared/components/cards/folder-card/folder-card';
import {NoteSection} from '../components/note-section/note-section';

export interface NavItem {
  icon:      string;
  label:     string;
  key:       string;
  active?:   boolean;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    FolderCard,
    NoteSection
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  isExpanded  = signal(true);
  activeKey   = signal<string>('admin-overview');

  userItems: NavItem[] = [
    { icon: 'pi-pencil',    label: 'Notizen', key: 'pencil'     },
    { icon: 'pi-verified', label: 'Regeln',   key: 'verified' },
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
