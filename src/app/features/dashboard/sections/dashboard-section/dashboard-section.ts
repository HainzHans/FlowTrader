import { Component } from '@angular/core';
import {SectionHeader} from '../../components/section-header/section-header';

@Component({
  selector: 'app-dashboard-section',
  imports: [
    SectionHeader,
  ],
  templateUrl: './dashboard-section.html',
  styleUrl: './dashboard-section.css',
})
export class DashboardSection {}
