// src/app/features/auth/login/login.component.ts

import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {AuthService} from '../../../core/services/auth-service/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">

        <div class="auth-header">
          <div class="auth-label">TradingJournal</div>
          <h1>Einloggen</h1>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">

          <div class="field">
            <label for="email">E-Mail</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="trader@example.com"
              autocomplete="email"
              [class.invalid]="showErrors && form.controls.email.invalid"
            />
          </div>

          <div class="field">
            <label for="password">Passwort</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="••••••••"
              autocomplete="current-password"
              [class.invalid]="showErrors && form.controls.password.invalid"
            />
          </div>

          @if (errorMessage()) {
            <div class="error-banner">{{ errorMessage() }}</div>
          }

          <button type="submit" class="submit-btn" [disabled]="isLoading()">
            @if (isLoading()) {
              Wird eingeloggt…
            } @else {
              Einloggen
            }
          </button>

        </form>

        <div class="auth-footer">
          <a routerLink="/auth/reset-password">Passwort vergessen?</a>
          <span>·</span>
          <a routerLink="/auth/register">Registrieren</a>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      background: #0a0b0d;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .auth-card {
      width: 100%;
      max-width: 400px;
      background: #111318;
      border: 1px solid #1f2430;
      border-radius: 12px;
      padding: 2.5rem;
    }
    .auth-header {
      margin-bottom: 2rem;
    }
    .auth-label {
      font-family: monospace;
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #3b82f6;
      margin-bottom: 0.5rem;
    }
    h1 {
      font-size: 1.6rem;
      font-weight: 700;
      color: #e8eaf0;
      letter-spacing: -0.03em;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
    }
    label {
      font-size: 13px;
      color: #5a6278;
      font-family: monospace;
    }
    input {
      background: #0a0b0d;
      border: 1px solid #1f2430;
      border-radius: 6px;
      padding: 0.65rem 0.875rem;
      color: #e8eaf0;
      font-size: 14px;
      outline: none;
      transition: border-color 0.15s;
      font-family: inherit;
    }
    input:focus { border-color: #3b82f6; }
    input.invalid { border-color: #ef4444; }
    input::placeholder { color: #2a3040; }
    .error-banner {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.25);
      border-radius: 6px;
      padding: 0.75rem 1rem;
      color: #ef4444;
      font-size: 13px;
      margin-bottom: 1.25rem;
    }
    .submit-btn {
      width: 100%;
      background: #3b82f6;
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 0.75rem;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
      font-family: inherit;
    }
    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .submit-btn:not(:disabled):hover { opacity: 0.9; }
    .auth-footer {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      margin-top: 1.5rem;
      font-size: 13px;
    }
    .auth-footer a { color: #5a6278; text-decoration: none; }
    .auth-footer a:hover { color: #e8eaf0; }
    .auth-footer span { color: #2a3040; }
  `],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  showErrors = false;

  async submit(): Promise<void> {
    this.showErrors = true;
    this.errorMessage.set(null);

    if (this.form.invalid) return;

    this.isLoading.set(true);

    const error = await this.authService.login(
      this.form.value.email!,
      this.form.value.password!
    );

    this.isLoading.set(false);

    if (error) {
      this.errorMessage.set(this.mapError(error.message));
      return;
    }

    // Erfolgreich — GuestGuard und onAuthStateChange regeln den Redirect
    this.router.navigate(['/app/dashboard']);
  }

  private mapError(message: string): string {
    if (message.includes('Invalid login credentials'))
      return 'E-Mail oder Passwort falsch.';
    if (message.includes('Email not confirmed'))
      return 'Bitte bestätige zuerst deine E-Mail-Adresse.';
    if (message.includes('Too many requests'))
      return 'Zu viele Versuche. Bitte kurz warten.';
    return 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.';
  }
}
