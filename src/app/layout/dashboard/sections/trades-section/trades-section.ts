import {Component, OnInit} from '@angular/core';
import {AccentButton} from '../../../../shared/components/button/accent-button/accent-button';
import {SectionHeader} from '../../components/section-header/section-header';
import {SupabaseService} from '../../../../services/supabase-service/supabase-service';

@Component({
  selector: 'app-trades-section',
  imports: [
    SectionHeader
  ],
  templateUrl: './trades-section.html',
  styleUrl: './trades-section.css',
})
export class TradesSection implements OnInit {

  daten: any[] = [];

  constructor(private supabaseService: SupabaseService) { }

  async ngOnInit() {
    this.daten = await this.supabaseService.getDaten();
    console.log(this.daten);
  }

}
