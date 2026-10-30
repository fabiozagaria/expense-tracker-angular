import { environment } from '../../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { finalize, TimeoutError } from 'rxjs';
import { RevealDirective } from '../../../../core/ui/reveal.directive';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonModule,
    CardModule,
    InputTextModule,
    MessageModule,
    RevealDirective,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly demo = environment.demo;
  protected readonly loading = signal(false);
  protected readonly registered = signal(false);
  protected readonly error = signal('');
  protected readonly passwordVisible = signal(false);
  protected readonly form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(50)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(12)],
    }),
  });

  protected submit(): void {
    if (this.loading()) return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth
      .register(this.form.getRawValue())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: () => this.registered.set(true),
        error: (error: unknown) => this.error.set(this.registrationError(error)),
      });
  }

  private registrationError(error: unknown): string {
    if (error instanceof TimeoutError)
      return 'Il server non si è avviato in tempo. Riprova più tardi.';
    if (!(error instanceof HttpErrorResponse))
      return 'Registrazione non riuscita. Riprova più tardi.';
    if (error.status === 409) {
      if (error.error?.errorName === 'EMAIL_ALREADY_EXISTS')
        return 'Email già registrata. Usa un altro indirizzo o accedi.';
      if (error.error?.errorName === 'USERNAME_ALREADY_EXISTS')
        return 'Username già registrato. Scegli un altro username.';
      return 'Username o email già registrati.';
    }
    if (error.status === 503 && error.error?.errorName === 'EMAIL_DELIVERY_FAILED') {
      return 'Invio email non riuscito. Account non creato: riprova più tardi.';
    }
    if (error.status === 0) {
      return 'Risposta non ricevuta. La registrazione potrebbe essere stata completata: controlla la tua email prima di riprovare.';
    }
    if (error.status === 503) {
      return 'Server non disponibile. Controlla la connessione e riprova più tardi.';
    }
    return 'Registrazione non riuscita. Riprova più tardi.';
  }
}
