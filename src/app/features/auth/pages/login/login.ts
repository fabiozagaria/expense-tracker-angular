import { environment } from '../../../../../environments/environment';
import { timeout } from 'rxjs';
import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { apiErrorName, commonAuthErrorMessage } from '../../../../core/api/api-error';
import { maxUtf8Bytes, PASSWORD_MAX_BYTES } from '../../../../core/api/validators';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { RevealDirective } from '../../../../core/ui/reveal.directive';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, InputTextModule, MessageModule, RevealDirective],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly demo = environment.demo;
  protected readonly maintenance = environment.maintenance;
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  /** 403 EMAIL_NOT_VERIFIED: la pagina offre il reinvio del link di verifica. */
  protected readonly emailNotVerified = signal(false);
  protected readonly passwordVisible = signal(false);
  protected readonly form = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, maxUtf8Bytes(PASSWORD_MAX_BYTES)] }),
  });

  protected tryDemo(): void {
    if (this.loading() || this.maintenance) return;
    this.loading.set(true);
    this.error.set('');
    this.emailNotVerified.set(false);
    // Do not automatically retry the POST: a retry could create another session.
    this.auth.demoLogin().pipe(timeout(270000), finalize(() => this.loading.set(false))).subscribe({
      next: () => { void this.router.navigateByUrl('/dashboard'); },
      error: (error: unknown) => this.error.set(
        error instanceof HttpErrorResponse && error.status === 429
          ? commonAuthErrorMessage(error)!
          : 'Il server demo non è ancora disponibile. Attendi qualche istante e riprova.'),
    });
  }

  protected submit(): void {
    if (this.loading()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.emailNotVerified.set(false);
    const { username, password } = this.form.getRawValue();
    this.auth.login(username, password).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: () => {
        const requested = this.route.snapshot.queryParamMap.get('returnUrl');
        const destination = requested?.startsWith('/') && !requested.startsWith('//')
          ? requested : '/dashboard';
        void this.router.navigateByUrl(destination);
      },
      error: (error: unknown) => {
        const name = apiErrorName(error);
        this.emailNotVerified.set(name === 'EMAIL_NOT_VERIFIED');
        this.error.set(
          name === 'EMAIL_NOT_VERIFIED' ? 'Verifica prima la tua email: apri il link ricevuto dopo la registrazione.' :
          name === 'INVALID_CREDENTIALS' || (error instanceof HttpErrorResponse && error.status === 401)
            ? 'Username o password non corretti.' :
          commonAuthErrorMessage(error) ?? 'Accesso non riuscito. Riprova più tardi.'
        );
      },
    });
  }
}

