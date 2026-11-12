import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { finalize } from 'rxjs';
import { apiErrorName, commonAuthErrorMessage } from '../../../../core/api/api-error';
import { maxUtf8Bytes, PASSWORD_MAX_BYTES } from '../../../../core/api/validators';
import { RevealDirective } from '../../../../core/ui/reveal.directive';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../services/auth.service';

type ResetState = 'form' | 'success' | 'invalid-link';

function samePassword(group: AbstractControl): ValidationErrors | null {
  const { newPassword, confirmation } = group.value as { newPassword: string; confirmation: string };
  return confirmation && newPassword !== confirmation ? { mismatch: true } : null;
}

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink, ButtonModule, CardModule, InputTextModule, MessageModule, RevealDirective],
  templateUrl: './reset-password.html',
  styleUrl: '../account-recovery.css',
})
export class ResetPassword {
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  // Il token è un segreto monouso: resta in memoria e viene inviato solo al submit.
  private readonly token = inject(ActivatedRoute).snapshot.queryParamMap.get('token')?.trim() ?? '';

  protected readonly state = signal<ResetState>(this.token && this.token.length <= 100 ? 'form' : 'invalid-link');
  protected readonly demo = environment.demo;
  protected readonly maintenance = environment.maintenance;
  protected readonly loading = signal(false);
  protected readonly error = signal('');
  protected readonly passwordVisible = signal(false);
  protected readonly form = new FormGroup({
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6), maxUtf8Bytes(PASSWORD_MAX_BYTES)],
    }),
    confirmation: new FormControl('', { nonNullable: true, validators: Validators.required }),
  }, { validators: samePassword });

  protected submit(): void {
    if (this.loading() || this.maintenance || this.state() !== 'form') return;
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.resetPassword(this.token, this.form.controls.newPassword.value)
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)))
      .subscribe({
        next: () => {
          // Il server revoca tutti i refresh token: anche la sessione locale non è più valida.
          this.auth.clearSession();
          this.form.reset();
          this.state.set('success');
        },
        error: (error: unknown) => {
          if (apiErrorName(error) === 'INVALID_PASSWORD_RESET_TOKEN') {
            this.state.set('invalid-link');
            return;
          }
          this.error.set(
            error instanceof HttpErrorResponse && apiErrorName(error) === 'VALIDATION_ERROR'
              ? 'La password non rispetta i requisiti: almeno 6 caratteri, al massimo 72 byte.'
              : commonAuthErrorMessage(error) ?? 'Password non aggiornata. Riprova più tardi.',
          );
        },
      });
  }
}
