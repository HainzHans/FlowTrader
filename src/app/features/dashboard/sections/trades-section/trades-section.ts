import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SectionHeader } from '../../components/section-header/section-header';
import { SectionStats, Stat } from '../../components/section-stats/section-stats';
import { supabase } from '../../../../core/supabase.client';
import {UserTrade} from '../../../../shared/models/trade.model';
import {UserTradeCard} from '../../components/user-trade-card/user-trade-card';

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

  get stats(): Stat[] {
    const t = this.trades();
    const wins   = t.filter(x => x.pnl_absolute > 0).length;
    const losses = t.filter(x => x.pnl_absolute < 0).length;
    const totalPnl = t.reduce((s, x) => s + x.pnl_absolute, 0);
    const totalCommission = t.reduce((s, x) => s + (x.commission ?? 0), 0);
    const netPnl = totalPnl - totalCommission;
    const winRate = t.length > 0 ? Math.round((wins / t.length) * 100) : 0;

    const avgWin = wins > 0
      ? t.filter(x => x.pnl_absolute > 0).reduce((s, x) => s + x.pnl_absolute, 0) / wins
      : 0;

    const avgLoss = losses > 0
      ? Math.abs(t.filter(x => x.pnl_absolute < 0).reduce((s, x) => s + x.pnl_absolute, 0) / losses)
      : 0;

    return [
      {
        title: 'Trades gesamt',
        value: t.length.toString(),
        icon: 'pi-arrow-right-arrow-left',
      },
      {
        title: 'Win-Rate',
        value: `${winRate}%`,
        icon: 'pi-chart-pie',
      },
      {
        title: 'P&L Netto',
        value: (netPnl >= 0 ? '+' : '') +
          netPnl.toLocaleString('de-DE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) + '$',
        icon: 'pi-dollar',
      },
      {
        title: 'Wins / Losses',
        value: `${wins} / ${losses}`,
        icon: 'pi-check-circle',
      },
    ];
  }

  async ngOnInit() {
    await this.loadTrades();
  }

  async loadTrades() {
    this.loading.set(true);
    this.error.set('');

    const { data, error } = await supabase
      .from('user_trades')
      .select('*')
      .order('entry_time', { ascending: false });

    if (error) {
      this.error.set('Fehler beim Laden: ' + error.message);
      console.error('[TradesSection] Supabase error:', error);
    } else {
      this.trades.set(data ?? []);
    }

    this.loading.set(false);
  }

  async deleteTrade(id: string) {
    const confirmed = confirm('Trade wirklich löschen?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('user_trades')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Fehler beim Löschen: ' + error.message);
    } else {
      this.trades.update(t => t.filter(x => x.id !== id));
    }
  }

  trackById(index: number, trade: UserTrade): string {
    return trade.id;
  }
}
