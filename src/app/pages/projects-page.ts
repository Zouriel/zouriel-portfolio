import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChildren,
  computed,
  signal,
} from '@angular/core';
import { RevealDirective } from '../directives/reveal.directive';
import { SectionLabelComponent } from '../components/section-label.component';
import { MarqueeComponent } from '../components/marquee.component';
import {
  Project,
  ProjectCategory,
  projectCategories,
  projects,
} from '../data/projects.data';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, RevealDirective, SectionLabelComponent, MarqueeComponent],
  template: `
    <section class="page">
      <div class="wrap">
        <app-section-label index="01" label="works" />

        <h1 reveal="up" [revealDelay]="80" class="title font-display">
          <span class="title__primary">Selected</span>
          <span class="title__accent">works.</span>
        </h1>

        <p reveal="up" [revealDelay]="180" class="intro text-pretty">
          Production systems, classroom tools, and personal experiments — built
          across .NET, Angular, Go, and Vue. Each one shipped with the same
          discipline.
        </p>

        <!-- filters -->
        <div reveal="up" [revealDelay]="260" class="filters font-mono">
          @for (cat of categories; track cat.key) {
          <button
            type="button"
            data-magnetic
            (click)="activeCategory.set(cat.key)"
            class="filter-btn"
            [class.is-active]="activeCategory() === cat.key"
          >
            {{ cat.label }}
            @if (activeCategory() === cat.key) {
            <span class="dot">●</span>
            }
          </button>
          }
        </div>

        <!-- grid -->
        <div class="grid">
          @for (p of filtered(); track p.name; let i = $index) {
          <a
            #cardEl
            [href]="p.live || p.repo"
            target="_blank"
            rel="noopener noreferrer"
            data-magnetic
            reveal="up"
            [revealDelay]="i * 60"
            class="card"
            [class.card--featured]="p.featured"
            [style.--accent]="p.accent"
          >
            <div class="card-bg" aria-hidden="true"></div>

            <div class="card__meta">
              <div class="font-mono">
                <span class="lang-dot">●</span>
                <span>{{ p.language }}</span>
              </div>
              <div class="font-mono card__meta-r">
                @if (p.live) {
                <span class="live-badge">
                  <span class="live-dot"></span>
                  live
                </span>
                }
                <span>{{ p.year }}</span>
              </div>
            </div>

            <h3 class="card__name font-display" [class.card__name--big]="p.featured">
              {{ p.name }}
            </h3>
            <p class="card__tag font-mono">{{ p.tagline }}</p>

            <p class="card__desc text-pretty" [class.card__desc--big]="p.featured">
              {{ p.description }}
            </p>

            <div class="card__stack">
              @for (s of p.stack; track s) {
              <span class="chip font-mono">{{ s }}</span>
              }
            </div>

            <div class="card__foot">
              <span class="font-mono">{{ p.live ? 'visit live site' : 'view repository' }}</span>
              <span class="arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M7 17 17 7M9 7h8v8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
            </div>
          </a>
          }
        </div>

        <!-- languages marquee -->
        <div class="ribbon" reveal="up">
          <div class="ribbon__label font-mono">// languages crossed</div>
          <div class="ribbon__inner">
            <app-marquee [items]="languages" [duration]="36" />
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }

      .page {
        position: relative;
        min-height: 100vh;
        padding: 6rem 1.5rem 6rem;
      }
      @media (min-width: 768px) {
        .page { padding: 6rem 4rem; }
      }
      .wrap {
        max-width: 1400px;
        margin: 0 auto;
      }

      .title {
        margin-top: 1.5rem;
        font-size: clamp(3rem, 11vw, 9rem);
        font-weight: 700;
        line-height: 0.92;
        letter-spacing: -0.04em;
        text-wrap: balance;
      }
      .title__primary {
        display: block;
        color: #fff;
      }
      .title__accent {
        display: block;
        font-style: italic;
        font-weight: 300;
        background: linear-gradient(90deg, #d23045 0%, #f59e0b 50%, #fb7185 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        text-shadow: 0 0 30px rgba(245, 158, 11, .35);
      }

      .intro {
        margin-top: 1.5rem;
        max-width: 38rem;
        font-size: 1.125rem;
        color: rgba(255, 255, 255, 0.6);
      }

      /* filters */
      .filters {
        margin-top: 3rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        font-size: 11.5px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }
      .filter-btn {
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0);
        color: rgba(255, 255, 255, 0.55);
        transition: all 0.3s ease;
        cursor: none;
      }
      .filter-btn:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.05);
      }
      .filter-btn.is-active {
        border-color: rgba(245, 158, 11, 0.55);
        background: rgba(245, 158, 11, 0.1);
        color: #fbbf24;
      }
      .filter-btn .dot {
        margin-left: 0.5rem;
        color: #fb7185;
      }

      /* grid */
      .grid {
        margin-top: 3rem;
        display: grid;
        gap: 1.5rem;
      }
      @media (min-width: 700px) {
        .grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (min-width: 1100px) {
        .grid { grid-template-columns: repeat(3, 1fr); }
      }

      .card {
        position: relative;
        display: block;
        overflow: hidden;
        padding: 1.75rem;
        border-radius: 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.02);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1),
          border-color 0.4s ease, background 0.4s ease;
        transform-style: preserve-3d;
        will-change: transform;
      }
      @media (min-width: 1100px) {
        .card--featured { grid-column: span 2; grid-row: span 2; padding: 2.5rem; }
      }
      .card .card-bg {
        position: absolute;
        inset: -1px;
        border-radius: inherit;
        background: radial-gradient(
          480px circle at var(--mx, 50%) var(--my, 30%),
          color-mix(in srgb, var(--accent) 28%, transparent) 0%,
          transparent 60%
        );
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
        z-index: 0;
      }
      .card:hover {
        border-color: color-mix(in srgb, var(--accent) 40%, rgba(255,255,255,.1));
      }
      .card:hover .card-bg { opacity: 1; }
      .card:hover .arrow {
        background: var(--accent);
        color: #0a0608;
        border-color: var(--accent);
        transform: translate(2px, -2px);
      }

      .card > * { position: relative; z-index: 1; }

      .card__meta {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.4);
      }
      .card__meta .lang-dot {
        color: var(--accent);
        margin-right: 0.5rem;
      }
      .card__meta-r {
        display: inline-flex;
        align-items: center;
        gap: 0.65rem;
      }
      .live-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.2rem 0.55rem;
        border-radius: 9999px;
        border: 1px solid rgba(52, 211, 153, 0.4);
        background: rgba(16, 185, 129, 0.1);
        color: #6ee7b7;
        font-size: 9.5px;
        letter-spacing: 0.22em;
      }
      .live-dot {
        width: 6px;
        height: 6px;
        border-radius: 9999px;
        background: #34d399;
        box-shadow: 0 0 8px #34d399;
        animation: liveDot 1.6s ease-in-out infinite;
      }
      @keyframes liveDot {
        0%, 100% { transform: scale(1); opacity: 1; }
        50%      { transform: scale(0.6); opacity: 0.4; }
      }

      .card__name {
        margin-top: 1.5rem;
        font-size: 1.5rem;
        font-weight: 600;
        letter-spacing: -0.02em;
        color: #fff;
        line-height: 1.05;
      }
      @media (min-width: 700px) {
        .card__name { font-size: 1.8rem; }
      }
      .card__name--big {
        font-size: 2.25rem !important;
      }
      @media (min-width: 900px) {
        .card__name--big { font-size: 3rem !important; }
      }

      .card__tag {
        margin-top: 0.5rem;
        font-size: 13px;
        color: rgba(255, 255, 255, 0.5);
      }
      .card__desc {
        margin-top: 1.25rem;
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.7);
        line-height: 1.55;
      }
      .card__desc--big {
        font-size: 1.1rem;
      }

      .card__stack {
        margin-top: 1.5rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
      }
      .chip {
        padding: 0.3rem 0.65rem;
        font-size: 10.5px;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.04);
        color: rgba(255, 255, 255, 0.7);
      }

      .card__foot {
        margin-top: 1.75rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 10px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.4);
      }
      .arrow {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 9999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 0.8);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
          background 0.3s ease, color 0.3s ease, border-color 0.3s ease;
      }
      .arrow svg { width: 1rem; height: 1rem; }

      .ribbon {
        margin-top: 6rem;
      }
      .ribbon__label {
        font-size: 10.5px;
        letter-spacing: 0.4em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.4);
      }
      .ribbon__inner {
        margin-top: 1.5rem;
      }

      @media (prefers-reduced-motion: reduce) {
        .card { transition: none !important; }
      }
    `,
  ],
  host: { class: 'route-enter block' },
})
export class ProjectsPage implements AfterViewInit, OnDestroy {
  @HostBinding('class.block') hostBlock = true;

  categories = projectCategories;
  activeCategory = signal<ProjectCategory | 'all'>('all');

  filtered = computed(() => {
    const cat = this.activeCategory();
    if (cat === 'all') return projects;
    return projects.filter((p) => p.category === cat);
  });

  languages = [
    'Angular',
    'TypeScript',
    '.NET / C#',
    'Go',
    'PostgreSQL',
    'Vue',
    'Docker',
    'Tailwind',
    'OAuth2',
    'SQL Server',
    'Web Animations API',
  ];

  @ViewChildren('cardEl', { read: ElementRef })
  cards!: QueryList<ElementRef<HTMLElement>>;

  private offHandlers: Array<() => void> = [];

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.zone.runOutsideAngular(() => {
      this.bind();
      this.cards.changes.subscribe(() => this.rebind());
    });
  }

  private bind(): void {
    this.cards.forEach((cardRef) => {
      const el = cardRef.nativeElement;
      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--mx', `${mx}%`);
        el.style.setProperty('--my', `${my}%`);

        const rx = ((my - 50) / 50) * -4;
        const ry = ((mx - 50) / 50) * 5;
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
      };
      const onLeave = () => {
        el.style.transform = '';
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      this.offHandlers.push(() => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
      });
    });
  }

  private rebind(): void {
    this.offHandlers.forEach((fn) => fn());
    this.offHandlers = [];
    this.bind();
  }

  ngOnDestroy(): void {
    this.offHandlers.forEach((fn) => fn());
  }
}
