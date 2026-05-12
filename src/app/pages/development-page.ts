import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { devPageData, DevPageData, SkillItem } from '../data/development.data';
import { RevealDirective } from '../directives/reveal.directive';
import { SectionLabelComponent } from '../components/section-label.component';

@Component({
  selector: 'app-development',
  standalone: true,
  imports: [CommonModule, RevealDirective, SectionLabelComponent],
  template: `
    <section class="page">
      <div class="wrap">
        <app-section-label index="02" label="stack" />

        <h1 class="title font-display" reveal="up" [revealDelay]="80">
          <span class="title__primary">{{ data.headline }}</span>
          <span class="title__accent">{{ data.subhead }}</span>
        </h1>

        <p class="intro text-pretty" reveal="up" [revealDelay]="180">
          {{ data.summary }}
        </p>

        <section class="grid">
          @for (group of data.skillGroups; track group.title; let gi = $index) {
          <div class="block" reveal="up" [revealDelay]="gi * 80">
            <h3 class="block__h font-mono">
              <span class="block__num">{{ '0' + (gi + 1) }}</span>
              {{ group.title }}
            </h3>
            <ul class="block__list">
              @for (s of group.items; track s.name; let si = $index) {
              <li class="skill" reveal="up" [revealDelay]="gi * 80 + si * 40">
                <div class="skill__row">
                  <span class="skill__name">{{ s.name }}</span>
                  @if (s.note) {
                  <span class="skill__note">{{ s.note }}</span>
                  }
                  <span class="skill__chip" [ngClass]="levelChipClass(s)">
                    {{ badge(s) }}
                  </span>
                </div>
                <div class="bar">
                  <div
                    class="bar__fill"
                    [ngClass]="levelBarClass(s)"
                    [style.width.%]="levelPercent(s)"
                  ></div>
                </div>
              </li>
              }
            </ul>
          </div>
          }
        </section>

        <section class="tools" reveal="up">
          <h3 class="tools__h font-mono">// tooling</h3>
          <div class="tools__cloud">
            @for (t of data.tools; track t; let ti = $index) {
            <span
              class="tool"
              reveal="up"
              [revealDelay]="ti * 50"
              data-magnetic
            >
              {{ t }}
            </span>
            }
          </div>
        </section>
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
      .wrap { max-width: 1400px; margin: 0 auto; }

      .title {
        margin-top: 1.5rem;
        font-size: clamp(3rem, 10vw, 8rem);
        font-weight: 700;
        line-height: 0.92;
        letter-spacing: -0.04em;
        text-wrap: balance;
      }
      .title__primary { display: block; color: #fff; }
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
        font-size: 0.7em;
      }
      .intro {
        margin-top: 1.5rem;
        max-width: 40rem;
        font-size: 1.05rem;
        color: rgba(255, 255, 255, 0.6);
        line-height: 1.55;
      }

      .grid {
        margin-top: 4rem;
        display: grid;
        gap: 1.25rem;
      }
      @media (min-width: 700px) {
        .grid { grid-template-columns: repeat(2, 1fr); }
      }
      @media (min-width: 1100px) {
        .grid { grid-template-columns: repeat(3, 1fr); }
      }
      .block {
        padding: 1.5rem;
        border-radius: 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.025);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
      }
      .block__h {
        display: flex;
        align-items: baseline;
        gap: 0.6rem;
        font-size: 11px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.85);
      }
      .block__num { color: #f59e0b; }
      .block__list {
        margin-top: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
      }
      .skill__row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .skill__name {
        flex: 1;
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
      }
      .skill__note {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.4);
      }
      .skill__chip {
        font-size: 10.5px;
        padding: 0.2rem 0.55rem;
        border-radius: 9999px;
        border: 1px solid;
        font-family: "JetBrains Mono", monospace;
        white-space: nowrap;
        letter-spacing: 0.02em;
      }
      .bar {
        margin-top: 0.4rem;
        height: 2px;
        background: rgba(255, 255, 255, 0.06);
        border-radius: 9999px;
        overflow: hidden;
      }
      .bar__fill {
        height: 100%;
        border-radius: 9999px;
        width: 0;
        animation: growBar 1.4s cubic-bezier(.2,.9,.2,1) both;
      }
      @keyframes growBar { from { width: 0; } }

      /* level classes */
      .lc-expert {
        background: rgba(16, 185, 129, 0.12);
        color: #6ee7b7;
        border-color: rgba(16, 185, 129, 0.3);
      }
      .lc-advanced {
        background: rgba(14, 165, 233, 0.12);
        color: #93c5fd;
        border-color: rgba(14, 165, 233, 0.3);
      }
      .lc-working {
        background: rgba(245, 158, 11, 0.12);
        color: #fcd34d;
        border-color: rgba(245, 158, 11, 0.3);
      }
      .lc-learning {
        background: rgba(244, 63, 94, 0.12);
        color: #fda4af;
        border-color: rgba(244, 63, 94, 0.3);
      }

      .lb-expert { background: linear-gradient(90deg, #34d399, #14b8a6); }
      .lb-advanced { background: linear-gradient(90deg, #60a5fa, #818cf8); }
      .lb-working { background: linear-gradient(90deg, #fbbf24, #fb923c); }
      .lb-learning { background: linear-gradient(90deg, #fb7185, #f472b6); }

      .tools { margin-top: 4rem; }
      .tools__h {
        font-size: 10.5px;
        letter-spacing: 0.4em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.4);
      }
      .tools__cloud {
        margin-top: 1.5rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .tool {
        padding: 0.55rem 1rem;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.03);
        color: rgba(255, 255, 255, 0.85);
        font-family: "JetBrains Mono", monospace;
        font-size: 12px;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .tool:hover {
        background: rgba(245, 158, 11, 0.1);
        border-color: rgba(245, 158, 11, 0.4);
        color: #fbbf24;
        transform: translateY(-2px);
      }
    `,
  ],
  host: { class: 'route-enter block' },
})
export class DevelopmentPage {
  @HostBinding('class.block') hostBlock = true;
  data: DevPageData = devPageData;

  badge(s: SkillItem): string {
    const yrs = s.years ? ` · ${s.years}y` : '';
    return `${s.level}${yrs}`;
  }

  levelPercent(s: SkillItem): number {
    switch (s.level) {
      case 'Expert': return 96;
      case 'Advanced': return 82;
      case 'Working': return 64;
      case 'Learning': return 40;
      default: return 60;
    }
  }

  levelChipClass(s: SkillItem) {
    switch (s.level) {
      case 'Expert': return 'lc-expert';
      case 'Advanced': return 'lc-advanced';
      case 'Working': return 'lc-working';
      case 'Learning': return 'lc-learning';
      default: return '';
    }
  }

  levelBarClass(s: SkillItem) {
    switch (s.level) {
      case 'Expert': return 'lb-expert';
      case 'Advanced': return 'lb-advanced';
      case 'Working': return 'lb-working';
      case 'Learning': return 'lb-learning';
      default: return '';
    }
  }
}
