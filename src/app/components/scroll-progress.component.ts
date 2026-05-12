import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  template: `
    <div class="bar" #bar aria-hidden="true"></div>
  `,
  styles: [
    `
      :host {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        z-index: 80;
        pointer-events: none;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0.04) 0%,
          rgba(255, 255, 255, 0.04) 100%
        );
      }
      .bar {
        height: 100%;
        width: 0%;
        background: linear-gradient(90deg, #d23045 0%, #f59e0b 60%, #fb7185 100%);
        box-shadow: 0 0 16px rgba(245, 158, 11, 0.55),
          0 0 28px rgba(210, 48, 69, 0.4);
        transform-origin: left center;
        will-change: width;
        transition: width 0.08s linear;
      }
    `,
  ],
})
export class ScrollProgressComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bar', { static: true }) barRef!: ElementRef<HTMLDivElement>;
  private onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    this.barRef.nativeElement.style.width = `${pct}%`;
  };

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScroll, { passive: true });
      this.onScroll();
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }
}
