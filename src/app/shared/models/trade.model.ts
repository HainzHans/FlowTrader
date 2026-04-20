export type TradeResult = 'win' | 'loss' | 'breakeven';

export interface Trade {
  id: string;
  symbol: string;
  market: string;         // z.B. "Crypto", "Forex", "Stocks"
  setup: string;          // z.B. "Liquiditätszone", "Pullback", "Gap & Go"
  result: TradeResult;
  pnl: number;            // absolut in $
  pnlPercent: number;
  rr: number;             // Risk:Reward ratio
  date: string;           // ISO date string
  imageUrl?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
}

export const MARKET_OPTIONS = ['Crypto', 'Forex', 'Stocks', 'Futures', 'Indices'];

export const SETUP_OPTIONS = [
  'Liquiditätszone',
  'Pullback Entry',
  'BIAS Reversal',
  'Gap & Go',
  'Range Break',
  'Trendfortsetzung',
  'News Play',
  'Session Open',
];
