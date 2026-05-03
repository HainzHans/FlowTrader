import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DashboardStat {
  label: string;
  value: string;
  subValue?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendPercent?: string;
  icon: string;
  accent?: 'green' | 'red' | 'accent' | 'amber';
}

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-grid">
      @for (stat of stats(); track stat.label) {
        <div class="stat-card stat-card--{{ stat.accent ?? 'default' }}">
          <div class="stat-card-top">
            <div class="stat-icon stat-icon--{{ stat.accent ?? 'default' }}">
              <i class="pi {{ stat.icon }}"></i>
            </div>
            @if (stat.trend) {
              <div class="stat-trend stat-trend--{{ stat.trend }}">
                <i class="pi {{ stat.trend === 'up' ? 'pi-arrow-up' : stat.trend === 'down' ? 'pi-arrow-down' : 'pi-minus' }}"></i>
                {{ stat.trendPercent }}
              </div>
            }
          </div>
          <div class="stat-body">
            <p class="stat-label">{{ stat.label }}</p>
            <p class="stat-value">{{ stat.value }}</p>
            @if (stat.subValue) {
              <p class="stat-sub">{{ stat.subValue }}</p>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-4);
    }

    .stat-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: var(--space-5);
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      position: relative;
      overflow: hidden;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      inset: 0;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      border-color: var(--border-default);
    }

    .stat-card--green::before { background: radial-gradient(ellipse at top left, rgba(34,197,94,0.06) 0%, transparent 60%); }
    .stat-card--red::before   { background: radial-gradient(ellipse at top left, rgba(239,68,68,0.06) 0%, transparent 60%); }
    .stat-card--accent::before { background: radial-gradient(ellipse at top left, rgba(124,58,237,0.08) 0%, transparent 60%); }
    .stat-card--amber::before  { background: radial-gradient(ellipse at top left, rgba(245,158,11,0.06) 0%, transparent 60%); }

    .stat-card:hover::before { opacity: 1; }

    .stat-card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    .stat-icon--default { background: var(--bg-elevated); border: 1px solid var(--border-default); color: var(--text-tertiary); }
    .stat-icon--green   { background: rgba(34,197,94,0.12);   border: 1px solid rgba(34,197,94,0.25);   color: var(--green); }
    .stat-icon--red     { background: rgba(239,68,68,0.12);   border: 1px solid rgba(239,68,68,0.25);   color: var(--red); }
    .stat-icon--accent  { background: var(--accent-muted);    border: 1px solid var(--accent-border);   color: var(--accent-bright); }
    .stat-icon--amber   { background: rgba(245,158,11,0.12);  border: 1px solid rgba(245,158,11,0.25);  color: var(--amber); }

    .stat-trend {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 9px;
      border-radius: 99px;
      font-size: 11.5px;
      font-family: var(--font-mono);
      font-weight: 500;
    }

    .stat-trend .pi { font-size: 9px; }

    .stat-trend--up      { background: rgba(34,197,94,0.12);  color: var(--green); border: 1px solid rgba(34,197,94,0.2); }
    .stat-trend--down    { background: rgba(239,68,68,0.12);  color: var(--red);   border: 1px solid rgba(239,68,68,0.2); }
    .stat-trend--neutral { background: var(--bg-elevated);    color: var(--text-tertiary); border: 1px solid var(--border-subtle); }

    .stat-body {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .stat-label {
      font-size: 11.5px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.07em;
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 700;
      font-family: var(--font-mono);
      letter-spacing: -0.04em;
      line-height: 1;
      color: var(--text-primary);
    }

    .stat-sub {
      font-size: 12px;
      font-family: var(--font-mono);
      color: var(--text-tertiary);
      margin-top: 2px;
    }

    @media (max-width: 1100px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 560px) {
      .stats-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardStats {
  stats = input.required<DashboardStat[]>();
}
