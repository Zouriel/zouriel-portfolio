import { Component } from '@angular/core';
import { UiSectionLabel, UiReveal } from 'ui/fx';
import { militaryData } from '../data/military.data';

@Component({
  selector: 'app-military-page',
  standalone: true,
  host: { class: 'route-enter' },
  imports: [UiSectionLabel, UiReveal],
  template: `
    <div class="wrap">
      <ui-section-label index="05" label="Service" />

      <header class="hero">
        <h1 class="title font-display" uiReveal="up" [revealDelay]="80">
          <span class="title__primary">In the</span>
          <span class="title__accent ui-gradient-text">Corps.</span>
        </h1>

        <div class="hero__meta font-mono" uiReveal="up" [revealDelay]="200">
          <span class="dot"></span>
          <span>{{ data.branch }}</span>
          <span class="sep">·</span>
          <span>{{ data.period }}</span>
        </div>

        <p class="intro text-pretty" uiReveal="up" [revealDelay]="280">
          {{ data.summary }}
        </p>
      </header>

      <!-- TOP ROW: rank + qualification + BFT -->
      <section class="row row--three">
        <!-- RANK -->
        <article class="card card--rank" uiReveal="up" [revealDelay]="120">
          <div class="card__label font-mono">// last rank</div>

          <div class="chevron-wrap">
            <svg viewBox="0 0 200 160" class="chevron" aria-hidden="true">
              <defs>
                <linearGradient id="chev-g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stop-color="#fde68a"/>
                  <stop offset="60%" stop-color="#f59e0b"/>
                  <stop offset="100%" stop-color="#d23045"/>
                </linearGradient>
                <linearGradient id="chev-rifle" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#fde68a"/>
                  <stop offset="100%" stop-color="#fbbf24"/>
                </linearGradient>
              </defs>
              <path
                d="M40 92 L100 40 L160 92 L138 92 L100 60 L62 92 Z"
                fill="url(#chev-g)" stroke="#fde68a" stroke-width="1.2" opacity="0.95"
              />
              <g transform="translate(100 108) rotate(-45)" fill="url(#chev-rifle)" opacity="0.92">
                <rect x="-30" y="-2.2" width="60" height="4.4" rx="1"/>
                <rect x="22" y="-4.5" width="9" height="9" rx="1"/>
                <rect x="-31" y="-3.5" width="3" height="7" rx="0.5"/>
              </g>
              <g transform="translate(100 108) rotate(45)" fill="url(#chev-rifle)" opacity="0.92">
                <rect x="-30" y="-2.2" width="60" height="4.4" rx="1"/>
                <rect x="22" y="-4.5" width="9" height="9" rx="1"/>
                <rect x="-31" y="-3.5" width="3" height="7" rx="0.5"/>
              </g>
            </svg>
          </div>

          <h2 class="card__h font-display">{{ data.rank }}</h2>
          <p class="card__sub font-mono">{{ data.rankShort }} · {{ data.branchShort }}</p>
        </article>

        <!-- EXPERT QUALIFICATION -->
        <article class="card card--qual" uiReveal="up" [revealDelay]="220">
          <div class="card__label font-mono">// last shooter qual</div>

          <div class="badge-wrap">
            <svg viewBox="0 0 220 220" class="badge" aria-hidden="true">
              <defs>
                <linearGradient id="bg-g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stop-color="#fde68a"/>
                  <stop offset="100%" stop-color="#f59e0b"/>
                </linearGradient>
                <radialGradient id="bg-glow" cx="0.5" cy="0.5" r="0.5">
                  <stop offset="0%"  stop-color="#f59e0b" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
                </radialGradient>
              </defs>
              <circle cx="110" cy="100" r="92" fill="url(#bg-glow)"/>
              <circle cx="110" cy="100" r="70" fill="none" stroke="url(#bg-g)" stroke-width="1.5" opacity="0.55"/>
              <g fill="none" stroke="url(#bg-g)" stroke-width="2.2" stroke-linecap="round" opacity="0.85">
                <path d="M40 100 Q50 70 60 60"/>
                <path d="M44 88 Q50 80 56 78"/>
                <path d="M50 76 Q56 70 62 70"/>
                <path d="M180 100 Q170 70 160 60"/>
                <path d="M176 88 Q170 80 164 78"/>
                <path d="M170 76 Q164 70 158 70"/>
                <path d="M65 55 Q90 38 110 36"/>
                <path d="M155 55 Q130 38 110 36"/>
              </g>
              <g transform="translate(110 102)">
                <g transform="rotate(-35)" fill="url(#bg-g)">
                  <rect x="-44" y="-2.6" width="88" height="5" rx="1.2"/>
                  <rect x="34" y="-6" width="12" height="12" rx="1.2"/>
                </g>
                <g transform="rotate(35)" fill="url(#bg-g)">
                  <rect x="-44" y="-2.6" width="88" height="5" rx="1.2"/>
                  <rect x="34" y="-6" width="12" height="12" rx="1.2"/>
                </g>
              </g>
              <g transform="translate(110 60)" fill="none" stroke="url(#bg-g)" stroke-width="1.6">
                <circle r="11"/>
                <circle r="7"/>
                <circle r="3" fill="url(#bg-g)"/>
              </g>
              <g transform="translate(110 170)">
                <rect x="-58" y="-13" width="116" height="26" rx="3" fill="#0a0608" stroke="url(#bg-g)" stroke-width="1.4"/>
                <text x="0" y="5" text-anchor="middle" fill="#fde68a"
                  font-family="'JetBrains Mono', monospace" font-size="13" letter-spacing="6" font-weight="700">EXPERT</text>
              </g>
              <g transform="translate(110 200)">
                <circle cx="-18" cy="0" r="6" fill="url(#bg-g)" stroke="#0a0608" stroke-width="1.4"/>
                <circle cx="0"   cy="0" r="6" fill="url(#bg-g)" stroke="#0a0608" stroke-width="1.4"/>
                <circle cx="18"  cy="0" r="6" fill="url(#bg-g)" stroke="#0a0608" stroke-width="1.4"/>
              </g>
            </svg>
          </div>

          <h2 class="card__h font-display">Expert</h2>
          <p class="card__sub font-mono">
            marksmanship · <span class="qual-stars">
              @for (i of awards; track i) {<span class="qual-dot"></span>}
            </span>
            <span class="qual-num">×{{ data.qualificationAwards }}</span>
          </p>
        </article>

        <!-- BFT -->
        <article class="card card--bft" uiReveal="up" [revealDelay]="320">
          <div class="card__label font-mono">// last bft</div>

          <div class="bft-num font-display">
            {{ data.bftScore }}
            <span class="bft-max">/ {{ data.bftMax }}</span>
          </div>

          <div class="bft-bar" aria-hidden="true">
            <div class="bft-bar__fill" [style.width.%]="data.bftPercent"></div>
            <div class="bft-bar__ticks">
              @for (t of ticks; track $index) { <span></span> }
            </div>
          </div>

          <p class="card__sub font-mono">basic fitness test · top quartile</p>
        </article>
      </section>

      <!-- PILLARS -->
      <section class="pillars" uiReveal="up">
        <div class="pillars__label font-mono">// values carried forward</div>
        <div class="pillars__grid">
          @for (p of data.pillars; track p.word; let i = $index) {
            <div class="pillar" uiReveal="up" [revealDelay]="i * 70">
              <div class="pillar__word font-display ui-gradient-text">{{ p.word }}</div>
              <div class="pillar__meaning">{{ p.meaning }}</div>
            </div>
          }
        </div>
      </section>

      <!-- COURSES -->
      <section class="courses">
        <div class="courses__head" uiReveal="up">
          <h2 class="courses__h font-display">
            Courses &amp; <span class="ital ui-gradient-text">qualifications.</span>
          </h2>
          <p class="courses__sub font-mono">// training that stuck</p>
        </div>

        <div class="course-grid">
          @for (c of data.courses; track c.title; let i = $index) {
            <article class="course" uiReveal="up" [revealDelay]="i * 80">
              <div class="course__glyph">
                @switch (c.glyph) {
                  @case ('belt') {
                    <svg viewBox="0 0 120 60" aria-hidden="true">
                      <defs>
                        <linearGradient id="belt-g" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stop-color="#e5c599"/>
                          <stop offset="100%" stop-color="#a47148"/>
                        </linearGradient>
                      </defs>
                      <rect x="2" y="22" width="116" height="16" rx="3" fill="url(#belt-g)" stroke="#0a0608" stroke-width="1"/>
                      <rect x="46" y="14" width="28" height="32" rx="3" fill="url(#belt-g)" stroke="#0a0608" stroke-width="1.4"/>
                      <line x1="58" y1="18" x2="58" y2="42" stroke="#0a0608" stroke-width="1"/>
                      <line x1="62" y1="18" x2="62" y2="42" stroke="#0a0608" stroke-width="1"/>
                    </svg>
                  }
                  @case ('medal-bronze') {
                    <svg viewBox="0 0 80 100" aria-hidden="true">
                      <defs>
                        <linearGradient id="bz-r" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stop-color="#d23045"/>
                          <stop offset="100%" stop-color="#7c1d2c"/>
                        </linearGradient>
                        <radialGradient id="bz-m" cx="0.4" cy="0.35">
                          <stop offset="0%" stop-color="#f4c08a"/>
                          <stop offset="55%" stop-color="#cd7f32"/>
                          <stop offset="100%" stop-color="#7a4a1a"/>
                        </radialGradient>
                      </defs>
                      <path d="M22 6 L58 6 L62 30 L18 30 Z" fill="url(#bz-r)"/>
                      <circle cx="40" cy="58" r="26" fill="url(#bz-m)" stroke="#7a4a1a" stroke-width="1.5"/>
                      <text x="40" y="64" text-anchor="middle" fill="#0a0608" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="700">III</text>
                    </svg>
                  }
                  @case ('medal-silver') {
                    <svg viewBox="0 0 80 100" aria-hidden="true">
                      <defs>
                        <linearGradient id="sv-r" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stop-color="#0a66c2"/>
                          <stop offset="100%" stop-color="#063e75"/>
                        </linearGradient>
                        <radialGradient id="sv-m" cx="0.4" cy="0.35">
                          <stop offset="0%" stop-color="#f5f5f5"/>
                          <stop offset="55%" stop-color="#c0c0c0"/>
                          <stop offset="100%" stop-color="#6b6b6b"/>
                        </radialGradient>
                      </defs>
                      <path d="M22 6 L58 6 L62 30 L18 30 Z" fill="url(#sv-r)"/>
                      <circle cx="40" cy="58" r="26" fill="url(#sv-m)" stroke="#6b6b6b" stroke-width="1.5"/>
                      <text x="40" y="64" text-anchor="middle" fill="#0a0608" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="700">II</text>
                    </svg>
                  }
                  @case ('corps') {
                    <svg viewBox="0 0 80 90" aria-hidden="true">
                      <defs>
                        <linearGradient id="cp-g" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stop-color="#f59e0b"/>
                          <stop offset="100%" stop-color="#d23045"/>
                        </linearGradient>
                      </defs>
                      <path d="M40 6 L70 16 L70 44 C70 64 56 78 40 84 C24 78 10 64 10 44 L10 16 Z" fill="none" stroke="url(#cp-g)" stroke-width="2"/>
                      <path d="M40 22 L56 30 L56 46 C56 58 48 66 40 70 C32 66 24 58 24 46 L24 30 Z" fill="url(#cp-g)" opacity="0.25"/>
                      <path d="M30 44 L37 51 L51 37" fill="none" stroke="url(#cp-g)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  }
                }
              </div>

              <div class="course__body">
                <h3 class="course__title font-display">{{ c.title }}</h3>
                <p class="course__org font-mono">{{ c.org }}</p>
                @if (c.detail) { <p class="course__detail">{{ c.detail }}</p> }
              </div>
            </article>
          }
        </div>
      </section>

      <!-- CLOSING -->
      <section class="closing" uiReveal="up">
        <blockquote class="closing__q font-display">
          "Discipline is doing it cold,
          <span class="ital ui-gradient-text">tired, and right."</span>
        </blockquote>
        <div class="closing__sig font-mono">— habit, not nostalgia</div>
      </section>
    </div>
  `,
  styles: [
    `
      :host { display: block; }

      .wrap { max-width: 1200px; margin: 0 auto; padding: clamp(3.5rem, 8vw, 7rem) 1.25rem 6rem; }

      .title { margin-top: 1.5rem; font-size: clamp(3rem, 11vw, 8rem); font-weight: 700; line-height: 0.92; letter-spacing: -0.04em; text-wrap: balance; }
      .title__primary { display: block; color: var(--ui-color-text); }
      .title__accent { display: inline-block; padding: 0.05em 0.12em; margin: -0.05em -0.12em; font-style: italic; font-weight: 300;
        filter: drop-shadow(0 0 36px rgba(245, 158, 11, 0.35)) drop-shadow(0 0 80px rgba(210, 48, 69, 0.22)); }

      .hero__meta { margin-top: 1.25rem; display: inline-flex; align-items: center; gap: 0.6rem; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ui-color-text-muted); }
      .hero__meta .dot { width: 7px; height: 7px; border-radius: 9999px; background: var(--ui-color-primary); box-shadow: 0 0 12px color-mix(in srgb, var(--ui-color-primary) 70%, transparent); }
      .hero__meta .sep { opacity: 0.4; }
      .intro { margin-top: 1.5rem; max-width: 42rem; font-size: 1.05rem; color: var(--ui-color-text-muted); line-height: 1.6; }

      /* card row */
      .row { margin-top: 4rem; display: grid; gap: 1.25rem; }
      .row--three { grid-template-columns: 1fr; }
      @media (min-width: 900px) { .row--three { grid-template-columns: repeat(3, 1fr); } }

      .card { position: relative; padding: 1.75rem; border-radius: 1.5rem;
        border: 1px solid var(--ui-color-border); background: var(--ui-color-surface);
        backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
        transition: border-color 0.4s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
      .card:hover { border-color: color-mix(in srgb, var(--ui-color-primary) 45%, transparent); transform: translateY(-3px); }
      .card__label { font-size: 10px; letter-spacing: 0.34em; text-transform: uppercase; color: var(--ui-color-text-muted); }
      .card__h { margin-top: 1rem; font-size: 2.5rem; font-weight: 600; letter-spacing: -0.02em; color: var(--ui-color-text); line-height: 1; }
      .card__sub { margin-top: 0.5rem; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ui-color-text-muted);
        display: inline-flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }

      .chevron-wrap, .badge-wrap { margin-top: 1.25rem; display: grid; place-items: center; height: 180px; }
      .chevron { width: 80%; height: auto; max-width: 240px; }
      .badge { width: 90%; height: auto; max-width: 260px; }

      .qual-stars { display: inline-flex; gap: 4px; align-items: center; }
      .qual-dot { width: 7px; height: 7px; border-radius: 9999px; background: var(--ui-color-primary); box-shadow: 0 0 8px color-mix(in srgb, var(--ui-color-primary) 70%, transparent); }
      .qual-num { color: var(--ui-color-primary); }

      .bft-num { margin-top: 1.5rem; font-size: clamp(3rem, 6vw, 4.5rem); font-weight: 700; letter-spacing: -0.04em; color: var(--ui-color-text); line-height: 1; display: inline-flex; align-items: baseline; gap: 0.4rem; }
      .bft-max { font-size: 0.35em; color: var(--ui-color-text-muted); letter-spacing: 0.1em; }
      .bft-bar { position: relative; margin-top: 1.5rem; height: 6px; border-radius: 9999px; background: var(--ui-color-surface-raised); overflow: hidden; }
      .bft-bar__fill { height: 100%; background: linear-gradient(90deg, #d23045, #f59e0b, #fbbf24); border-radius: 9999px; width: 0;
        animation: bftFill 1.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both; box-shadow: 0 0 18px rgba(245, 158, 11, 0.45); }
      .bft-bar__ticks { position: absolute; inset: 0; display: flex; justify-content: space-between; align-items: center; padding: 0 4px; pointer-events: none; }
      .bft-bar__ticks span { width: 1px; height: 60%; background: color-mix(in srgb, var(--ui-color-text) 20%, transparent); }
      @keyframes bftFill { from { width: 0; } }

      /* pillars */
      .pillars { margin-top: 5rem; padding-top: 3rem; border-top: 1px solid var(--ui-color-border); }
      .pillars__label { font-size: 10.5px; letter-spacing: 0.4em; text-transform: uppercase; color: var(--ui-color-text-muted); }
      .pillars__grid { margin-top: 1.75rem; display: grid; grid-template-columns: 1fr; gap: 1rem; }
      @media (min-width: 700px) { .pillars__grid { grid-template-columns: repeat(2, 1fr); gap: 1.25rem; } }
      @media (min-width: 1100px) { .pillars__grid { grid-template-columns: repeat(4, 1fr); } }
      .pillar { padding: 1.5rem; border: 1px solid var(--ui-color-border); border-radius: 1.25rem; background: var(--ui-color-surface); transition: border-color 0.4s ease, background 0.4s ease; }
      .pillar:hover { border-color: color-mix(in srgb, var(--ui-color-primary) 45%, transparent); background: color-mix(in srgb, var(--ui-color-primary) 5%, transparent); }
      .pillar__word { font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 700; letter-spacing: -0.02em; line-height: 1; }
      .pillar__meaning { margin-top: 0.75rem; color: var(--ui-color-text-muted); font-size: 0.9rem; line-height: 1.5; }

      /* courses */
      .courses { margin-top: 5rem; }
      .courses__head { margin-bottom: 2rem; }
      .courses__h { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 600; letter-spacing: -0.03em; line-height: 1.05; color: var(--ui-color-text); }
      .courses__h .ital { font-style: italic; font-weight: 300; }
      .courses__sub { margin-top: 0.5rem; font-size: 10.5px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--ui-color-text-muted); }
      .course-grid { display: grid; gap: 1rem; grid-template-columns: 1fr; }
      @media (min-width: 760px) { .course-grid { grid-template-columns: repeat(2, 1fr); } }
      .course { display: grid; grid-template-columns: 100px 1fr; gap: 1.25rem; padding: 1.5rem; border-radius: 1.25rem;
        border: 1px solid var(--ui-color-border); background: var(--ui-color-surface); align-items: center;
        transition: border-color 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      .course:hover { border-color: color-mix(in srgb, var(--ui-color-primary) 45%, transparent); transform: translateX(3px); }
      .course__glyph { width: 100px; height: 100px; display: grid; place-items: center; background: var(--ui-color-surface-raised); border: 1px solid var(--ui-color-border); border-radius: 1rem; }
      .course__glyph svg { width: 80%; height: auto; }
      .course__title { font-size: 1.2rem; font-weight: 600; color: var(--ui-color-text); letter-spacing: -0.01em; }
      .course__org { margin-top: 0.25rem; font-size: 10.5px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--ui-color-text-muted); }
      .course__detail { margin-top: 0.6rem; font-size: 0.9rem; color: var(--ui-color-text-muted); }

      /* closing */
      .closing { margin-top: 6rem; padding-top: 4rem; border-top: 1px solid var(--ui-color-border); }
      .closing__q { font-size: clamp(1.75rem, 4.5vw, 3rem); line-height: 1.2; font-weight: 500; color: var(--ui-color-text); max-width: 56rem; text-wrap: balance; }
      .closing__q .ital { font-style: italic; font-weight: 300; }
      .closing__sig { margin-top: 1.25rem; font-size: 10.5px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--ui-color-text-muted); }
    `,
  ],
})
export class MilitaryPage {
  data = militaryData;
  awards = Array.from({ length: militaryData.qualificationAwards }, (_, i) => i);
  ticks = Array.from({ length: 11 }, (_, i) => i);
}
