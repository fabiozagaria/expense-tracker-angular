import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { LoadingSpinner } from './core/ui/loading-spinner';
import { Header } from './core/layout/header/header';
import { Footer } from './core/layout/footer/footer';
import { MaintenanceBanner } from './core/layout/maintenance-banner/maintenance-banner';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, MaintenanceBanner, LoadingSpinner],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly auth = inject(AuthService);
  protected readonly router = inject(Router);
  protected readonly navigationError = signal(false);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((event) => {
      if (event instanceof NavigationStart) this.navigationError.set(false);
      if (event instanceof NavigationError) this.navigationError.set(true);
    });
  }
}
