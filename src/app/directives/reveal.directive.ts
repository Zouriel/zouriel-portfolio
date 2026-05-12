import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
} from '@angular/core';

@Directive({
  selector: '[reveal]',
  standalone: true,
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  @Input('reveal') mode: 'up' | 'x' | 'blur' = 'up';
  @Input('revealDelay') delay = 0;
  @Input('revealThreshold') threshold = 0.18;
  @Input('revealOnce') once = true;

  private io?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private zone: NgZone) {}

  ngAfterViewInit(): void {
    const host = this.el.nativeElement;
    const attr =
      this.mode === 'x' ? 'data-reveal-x' : this.mode === 'blur' ? 'data-reveal-blur' : 'data-reveal';
    host.setAttribute(attr, '');
    if (this.delay) host.style.setProperty('--reveal-delay', `${this.delay}ms`);

    if (
      typeof window === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      host.setAttribute(attr, 'in');
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.setAttribute(attr, 'in');
              if (this.once) this.io?.unobserve(entry.target);
            } else if (!this.once) {
              entry.target.setAttribute(attr, '');
            }
          }
        },
        { threshold: this.threshold, rootMargin: '0px 0px -8% 0px' }
      );
      this.io.observe(host);
    });
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
