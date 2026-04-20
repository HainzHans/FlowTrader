import {
  Component, input, output, signal, effect, OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Trade, MARKET_OPTIONS, SETUP_OPTIONS } from '../../../shared/models/trade.model';

export interface TradeFormData {
  symbol: string;
  market: string;
  setup: string;
  result: 'win' | 'loss' | 'breakeven';
  pnl: number;
  pnlPercent: number;
  rr: number;
  date: string;
  imageUrl: string;
  notes: string;
  tags: string[];
}

const EMPTY_FORM = (): TradeFormData => ({
  symbol: '',
  market: 'Crypto',
  setup: '',
  result: 'win',
  pnl: 0,
  pnlPercent: 0,
  rr: 0,
  date: new Date().toISOString().split('T')[0],
  imageUrl: '',
  notes: '',
  tags: [],
});

@Component({
  selector: 'app-trade-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trade-modal.html',
  styleUrl: './trade-modal.css',
})
export class TradeModal {
  editTrade = input<Trade | null>(null);
  onSave   = output<TradeFormData>();
  onClose  = output<void>();

  readonly marketOptions = MARKET_OPTIONS;
  readonly setupOptions  = SETUP_OPTIONS;

  form    = signal<TradeFormData>(EMPTY_FORM());
  tagInput = signal('');
  errors  = signal<Partial<Record<keyof TradeFormData, string>>>({});

  constructor() {
    // Sync form when editTrade changes
    effect(() => {
      const t = this.editTrade();
      if (t) {
        this.form.set({
          symbol: t.symbol,
          market: t.market,
          setup:  t.setup,
          result: t.result,
          pnl:    t.pnl,
          pnlPercent: t.pnlPercent,
          rr:     t.rr,
          date:   t.date,
          imageUrl: t.imageUrl ?? '',
          notes:  t.notes ?? '',
          tags:   [...t.tags],
        });
      } else {
        this.form.set(EMPTY_FORM());
      }
      this.errors.set({});
      this.tagInput.set('');
    });
  }

  get isEditing() { return !!this.editTrade(); }

  patch<K extends keyof TradeFormData>(key: K, value: TradeFormData[K]) {
    this.form.update(f => ({ ...f, [key]: value }));
    this.errors.update(e => { const c = { ...e }; delete c[key]; return c; });
  }

  setResult(r: 'win' | 'loss' | 'breakeven') { this.patch('result', r); }

  addTag() {
    const raw = this.tagInput().trim().toLowerCase().replace(/\s+/g, '-');
    if (!raw) return;
    const current = this.form().tags;
    if (!current.includes(raw)) {
      this.form.update(f => ({ ...f, tags: [...f.tags, raw] }));
    }
    this.tagInput.set('');
  }

  removeTag(tag: string) {
    this.form.update(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }));
  }

  onTagKey(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); this.addTag(); }
  }

  validate(): boolean {
    const f = this.form();
    const err: Partial<Record<keyof TradeFormData, string>> = {};
    if (!f.symbol.trim()) err['symbol'] = 'Symbol ist erforderlich';
    if (!f.setup.trim())  err['setup']  = 'Setup ist erforderlich';
    this.errors.set(err);
    return Object.keys(err).length === 0;
  }

  submit() {
    if (!this.validate()) return;
    this.onSave.emit(this.form());
  }

  backdropClick() { this.onClose.emit(); }
}
