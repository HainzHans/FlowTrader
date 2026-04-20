import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeCard } from '../../../../shared/components/cards/trade-card/trade-card';
import { TradeFormData, TradeModal } from '../../../../shared/components/trade-modal/trade-modal';
import { DeleteConfirm } from '../../../../shared/components/delete-confirm/delete-confirm';
import { TradeService } from '../../../../services/trade-service';
import { Trade } from '../../../../shared/models/trade.model';

type Filter = 'all' | 'win' | 'loss' | 'breakeven';

@Component({
  selector: 'app-trades-component',
  standalone: true,
  imports: [CommonModule, TradeCard, TradeModal, DeleteConfirm],
  templateUrl: './trades-component.html',
  styleUrl: './trades-component.css',
})
export class TradesComponent {
  private svc = inject(TradeService);

  readonly stats     = this.svc.stats;
  readonly allTrades = this.svc.trades;

  activeFilter = signal<Filter>('all');
  searchQuery  = signal('');
  showModal    = signal(false);
  editingTrade = signal<Trade | null>(null);
  deleteId     = signal<string | null>(null);

  filteredTrades = computed(() => {
    let list = this.svc.filterByResult(this.activeFilter());
    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      list = list.filter(t =>
        t.symbol.toLowerCase().includes(q) ||
        t.setup.toLowerCase().includes(q)  ||
        t.market.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.includes(q))
      );
    }
    return list;
  });

  // ── Modal ──────────────────────────────────
  openAdd() {
    this.editingTrade.set(null);
    this.showModal.set(true);
  }

  openEdit(trade: Trade) {
    this.editingTrade.set(trade);
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
    this.editingTrade.set(null);
  }

  saveHandler(data: TradeFormData) {
    const editing = this.editingTrade();
    if (editing) {
      this.svc.update(editing.id, data);
    } else {
      this.svc.add(data);
    }
    this.closeModal();
  }

  // ── Delete ──────────────────────────────────
  requestDelete(id: string) { this.deleteId.set(id); }
  cancelDelete()            { this.deleteId.set(null); }
  confirmDelete() {
    const id = this.deleteId();
    if (id) this.svc.delete(id);
    this.deleteId.set(null);
  }

  // ── Helpers ────────────────────────────────
  setFilter(f: Filter) { this.activeFilter.set(f); }

  formatPnl(n: number): string {
    return (n >= 0 ? '+' : '') +
      n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '$';
  }
}
