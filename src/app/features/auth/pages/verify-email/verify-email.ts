import { Component, inject, OnInit, signal } from '@angular/core';
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

  protected readonly state = signal<VerificationState>('loading');
  protected readonly message = signal('Stiamo verificando il tuo indirizzo email.');

  public ngOnInit(): void {
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
      error: () => {
        this.setError('Il link di verifica non è valido o è scaduto.');
      },
    });
  }

  private setError(message: string): void {
    this.state.set('error');
    this.message.set(message);
  }
}
