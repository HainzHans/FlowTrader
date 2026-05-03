import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTrade } from '../../../../shared/models/trade.model';

@Component({
  selector: 'app-dashboard-winrate',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="winrate-card">
      <p class="winrate-label">Win Rate</p>

      <div class="winrate-donut-wrap">
        <svg viewBox="0 0 120 120" class="winrate-svg">
          <!-- Background circle -->
          <circle
            cx="60" cy="60" r="48"
            fill="none"
            stroke="var(--bg-elevated)"
            stroke-width="10"
          />
          <!-- Win arc -->
          @if (winRate() > 0) {
            <circle
              cx="60" cy="60" r="48"
              fill="none"
              stroke="#22c55e"
              stroke-width="10"
              stroke-linecap="round"
              [attr.stroke-dasharray]="winDash()"
              stroke-dashoffset="-75"
              transform="rotate(-90 60 60)"
            />
          }
          <!-- Loss arc -->
          @if (lossRate() > 0) {
            <circle
              cx="60" cy="60" r="48"
              fill="none"
              stroke="#ef4444"
              stroke-width="10"
              stroke-linecap="round"
              [attr.stroke-dasharray]="lossDash()"
              [attr.stroke-dashoffset]="lossOffset()"
              transform="rotate(-90 60 60)"
            />
          }
          <!-- Center text -->
          <text x="60" y="55" text-anchor="middle" class="donut-pct" font-size="20" font-weight="700" fill="var(--text-primary)" font-family="var(--font-mono)">
            {{ winRate() }}%
          </text>
          <text x="60" y="70" text-anchor="middle" font-size="9" fill="var(--text-tertiary)" font-family="var(--font-mono)">
            WIN RATE
          </text>
        </svg>
      </div>

      <div class="winrate-legend">
        <div class="winrate-legend-item">
          <span class="winrate-legend-dot win"></span>
          <div class="winrate-legend-body">
            <span class="winrate-legend-label">Wins</span>
            <span class="winrate-legend-value win-text">{{ wins() }}</span>
          </div>
        </div>
        <div class="winrate-legend-divider"></div>
        <div class="winrate-legend-item">
          <span class="winrate-legend-dot loss"></span>
          <div class="winrate-legend-body">
            <span class="winrate-legend-label">Losses</span>
            <span class="winrate-legend-value loss-text">{{ losses() }}</span>
          </div>
        </div>
        <div class="winrate-legend-divider"></div>
        <div class="winrate-legend-item">
          <span class="winrate-legend-dot neutral"></span>
          <div class="winrate-legend-body">
            <span class="winrate-legend-label">Break Even</span>
            <span class="winrate-legend-value">{{ breakevens() }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .winrate-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      align-items: center;
    }

    .winrate-label {
      font-size: 11.5px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.07em;
      align-self: flex-start;
      width: 100%;
    }

    .winrate-donut-wrap {
      width: 130px;
      height: 130px;
      flex-shrink: 0;
    }

    .winrate-svg {
      width: 100%;
      height: 100%;
    }

    .winrate-legend {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
    }

    .winrate-legend-item {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }

    .winrate-legend-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .winrate-legend-dot.win     { background: var(--green); box-shadow: 0 0 5px rgba(34,197,94,0.4); }
    .winrate-legend-dot.loss    { background: var(--red);   box-shadow: 0 0 5px rgba(239,68,68,0.4); }
    .winrate-legend-dot.neutral { background: var(--text-tertiary); }

    .winrate-legend-body {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .winrate-legend-label {
      font-size: 10px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .winrate-legend-value {
      font-size: 14px;
      font-weight: 700;
      font-family: var(--font-mono);
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    .winrate-legend-value.win-text  { color: var(--green); }
    .winrate-legend-value.loss-text { color: var(--red); }

    .winrate-legend-divider {
      width: 1px;
      height: 24px;
      background: var(--border-subtle);
    }
  `]
})
export class DashboardWinRate {
  trades = input.required<UserTrade[]>();

  wins        = computed(() => this.trades().filter(t => t.pnl_absolute > 0).length);
  losses      = computed(() => this.trades().filter(t => t.pnl_absolute < 0).length);
  breakevens  = computed(() => this.trades().filter(t => t.pnl_absolute === 0).length);

  winRate  = computed(() => {
    const total = this.trades().length;
    return total > 0 ? Math.round((this.wins() / total) * 100) : 0;
  });

  lossRate = computed(() => {
    const total = this.trades().length;
    return total > 0 ? Math.round((this.losses() / total) * 100) : 0;
  });

  private circumference = 2 * Math.PI * 48; // r=48

  winDash = computed(() => {
    const frac = this.winRate() / 100;
    const arc  = frac * this.circumference;
    return `${arc} ${this.circumference - arc}`;
  });

  lossDash = computed(() => {
    const frac = this.lossRate() / 100;
    const arc  = frac * this.circumference;
    return `${arc} ${this.circumference - arc}`;
  });

  lossOffset = computed(() => {
    const winArc = (this.winRate() / 100) * this.circumference;
    return -(winArc + 75);
  });
}
