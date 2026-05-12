import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-cursor',
  standalone: true,
  template: `
    <div #ring class="cursor-ring" aria-hidden="true"></div>
    <div #dot class="cursor-dot" aria-hidden="true"></div>
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 100;
      }
      .cursor-dot,
      .cursor-ring {
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
        will-change: transform, width, height, opacity;
        mix-blend-mode: difference;
      }
      .cursor-dot {
        width: 6px;
        height: 6px;
        border-radius: 9999px;
        background: #ffffff;
        transform: translate3d(-100px, -100px, 0);
        transition: opacity 0.25s ease;
      }
      .cursor-ring {
        width: 38px;
        height: 38px;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.85);
        transform: translate3d(-100px, -100px, 0);
        transition: width 0.35s cubic-bezier(0.16, 1, 0.3, 1),
          height 0.35s cubic-bezier(0.16, 1, 0.3, 1),
          border-color 0.25s ease, background 0.25s ease, opacity 0.25s ease;
      }
      :host(.hover) .cursor-ring {
        width: 64px;
        height: 64px;
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.95);
      }
      :host(.click) .cursor-ring {
        width: 28px;
        height: 28px;
      }
      :host(.hidden) .cursor-dot,
      :host(.hidden) .cursor-ring {
        opacity: 0;
      }
      @media (pointer: coarse) {
        :host {
          display: none;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        :host {
          display: none;
        }
      }
    `,
  ],
  host: {
    '[class.hover]': 'isHover',
    '[class.click]': 'isDown',
    '[class.hidden]': 'isOut',
  },
})
export class CursorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('dot', { static: true }) dotRef!: ElementRef<HTMLDivElement>;
  @ViewChild('ring', { static: true }) ringRef!: ElementRef<HTMLDivElement>;

  isHover = false;
  isDown = false;
  isOut = false;

  private tx = 0;
  private ty = 0;
  private rx = 0;
  private ry = 0;
  private raf = 0;
  private onMove = (e: PointerEvent) => {
    this.tx = e.clientX;
    this.ty = e.clientY;
    this.isOut = false;
  };
  private onDown = () => (this.isDown = true);
  private onUp = () => (this.isDown = false);
  private onLeave = () => (this.isOut = true);
  private onOver = (e: Event) => {
    const t = e.target as HTMLElement;
    this.isHover = !!t?.closest?.('a, button, [data-magnetic], input, textarea');
  };

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    window.addEventListener('pointermove', this.onMove, { passive: true });
    window.addEventListener('pointerdown', this.onDown, { passive: true });
    window.addEventListener('pointerup', this.onUp, { passive: true });
    window.addEventListener('pointerleave', this.onLeave, { passive: true });
    document.addEventListener('pointerover', this.onOver, true);

    this.zone.runOutsideAngular(() => {
      const tick = () => {
        // ring lags the dot
        this.rx += (this.tx - this.rx) * 0.18;
        this.ry += (this.ty - this.ry) * 0.18;
        this.dotRef.nativeElement.style.transform = `translate3d(${this.tx - 3}px, ${this.ty - 3}px, 0)`;
        this.ringRef.nativeElement.style.transform = `translate3d(${this.rx - 19}px, ${this.ry - 19}px, 0)`;
        this.raf = requestAnimationFrame(tick);
      };
      tick();
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('pointermove', this.onMove);
    window.removeEventListener('pointerdown', this.onDown);
    window.removeEventListener('pointerup', this.onUp);
    window.removeEventListener('pointerleave', this.onLeave);
    document.removeEventListener('pointerover', this.onOver, true);
  }
}
