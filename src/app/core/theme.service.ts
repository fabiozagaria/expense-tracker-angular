import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, DestroyRef, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  readonly dark = signal(false);

  constructor() {
    if (!this.browser || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    let saved: string | null = null;
    try {
      saved = localStorage.getItem('color-theme');
    } catch {
      /* Storage can be unavailable. */
    }
    let manual = saved === 'dark' || saved === 'light';
    this.apply(manual ? saved === 'dark' : media.matches);
    const onChange = (event: MediaQueryListEvent) => {
      if (!manual) this.apply(event.matches);
    };
    media.addEventListener('change', onChange);
    this.destroyRef.onDestroy(() => media.removeEventListener('change', onChange));
    this.markManual = () => {
      manual = true;
    };
  }

  private markManual = () => {};

  toggle(): void {
    if (!this.browser) return;
    this.markManual();
    this.apply(!this.dark());
    try {
      localStorage.setItem('color-theme', this.dark() ? 'dark' : 'light');
    } catch {
      /* Keep the in-memory choice. */
    }
  }

  private apply(dark: boolean): void {
    this.dark.set(dark);
    this.document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
    this.document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    this.document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  }
}
