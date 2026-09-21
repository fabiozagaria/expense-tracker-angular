import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmailVerificationApiService } from '../../services/email-verification-api.service';

type VerificationState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly emailVerificationApiService = inject(EmailVerificationApiService);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly state = signal<VerificationState>('loading');
  protected readonly message = signal('Stiamo verificando il tuo indirizzo email.');

  public ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.setError('Il link di verifica non contiene un token valido.');
      return;
    }

    this.emailVerificationApiService.verifyEmail(token).subscribe({
      next: () => {
        this.state.set('success');
        this.message.set('Email verificata. Ora puoi effettuare il login.');
      },
      error: (error: HttpErrorResponse) => {
        this.setError(error.status === 400
          ? 'Il link di verifica non è valido o è scaduto.'
          : 'Non è stato possibile verificare l’email. Controlla la connessione e riprova.');
      },
    });
  }

  private setError(message: string): void {
    this.state.set('error');
    this.message.set(message);
  }
}
