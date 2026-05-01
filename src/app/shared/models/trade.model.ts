export type TradeDirection = 'Long' | 'Short';
export type TradeResult   = 'win' | 'loss' | 'breakeven';

// Model für user_trades Tabelle
export interface UserTrade {
  id: string;
  user_id: string;
  symbol: string;
  direction: TradeDirection;
  entry_price: number;
  exit_price: number;
  entry_time: string;  // ISO timestamp
  exit_time: string;   // ISO timestamp
  volume: number;
  pnl_absolute: number;
  commission: number | null;
  account_id: string;
  is_import: boolean;
  created_at: string;  // ISO timestamp
}
