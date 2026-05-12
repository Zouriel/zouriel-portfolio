import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { SocialLinksComponent } from '../components/social-links.component';
import { MarqueeComponent } from '../components/marquee.component';
import { SectionLabelComponent } from '../components/section-label.component';
import { RevealDirective } from '../directives/reveal.directive';
import { homePageData, SocialLinks } from '../data/home-page.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SocialLinksComponent,
    MarqueeComponent,
    SectionLabelComponent,
    RevealDirective,
  ],
  template: `
    <div class="hero">
      <!-- META BAR -->
      <header class="meta-bar font-mono">
        <div class="meta-bar__l">
          <span class="dot"></span>
          <span>Now lecturing &amp; engineering — Malé, Maldives</span>
        </div>
        <div class="meta-bar__r">
          <span>{{ today }}</span>
          <span class="sep">·</span>
          <span>UTC+5</span>
        </div>
      </header>

      <!-- HERO -->
      <section class="hero__main" #parallax>
        <app-section-label index="00" label="index" />

        <h1 #name class="name font-display">
          <span class="name__row" aria-hidden="true">
            <span class="name__char" *ngFor="let c of firstChars; let i = index" [style.--i]="i">{{ c }}</span>
          </span>
          <span class="name__row name__row--accent" aria-hidden="true">
            <span class="name__accent" [style.animationDelay.ms]="firstChars.length * 30 + 300">{{ lastName }}</span>
          </span>
          @if (familyName) {
          <span class="name__family font-mono" reveal="up" [revealDelay]="950">
            <span class="name__family-line"></span>
            <span>{{ familyName }}</span>
          </span>
          }
          <span class="sr-only">{{ data.name }}</span>
        </h1>

        <div class="role-row" reveal="up" [revealDelay]="700">
          <div class="role-row__pillRow">
            <span class="pill">Full-Stack Engineer</span>
            <span class="pill">Marine Veteran</span>
            <span class="pill">Lecturer</span>
            <span class="pill">Athlete</span>
          </div>
          <div class="role-row__scroll font-mono">
            <span class="role-row__arrow">↓</span>
            <span>scroll</span>
          </div>
        </div>

        <div class="bio" reveal="blur" [revealDelay]="850">
          <p class="bio__lead text-pretty">
            <span class="bio__amp">&amp;</span>
            I build disciplined, cinematic software — production systems, classroom
            tools, and personal experiments — with the same precision I learned
            in the Marines.
          </p>
        </div>

        <!-- CTAs -->
        <div class="cta-row" reveal="up" [revealDelay]="1000">
          <a
            href="mailto:{{ data.email }}"
            class="cta cta--primary"
            data-magnetic
          >
            <span class="cta__label">Get in touch</span>
            <span class="cta__hover">{{ data.email }}</span>
            <span class="cta__arrow">→</span>
          </a>
          <a routerLink="/projects" class="cta cta--ghost" data-magnetic>
            <span>See selected works</span>
            <span class="cta__arrow">→</span>
          </a>
        </div>

        <div class="socials" reveal="up" [revealDelay]="1150">
          <app-social-links [links]="links"></app-social-links>
        </div>
      </section>

      <!-- DECORATIVE STAT GRID -->
      <section class="stats">
        <div class="stat" reveal="up" [revealDelay]="0">
          <div class="stat__n font-display">4+</div>
          <div class="stat__l font-mono">years engineering</div>
        </div>
        <div class="stat" reveal="up" [revealDelay]="100">
          <div class="stat__n font-display">6</div>
          <div class="stat__l font-mono">years in service</div>
        </div>
        <div class="stat" reveal="up" [revealDelay]="200">
          <div class="stat__n font-display">10+</div>
          <div class="stat__l font-mono">production projects</div>
        </div>
        <div class="stat" reveal="up" [revealDelay]="300">
          <div class="stat__n font-display">1st</div>
          <div class="stat__l font-mono">class honours · uwe</div>
        </div>
      </section>

      <!-- MARQUEE -->
      <section class="ribbon" reveal="up">
        <app-marquee
          [items]="ribbonItems"
          [duration]="46"
        />
      </section>

      <!-- ABOUT -->
      <section class="about">
        <app-section-label index="01" label="about" />

        <div class="about__grid">
          <h2 class="about__h font-display" reveal="up">
            Discipline is a
            <span class="ital">technique.</span> So is taste.
          </h2>
          <div class="about__body">
            <p class="about__p" reveal="up" [revealDelay]="100">
              I write code the way I trained as a Marine — methodical, calm
              under load, and uncompromising about the standards I leave in the
              codebase.
            </p>
            <p class="about__p" reveal="up" [revealDelay]="200">
              I am currently engineering at
              <a class="link-line" href="#">Oxiqa</a> and lecturing Computer
              Science at <a class="link-line" href="#">Villa College</a> — a
              partnership with UWE Bristol where I finished my BSc with first
              class honours.
            </p>
            <p class="about__p" reveal="up" [revealDelay]="300">
              I have shipped full-stack platforms across MOTCA, MWSC, Joali, and
              independent classrooms. The work is the proof.
            </p>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="foot">
        <div class="foot__big font-display" reveal="up">
          Got a system worth building?
        </div>
        <a class="foot__cta font-display" href="mailto:{{ data.email }}" data-magnetic reveal="up" [revealDelay]="120">
          <span>{{ data.email }}</span>
          <span class="foot__arrow">→</span>
        </a>
        <div class="foot__row font-mono">
          <span>Malé · Maldives</span>
          <span>2026 © Zouriel</span>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      :host { display: block; }

      .hero {
        position: relative;
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 1.5rem 6rem;
      }
      @media (min-width: 768px) {
        .hero { padding: 0 4rem 8rem; }
      }

      /* meta bar */
      .meta-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1.25rem;
        font-size: 11px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.4);
      }
      .meta-bar__l {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
      }
      .meta-bar__l .dot {
        width: 7px;
        height: 7px;
        border-radius: 9999px;
        background: #34d399;
        box-shadow: 0 0 14px #34d399;
        animation: livePulse 1.6s ease-in-out infinite;
      }
      .meta-bar__r {
        display: inline-flex;
        gap: 0.6rem;
      }
      .meta-bar__r .sep { opacity: 0.4; }

      /* hero main */
      .hero__main {
        position: relative;
        min-height: 92vh;
        padding-top: 6rem;
      }

      /* name */
      .name {
        margin-top: 1.5rem;
        font-weight: 700;
        line-height: 0.86;
        letter-spacing: -0.04em;
        font-size: clamp(3rem, 14vw, 12rem);
      }
      .name__row {
        display: block;
        white-space: nowrap;
        overflow: visible;
      }
      .name__row--accent {
        font-style: italic;
        font-weight: 300;
      }
      .name__char {
        display: inline-block;
        opacity: 0;
        transform: translateY(0.9em) rotate(6deg);
        animation: charIn 0.95s cubic-bezier(0.16, 1, 0.3, 1) both;
        animation-delay: calc(var(--i, 0) * 30ms + 200ms);
      }
      .name__accent {
        display: inline-block;
        padding: 0.1em 0.12em;
        margin: -0.1em -0.12em;
        background-image: linear-gradient(90deg, #d23045 0%, #f59e0b 55%, #fb7185 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        filter: drop-shadow(0 0 36px rgba(245, 158, 11, 0.38))
                drop-shadow(0 0 80px rgba(210, 48, 69, 0.22));
        opacity: 0;
        transform: translateY(0.45em);
        animation: accentIn 1.1s cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      @keyframes accentIn {
        to { opacity: 1; transform: translateY(0); }
      }

      .name__family {
        display: inline-flex;
        align-items: center;
        gap: 0.85rem;
        margin-top: 1.25rem;
        font-size: 11px;
        letter-spacing: 0.4em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.4);
      }
      .name__family-line {
        display: inline-block;
        width: 56px;
        height: 1px;
        background: linear-gradient(90deg, rgba(245, 158, 11, 0.6), transparent);
      }

      .sr-only {
        position: absolute;
        width: 1px; height: 1px;
        padding: 0; margin: -1px;
        overflow: hidden; clip: rect(0,0,0,0);
        white-space: nowrap; border: 0;
      }

      /* role row */
      .role-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 2.5rem;
        gap: 1.5rem;
        flex-wrap: wrap;
      }
      .role-row__pillRow {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .pill {
        font-size: 11px;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        font-family: "JetBrains Mono", monospace;
        padding: 0.4rem 0.8rem;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.03);
        color: rgba(255, 255, 255, 0.7);
      }
      .role-row__scroll {
        font-size: 11px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.45);
        display: inline-flex;
        gap: 0.6rem;
        align-items: center;
      }
      .role-row__arrow {
        display: inline-block;
        animation: scrollBob 1.8s ease-in-out infinite;
      }
      @keyframes scrollBob {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(4px); }
      }

      /* bio */
      .bio {
        margin-top: 3.5rem;
        max-width: 720px;
      }
      .bio__lead {
        font-size: clamp(1.25rem, 2.2vw, 1.65rem);
        line-height: 1.45;
        color: rgba(255, 255, 255, 0.85);
      }
      .bio__amp {
        font-family: "Bricolage Grotesque", serif;
        font-style: italic;
        font-weight: 300;
        color: #f59e0b;
        margin-right: 0.35rem;
      }

      /* cta */
      .cta-row {
        margin-top: 2.5rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }
      .cta {
        position: relative;
        overflow: hidden;
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        border-radius: 9999px;
        font-family: "Space Grotesk", sans-serif;
        font-weight: 500;
        letter-spacing: -0.01em;
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
          background 0.4s ease, color 0.3s ease, border-color 0.3s ease;
      }
      .cta__label, .cta__hover {
        display: inline-block;
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
          opacity 0.4s ease;
      }
      .cta__hover {
        position: absolute;
        left: 1.5rem;
        right: 1.5rem;
        white-space: nowrap;
        opacity: 0;
        transform: translateY(120%);
      }
      .cta__arrow {
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .cta:hover .cta__arrow {
        transform: translate(4px, -4px);
      }

      .cta--primary {
        background: #f4ece4;
        color: #0a0608;
      }
      .cta--primary:hover {
        background: #f59e0b;
        color: #0a0608;
      }
      .cta--primary:hover .cta__label {
        opacity: 0;
        transform: translateY(-120%);
      }
      .cta--primary:hover .cta__hover {
        opacity: 1;
        transform: translateY(0);
      }

      .cta--ghost {
        border: 1px solid rgba(255, 255, 255, 0.18);
        color: rgba(255, 255, 255, 0.85);
        background: rgba(255, 255, 255, 0.02);
      }
      .cta--ghost:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.45);
      }

      .socials { margin-top: 2.25rem; }

      @keyframes livePulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50%      { transform: scale(0.5); opacity: 0.4; }
      }
      @keyframes charIn {
        to { opacity: 1; transform: translateY(0) rotate(0); }
      }

      /* stats */
      .stats {
        margin-top: 8rem;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding-top: 3rem;
      }
      @media (min-width: 768px) {
        .stats { grid-template-columns: repeat(4, 1fr); gap: 2.5rem; }
      }
      .stat__n {
        font-size: clamp(2.5rem, 6vw, 4.5rem);
        font-weight: 700;
        letter-spacing: -0.04em;
        color: #fff;
        line-height: 0.95;
      }
      .stat__l {
        margin-top: 0.5rem;
        font-size: 11px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.4);
      }

      /* marquee ribbon */
      .ribbon {
        margin-top: 6rem;
        margin-left: -1.5rem;
        margin-right: -1.5rem;
        padding: 2rem 0;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        background: linear-gradient(
          180deg,
          rgba(245, 158, 11, 0.04),
          rgba(210, 48, 69, 0.04)
        );
      }
      @media (min-width: 768px) {
        .ribbon { margin-left: -4rem; margin-right: -4rem; }
      }

      /* about */
      .about {
        margin-top: 8rem;
      }
      .about__grid {
        margin-top: 2rem;
        display: grid;
        grid-template-columns: 1fr;
        gap: 3rem;
      }
      @media (min-width: 900px) {
        .about__grid { grid-template-columns: 1.2fr 1fr; gap: 6rem; }
      }
      .about__h {
        font-size: clamp(2rem, 5vw, 4rem);
        font-weight: 600;
        line-height: 1.05;
        letter-spacing: -0.03em;
        color: rgba(255, 255, 255, 0.95);
        text-wrap: balance;
      }
      .about__h .ital {
        font-style: italic;
        font-weight: 300;
        color: #f59e0b;
      }
      .about__body {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .about__p {
        font-size: 1.05rem;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.7);
      }

      /* footer */
      .foot {
        margin-top: 10rem;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        padding-top: 4rem;
      }
      .foot__big {
        font-size: clamp(2rem, 6vw, 5rem);
        font-weight: 500;
        letter-spacing: -0.03em;
        color: rgba(255, 255, 255, 0.55);
        line-height: 1;
      }
      .foot__cta {
        display: inline-flex;
        align-items: center;
        gap: 1rem;
        margin-top: 1.5rem;
        font-size: clamp(1.75rem, 5vw, 3.5rem);
        font-weight: 600;
        letter-spacing: -0.04em;
        background: linear-gradient(90deg, #fff 0%, #f59e0b 60%, #fb7185 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .foot__arrow {
        display: inline-block;
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        color: #f59e0b;
        -webkit-text-fill-color: #f59e0b;
      }
      .foot__cta:hover .foot__arrow {
        transform: translate(8px, -8px) rotate(-12deg);
      }
      .foot__row {
        display: flex;
        justify-content: space-between;
        margin-top: 5rem;
        font-size: 11px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.4);
      }
    `,
  ],
  host: { class: 'route-enter' },
})
export class HomePage implements AfterViewInit, OnDestroy {
  @HostBinding('class.block') hostBlock = true;
  links = SocialLinks;
  data = homePageData;

  firstChars: string[] = [];
  lastChars: string[] = [];
  lastName = '';
  familyName = '';

  today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  ribbonItems = [
    'Angular',
    '.NET',
    'TypeScript',
    'Go',
    'PostgreSQL',
    'Docker',
    'Tailwind',
    'Vue',
    'OAuth2',
    'CI/CD',
    'Canvas',
    'Marine Veteran',
    'Lecturer',
  ];

  @ViewChild('parallax') parallaxRef?: ElementRef<HTMLElement>;
  private onMove?: (e: PointerEvent) => void;

  constructor(private zone: NgZone) {
    const parts = this.data.name.trim().split(/\s+/);
    const first = parts[0] ?? '';
    const second = parts[1] ?? '';
    this.firstChars = [...first];
    this.lastChars = [...second];
    this.lastName = second;
    this.familyName = parts.slice(2).join(' ');
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const host = this.parallaxRef?.nativeElement;
    if (!host) return;

    this.zone.runOutsideAngular(() => {
      this.onMove = (e: PointerEvent) => {
        const rect = host.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        host.style.setProperty('--px', `${nx * 14}px`);
        host.style.setProperty('--py', `${ny * 14}px`);
        host.style.transform = `translate3d(${nx * -8}px, ${ny * -6}px, 0)`;
      };
      host.addEventListener('pointermove', this.onMove);
    });
  }

  ngOnDestroy(): void {
    if (this.parallaxRef && this.onMove)
      this.parallaxRef.nativeElement.removeEventListener('pointermove', this.onMove);
  }
}
