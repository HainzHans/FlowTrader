import {TradeDirection} from '../enums/direction.enum';

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


export interface Trade {
  id: string;
  symbol: string;
  direction: TradeDirection;
  entry_price: number;
  exit_price: number;
  entry_time: string;
  exit_time: string;
  volume: number;
  pnl_absolute: number;
  account_id: string;
}
