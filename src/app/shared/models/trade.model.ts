export type TradeDirection = 'Long' | 'Short';
export type TradeResult   = 'win' | 'loss' | 'breakeven';

export interface Trade {
  id:           string;
  symbol:       string;
  direction:    TradeDirection;
  entry_price:  number;
  exit_price:   number;
  entry_time:   string;   // ISO timestamp
  exit_time:    string;   // ISO timestamp
  volume:       number;
  pnl_absolute: number;
  pnl_percent:  number;
  commission:   number | null;
  account_id:   string;
  source:       string;
  created_at:   string;
}

// ── Derived helpers ──────────────────────────────────────────
export function tradeResult(t: Trade): TradeResult {
  if (t.pnl_absolute > 0)  return 'win';
  if (t.pnl_absolute < 0)  return 'loss';
  return 'breakeven';
}

/** Duration between entry and exit in a human-readable format */
export function tradeDuration(t: Trade): string {
  const ms   = new Date(t.exit_time).getTime() - new Date(t.entry_time).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 60)  return `${mins}m`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/** Formatted entry date e.g. "12. Apr 2025" */
export function tradeDate(t: Trade): string {
  return new Date(t.entry_time).toLocaleDateString('de-DE', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

/** Formatted entry time e.g. "14:32" */
export function tradeTime(t: Trade): string {
  return new Date(t.entry_time).toLocaleTimeString('de-DE', {
    hour: '2-digit', minute: '2-digit'
  });
}
