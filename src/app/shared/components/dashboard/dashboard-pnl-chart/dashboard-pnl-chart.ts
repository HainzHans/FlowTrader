import { Component, input, computed, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTrade } from '../../../../shared/models/trade.model';

@Component({
  selector: 'app-dashboard-pnl-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pnl-chart-card">
      <div class="pnl-chart-header">
        <div class="pnl-chart-title-group">
          <p class="pnl-chart-label">P&L Verlauf</p>
          <p class="pnl-chart-total" [class.positive]="totalPnl() >= 0" [class.negative]="totalPnl() < 0">
            {{ totalPnl() >= 0 ? '+' : '' }}{{ formatCurrency(totalPnl()) }}
          </p>
        </div>
        <div class="pnl-chart-meta">
          <span class="pnl-meta-pill pnl-meta-pill--win">
            <i class="pi pi-arrow-up"></i>
            {{ winCount() }} Wins
          </span>
          <span class="pnl-meta-pill pnl-meta-pill--loss">
            <i class="pi pi-arrow-down"></i>
            {{ lossCount() }} Losses
          </span>
        </div>
      </div>

      @if (chartPoints().length > 1) {
        <div class="pnl-chart-area">
          <svg [attr.viewBox]="'0 0 800 200'" preserveAspectRatio="none" class="pnl-svg">
            <defs>
              <linearGradient id="pnlGradientPos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#22c55e" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="#22c55e" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="pnlGradientNeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#ef4444" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
              </linearGradient>
            </defs>

            <!-- Zero line -->
            <line
              x1="0" [attr.y1]="zeroY()"
              x2="800" [attr.y2]="zeroY()"
              stroke="rgba(255,255,255,0.08)"
              stroke-width="1"
              stroke-dasharray="4 4"
            />

            <!-- Fill -->
            <path
              [attr.d]="fillPath()"
              [attr.fill]="totalPnl() >= 0 ? 'url(#pnlGradientPos)' : 'url(#pnlGradientNeg)'"
            />

            <!-- Line -->
            <path
              [attr.d]="linePath()"
              fill="none"
              [attr.stroke]="totalPnl() >= 0 ? '#22c55e' : '#ef4444'"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <!-- End dot -->
            @if (endPoint()) {
              <circle
                [attr.cx]="endPoint()!.x"
                [attr.cy]="endPoint()!.y"
                r="4"
                [attr.fill]="totalPnl() >= 0 ? '#22c55e' : '#ef4444'"
              />
              <circle
                [attr.cx]="endPoint()!.x"
                [attr.cy]="endPoint()!.y"
                r="8"
                [attr.fill]="totalPnl() >= 0 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'"
              />
            }
          </svg>

          <!-- Y-axis labels -->
          <div class="pnl-y-labels">
            <span class="pnl-y-label">{{ formatCurrencyShort(maxVal()) }}</span>
            <span class="pnl-y-label">0</span>
            <span class="pnl-y-label">{{ formatCurrencyShort(minVal()) }}</span>
          </div>
        </div>

        <!-- X-axis: trade numbers -->
        <div class="pnl-x-labels">
          <span class="pnl-x-label">Trade #1</span>
          <span class="pnl-x-label">Trade #{{ Math.ceil(chartPoints().length / 2) }}</span>
          <span class="pnl-x-label">Trade #{{ chartPoints().length }}</span>
        </div>
      } @else {
        <div class="pnl-empty">
          <i class="pi pi-chart-line"></i>
          <p>Noch keine Trades für den Chart vorhanden.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .pnl-chart-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .pnl-chart-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--space-4);
      flex-wrap: wrap;
    }

    .pnl-chart-label {
      font-size: 11.5px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.07em;
      margin-bottom: 4px;
    }

    .pnl-chart-total {
      font-size: 1.75rem;
      font-weight: 700;
      font-family: var(--font-mono);
      letter-spacing: -0.04em;
      line-height: 1;
    }

    .pnl-chart-total.positive { color: var(--green); }
    .pnl-chart-total.negative { color: var(--red); }

    .pnl-chart-meta {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      flex-wrap: wrap;
    }

    .pnl-meta-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 12px;
      border-radius: 99px;
      font-size: 12px;
      font-family: var(--font-mono);
      font-weight: 500;
    }

    .pnl-meta-pill .pi { font-size: 10px; }

    .pnl-meta-pill--win  { background: rgba(34,197,94,0.12);  color: var(--green); border: 1px solid rgba(34,197,94,0.25); }
    .pnl-meta-pill--loss { background: rgba(239,68,68,0.12);  color: var(--red);   border: 1px solid rgba(239,68,68,0.25); }

    .pnl-chart-area {
      position: relative;
      height: 160px;
    }

    .pnl-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .pnl-y-labels {
      position: absolute;
      right: 0;
      top: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 4px 0;
      pointer-events: none;
    }

    .pnl-y-label {
      font-size: 10px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      text-align: right;
    }

    .pnl-x-labels {
      display: flex;
      justify-content: space-between;
    }

    .pnl-x-label {
      font-size: 10px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
    }

    .pnl-empty {
      height: 140px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-3);
      color: var(--text-tertiary);
      font-size: 13.5px;
    }

    .pnl-empty .pi { font-size: 28px; opacity: 0.4; }
  `]
})
export class DashboardPnlChart implements OnChanges {
  trades = input.required<UserTrade[]>();

  protected readonly Math = Math;

  private cumulativePnl = computed(() => {
    const sorted = [...this.trades()].sort(
      (a, b) => new Date(a.entry_time).getTime() - new Date(b.entry_time).getTime()
    );
    let cumulative = 0;
    return sorted.map(t => {
      cumulative += t.pnl_absolute;
      return cumulative;
    });
  });

  chartPoints = computed(() => this.cumulativePnl());
  totalPnl    = computed(() => this.trades().reduce((s, t) => s + t.pnl_absolute, 0));
  winCount    = computed(() => this.trades().filter(t => t.pnl_absolute > 0).length);
  lossCount   = computed(() => this.trades().filter(t => t.pnl_absolute < 0).length);

  maxVal = computed(() => Math.max(0, ...this.chartPoints()));
  minVal = computed(() => Math.min(0, ...this.chartPoints()));

  private svgWidth  = 800;
  private svgHeight = 200;
  private padding   = 10;

  private getX(index: number): number {
    const pts = this.chartPoints();
    if (pts.length <= 1) return this.svgWidth / 2;
    return this.padding + (index / (pts.length - 1)) * (this.svgWidth - this.padding * 2);
  }

  private getY(value: number): number {
    const range = this.maxVal() - this.minVal();
    if (range === 0) return this.svgHeight / 2;
    const ratio = (value - this.minVal()) / range;
    return (this.svgHeight - this.padding) - ratio * (this.svgHeight - this.padding * 2);
  }

  zeroY = computed(() => this.getY(0));

  linePath = computed(() => {
    const pts = this.chartPoints();
    if (pts.length < 2) return '';
    return pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${this.getX(i)},${this.getY(v)}`).join(' ');
  });

  fillPath = computed(() => {
    const pts = this.chartPoints();
    if (pts.length < 2) return '';
    const line = pts.map((v, i) => `${i === 0 ? 'M' : 'L'}${this.getX(i)},${this.getY(v)}`).join(' ');
    const lastX = this.getX(pts.length - 1);
    const z     = this.getY(0);
    return `${line} L${lastX},${z} L${this.getX(0)},${z} Z`;
  });

  endPoint = computed(() => {
    const pts = this.chartPoints();
    if (pts.length === 0) return null;
    return { x: this.getX(pts.length - 1), y: this.getY(pts[pts.length - 1]) };
  });

  ngOnChanges() {}

  formatCurrency(val: number): string {
    const prefix = val >= 0 ? '+' : '';
    return prefix + val.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '$';
  }

  formatCurrencyShort(val: number): string {
    if (Math.abs(val) >= 1000) return (val / 1000).toFixed(1) + 'k$';
    return val.toFixed(0) + '$';
  }
}
