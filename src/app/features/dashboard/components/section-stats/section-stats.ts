import {Component, input} from '@angular/core';

@Component({
  selector: 'app-section-stats',
  imports: [],
  templateUrl: './section-stats.html',
  styleUrl: './section-stats.css',
})
export class SectionStats {

  stats = input<Stat[]>()

}

export interface Stat {
  title: string;
  value: string;
  icon: string;
}
