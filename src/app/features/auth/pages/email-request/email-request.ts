import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { finalize } from 'rxjs';
import { apiErrorName, commonAuthErrorMessage } from '../../../../core/api/api-error';
import { RevealDirective } from '../../../../core/ui/reveal.directive';
import { AuthService } from '../../services/auth.service';

/** `password`: POST /auth/forgot-password. `verification`: POST /auth/resend-verification. */
export type EmailRequestMode = 'password' | 'verification';

const COPY = {
  password: {
    eyebrow: 'RECUPERO ACCOUNT',
    title: 'Password dimenticata',
    subtitle: 'Inserisci l’email del tuo account: ti invieremo un link per sceglierne una nuova.',
    submit: 'Invia il link',
    sent: 'Se l’indirizzo appartiene a un account verificato, riceverai un link valido per 30 minuti. Controlla anche la cartella Spam. Puoi chiedere un nuovo link dopo un minuto.',
  },
  verification: {
    eyebrow: 'IL TUO ACCOUNT',
    title: 'Nuovo link di verifica',
    subtitle: 'Il link di verifica è scaduto o non è arrivato? Inserisci l’email usata per la registrazione.',
    submit: 'Invia un nuovo link',
    sent: 'Se l’indirizzo appartiene a un account non ancora verificato, riceverai un nuovo link valido per 10 minuti. Il link precedente non funziona più. Controlla anche la cartella Spam.',
  },
} as const;

@Component({
  selector: 'app-email-request',
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, CardModule, InputTextModule, MessageModule, RevealDirective],
  templateUrl: './email-request.html',
  styleUrl: '../account-recovery.css',
})
export class EmailRequest {
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  protected readonly mode: EmailRequestMode = this.route.snapshot.data['mode'] === 'verification' ? 'verification' : 'password';
  protected readonly copy = COPY[this.mode];
  protected readonly loading = signal(false);
  protected readonly sent = signal(false);
  protected readonly error = signal('');
  protected readonly form = new FormGroup({
    email: new FormControl(this.route.snapshot.queryParamMap.get('email') ?? '', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(50)],
    }),
  });
  protected readonly email = this.form.controls.email;

  protected submit(): void {
    if (this.loading()) return;
    if (this.email.invalid) {
      this.email.markAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    const email = this.email.value.trim();
    const request = this.mode === 'password' ? this.auth.forgotPassword(email) : this.auth.resendVerification(email);
    request.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false))).subscribe({
      next: () => this.sent.set(true),
      error: (error: unknown) => this.error.set(this.message(error)),
    });
  }

  private message(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.status === 503) {
      return apiErrorName(error) === 'EMAIL_DELIVERY_FAILED'
        ? 'Invio email non riuscito. Riprova più tardi.'
        : 'L’invio di email non è disponibile in questo momento. Riprova più tardi.';
    }
    if (error instanceof HttpErrorResponse && apiErrorName(error) === 'VALIDATION_ERROR') {
      return 'Controlla l’indirizzo email inserito.';
    }
    return commonAuthErrorMessage(error) ?? 'Richiesta non riuscita. Riprova più tardi.';
  }
}
