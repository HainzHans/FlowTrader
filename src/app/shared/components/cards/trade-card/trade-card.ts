import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Trade} from '../../../models/trade.model';

@Component({
  selector: 'app-trade-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trade-card.html',
  styleUrl: './trade-card.css',
})
export class TradeCard {
  trade = input.required<Trade>();
  onEdit = output<Trade>();
  onDelete = output<string>();

  get initials(): string {
    return this.trade().symbol.replace('/USDT', '').replace('/USD', '').slice(0, 3);
  }

  get pnlFormatted(): string {
    const p = this.trade().pnl;
    const prefix = p > 0 ? '+' : '';
    return `${prefix}${p.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}$`;
  }

  get resultLabel(): string {
    return { win: 'WIN', loss: 'LOSS', breakeven: 'BE' }[this.trade().result];
  }

  // Generate a deterministic-ish mini sparkline path based on trade id + result
  get sparklinePath(): string {
    const t = this.trade();
    if (t.result === 'win') {
      return 'M0,65 C25,60 45,50 70,38 C95,26 115,32 140,18 C165,6 185,12 210,5';
    } else if (t.result === 'loss') {
      return 'M0,5 C25,12 45,22 70,32 C95,44 115,36 140,50 C165,62 185,56 210,68';
    }
    return 'M0,35 C40,33 80,37 120,34 C160,32 185,36 210,35';
  }

  get sparklineFill(): string {
    const t = this.trade();
    if (t.result === 'win') return 'M0,65 C25,60 45,50 70,38 C95,26 115,32 140,18 C165,6 185,12 210,5 L210,80 L0,80 Z';
    if (t.result === 'loss') return 'M0,5 C25,12 45,22 70,32 C95,44 115,36 140,50 C165,62 185,56 210,68 L210,80 L0,80 Z';
    return 'M0,35 C40,33 80,37 120,34 C160,32 185,36 210,35 L210,80 L0,80 Z';
  }

  get strokeColor(): string {
    return { win: '#22c55e', loss: '#ef4444', breakeven: '#64748b' }[this.trade().result];
  }

  get gradientId(): string {
    return `grad-${this.trade().id}`;
  }

  get gradientColor(): string {
    return { win: '#22c55e', loss: '#ef4444', breakeven: '#64748b' }[this.trade().result];
  }
}
