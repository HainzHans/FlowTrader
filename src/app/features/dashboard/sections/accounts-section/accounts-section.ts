import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {SectionHeader} from '../../components/section-header/section-header';

export type AccountType = 'live' | 'prop' | 'demo';

export interface Account {
  id: string;
  name: string;
  broker: string;
  type: AccountType;
  currency: string;
  startBalance: number;
  currentBalance: number;
  createdAt: string;
  color: string;
}

@Component({
  selector: 'app-accounts-section',
  standalone: true,
  imports: [CommonModule, FormsModule, SectionHeader],
  templateUrl: './accounts-section.html',
  styleUrl: './accounts-section.css',
})
export class AccountsSection {

  accounts = signal<Account[]>([
    {
      id: 'a1',
      name: 'Haupt-Konto',
      broker: 'Interactive Brokers',
      type: 'live',
      currency: 'USD',
      startBalance: 10000,
      currentBalance: 11240,
      createdAt: '2025-01-15',
      color: '#22c55e',
    },
    {
      id: 'a2',
      name: 'FTMO Challenge',
      broker: 'FTMO',
      type: 'prop',
      currency: 'USD',
      startBalance: 100000,
      currentBalance: 98500,
      createdAt: '2025-03-01',
      color: '#7c3aed',
    },
  ]);

  showModal = signal(false);
  editingAccount = signal<Account | null>(null);
  deleteConfirmId = signal<string | null>(null);

  accountForm = signal({
    name: '',
    broker: '',
    type: 'live' as AccountType,
    currency: 'USD',
    startBalance: '' as string | number,
    color: '#22c55e',
  });

  accountTypes: { value: AccountType; label: string; icon: string; desc: string; color: string }[] = [
    { value: 'live',  label: 'Live',       icon: 'pi-circle-fill', desc: 'Echtes Kapital',    color: '#22c55e' },
    { value: 'prop',  label: 'Prop Firm',  icon: 'pi-building',    desc: 'Fremdkapital',      color: '#7c3aed' },
    { value: 'demo',  label: 'Demo',       icon: 'pi-desktop',     desc: 'Übungskonto',       color: '#64748b' },
  ];

  currencies = ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'BTC'];
  colors = ['#22c55e', '#7c3aed', '#3b82f6', '#ef4444', '#f59e0b', '#ec4899', '#14b8a6', '#f97316'];

  totalBalance = computed(() =>
    this.accounts().reduce((sum, a) => sum + a.currentBalance, 0)
  );

  totalPnl = computed(() =>
    this.accounts().reduce((sum, a) => sum + (a.currentBalance - a.startBalance), 0)
  );

  getTypeMeta(type: AccountType) {
    return this.accountTypes.find(t => t.value === type)!;
  }

  getPnl(account: Account): number {
    return account.currentBalance - account.startBalance;
  }

  getPnlPercent(account: Account): number {
    return ((account.currentBalance - account.startBalance) / account.startBalance) * 100;
  }

  formatCurrency(value: number, currency: string): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: currency === 'BTC' ? 'USD' : currency,
      maximumFractionDigits: 2,
    }).format(value).replace('US$', currency === 'BTC' ? '₿' : '$');
  }

  openNew() {
    this.editingAccount.set(null);
    this.accountForm.set({ name: '', broker: '', type: 'live', currency: 'USD', startBalance: '', color: '#22c55e' });
    this.showModal.set(true);
  }

  openEdit(account: Account) {
    this.editingAccount.set(account);
    this.accountForm.set({
      name: account.name,
      broker: account.broker,
      type: account.type,
      currency: account.currency,
      startBalance: account.startBalance,
      color: account.color,
    });
    this.showModal.set(true);
  }

  save() {
    const f = this.accountForm();
    if (!f.name.trim() || !f.startBalance) return;
    const balance = typeof f.startBalance === 'string' ? parseFloat(f.startBalance) : f.startBalance;
    if (isNaN(balance) || balance <= 0) return;

    const editing = this.editingAccount();
    if (editing) {
      this.accounts.update(list => list.map(a => a.id === editing.id
        ? { ...a, name: f.name, broker: f.broker, type: f.type, currency: f.currency, startBalance: balance, color: f.color }
        : a));
    } else {
      const newAccount: Account = {
        id: 'a' + Date.now(),
        name: f.name,
        broker: f.broker,
        type: f.type,
        currency: f.currency,
        startBalance: balance,
        currentBalance: balance,
        createdAt: new Date().toISOString().slice(0, 10),
        color: f.color,
      };
      this.accounts.update(list => [...list, newAccount]);
    }
    this.showModal.set(false);
  }

  confirmDelete(id: string) {
    this.deleteConfirmId.set(id);
  }

  deleteAccount() {
    const id = this.deleteConfirmId();
    if (id) this.accounts.update(list => list.filter(a => a.id !== id));
    this.deleteConfirmId.set(null);
  }


  //Helper
  accountUpdateColor(color: any){
    this.accountForm.update(f => ({...f, color: color}))
  }

  accountUpdateStartBalance(event: any){
    this.accountForm.update(f => ({...f, startBalance: event}))
  }

  accountUpdateCurrency(event: any){
    this.accountForm.update(f => ({...f, currency: event}))
  }

  accountUpdateType(value: any){
    this.accountForm.update(f => ({...f, type: value}))
  }

  accountUpdateBroker(event: any){
    this.accountForm.update(f => ({...f, broker: event}))
  }

  accountUpdateName(event: any){
    this.accountForm.update(f => ({...f, name: event}))
  }

  protected readonly Math = Math;
}
