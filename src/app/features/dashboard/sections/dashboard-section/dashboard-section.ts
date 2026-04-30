import { Component } from '@angular/core';
import {SectionHeader} from '../../components/section-header/section-header';
import {PnlCardComponent} from '../../components/card/card';

@Component({
  selector: 'app-dashboard-section',
  imports: [
    SectionHeader,
    PnlCardComponent
  ],
  templateUrl: './dashboard-section.html',
  styleUrl: './dashboard-section.css',
})
export class DashboardSection {}
