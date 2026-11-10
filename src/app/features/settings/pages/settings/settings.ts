import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { finalize } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { apiErrorName, commonAuthErrorMessage } from '../../../../core/api/api-error';
import { RevealDirective } from '../../../../core/ui/reveal.directive';
import { AuthService } from '../../../auth/services/auth.service';
import { Profile, ProfileApiService } from '../../services/profile-api.service';

@Component({
  selector: 'app-settings',
  imports: [ButtonModule, MessageModule, SkeletonModule, RevealDirective],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  private readonly profileApi = inject(ProfileApiService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly auth = inject(AuthService);

  protected readonly demo = environment.demo;
  protected readonly profile = signal<Profile | null>(null);
  protected readonly loading = signal(true);
  protected readonly loadFailed = signal(false);
  protected readonly sending = signal(false);
  protected readonly sent = signal(false);
  protected readonly sendError = signal('');
  protected readonly initial = computed(() => this.profile()?.username.charAt(0).toUpperCase() ?? '');

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.loadFailed.set(false);
    this.profileApi.getProfile().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (profile) => {
        this.profile.set(profile);
        this.loading.set(false);
      },
      error: () => {
        this.loadFailed.set(true);
        this.loading.set(false);
      },
    });
  }

  protected sendLink(): void {
    const profile = this.profile();
    if (!profile || this.sending()) return;
    this.sending.set(true);
    this.sendError.set('');
    this.auth.forgotPassword(profile.email).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.sending.set(false)),
    ).subscribe({
      next: () => this.sent.set(true),
      error: (error: unknown) => this.sendError.set(
        apiErrorName(error) === 'EMAIL_DELIVERY_FAILED'
          ? 'Invio email non riuscito. Riprova più tardi.'
          : commonAuthErrorMessage(error) ?? 'Non siamo riusciti a inviare il link. Riprova più tardi.',
      ),
    });
  }
}
