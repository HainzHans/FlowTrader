import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserTrade } from '../../../../shared/models/trade.model';

interface DayData {
  date: string;
  pnl: number;
  tradeCount: number;
  intensity: 'strong-win' | 'win' | 'neutral' | 'loss' | 'strong-loss' | 'empty';
}

@Component({
  selector: 'app-dashboard-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="calendar-card">
      <div class="calendar-header">
        <p class="calendar-label">Trading Kalender</p>
        <div class="calendar-legend">
          <span class="legend-item">
            <span class="legend-dot legend-dot--loss"></span> Verlust
          </span>
          <span class="legend-item">
            <span class="legend-dot legend-dot--neutral"></span> Break Even
          </span>
          <span class="legend-item">
            <span class="legend-dot legend-dot--win"></span> Gewinn
          </span>
        </div>
      </div>

      <div class="calendar-grid-wrap">
        <!-- Day labels -->
        <div class="calendar-day-labels">
          @for (day of dayLabels; track day) {
            <span class="calendar-day-label">{{ day }}</span>
          }
        </div>

        <div class="calendar-grid">
          <!-- Empty cells for offset -->
          @for (cell of paddingCells(); track $index) {
            <div class="calendar-cell calendar-cell--empty"></div>
          }
          <!-- Day cells -->
          @for (day of calendarDays(); track day.date) {
            <div
              class="calendar-cell calendar-cell--{{ day.intensity }}"
              [title]="day.tradeCount > 0 ? day.date + ': ' + (day.pnl >= 0 ? '+' : '') + day.pnl.toFixed(2) + '$ (' + day.tradeCount + ' Trades)' : day.date + ': Kein Trading'"
            >
              @if (day.tradeCount > 0 && day.intensity !== 'empty') {
                <span class="calendar-cell-dot"></span>
              }
            </div>
          }
        </div>
      </div>

      <!-- Month labels -->
      <div class="calendar-month-labels">
        @for (m of monthLabels(); track m.label) {
          <span class="calendar-month-label" [style.grid-column-start]="m.col">{{ m.label }}</span>
        }
      </div>
    </div>
  `,
  styles: [`
    .calendar-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }

    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: var(--space-3);
    }

    .calendar-label {
      font-size: 11.5px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }

    .calendar-legend {
      display: flex;
      gap: var(--space-4);
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 2px;
    }

    .legend-dot--loss    { background: rgba(239,68,68,0.5); }
    .legend-dot--neutral { background: var(--bg-overlay); border: 1px solid var(--border-default); }
    .legend-dot--win     { background: rgba(34,197,94,0.5); }

    .calendar-grid-wrap {
      display: flex;
      gap: var(--space-2);
      overflow-x: auto;
      padding-bottom: var(--space-1);
    }

    .calendar-day-labels {
      display: grid;
      grid-template-rows: repeat(7, 14px);
      gap: 3px;
      flex-shrink: 0;
    }

    .calendar-day-label {
      font-size: 10px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      line-height: 14px;
      width: 18px;
    }

    .calendar-grid {
      display: grid;
      grid-template-rows: repeat(7, 14px);
      grid-auto-columns: 14px;
      grid-auto-flow: column;
      gap: 3px;
    }

    .calendar-cell {
      width: 14px;
      height: 14px;
      border-radius: 3px;
      position: relative;
      transition: transform 0.1s ease;
      cursor: default;
    }

    .calendar-cell:hover { transform: scale(1.3); }

    .calendar-cell--empty       { background: transparent; }
    .calendar-cell--neutral     { background: var(--bg-elevated); border: 1px solid var(--border-subtle); }
    .calendar-cell--win         { background: rgba(34,197,94,0.35); }
    .calendar-cell--strong-win  { background: rgba(34,197,94,0.7); box-shadow: 0 0 6px rgba(34,197,94,0.3); }
    .calendar-cell--loss        { background: rgba(239,68,68,0.35); }
    .calendar-cell--strong-loss { background: rgba(239,68,68,0.7); box-shadow: 0 0 6px rgba(239,68,68,0.3); }

    .calendar-cell-dot {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: rgba(255,255,255,0.5);
    }

    .calendar-month-labels {
      display: flex;
      gap: 0;
      margin-left: 24px;
      overflow: hidden;
    }

    .calendar-month-label {
      font-size: 10px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      min-width: 0;
      flex: 1;
    }
  `]
})
export class DashboardCalendar {
  trades = input.required<UserTrade[]>();

  readonly dayLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  private tradesByDay = computed(() => {
    const map = new Map<string, { pnl: number; count: number }>();
    for (const t of this.trades()) {
      const day = t.entry_time.slice(0, 10);
      const existing = map.get(day) ?? { pnl: 0, count: 0 };
      map.set(day, { pnl: existing.pnl + t.pnl_absolute, count: existing.count + 1 });
    }
    return map;
  });

  calendarDays = computed((): DayData[] => {
    const today  = new Date();
    const start  = new Date(today);
    start.setDate(today.getDate() - 364);

    const days: DayData[] = [];
    const cur = new Date(start);

    // Compute avg abs PnL for intensity thresholds
    const allPnls = [...this.tradesByDay().values()].map(v => Math.abs(v.pnl));
    const avgAbs  = allPnls.length > 0 ? allPnls.reduce((a, b) => a + b, 0) / allPnls.length : 100;

    while (cur <= today) {
      const dateStr = cur.toISOString().slice(0, 10);
      const data    = this.tradesByDay().get(dateStr);

      let intensity: DayData['intensity'] = 'neutral';
      if (data) {
        const abs = Math.abs(data.pnl);
        if (data.pnl > 0)  intensity = abs > avgAbs ? 'strong-win'  : 'win';
        if (data.pnl < 0)  intensity = abs > avgAbs ? 'strong-loss' : 'loss';
      }

      days.push({
        date:       dateStr,
        pnl:        data?.pnl ?? 0,
        tradeCount: data?.count ?? 0,
        intensity,
      });

      cur.setDate(cur.getDate() + 1);
    }
    return days;
  });

  paddingCells = computed(() => {
    const days    = this.calendarDays();
    if (days.length === 0) return [];
    const first   = new Date(days[0].date + 'T00:00:00Z');
    const dow     = first.getUTCDay(); // 0 = Sun
    const offset  = dow === 0 ? 6 : dow - 1; // Mon-based
    return new Array(offset).fill(null);
  });

  monthLabels = computed(() => {
    const days   = this.calendarDays();
    const offset = this.paddingCells().length;
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;

    days.forEach((d, i) => {
      const month = new Date(d.date + 'T00:00:00Z').getUTCMonth();
      if (month !== lastMonth) {
        const totalIdx = offset + i;
        const col      = Math.floor(totalIdx / 7) + 1;
        labels.push({
          label: new Date(d.date + 'T00:00:00Z').toLocaleDateString('de-DE', { month: 'short' }),
          col,
        });
        lastMonth = month;
      }
    });
    return labels;
  });
}
