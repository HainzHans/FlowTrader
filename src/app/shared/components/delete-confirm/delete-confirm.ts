import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-confirm',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirm-backdrop" (click)="onCancel.emit()">
      <div class="confirm-dialog" (click)="$event.stopPropagation()">
        <div class="confirm-icon">
          <i class="pi pi-exclamation-triangle"></i>
        </div>
        <h3>Trade löschen?</h3>
        <p>Diese Aktion kann nicht rückgängig gemacht werden.</p>
        <div class="confirm-actions">
          <button class="btn-cancel" (click)="onCancel.emit()">Abbrechen</button>
          <button class="btn-delete" (click)="onConfirm.emit()">
            <i class="pi pi-trash"></i> Löschen
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.78);
      backdrop-filter: blur(8px);
      z-index: 3000;
      display: flex; align-items: center; justify-content: center;
      padding: var(--space-4);
      animation: fadeIn 0.15s ease;
    }
    @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
    .confirm-dialog {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-2xl);
      padding: var(--space-8) var(--space-8);
      max-width: 360px; width: 100%;
      text-align: center;
      animation: slideUp 0.2s cubic-bezier(0.34,1.42,0.64,1);
      box-shadow: 0 40px 80px rgba(0,0,0,0.5);
    }
    @keyframes slideUp { from { transform:translateY(16px) scale(0.97); opacity:0 } to { transform:translateY(0) scale(1); opacity:1 } }
    .confirm-icon {
      width: 52px; height: 52px;
      border-radius: 50%;
      background: var(--red-muted);
      border: 1px solid rgba(239,68,68,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 20px; color: var(--red);
      margin: 0 auto var(--space-4);
    }
    h3 { font-size: 1.0625rem; font-weight: 600; margin-bottom: var(--space-2); color: var(--text-primary); }
    p  { font-size: 13px; color: var(--text-tertiary); margin-bottom: var(--space-6); }
    .confirm-actions { display: flex; gap: var(--space-3); justify-content: center; }
    .btn-cancel {
      padding: 9px 20px; border-radius: var(--radius-md);
      border: 1px solid var(--border-default);
      background: transparent; font-size: 13.5px; font-family: var(--font-sans);
      color: var(--text-secondary); cursor: pointer; transition: all 0.15s;
    }
    .btn-cancel:hover { background: var(--bg-elevated); color: var(--text-primary); }
    .btn-delete {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 9px 20px; border-radius: var(--radius-md);
      border: none; background: var(--red);
      font-size: 13.5px; font-family: var(--font-sans); font-weight: 500;
      color: #fff; cursor: pointer; transition: all 0.15s;
    }
    .btn-delete:hover { background: #dc2626; transform: translateY(-1px); }
  `],
})
export class DeleteConfirm {
  onConfirm = output<void>();
  onCancel  = output<void>();
}
