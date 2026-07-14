import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { UiButton } from 'ui/button';
import { UiChip } from 'ui/badge';
import { UiStatCard } from 'ui/card';
import { UiSectionLabel, UiReveal, UiSplitText, UiMarquee, UiMagnetic, UiDriftRow } from 'ui/fx';

import { SocialLinksComponent } from '../components/social-links.component';
import { BinaryFaceComponent } from '../components/binary-face-background.component';
import { homePageData, SocialLinks } from '../data/home-page.data';
import { projects } from '../data/projects.data';
import { workExperienceData } from '../data/work-experience.data';

@Component({
  selector: 'app-home',
  standalone: true,
  host: { class: 'route-enter' },
  imports: [
    RouterLink,
    UiButton,
    UiChip,
    UiStatCard,
    UiSectionLabel,
    UiReveal,
    UiSplitText,
    UiMarquee,
    UiMagnetic,
    UiDriftRow,
    SocialLinksComponent,
    BinaryFaceComponent,
  ],
  template: `
    <div class="wrap">
      <!-- ============ HERO ============ -->
      <section class="hero">
        <!-- full-viewport dark backdrop for the mobile hero; fades to the light
             page as you scroll past. (opacity driven by scroll on mobile) -->
        <div class="hero__backdrop" aria-hidden="true"></div>

        <!-- meta (desktop only) -->
        <div class="meta font-mono">
          <span class="live"><span class="pulse"></span>Engineering &amp; lecturing — Malé, Maldives</span>
          <span class="date">{{ today() }} · UTC+5</span>
        </div>

        <!-- On mobile this becomes a pinned, scroll-driven cross-fade:
             banner → socials → contact. On desktop the layers stack normally. -->
        <div class="hero__track" #track>
          <div class="hero__pin">
            <!-- LAYER 1 · dark banner -->
            <div class="hero__layer hero__layer--banner">
              <div class="hero__panel" data-theme="darkOrange">
                <div class="hero__stage" aria-hidden="true">
                  <app-binary-face />
                </div>
                <div class="hero__panelcontent">
                  <ui-section-label index="00" label="Index" />
                  <h1 class="name font-display glow-amber">
                    <span uiSplitText>Mohamed</span>
                    <span class="accent ui-gradient-text">Imdaah</span>
                    <span class="kin font-mono">Nasrullah</span>
                  </h1>
                  <span class="sr-only">{{ data.name }}</span>

                  <div class="roles">
                    <ui-chip>Full-Stack Engineer</ui-chip>
                    <a class="rank" routerLink="/military" uiMagnetic title="MNDF Marine Corps">
                      LCpl · Marine Veteran <span aria-hidden="true">›</span>
                    </a>
                    <ui-chip>Lecturer</ui-chip>
                    <ui-chip>Athlete</ui-chip>
                  </div>

                  <p class="bio text-pretty">
                    I write code for a living — production systems, classroom tools, and the side
                    projects I can't quite put down. Most of the discipline came from six years as a
                    Lance Corporal in the
                    <a class="link-line" routerLink="/military">MNDF Marine Corps</a>.
                  </p>
                </div>
              </div>
            </div>

            <!-- LAYER 2 · socials -->
            <div class="hero__layer hero__layer--socials">
              <p class="social__label font-mono">Find me elsewhere</p>
              <app-social-links [links]="links" />
            </div>

            <!-- LAYER 3 · contact (with the drifting showcase) -->
            <div class="hero__layer hero__layer--contact">
              <p class="cta__q font-display">Want to get in touch?</p>

              <div class="showcase">
                <div class="showcase__row">
                  <div class="showcase__label font-mono">// what I've built</div>
                  <ui-drift-row [speed]="26" gap="1rem">
                    @for (p of driftProjects; track p.name; let i = $index) {
                      <a class="dcard" [href]="p.live || null" [attr.target]="p.live ? '_blank' : null"
                         rel="noopener noreferrer" [style.--accent]="driftAccent(i)">
                        <div class="dcard__top font-mono">
                          <span class="dcard__type"><span class="ddot"></span>{{ p.projectType }}</span>
                          @if (p.live) { <span class="dcard__live">LIVE</span> }
                        </div>
                        <h3 class="dcard__name font-display">{{ p.name }}</h3>
                        <div class="dcard__stack">
                          @for (s of p.stackFlat.slice(0, 3); track s) { <span class="dtag" [title]="s">{{ s }}</span> }
                        </div>
                      </a>
                    }
                  </ui-drift-row>
                </div>

                <div class="showcase__row">
                  <div class="showcase__label font-mono">// where I've worked</div>
                  <ui-drift-row [speed]="22" direction="left" gap="1rem">
                    @for (w of driftWork; track w.org + w.role) {
                      <article class="dcard dcard--work">
                        <div class="dcard__top font-mono">
                          <span class="dcard__type"><span class="ddot"></span>{{ w.period }}</span>
                          @if (w.type === 'lecturer') { <span class="dcard__tag">Teaching</span> }
                        </div>
                        <h3 class="dcard__name font-display">{{ w.role }}</h3>
                        <div class="dcard__org">{{ w.org }}</div>
                      </article>
                    }
                  </ui-drift-row>
                </div>
              </div>

              <div class="cta__buttons">
                <a class="cta__primary" [href]="'mailto:' + data.email">
                  <ui-button variant="primary" size="lg">Get in touch</ui-button>
                </a>
                <a routerLink="/projects">
                  <ui-button variant="ghost" size="lg">See selected works ›</ui-button>
                </a>
              </div>
            </div>

            <!-- persistent chrome across all mobile frames -->
            <div class="hero__persist" aria-hidden="true">
              <span class="hero__persist-meta font-mono">
                <span class="pulse"></span>Engineering &amp; lecturing — Malé, Maldives
              </span>
              <span class="hero__scroll font-mono">
                scroll <span class="hero__scroll-arrow"></span>
              </span>
            </div>
          </div>
          <!-- magnetic snap points at each frame centre (mobile) -->
          <span class="snap snap--banner" aria-hidden="true"></span>
          <span class="snap snap--socials" aria-hidden="true"></span>
          <span class="snap snap--contact" aria-hidden="true"></span>
        </div>
      </section>

      <!-- ============ STATS ============ -->
      <section class="stats" uiReveal="up">
        @for (s of stats; track s.label) {
          <ui-stat-card [label]="s.label" [value]="s.value" [delta]="s.delta" />
        }
      </section>

      <!-- ============ RIBBON ============ -->
      <section class="ribbon">
        <ui-marquee [items]="ribbon" [duration]="46" />
      </section>

      <!-- ============ ABOUT ============ -->
      <section class="about">
        <ui-section-label index="01" label="About" />
        <h2 class="about__head font-display" uiReveal="up">
          I like building things that
          <span class="accent ui-gradient-text">actually work.</span>
        </h2>

        <div class="about__body">
          <p uiReveal="up" [revealDelay]="60">
            The Marine Corps taught me to be precise under load and calm when conditions
            aren't. I carry that into engineering: clear contracts, reproducible builds,
            and systems that hold the line in production.
          </p>
          <p uiReveal="up" [revealDelay]="120">
            These days I'm engineering at <strong>Oxiqa</strong> and teaching Computer
            Science at <strong>Villa College</strong> — the UWE Bristol partner here in
            Malé, where I also earned my BSc (First Class).
          </p>
          <p uiReveal="up" [revealDelay]="180">
            I've shipped full-stack work for the Ministry of Higher Education, MOTCA,
            MWSC, and Joali — and a handful of classrooms — across .NET, Angular, Go,
            and Vue.
          </p>
        </div>
      </section>

      <!-- ============ FOOTER CTA ============ -->
      <section class="foot">
        <ui-section-label label="Contact" />
        <a class="foot__cta font-display glow-amber" [href]="'mailto:' + data.email" uiMagnetic>
          Got something you want built?
        </a>
        <div class="foot__row font-mono">
          <span>Malé · Maldives</span>
          <span>2026 © Zouriel</span>
        </div>
      </section>
    </div>
  `,
  styles: `
    :host { display: block; }
    .wrap { max-width: 68rem; margin: 0 auto; padding: clamp(3.5rem, 8vw, 7rem) 1.25rem 6rem; display: flex; flex-direction: column; gap: clamp(4rem, 10vw, 8rem); }

    /* hero — desktop: meta on top, then banner / contact / socials stacked in flow */
    .hero { position: relative; display: flex; flex-direction: column; gap: 1.25rem; }
    .hero__backdrop { display: none; }
    .hero__pin { display: flex; flex-direction: column; gap: 1.5rem; }
    .hero__layer { opacity: 1; }
    .hero__layer--banner { order: 1; }
    .hero__layer--contact { order: 2; display: flex; flex-direction: column; gap: 1rem; }
    .hero__layer--socials { order: 3; display: flex; flex-direction: column; gap: 1rem; }

    .hero__panel {
      position: relative; isolation: isolate; overflow: clip;
      border-radius: 1.5rem;
      background: var(--ui-color-bg);
      border: 1px solid var(--ui-color-border);
      padding: clamp(1.25rem, 3vw, 2rem);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
    }
    .hero__panelcontent { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 1rem; }
    .hero__stage {
      position: absolute; z-index: 0; pointer-events: none;
      top: 0; right: 0; bottom: 0;
      width: min(56%, 34rem);
      --bf-opacity: 0.95;
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 34%);
      mask-image: linear-gradient(90deg, transparent, #000 34%);
    }

    .meta { display: flex; flex-wrap: wrap; gap: 0.5rem 1.5rem; justify-content: space-between; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ui-color-text-muted); }
    .live { display: inline-flex; align-items: center; gap: 0.6rem; }
    .pulse { width: 8px; height: 8px; border-radius: 999px; background: #34d399; box-shadow: 0 0 10px #34d399; animation: livePulse 2.2s ease-in-out infinite; }
    @keyframes livePulse { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }

    .name { margin: 0.25rem 0 0; font-size: clamp(2.2rem, 6.5vw, 4.2rem); line-height: 0.95; letter-spacing: -0.03em; display: flex; flex-direction: column; }
    .name .accent { font-style: italic; }
    .name .kin { font-size: clamp(0.7rem, 2vw, 0.95rem); letter-spacing: 0.35em; text-transform: uppercase; color: var(--ui-color-text-muted); margin-top: 0.5rem; }

    .roles { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem; }
    .rank { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.35rem 0.85rem; border-radius: 999px;
      font-size: 0.85rem; text-decoration: none; color: var(--ui-color-text);
      border: 1px solid color-mix(in srgb, var(--ui-color-primary) 45%, transparent);
      background: color-mix(in srgb, var(--ui-color-primary) 10%, transparent); }
    .rank span { color: var(--ui-color-primary); }

    .bio { max-width: 42ch; font-size: clamp(0.98rem, 2vw, 1.12rem); line-height: 1.55; color: var(--ui-color-text); }
    .bio a { color: var(--ui-color-primary); text-decoration: none; }

    .cta__buttons { display: flex; flex-wrap: wrap; gap: 0.85rem; }
    .cta__buttons a { text-decoration: none; }
    /* prompts used only in the mobile stepped hero */
    .cta__q, .social__label { display: none; }
    /* dark "Get in touch" button — matches the hero black */
    .cta__primary {
      --ui-color-primary: #0a0608;
      --ui-color-primary-hover: #1a1014;
      --ui-color-primary-contrast: #f4ece4;
    }

    /* stats */
    .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    @media (min-width: 720px) { .stats { grid-template-columns: repeat(4, 1fr); } }

    /* showcase — drifting rows of key projects + work */
    .showcase { display: flex; flex-direction: column; gap: 2rem; width: 100%; }
    .showcase__row { display: flex; flex-direction: column; gap: 0.9rem; width: 100%; min-width: 0; }
    .showcase ui-drift-row { display: block; width: 100%; }
    .showcase__label { font-size: 10.5px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--ui-color-text-muted); }
    .dcard {
      flex: 0 0 auto; width: 17rem; min-height: 8.5rem; overflow: hidden; display: flex; flex-direction: column; gap: 0.6rem;
      padding: 1.1rem 1.2rem; border-radius: 1rem; text-decoration: none;
      background: var(--ui-color-surface); border: 1px solid var(--ui-color-border);
      transition: border-color 0.3s ease, transform 0.3s ease;
    }
    .dcard--work { width: 15rem; min-height: 7rem; }
    .dcard:hover { border-color: color-mix(in srgb, var(--accent, var(--ui-color-primary)) 45%, var(--ui-color-border)); transform: translateY(-2px); }
    .dcard__top { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ui-color-text-muted); }
    .dcard__type { display: inline-flex; align-items: center; gap: 0.4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .ddot { flex: 0 0 auto; width: 6px; height: 6px; border-radius: 999px; background: var(--accent, var(--ui-color-primary)); box-shadow: 0 0 8px var(--accent, var(--ui-color-primary)); }
    .dcard__live { flex: 0 0 auto; color: var(--ui-color-success); font-weight: 600; }
    .dcard__tag { flex: 0 0 auto; color: var(--ui-color-primary); }
    .dcard__name { margin: 0; font-size: 1.12rem; line-height: 1.15; letter-spacing: -0.01em; color: var(--ui-color-text); }
    .dcard__org { font-size: 0.85rem; color: var(--ui-color-text-muted); }
    .dcard__stack { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: auto; }
    .dcard__stack { max-width: 100%; overflow: hidden; }
    .dtag {
      display: inline-block; max-width: 7.5rem; box-sizing: border-box;
      font-family: var(--ui-font-mono, var(--font-mono)); font-size: 10px; letter-spacing: 0.04em;
      padding: 0.12rem 0.5rem; border-radius: 999px;
      background: var(--ui-color-surface-raised); color: var(--ui-color-text-muted);
      border: 1px solid var(--ui-color-border);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; vertical-align: bottom;
    }

    /* ribbon */
    .ribbon { border-block: 1px solid var(--ui-color-border); padding-block: 1.5rem; }

    /* about */
    .about { display: flex; flex-direction: column; gap: 1.5rem; }
    .about__head { margin: 0; font-size: clamp(1.8rem, 5vw, 3rem); line-height: 1.05; letter-spacing: -0.02em; max-width: 22ch; }
    .about__head .accent { font-style: italic; }
    .about__body { display: grid; gap: 1.1rem; max-width: 52ch; color: var(--ui-color-text-muted); font-size: 1.05rem; line-height: 1.7; }
    .about__body strong { color: var(--ui-color-text); font-weight: 600; }

    /* footer */
    .foot { display: flex; flex-direction: column; gap: 1.25rem; align-items: flex-start; }
    .foot__cta { font-size: clamp(2rem, 7vw, 4.5rem); line-height: 1; letter-spacing: -0.03em; text-decoration: none; color: var(--ui-color-text); max-width: 16ch; }
    .foot__cta:hover { color: var(--ui-color-primary); }
    .foot__row { display: flex; gap: 1.5rem; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ui-color-text-muted); }

    .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }

    /* persistent header + scroll cue (mobile hero only) */
    .hero__persist { display: none; }

    /* ============================================================
       MOBILE ONLY — pinned, scroll-driven cross-fade hero.
       The track is tall; a sticky pin keeps one screen centred while
       the three layers cross-fade in place as you scroll (reversible):
       dark banner → socials → "get in touch?" → then the rest of the page.
       ============================================================ */
    @media (max-width: 760px) {
      .wrap { padding-top: 0; gap: 3rem; }
      .meta { display: none; }

      /* full-viewport dark backdrop (opacity driven by scroll) */
      .hero__backdrop { display: block; position: fixed; inset: 0; z-index: -1; background: #0a0608; opacity: 1; }

      .hero__track { position: relative; height: 320dvh; }
      /* magnetic snap targets: settle the scroll on a frame so it's fully in
         (opacity 1 → interactive) — at the top, and the socials + contact centres */
      .snap { position: absolute; left: 0; width: 1px; height: 1px; pointer-events: none; scroll-snap-align: start; }
      .snap--banner { top: 0; }
      .snap--socials { top: 34.4%; }
      .snap--contact { top: 64%; }
      .hero__pin {
        position: sticky; top: 0; height: 100dvh; display: block;
        /* dark theme tokens so all hero content reads on the dark frame */
        --ui-color-bg: #0a0608;
        --ui-color-surface: #120a0d;
        --ui-color-surface-raised: #1a1014;
        --ui-color-text: #f4ece4;
        --ui-color-text-muted: rgba(244, 236, 228, 0.5);
        --ui-color-border: rgba(244, 236, 228, 0.14);
        --ui-color-primary: #f59e0b;
        --ui-color-primary-hover: #fbbf24;
        --ui-color-primary-contrast: #0a0608;
        /* map the library font tokens to the site fonts (display/sans/mono) */
        --ui-font-display: var(--font-display);
        --ui-font-default: var(--font-sans);
        --ui-font-mono: var(--font-mono);
      }
      /* no card — the whole frame is dark now */
      .hero__panel { background: transparent; border: none; box-shadow: none; padding: 0; }
      /* bone button + raised chips read on the dark frame */
      .cta__primary { --ui-color-primary: #f4ece4; --ui-color-primary-hover: #ffffff; --ui-color-primary-contrast: #0a0608; }
      .hero__layer--socials app-social-links {
        --sl-bg: #14090d; --sl-bd: rgba(244, 236, 228, 0.18); --sl-fg: rgba(244, 236, 228, 0.82);
        --sl-bgh: #241318; --sl-fgh: #ffffff;
      }

      .hero__layer {
        position: absolute; inset: 0;
        display: flex; flex-direction: column; justify-content: center;
        opacity: 0; will-change: opacity;
      }
      .hero__layer--banner { align-items: stretch; }
      .hero__layer--socials,
      .hero__layer--contact { align-items: flex-start; gap: 1.5rem; }

      .cta__q, .social__label { display: block; }
      .social__label { font-size: 11px; letter-spacing: 0.32em; text-transform: uppercase; color: var(--ui-color-text-muted); }
      .cta__q { margin: 0; font-size: clamp(2.1rem, 10vw, 3rem); line-height: 1.05; letter-spacing: -0.02em; color: var(--ui-color-text); max-width: 11ch; }
      .cta__buttons { flex-direction: column; align-items: stretch; width: 100%; max-width: 20rem; }
      .cta__buttons a, .cta__buttons ui-button { width: 100%; }

      /* the ember face inside the centred banner card */
      .hero__stage {
        right: -10%; left: auto; width: 80%;
        --bf-opacity: 0.32;
        -webkit-mask-image: radial-gradient(80% 72% at 52% 42%, #000 44%, transparent 82%);
        mask-image: radial-gradient(80% 72% at 52% 42%, #000 44%, transparent 82%);
      }
      .roles { max-width: 64%; }

      /* persistent chrome — sits above the fading layers, always visible */
      .hero__persist {
        display: block; position: absolute; inset: 0; z-index: 3; pointer-events: none;
      }
      .hero__persist-meta {
        position: absolute; top: 1.4rem; left: 0.25rem; right: 0.25rem;
        display: inline-flex; align-items: center; gap: 0.55rem;
        font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
        color: var(--ui-color-text-muted); line-height: 1.4;
      }
      .hero__scroll {
        position: absolute; bottom: 1.5rem; left: 0.25rem;
        display: inline-flex; align-items: center; gap: 0.55rem;
        font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase;
        color: var(--ui-color-text-muted);
      }
      .hero__scroll-arrow {
        width: 7px; height: 7px;
        border-right: 1.5px solid currentColor;
        border-bottom: 1.5px solid currentColor;
        transform: rotate(45deg);
        animation: heroScrollBob 1.6s ease-in-out infinite;
      }
      @keyframes heroScrollBob {
        0%, 100% { transform: translateY(0) rotate(45deg); opacity: 0.45; }
        50% { transform: translateY(3px) rotate(45deg); opacity: 1; }
      }
    }
  `,
})
export class HomePage implements AfterViewInit, OnDestroy {
  private hostRef = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly data = homePageData;
  protected readonly links = SocialLinks;

  private teardown?: () => void;

  protected readonly today = signal(
    new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  );

  protected readonly stats = [
    { label: 'Engineering', value: '4+ yrs', delta: 'shipping' },
    { label: 'In service', value: '6 yrs', delta: 'MNDF' },
    { label: 'Production projects', value: '10+', delta: 'live' },
    { label: 'BSc honours', value: 'First', delta: 'UWE' },
  ];

  protected readonly ribbon = [
    'Angular', '.NET', 'TypeScript', 'Go', 'PostgreSQL', 'Docker',
    'Tailwind', 'Vue', 'OAuth2', 'CI/CD', 'Marine Veteran', 'Lecturer',
  ];

  // drifting showcase: a curated set of key projects + the work history
  private static readonly DRIFT_NAMES = new Set([
    'HEMS — Higher Education Management System',
    'zcoms',
    'invites.blog',
    'VerifyPortal',
    'Lektrus',
    'Angular UI Library',
    'IMS — Inventory Management System',
    'MOTCA Domain',
  ]);
  protected readonly driftProjects = projects.filter((p) => HomePage.DRIFT_NAMES.has(p.name));
  protected readonly driftWork = workExperienceData;

  protected driftAccent(i: number): string {
    return ['#f59e0b', '#a78bfa', '#22d3ee', '#fb7185', '#34d399', '#60a5fa', '#f97316', '#facc15'][i % 8];
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;
    const track = this.hostRef.nativeElement.querySelector('.hero__track') as HTMLElement | null;
    if (!track) return;
    const layers = Array.from(track.querySelectorAll('.hero__layer')) as HTMLElement[];
    if (!layers.length) return;

    const backdrop = this.hostRef.nativeElement.querySelector('.hero__backdrop') as HTMLElement | null;
    const mq = window.matchMedia('(max-width: 760px)');
    const n = layers.length;
    let raf = 0;

    const apply = () => {
      raf = 0;
      // Desktop: clear inline styles so the layers stack normally at full opacity.
      if (!mq.matches) {
        for (const l of layers) { l.style.opacity = ''; l.style.pointerEvents = ''; }
        if (backdrop) backdrop.style.opacity = '';
        return;
      }
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;

      // Dark backdrop covers the screen through the hero, then drops to the light
      // page as the track scrolls out (rect.bottom falls below the viewport).
      if (backdrop) {
        const vh = window.innerHeight;
        const bd = Math.min(Math.max((rect.bottom - vh * 0.4) / (vh * 0.6), 0), 1);
        backdrop.style.opacity = bd.toFixed(3);
      }
      // Each layer holds fully visible for HOLD, fades over FADE, then a blank
      // gap before the next layer fades in (fade out → blank → fade in).
      const HOLD = 0.14; // half-width of the fully-visible plateau
      const FADE = 0.05; // fade in/out ramp width
      for (let i = 0; i < n; i++) {
        const c = n > 1 ? i / (n - 1) : 0;
        const d = Math.abs(p - c);
        const o = Math.min(Math.max((HOLD + FADE - d) / FADE, 0), 1);
        layers[i].style.opacity = o.toFixed(3);
        layers[i].style.pointerEvents = o > 0.5 ? 'auto' : 'none';
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply); };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    mq.addEventListener('change', onScroll);
    apply();

    this.teardown = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      mq.removeEventListener('change', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }

  ngOnDestroy(): void {
    this.teardown?.();
  }
}
