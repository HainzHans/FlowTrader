// src/app/features/auth/register/register.component.ts

import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {AuthService} from '../../../core/services/auth-service/auth-service';

/** Validator: password === confirmPassword */
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirm = control.get('confirmPassword');
  if (!password || !confirm) return null;
  return password.value === confirm.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">

        <div class="auth-header">
          <div class="auth-label">TradingJournal</div>
          <h1>Registrieren</h1>
          <p class="auth-sub">Kostenlos starten · 50 Trades/Monat inklusive</p>
        </div>

        @if (successMessage()) {
          <div class="success-banner">
            <strong>Fast fertig!</strong> {{ successMessage() }}
          </div>
        } @else {

          <form [formGroup]="form" (ngSubmit)="submit()">

            <div class="field">
              <label for="displayName">Name (optional)</label>
              <input
                id="displayName"
                type="text"
                formControlName="displayName"
                placeholder="Max Mustermann"
                autocomplete="name"
              />
            </div>

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
                placeholder="Mindestens 8 Zeichen"
                autocomplete="new-password"
                [class.invalid]="showErrors && form.controls.password.invalid"
              />
            </div>

            <div class="field">
              <label for="confirmPassword">Passwort bestätigen</label>
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                placeholder="••••••••"
                autocomplete="new-password"
                [class.invalid]="showErrors && (form.hasError('passwordMismatch') || form.controls.confirmPassword.invalid)"
              />
              @if (showErrors && form.hasError('passwordMismatch')) {
                <span class="field-error">Passwörter stimmen nicht überein.</span>
              }
            </div>

            @if (errorMessage()) {
              <div class="error-banner">{{ errorMessage() }}</div>
            }

            <button type="submit" class="submit-btn" [disabled]="isLoading()">
              @if (isLoading()) {
                Wird registriert…
              } @else {
                Kostenlos registrieren
              }
            </button>

          </form>

        }

        <div class="auth-footer">
          Bereits registriert?
          <a routerLink="/auth/login">Einloggen</a>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* Gleiche Basis-Styles wie LoginComponent — in Phase 1 in shared CSS auslagern */
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
    .auth-header { margin-bottom: 2rem; }
    .auth-label {
      font-family: monospace;
      font-size: 11px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #3b82f6;
      margin-bottom: 0.5rem;
    }
    h1 { font-size: 1.6rem; font-weight: 700; color: #e8eaf0; letter-spacing: -0.03em; }
    .auth-sub { font-size: 13px; color: #5a6278; margin-top: 0.25rem; font-family: monospace; }
    .field { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.25rem; }
    label { font-size: 13px; color: #5a6278; font-family: monospace; }
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
    .field-error { font-size: 12px; color: #ef4444; font-family: monospace; }
    .error-banner {
      background: rgba(239,68,68,0.1);
      border: 1px solid rgba(239,68,68,0.25);
      border-radius: 6px;
      padding: 0.75rem 1rem;
      color: #ef4444;
      font-size: 13px;
      margin-bottom: 1.25rem;
    }
    .success-banner {
      background: rgba(34,197,94,0.1);
      border: 1px solid rgba(34,197,94,0.25);
      border-radius: 6px;
      padding: 1rem;
      color: #22c55e;
      font-size: 13px;
      margin-bottom: 1.5rem;
      line-height: 1.6;
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
      gap: 0.5rem;
      margin-top: 1.5rem;
      font-size: 13px;
      color: #5a6278;
    }
    .auth-footer a { color: #3b82f6; text-decoration: none; }
    .auth-footer a:hover { text-decoration: underline; }
  `],
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group(
    {
      displayName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  showErrors = false;

  async submit(): Promise<void> {
    this.showErrors = true;
    this.errorMessage.set(null);

    if (this.form.invalid) return;

    this.isLoading.set(true);

    const error = await this.authService.register(
      this.form.value.email!,
      this.form.value.password!,
      this.form.value.displayName || undefined
    );

    this.isLoading.set(false);

    if (error) {
      this.errorMessage.set(this.mapError(error.message));
      return;
    }

    // Supabase schickt Bestätigungs-Mail (wenn Email-Confirm aktiv).
    // Wenn deaktiviert → direkt eingeloggt → onAuthStateChange → Dashboard.
    this.successMessage.set(
      'Bitte bestätige deine E-Mail-Adresse. Den Link findest du in deinem Postfach.'
    );
  }

  private mapError(message: string): string {
    if (message.includes('User already registered'))
      return 'Diese E-Mail-Adresse ist bereits registriert.';
    if (message.includes('Password should be at least'))
      return 'Das Passwort muss mindestens 8 Zeichen lang sein.';
    if (message.includes('Invalid email'))
      return 'Bitte gib eine gültige E-Mail-Adresse ein.';
    return 'Registrierung fehlgeschlagen. Bitte erneut versuchen.';
  }
}
