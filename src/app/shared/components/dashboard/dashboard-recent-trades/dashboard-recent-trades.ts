import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTrade } from '../../../../shared/models/trade.model';

@Component({
  selector: 'app-dashboard-recent-trades',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="recent-trades-card">
      <div class="recent-trades-header">
        <div>
          <p class="recent-label">Letzte Trades</p>
        </div>
        <span class="recent-count">{{ trades().length }} gesamt</span>
      </div>

      @if (recentTrades().length === 0) {
        <div class="recent-empty">
          <i class="pi pi-arrow-right-arrow-left"></i>
          <p>Noch keine Trades vorhanden.</p>
        </div>
      } @else {
        <div class="recent-list">
          @for (trade of recentTrades(); track trade.id) {
            <div class="recent-row" [attr.data-result]="getResult(trade)">
              <div class="recent-row-left">
                <div class="recent-symbol-wrap">
                  <span class="recent-symbol">{{ trade.symbol }}</span>
                  <span class="recent-dir" [class.long]="trade.direction === 'Long'" [class.short]="trade.direction === 'Short'">
                    {{ trade.direction === 'Long' ? '▲' : '▼' }} {{ trade.direction }}
                  </span>
                </div>
                <span class="recent-time">{{ formatTime(trade.entry_time) }}</span>
              </div>
              <div class="recent-row-right">
                <span class="recent-pnl" [class.win]="trade.pnl_absolute > 0" [class.loss]="trade.pnl_absolute < 0">
                  {{ trade.pnl_absolute > 0 ? '+' : '' }}{{ trade.pnl_absolute.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}$
                </span>
                <span class="recent-account">{{ trade.account_id }}</span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .recent-trades-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      height: 100%;
    }

    .recent-trades-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .recent-label {
      font-size: 11.5px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }

    .recent-count {
      font-size: 11.5px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      padding: 3px 10px;
      border-radius: 99px;
    }

    .recent-empty {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-3);
      color: var(--text-tertiary);
      font-size: 13.5px;
      padding: var(--space-8) 0;
    }

    .recent-empty .pi { font-size: 24px; opacity: 0.4; }

    .recent-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .recent-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
      padding: var(--space-3) var(--space-3);
      border-radius: var(--radius-md);
      border: 1px solid transparent;
      transition: background 0.15s, border-color 0.15s;
      position: relative;
    }

    .recent-row::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 60%;
      border-radius: 0 2px 2px 0;
      opacity: 0;
      transition: opacity 0.15s;
    }

    .recent-row[data-result="win"]::before   { background: var(--green); }
    .recent-row[data-result="loss"]::before  { background: var(--red); }

    .recent-row:hover {
      background: var(--bg-elevated);
      border-color: var(--border-subtle);
    }

    .recent-row:hover::before { opacity: 1; }

    .recent-row-left {
      display: flex;
      flex-direction: column;
      gap: 3px;
      min-width: 0;
    }

    .recent-symbol-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .recent-symbol {
      font-size: 13.5px;
      font-weight: 600;
      font-family: var(--font-mono);
      color: var(--text-primary);
      letter-spacing: 0.02em;
    }

    .recent-dir {
      font-size: 10.5px;
      font-family: var(--font-mono);
      font-weight: 600;
      padding: 2px 7px;
      border-radius: 99px;
    }

    .recent-dir.long  { color: var(--green); background: rgba(34,197,94,0.1);  border: 1px solid rgba(34,197,94,0.2); }
    .recent-dir.short { color: var(--red);   background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.2); }

    .recent-time {
      font-size: 11px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
    }

    .recent-row-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 3px;
      flex-shrink: 0;
    }

    .recent-pnl {
      font-size: 13.5px;
      font-weight: 600;
      font-family: var(--font-mono);
      letter-spacing: -0.02em;
    }

    .recent-pnl.win  { color: var(--green); }
    .recent-pnl.loss { color: var(--red); }

    .recent-account {
      font-size: 10.5px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `]
})
export class DashboardRecentTrades {
  trades = input.required<UserTrade[]>();

  recentTrades() {
    return [...this.trades()]
      .sort((a, b) => new Date(b.entry_time).getTime() - new Date(a.entry_time).getTime())
      .slice(0, 7);
  }

  getResult(trade: UserTrade): string {
    if (trade.pnl_absolute > 0) return 'win';
    if (trade.pnl_absolute < 0) return 'loss';
    return 'breakeven';
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleDateString('de-DE', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
      timeZone: 'UTC'
    });
  }
}
