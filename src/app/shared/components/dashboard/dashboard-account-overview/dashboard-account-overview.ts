import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Account} from '../../../../features/dashboard/sections/accounts-section/accounts-section';

@Component({
  selector: 'app-dashboard-account-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="accounts-card">
      <div class="accounts-header">
        <p class="accounts-label">Deine Konten</p>
        <span class="accounts-count">{{ accounts().length }} Konten</span>
      </div>

      @if (accounts().length === 0) {
        <div class="accounts-empty">
          <i class="pi pi-briefcase"></i>
          <p>Noch keine Konten angelegt.</p>
        </div>
      } @else {
        <div class="accounts-list">
          @for (acc of accounts(); track acc.id) {
            <div class="account-row">
              <div class="account-row-left">
                <div class="account-dot" [style.background]="acc.color"></div>
                <div class="account-info">
                  <span class="account-name">{{ acc.name }}</span>
                  <span class="account-broker">{{ acc.broker || acc.type }}</span>
                </div>
              </div>
              <div class="account-row-right">
                <span class="account-balance">{{ formatCurrency(acc.currentBalance, acc.currency) }}</span>
                <span class="account-pnl" [class.pos]="getPnl(acc) >= 0" [class.neg]="getPnl(acc) < 0">
                  {{ getPnl(acc) >= 0 ? '+' : '' }}{{ getPnlPercent(acc).toFixed(1) }}%
                </span>
              </div>
            </div>

            <!-- Mini progress bar -->
            <div class="account-bar-wrap">
              <div
                class="account-bar"
                [style.width]="getBarWidth(acc) + '%'"
                [style.background]="getPnl(acc) >= 0 ? acc.color : 'var(--red)'"
              ></div>
            </div>
          }
        </div>

        <!-- Total -->
        <div class="accounts-total">
          <span class="accounts-total-label">Gesamt</span>
          <span class="accounts-total-value">{{ formatCurrency(totalBalance(), 'USD') }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .accounts-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      height: 100%;
    }

    .accounts-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .accounts-label {
      font-size: 11.5px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }

    .accounts-count {
      font-size: 11.5px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      padding: 3px 10px;
      border-radius: 99px;
    }

    .accounts-empty {
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

    .accounts-empty .pi { font-size: 24px; opacity: 0.4; }

    .accounts-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
      flex: 1;
    }

    .account-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-3);
    }

    .account-row-left {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      min-width: 0;
      flex: 1;
    }

    .account-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
      box-shadow: 0 0 6px currentColor;
    }

    .account-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .account-name {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .account-broker {
      font-size: 11px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .account-row-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
      flex-shrink: 0;
    }

    .account-balance {
      font-size: 13px;
      font-weight: 600;
      font-family: var(--font-mono);
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    .account-pnl {
      font-size: 11.5px;
      font-family: var(--font-mono);
      font-weight: 500;
    }

    .account-pnl.pos { color: var(--green); }
    .account-pnl.neg { color: var(--red); }

    .account-bar-wrap {
      height: 3px;
      background: var(--bg-elevated);
      border-radius: 99px;
      overflow: hidden;
      margin-top: -8px;
      margin-bottom: var(--space-1);
    }

    .account-bar {
      height: 100%;
      border-radius: 99px;
      min-width: 2px;
      transition: width 0.5s ease;
    }

    .accounts-total {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: var(--space-3);
      border-top: 1px solid var(--border-subtle);
      margin-top: auto;
    }

    .accounts-total-label {
      font-size: 12px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .accounts-total-value {
      font-size: 15px;
      font-weight: 700;
      font-family: var(--font-mono);
      color: var(--text-primary);
      letter-spacing: -0.03em;
    }
  `]
})
export class DashboardAccountOverview {
  accounts = input.required<Account[]>();

  totalBalance() {
    return this.accounts().reduce((s, a) => s + a.currentBalance, 0);
  }

  getPnl(acc: Account): number {
    return acc.currentBalance - acc.startBalance;
  }

  getPnlPercent(acc: Account): number {
    if (acc.startBalance === 0) return 0;
    return ((acc.currentBalance - acc.startBalance) / acc.startBalance) * 100;
  }

  getBarWidth(acc: Account): number {
    const pct = Math.abs(this.getPnlPercent(acc));
    return Math.min(pct * 5, 100); // scale up small percentages
  }

  formatCurrency(value: number, currency: string): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: ['BTC', 'USD'].includes(currency) ? 'USD' : currency,
      maximumFractionDigits: 2,
    }).format(value);
  }
}
