import {Component, OnInit} from '@angular/core';
import {AccentButton} from '../../../../shared/components/button/accent-button/accent-button';
import {SectionHeader} from '../../components/section-header/section-header';
import {SupabaseService} from '../../../../core/services/supabase-service/supabase-service';
import {SectionStats} from '../../components/section-stats/section-stats';
import {PnlCardComponent} from '../../components/card/card';

@Component({
  selector: 'app-trades-section',
  imports: [
    SectionHeader,
    SectionStats,
    PnlCardComponent
  ],
  templateUrl: './trades-section.html',
  styleUrl: './trades-section.css',
})
export class TradesSection implements OnInit {

  daten: any[] = [];

  constructor(private supabaseService: SupabaseService) { }

  async ngOnInit() {
    this.daten = await this.supabaseService.getAllTrades();
    console.log(this.daten);
  }

}
