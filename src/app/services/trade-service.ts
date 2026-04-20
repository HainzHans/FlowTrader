import { Injectable, computed, signal } from '@angular/core';
import {Trade, TradeResult} from '../shared/models/trade.model';

const MOCK_TRADES: Trade[] = [
  {
    id: '1',
    symbol: 'BTC/USDT',
    market: 'Crypto',
    setup: 'Liquiditätszone',
    result: 'win',
    pnl: 1_240.50,
    pnlPercent: 4.38,
    rr: 3.2,
    date: '2025-04-18',
    notes: 'Klarer Liquiditätsbereich bei 83.200. Entry nach Volumenbestätigung. SL unter letztem Swing Low.',
    tags: ['long', 'liquidity', 'confirmed'],
    imageUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    symbol: 'ETH/USDT',
    market: 'Crypto',
    setup: 'BIAS Reversal',
    result: 'loss',
    pnl: -310.00,
    pnlPercent: -1.12,
    rr: 1.8,
    date: '2025-04-17',
    notes: 'Stop knapp ausgelöst. Markt drehte danach wie erwartet. Einstieg zu früh.',
    tags: ['short', 'reversal'],
    imageUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    symbol: 'AAPL',
    market: 'Stocks',
    setup: 'Gap & Go',
    result: 'win',
    pnl: 980.00,
    pnlPercent: 6.75,
    rr: 4.1,
    date: '2025-04-16',
    notes: 'Earnings beat. Reaktion am Vormarkt klar lesbar. Sauberer Ausbruch.',
    tags: ['long', 'news', 'earnings'],
    imageUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    symbol: 'SOL/USDT',
    market: 'Crypto',
    setup: 'Pullback Entry',
    result: 'win',
    pnl: 620.00,
    pnlPercent: 12.3,
    rr: 2.8,
    date: '2025-04-15',
    notes: 'Retest des 4H-EMA. Volumen bestätigt. Klassischer Trend-Trade.',
    tags: ['long', 'trend', 'ema'],
    imageUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    symbol: 'EUR/USD',
    market: 'Forex',
    setup: 'Session Open',
    result: 'breakeven',
    pnl: 0,
    pnlPercent: 0,
    rr: 0,
    date: '2025-04-14',
    notes: 'Move zu früh ausgestoppt. Danach lief es doch — Move auf BE gezogen.',
    tags: ['scalp', 'london'],
    imageUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    symbol: 'NQ1!',
    market: 'Futures',
    setup: 'Range Break',
    result: 'win',
    pnl: 1_875.00,
    pnlPercent: 2.1,
    rr: 5.0,
    date: '2025-04-13',
    notes: 'Ausbruch aus dem 2-stündigen Pre-Market-Range. Volumen bei Ausbruch sehr stark.',
    tags: ['long', 'range', 'futures'],
    imageUrl: '',
    createdAt: new Date().toISOString(),
  },
];

@Injectable({ providedIn: 'root' })
export class TradeService {
  private _trades = signal<Trade[]>(MOCK_TRADES);

  readonly trades = this._trades.asReadonly();

  readonly stats = computed(() => {
    const all = this._trades();
    const decided = all.filter(t => t.result !== 'breakeven');
    const wins = all.filter(t => t.result === 'win');
    const losses = all.filter(t => t.result === 'loss');
    const totalPnl = all.reduce((s, t) => s + t.pnl, 0);
    const winRate = decided.length ? Math.round((wins.length / decided.length) * 100) : 0;
    const avgRR = wins.length
      ? +(wins.reduce((s, t) => s + t.rr, 0) / wins.length).toFixed(2)
      : 0;
    const bestTrade = all.reduce((b, t) => t.pnl > (b?.pnl ?? -Infinity) ? t : b, null as Trade | null);
    return { total: all.length, wins: wins.length, losses: losses.length, totalPnl, winRate, avgRR, bestTrade };
  });

  add(trade: Omit<Trade, 'id' | 'createdAt'>): void {
    const newTrade: Trade = {
      ...trade,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this._trades.update(ts => [newTrade, ...ts]);
  }

  update(id: string, partial: Partial<Omit<Trade, 'id' | 'createdAt'>>): void {
    this._trades.update(ts => ts.map(t => t.id === id ? { ...t, ...partial } : t));
  }

  delete(id: string): void {
    this._trades.update(ts => ts.filter(t => t.id !== id));
  }

  filterByResult(result: TradeResult | 'all'): Trade[] {
    if (result === 'all') return this._trades();
    return this._trades().filter(t => t.result === result);
  }
}
