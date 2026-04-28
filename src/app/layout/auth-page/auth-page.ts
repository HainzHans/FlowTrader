import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from '../../services/auth-service/auth-service';

type AuthMode = 'login' | 'register';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './auth-page.html',
  styleUrl: './auth-page.css',
})
export class AuthPage {
  mode      = signal<AuthMode>('login');
  email     = signal('');
  password  = signal('');
  loading   = signal(false);
  error     = signal('');
  success   = signal('');

  constructor(private auth: AuthService) {}

  setMode(m: AuthMode) {
    this.mode.set(m);
    this.error.set('');
    this.success.set('');
    this.email.set('');
    this.password.set('');
  }

  async submit() {
    this.error.set('');
    this.success.set('');

    const e = this.email().trim();
    const p = this.password();

    if (!e || !p) {
      this.error.set('Bitte E-Mail und Passwort eingeben.');
      return;
    }
    if (p.length < 6) {
      this.error.set('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    this.loading.set(true);

    if (this.mode() === 'login') {
      const { error } = await this.auth.signIn(e, p);
      if (error) {
        this.error.set(this.mapError(error.message));
      }
    } else {
      const { error } = await this.auth.signUp(e, p);
      if (error) {
        this.error.set(this.mapError(error.message));
      } else {
        this.success.set(
          'Konto erstellt! Bitte bestätige deine E-Mail-Adresse und logge dich anschließend ein.'
        );
        this.setMode('login');
      }
    }

    this.loading.set(false);
  }

  private mapError(msg: string): string {
    if (msg.includes('Invalid login credentials'))
      return 'E-Mail oder Passwort ist falsch.';
    if (msg.includes('Email not confirmed'))
      return 'Bitte bestätige zuerst deine E-Mail-Adresse.';
    if (msg.includes('User already registered'))
      return 'Diese E-Mail-Adresse ist bereits registriert.';
    if (msg.includes('Password should be'))
      return 'Das Passwort muss mindestens 6 Zeichen lang sein.';
    return msg;
  }
}
