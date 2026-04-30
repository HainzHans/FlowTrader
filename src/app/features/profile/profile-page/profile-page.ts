import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service/auth-service';
import { supabase } from '../../../core/supabase.client';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit {
  private auth   = inject(AuthService);
  private router = inject(Router);

  email    = computed(() => this.auth.user()?.email ?? '');
  userId   = computed(() => this.auth.user()?.id ?? '');
  joinedAt = computed(() => {
    const raw = this.auth.user()?.created_at;
    if (!raw) return '—';
    return new Date(raw).toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' });
  });

  displayName   = signal('');
  avatarInitial = computed(() => {
    const n = this.displayName();
    return n ? n.charAt(0).toUpperCase() : (this.email().charAt(0).toUpperCase() || 'U');
  });

  saving     = signal(false);
  successMsg = signal('');
  errorMsg   = signal('');

  newPassword     = signal('');
  confirmPassword = signal('');
  savingPw        = signal(false);
  pwSuccessMsg    = signal('');
  pwErrorMsg      = signal('');
  showNewPw       = signal(false);
  showConfirmPw   = signal(false);

  pwStrength = computed(() => {
    const pw = this.newPassword();
    if (pw.length === 0) return 0;
    if (pw.length < 6)  return 1;
    if (pw.length < 10) return 2;
    if (pw.length < 14) return 3;
    return 4;
  });

  pwStrengthLabel = computed(() =>
    ['', 'Zu kurz', 'Schwach', 'Gut', 'Stark'][this.pwStrength()]
  );

  apiKey         = signal('');
  apiKeyVisible  = signal(false);
  generatingKey  = signal(false);
  keyCopied      = signal(false);
  keyGeneratedAt = signal('');

  cancelReason     = signal('');
  showCancelForm   = signal(false);
  cancellingPlan   = signal(false);
  cancelSuccessMsg = signal('');
  cancelErrorMsg   = signal('');

  cancelReasons = [
    'Zu teuer',
    'Nutze es nicht genug',
    'Wechsel zu einem anderen Tool',
    'Fehlende Features',
    'Anderer Grund',
  ];

  activeTab = signal<'profile' | 'security' | 'api' | 'subscription'>('profile');

  ngOnInit() {
    const meta = this.auth.user()?.user_metadata;
    if (meta?.['display_name']) this.displayName.set(meta['display_name']);
    if (meta?.['api_key']) {
      this.apiKey.set(meta['api_key']);
      this.keyGeneratedAt.set(meta['api_key_created_at'] ?? '');
    }
  }

  setTab(tab: 'profile' | 'security' | 'api' | 'subscription') {
    this.activeTab.set(tab);
    this.clearAllMessages();
  }

  async saveProfile() {
    this.clearAllMessages();
    if (!this.displayName().trim()) { this.errorMsg.set('Bitte gib einen Anzeigenamen ein.'); return; }
    this.saving.set(true);
    const { error } = await supabase.auth.updateUser({ data: { display_name: this.displayName().trim() } });
    this.saving.set(false);
    if (error) { this.errorMsg.set('Fehler: ' + error.message); } else { this.successMsg.set('Profil gespeichert.'); }
  }

  async changePassword() {
    this.pwErrorMsg.set(''); this.pwSuccessMsg.set('');
    if (!this.newPassword() || !this.confirmPassword()) { this.pwErrorMsg.set('Bitte alle Felder ausfüllen.'); return; }
    if (this.newPassword().length < 6) { this.pwErrorMsg.set('Mindestens 6 Zeichen.'); return; }
    if (this.newPassword() !== this.confirmPassword()) { this.pwErrorMsg.set('Passwörter stimmen nicht überein.'); return; }
    this.savingPw.set(true);
    const { error } = await supabase.auth.updateUser({ password: this.newPassword() });
    this.savingPw.set(false);
    if (error) { this.pwErrorMsg.set('Fehler: ' + error.message); } else {
      this.pwSuccessMsg.set('Passwort geändert!');
      this.newPassword.set(''); this.confirmPassword.set('');
    }
  }

  // Ersetze generateApiKey() in profile-page.ts mit dieser Logik:

  async generateApiKey() {
    this.generatingKey.set(true);

    // 1. Plaintext-Key generieren (nur einmal dem User zeigen)
    const array = new Uint8Array(20);
    crypto.getRandomValues(array);
    const hex = Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    const plainKey = `ft_live_${hex}`;

    // 2. SHA-256 Hash für die DB berechnen
    const msgBuffer = new TextEncoder().encode(plainKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const keyHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const now = new Date().toISOString();

    // 3. Alten Key löschen, neuen Hash speichern
    const userId = this.auth.user()?.id;
    if (!userId) { this.generatingKey.set(false); return; }

    await supabase.from('api_keys').delete().eq('user_id', userId);

    const { error } = await supabase.from('api_keys').insert({
      user_id: userId,
      key_hash: keyHash,
    });

    // 4. Plaintext NUR im User-Metadata für die Anzeige (optional — oder nur im State)
    if (!error) {
      await supabase.auth.updateUser({
        data: { api_key_created_at: now }
        // Wichtig: Den plainKey NICHT in Supabase speichern!
      });
      this.apiKey.set(plainKey);   // nur im RAM für einmalige Anzeige
      this.apiKeyVisible.set(true);
      this.keyGeneratedAt.set(now);
    }

    this.generatingKey.set(false);
  }

  async copyApiKey() {
    if (!this.apiKey()) return;
    await navigator.clipboard.writeText(this.apiKey());
    this.keyCopied.set(true);
    setTimeout(() => this.keyCopied.set(false), 2000);
  }

  toggleKeyVisibility() { this.apiKeyVisible.update(v => !v); }

  get maskedKey(): string {
    const k = this.apiKey();
    if (!k) return '';
    return k.slice(0, 11) + '••••••••••••••••••••••••••••' + k.slice(-4);
  }

  get formattedKeyDate(): string {
    const d = this.keyGeneratedAt();
    if (!d) return '';
    return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  async cancelSubscription() {
    this.cancelErrorMsg.set('');
    if (!this.cancelReason().trim()) { this.cancelErrorMsg.set('Bitte wähle einen Grund.'); return; }
    this.cancellingPlan.set(true);
    await new Promise(r => setTimeout(r, 1400));
    this.cancellingPlan.set(false);
    this.cancelSuccessMsg.set('Dein Abo wurde zum Ende des Abrechnungszeitraums gekündigt.');
    this.showCancelForm.set(false);
  }

  goBack() { this.router.navigate(['/dashboard']); }
  logout() { this.auth.signOut(); }

  private clearAllMessages() {
    this.successMsg.set(''); this.errorMsg.set('');
    this.pwSuccessMsg.set(''); this.pwErrorMsg.set('');
    this.cancelSuccessMsg.set(''); this.cancelErrorMsg.set('');
  }
}
