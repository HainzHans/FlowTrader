import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeader } from '../../components/section-header/section-header';
import { UserTradeCard } from '../../components/user-trade-card/user-trade-card';
import { UserTrade } from '../../../../shared/models/trade.model';
import { Stat } from '../../components/section-stats/section-stats';
import {TradesService} from '../../../../core/services/trades-service/trades-service';

@Component({
  selector: 'app-trades-section',
  standalone: true,
  imports: [
    CommonModule,
    SectionHeader,
    UserTradeCard,
  ],
  templateUrl: './trades-section.html',
  styleUrl: './trades-section.css',
})
export class TradesSection implements OnInit {

  trades  = signal<UserTrade[]>([]);
  loading = signal(true);
  error   = signal('');

  constructor(private tradesService: TradesService) {}

  get stats(): Stat[] {
    const t       = this.trades();
    const wins    = t.filter(x => x.pnl_absolute > 0).length;
    const losses  = t.filter(x => x.pnl_absolute < 0).length;
    const totalPnl        = t.reduce((s, x) => s + x.pnl_absolute, 0);
    const totalCommission = t.reduce((s, x) => s + (x.commission ?? 0), 0);
    const netPnl   = totalPnl - totalCommission;
    const winRate  = t.length > 0 ? Math.round((wins / t.length) * 100) : 0;

    return [
      {
        title: 'Trades gesamt',
        value: t.length.toString(),
        icon:  'pi-arrow-right-arrow-left',
      },
      {
        title: 'Win-Rate',
        value: `${winRate}%`,
        icon:  'pi-chart-pie',
      },
      {
        title: 'P&L Netto',
        value: (netPnl >= 0 ? '+' : '') +
          netPnl.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + '$',
        icon:  'pi-dollar',
      },
      {
        title: 'Wins / Losses',
        value: `${wins} / ${losses}`,
        icon:  'pi-check-circle',
      },
    ];
  }

  async ngOnInit(): Promise<void> {
    await this.loadTrades();
  }

  async loadTrades(): Promise<void> {
    this.loading.set(true);
    this.error.set('');

    const { data, error } = await this.tradesService.getAll();

    if (error) {
      this.error.set('Fehler beim Laden: ' + error);
    } else {
      this.trades.set(data);
    }

    this.loading.set(false);
  }

  async deleteTrade(id: string): Promise<void> {
    const confirmed = confirm('Trade wirklich löschen?');
    if (!confirmed) return;

    const { error } = await this.tradesService.delete(id);

    if (error) {
      alert('Fehler beim Löschen: ' + error);
    } else {
      this.trades.update(t => t.filter(x => x.id !== id));
    }
  }

  trackById(_index: number, trade: UserTrade): string {
    return trade.id;
  }
}
