import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserTrade} from '../../../../shared/models/trade.model';

@Component({
  selector: 'app-user-trade-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-trade-card.html',
  styleUrl: './user-trade-card.css',
})
export class UserTradeCard {
  trade = input.required<UserTrade>();
  onDelete = output<string>();

  get isWin(): boolean {
    return this.trade().pnl_absolute > 0;
  }

  get isLoss(): boolean {
    return this.trade().pnl_absolute < 0;
  }

  get result(): 'win' | 'loss' | 'breakeven' {
    const pnl = this.trade().pnl_absolute;
    if (pnl > 0) return 'win';
    if (pnl < 0) return 'loss';
    return 'breakeven';
  }

  get pnlFormatted(): string {
    const p = this.trade().pnl_absolute;
    const prefix = p > 0 ? '+' : '';
    return `${prefix}${p.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}$`;
  }

  get entryPriceFormatted(): string {
    return this.trade().entry_price.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  }

  get exitPriceFormatted(): string {
    return this.trade().exit_price.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    });
  }

  get priceDiff(): number {
    return Math.abs(this.trade().exit_price - this.trade().entry_price);
  }

  get priceDiffFormatted(): string {
    const d = this.priceDiff;
    const prefix = this.isWin ? '+' : '-';
    return `${prefix}${d.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    })}`;
  }

  get durationFormatted(): string {
    const entry = new Date(this.trade().entry_time);
    const exit = new Date(this.trade().exit_time);
    const diffMs = exit.getTime() - entry.getTime();
    const diffSec = Math.floor(diffMs / 1000);

    if (diffSec < 60) return `${diffSec}s`;

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ${diffSec % 60}s`;

    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h ${diffMin % 60}m`;

    const diffD = Math.floor(diffH / 24);
    return `${diffD}d ${diffH % 24}h`;
  }

  get entryTimeFormatted(): string {
    // Das +00:00 im String wird nun nicht mehr auf die lokale Zeit umgerechnet
    return new Date(this.trade().entry_time).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC' // <-- Das verhindert die ungewollte Zeitverschiebung
    });
  }


  get exitTimeFormatted(): string {
    return new Date(this.trade().exit_time).toLocaleString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC'
    });
  }

  get commissionFormatted(): string {
    const c = this.trade().commission;
    if (!c) return '—';
    return `-${c.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}$`;
  }

  get netPnl(): number {
    return this.trade().pnl_absolute - (this.trade().commission ?? 0);
  }

  get netPnlFormatted(): string {
    const p = this.netPnl;
    const prefix = p > 0 ? '+' : '';
    return `${prefix}${p.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}$`;
  }

  // Sparkline-Pfad basierend auf Direction & Result
  get sparklinePath(): string {
    const dir = this.trade().direction;
    if (dir === 'Long')
      return 'M0,65 C25,60 45,50 70,38 C95,26 115,32 140,18 C165,6 185,12 210,5';
    if (dir === 'Short')
      return 'M0,15 C25,20 45,28 70,38 C95,48 115,42 140,55 C165,65 185,60 210,70';
    return 'M0,35 C40,33 80,37 120,34 C160,32 185,36 210,35';
  }

  get sparklineFill(): string {
    const path = this.sparklinePath;
    return `${path} L210,80 L0,80 Z`;
  }

  get strokeColor(): string {
    if (this.isWin) return '#22c55e';
    if (this.isLoss) return '#ef4444';
    return '#64748b';
  }

  get gradientColor(): string {
    return this.strokeColor;
  }

  get gradientId(): string {
    return `grad-trade-${this.trade().id.slice(0, 8)}`;
  }
}
