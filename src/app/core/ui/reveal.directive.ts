import { afterNextRender, DestroyRef, Directive, ElementRef, inject } from '@angular/core';

/** Browser-only, scoped motion; content remains readable without JavaScript. */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  private readonly element = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    let cancelled = false;
    let revert: (() => void) | undefined;
    this.destroyRef.onDestroy(() => { cancelled = true; revert?.(); });
    afterNextRender(() => {
      if (typeof window.matchMedia !== 'function'
        || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      void import('gsap').then(({ gsap }) => {
        if (cancelled) return;
        const context = gsap.context(() => {
          const targets = this.element.nativeElement.querySelectorAll('[data-reveal]');
          gsap.from(targets, { y: 18, opacity: 0, duration: 0.6, stagger: 0.065, ease: 'power2.out', clearProps: 'all' });
        }, this.element.nativeElement);
        revert = () => context.revert();
      });
    });
  }
}
