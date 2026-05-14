import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  signal,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { filter } from 'rxjs';
import { IconComponent } from '../data/nav-icon';
import { NavigationConfig } from '../data/nav-items';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, IconComponent],
  template: `
    <!-- DESKTOP: vertical pill rail, left side -->
    <nav class="rail" aria-label="Primary">
      <div class="rail__box">
        <div
          class="rail__indicator"
          [style.transform]="'translateY(' + indicatorY() + 'px)'"
          aria-hidden="true"
        ></div>

        @for (item of nav(); track item.route; let i = $index) {
        <a
          #itemEl
          [routerLink]="item.route"
          routerLinkActive="is-active"
          [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
          (mouseenter)="hoverLabel.set(item.label); hoverIdx.set(i)"
          (mouseleave)="hoverIdx.set(null)"
          [attr.aria-label]="item.label"
          class="rail__item group"
          data-magnetic
        >
          <span class="rail__num font-mono">{{ item.index }}</span>
          <app-icon [name]="item.icon" />
          <span class="rail__tooltip">{{ item.label }}</span>
        </a>
        }
      </div>
      <div class="rail__brand font-mono">
        <span class="rail__brand-dot"></span>
        <span class="rail__brand-text">zouriel.dev</span>
      </div>
    </nav>

    <!-- MOBILE -->
    <button
      #toggleBtn
      class="m-toggle"
      (click)="toggle()"
      [attr.aria-expanded]="isOpen()"
      aria-controls="mobile-nav"
      aria-label="Open navigation"
      data-magnetic
    >
      <svg *ngIf="!isOpen()" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 7h16M4 17h16" />
      </svg>
      <svg *ngIf="isOpen()" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>

    <nav
      #mobilePanel
      id="mobile-nav"
      class="m-panel"
      [class.m-panel--open]="isOpen()"
      [class.pointer-events-none]="!isOpen()"
    >
      <div class="m-panel__inner">
        @for (item of nav(); track item.route; let i = $index) {
        <a
          [routerLink]="item.route"
          routerLinkActive="is-active"
          [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
          (click)="close()"
          class="m-panel__item"
          [class.m-panel__item--service]="item.icon === 'military'"
          [style.transitionDelay]="(i * 35) + 'ms'"
        >
          <span class="font-mono text-[11px] tracking-widest text-white/40">{{ item.index }}</span>
          @if (item.icon === 'military') {
            <span class="m-panel__icon" aria-hidden="true">
              <app-icon name="military" />
            </span>
          }
          <span class="font-display text-2xl">{{ item.label }}</span>
          @if (item.icon === 'military') {
            <span class="m-panel__tag font-mono">LCpl</span>
          }
          <span class="ml-auto opacity-0 group-[.m-panel--open]:opacity-100">→</span>
        </a>
        }
      </div>
    </nav>
  `,
  styles: [
    `
      :host { display: contents; }

      .rail {
        position: fixed;
        left: 1.25rem;
        top: 50%;
        transform: translateY(-50%);
        z-index: 50;
        display: none;
      }
      @media (min-width: 768px) {
        .rail { display: block; }
      }
      .rail__box {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        padding: 0.75rem;
        background: rgba(10, 6, 8, 0.65);
        border: 1px solid rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border-radius: 9999px;
        box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.04);
      }
      .rail__brand {
        margin-top: 0.75rem;
        display: flex;
        align-items: center;
        gap: 0.4rem;
        padding: 0.5rem 0.75rem;
        font-size: 9.5px;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.4);
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        align-self: center;
      }
      .rail__brand-dot {
        width: 6px; height: 6px;
        border-radius: 9999px;
        background: #f59e0b;
        box-shadow: 0 0 10px #f59e0b;
      }
      .rail__brand-text { letter-spacing: 0.32em; }

      .rail__indicator {
        position: absolute;
        left: 0.4rem;
        right: 0.4rem;
        top: 0.75rem;
        height: 3.25rem;
        border-radius: 9999px;
        background: linear-gradient(135deg,
          rgba(245, 158, 11, 0.25),
          rgba(210, 48, 69, 0.35));
        border: 1px solid rgba(245, 158, 11, 0.45);
        box-shadow:
          0 0 20px rgba(245, 158, 11, 0.35),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        pointer-events: none;
      }

      .rail__item {
        position: relative;
        width: 3.25rem;
        height: 3.25rem;
        display: grid;
        place-items: center;
        color: rgba(255, 255, 255, 0.55);
        border-radius: 9999px;
        transition: color 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        z-index: 1;
      }
      .rail__item:hover {
        color: #fff;
      }
      .rail__item.is-active {
        color: #fff;
      }
      .rail__num {
        position: absolute;
        bottom: -2px;
        right: 4px;
        font-size: 8px;
        letter-spacing: 0.18em;
        color: rgba(255, 255, 255, 0.3);
      }
      .rail__item.is-active .rail__num { color: #f59e0b; }

      .rail__tooltip {
        position: absolute;
        left: calc(100% + 1rem);
        top: 50%;
        transform: translateY(-50%) translateX(-6px);
        padding: 0.45rem 0.75rem;
        font-family: "JetBrains Mono", monospace;
        font-size: 10px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        background: rgba(10, 6, 8, 0.92);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .rail__item:hover .rail__tooltip {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
      }

      /* mobile */
      .m-toggle {
        display: none;
        position: fixed;
        right: 1rem;
        bottom: 1.25rem;
        z-index: 70;
        width: 3.25rem;
        height: 3.25rem;
        place-items: center;
        border-radius: 9999px;
        background: rgba(10, 6, 8, 0.85);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.12);
        backdrop-filter: blur(12px);
        box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
      }
      @media (max-width: 767px) {
        .m-toggle { display: grid; }
      }

      .m-panel {
        position: fixed;
        inset: 0;
        z-index: 65;
        background: rgba(10, 6, 8, 0.94);
        backdrop-filter: blur(24px);
        -webkit-backdrop-filter: blur(24px);
        opacity: 0;
        transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .m-panel--open { opacity: 1; }
      .m-panel__inner {
        position: absolute;
        inset: 0;
        padding: 6rem 1.5rem 5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        overflow: auto;
      }
      .m-panel__item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.8);
        transform: translateX(-20px);
        opacity: 0;
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
          opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .m-panel--open .m-panel__item {
        transform: translateX(0);
        opacity: 1;
      }
      .m-panel__item.is-active { color: #f59e0b; }

      /* mobile: animated service line */
      .m-panel__item--service {
        position: relative;
        color: #fde68a;
        border-bottom-color: rgba(245, 158, 11, 0.28);
        background: linear-gradient(
          90deg,
          rgba(245, 158, 11, 0.08) 0%,
          rgba(245, 158, 11, 0) 70%
        );
      }
      .m-panel__item--service::before {
        content: "";
        position: absolute;
        left: -1.5rem;
        top: 50%;
        width: 3px;
        height: 1.6em;
        border-radius: 3px;
        background: linear-gradient(180deg, #f59e0b, #d23045);
        box-shadow: 0 0 12px rgba(245, 158, 11, 0.65);
        transform: translateY(-50%) scaleY(0.6);
        opacity: 0;
        transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
          opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        transition-delay: 320ms;
      }
      .m-panel--open .m-panel__item--service::before {
        opacity: 1;
        animation: serviceRailPulse 2.4s ease-in-out 1s infinite;
      }
      .m-panel__icon {
        display: inline-flex;
        color: #f59e0b;
        filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.45));
        transform: translateX(-8px) rotate(-10deg);
        opacity: 0;
        transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
          opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        transition-delay: 380ms;
      }
      .m-panel--open .m-panel__icon {
        transform: translateX(0) rotate(0);
        opacity: 1;
        animation: serviceIconFloat 3.2s ease-in-out 1.1s infinite;
      }
      .m-panel__tag {
        margin-left: 0.6rem;
        font-size: 9.5px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        padding: 0.25rem 0.55rem;
        border-radius: 4px;
        color: #fde68a;
        background: rgba(245, 158, 11, 0.12);
        border: 1px solid rgba(245, 158, 11, 0.4);
        opacity: 0;
        transform: translateY(4px);
        transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        transition-delay: 460ms;
      }
      .m-panel--open .m-panel__tag {
        opacity: 1;
        transform: translateY(0);
      }
      @keyframes serviceRailPulse {
        0%, 100% {
          transform: translateY(-50%) scaleY(1);
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.55);
        }
        50% {
          transform: translateY(-50%) scaleY(1.18);
          box-shadow: 0 0 22px rgba(245, 158, 11, 0.9);
        }
      }
      @keyframes serviceIconFloat {
        0%, 100% { transform: translateY(0) rotate(0); }
        50%      { transform: translateY(-3px) rotate(-2deg); }
      }

      @media (min-width: 768px) {
        .m-toggle, .m-panel { display: none; }
      }
    `,
  ],
})
export class NavigationComponent implements AfterViewInit, OnDestroy {
  nav = signal(NavigationConfig);
  isOpen = signal(false);
  hoverLabel = signal('');
  hoverIdx = signal<number | null>(null);
  indicatorY = signal(0);

  @ViewChildren('itemEl', { read: ElementRef })
  itemEls!: QueryList<ElementRef<HTMLAnchorElement>>;
  @ViewChild('mobilePanel') mobilePanelRef!: ElementRef<HTMLElement>;
  @ViewChild('toggleBtn') toggleBtnRef!: ElementRef<HTMLButtonElement>;

  constructor(private router: Router, private zone: NgZone) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => queueMicrotask(() => this.updateIndicator()));
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.updateIndicator());
    window.addEventListener('resize', this.updateIndicator, { passive: true });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateIndicator);
  }

  private updateIndicator = () => {
    if (!this.itemEls) return;
    const arr = this.itemEls.toArray();
    const url = this.router.url.split('?')[0].split('#')[0];
    const idx = NavigationConfig.findIndex((n) => {
      if (n.exact) return url === n.route || url === n.route + '/';
      return url.startsWith(n.route) && n.route !== '/';
    });
    const finalIdx = idx === -1 ? 0 : idx;
    const el = arr[finalIdx]?.nativeElement;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const offset = el.offsetTop - parent.offsetTop;
    this.indicatorY.set(offset - 12); // -padding compensation
  };

  toggle() {
    this.isOpen.update((v) => !v);
  }
  close() {
    this.isOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.close();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.isOpen()) return;
    const panel = this.mobilePanelRef?.nativeElement;
    const toggle = this.toggleBtnRef?.nativeElement;
    const target = ev.target as Node;
    if (panel && toggle && !panel.contains(target) && !toggle.contains(target))
      this.close();
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 768 && this.isOpen()) this.close();
    this.updateIndicator();
  }
}
