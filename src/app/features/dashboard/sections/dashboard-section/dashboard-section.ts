import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth-service/auth-service';
import { TradesService } from '../../../../core/services/trades-service/trades-service';
import { AccountsService } from '../../../../core/services/accounts-service/accounts-service';
import { UserTrade } from '../../../../shared/models/trade.model';
import { Account } from '../accounts-section/accounts-section';
import {DashboardStat, DashboardStats} from '../../../../shared/components/dashboard/dashboard-stats/dashboard-stats';
import {DashboardPnlChart} from '../../../../shared/components/dashboard/dashboard-pnl-chart/dashboard-pnl-chart';
import {
  DashboardRecentTrades
} from '../../../../shared/components/dashboard/dashboard-recent-trades/dashboard-recent-trades';
import {DashboardCalendar} from '../../../../shared/components/dashboard/dashboard-calendar/dashboard-calendar';
import {
  DashboardAccountOverview
} from '../../../../shared/components/dashboard/dashboard-account-overview/dashboard-account-overview';
import {DashboardWinRate} from '../../../../shared/components/dashboard/dashboard-win-rate/dashboard-win-rate';
import {SectionHeader} from '../../components/section-header/section-header';

// Sub-components

@Component({
  selector: 'app-dashboard-section',
  standalone: true,
  imports: [
    CommonModule,
    DashboardStats,
    DashboardPnlChart,
    DashboardRecentTrades,
    DashboardCalendar,
    DashboardAccountOverview,
    DashboardWinRate,
    SectionHeader,
  ],
  templateUrl: './dashboard-section.html',
  styleUrl: './dashboard-section.css',
})
export class DashboardSection implements OnInit {

  private auth     = inject(AuthService);
  private tradesSvc = inject(TradesService);
  private accountsSvc = inject(AccountsService);

  trades    = signal<UserTrade[]>([]);
  accounts  = signal<Account[]>([]);
  loading   = signal(true);

  displayName = computed(() => {
    const meta = this.auth.user()?.user_metadata;
    return meta?.['display_name'] || this.auth.user()?.email?.split('@')[0] || 'Trader';
  });

  currentHour = new Date().getHours();
  greeting = computed(() => {
    const h = this.currentHour;
    if (h < 12) return 'Guten Morgen';
    if (h < 18) return 'Guten Tag';
    return 'Guten Abend';
  });

  todayFormatted = new Date().toLocaleDateString('de-DE', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  // ── Computed Stats ────────────────────────────────────────────────────────

  stats = computed((): DashboardStat[] => {
    const t    = this.trades();
    const wins = t.filter(x => x.pnl_absolute > 0).length;
    const total = t.length;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

    const totalPnl        = t.reduce((s, x) => s + x.pnl_absolute, 0);
    const totalCommission = t.reduce((s, x) => s + (x.commission ?? 0), 0);
    const netPnl          = totalPnl - totalCommission;

    // Best / worst trade
    const sorted = [...t].sort((a, b) => a.pnl_absolute - b.pnl_absolute);
    const worst  = sorted[0]?.pnl_absolute ?? 0;
    const best   = sorted[sorted.length - 1]?.pnl_absolute ?? 0;

    // Avg trade
    const avgPnl = total > 0 ? netPnl / total : 0;

    return [
      {
        label:      'Trades gesamt',
        value:      total.toString(),
        subValue:   `${wins} Wins · ${total - wins} Losses`,
        icon:       'pi-arrow-right-arrow-left',
        accent:     'accent',
      },
      {
        label:        'P&L Netto',
        value:        (netPnl >= 0 ? '+' : '') + netPnl.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '$',
        subValue:     `Brutto: ${totalPnl.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}$`,
        trend:        netPnl >= 0 ? 'up' : 'down',
        trendPercent: total > 0 ? Math.abs(netPnl / total).toFixed(2) + '$/Trade' : '—',
        icon:         'pi-dollar',
        accent:       netPnl >= 0 ? 'green' : 'red',
      },
      {
        label:        'Win Rate',
        value:        winRate + '%',
        subValue:     `Bestes Trade: +${best.toFixed(2)}$`,
        trend:        winRate >= 50 ? 'up' : 'down',
        trendPercent: winRate + '%',
        icon:         'pi-chart-pie',
        accent:       winRate >= 50 ? 'green' : 'red',
      },
      {
        label:        'Durchschn. Trade',
        value:        (avgPnl >= 0 ? '+' : '') + avgPnl.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '$',
        subValue:     `Worst: ${worst.toFixed(2)}$`,
        trend:        avgPnl >= 0 ? 'up' : 'down',
        trendPercent: avgPnl.toFixed(2) + '$',
        icon:         'pi-chart-bar',
        accent:       avgPnl >= 0 ? 'green' : 'amber',
      },
    ];
  });

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    const [tradesResult, accountsResult] = await Promise.all([
      this.tradesSvc.getAll(),
      this.accountsSvc.getAll(),
    ]);
    this.trades.set(tradesResult.data);
    this.accounts.set(accountsResult.error ? this.getDemoAccounts() : accountsResult.data);
    this.loading.set(false);
  }

  private getDemoAccounts(): Account[] {
    return [
      { id: 'a1', name: 'Haupt-Konto', broker: 'Interactive Brokers', type: 'live', currency: 'USD', startBalance: 10000, currentBalance: 11240, createdAt: '2025-01-15', color: '#22c55e' },
      { id: 'a2', name: 'FTMO Challenge', broker: 'FTMO', type: 'prop', currency: 'USD', startBalance: 100000, currentBalance: 98500, createdAt: '2025-03-01', color: '#7c3aed' },
    ];
  }
}
