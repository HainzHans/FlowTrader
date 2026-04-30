import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-pnl-card',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './card.html',
  styleUrls: ['./card.css']
})
export class PnlCardComponent {
  @Input() totalPnL: number = 1250.50;
  @Input() bestTrade: number = 450.00;
  @Input() worstTrade: number = -120.00;
  @Input() currencyCode: string = 'EUR';

  get isPositive(): boolean {
    return this.totalPnL >= 0;
  }

  get statusTheme(): 'profit' | 'loss' {
    return this.isPositive ? 'profit' : 'loss';
  }
}
