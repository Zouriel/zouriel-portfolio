import { Component } from '@angular/core';
import { UiCard } from 'ui/card';
import { UiChip, UiBadge } from 'ui/badge';
import { UiProgressBar } from 'ui/progress';
import { UiGrid } from 'ui/layout';
import { UiDivider } from 'ui/divider';
import { UiSectionLabel, UiReveal, UiMagnetic, UiSplitText } from 'ui/fx';

import { devPageData, Proficiency } from '../data/development.data';

type Tone = 'primary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-development',
  standalone: true,
  host: { class: 'route-enter' },
  imports: [
    UiCard,
    UiChip,
    UiBadge,
    UiProgressBar,
    UiGrid,
    UiDivider,
    UiSectionLabel,
    UiReveal,
    UiMagnetic,
    UiSplitText,
  ],
  template: `
    <div class="wrap">
      <!-- ============ HEADER ============ -->
      <header class="head">
        <ui-section-label index="02" label="Stack" />

        <h1 class="title font-display glow-amber" uiReveal="up" [revealDelay]="60">
          <span uiSplitText>{{ data.headline }}</span>
          <span class="accent ui-gradient-text">{{ data.subhead }}</span>
        </h1>

        <p class="intro text-pretty" uiReveal="blur" [revealDelay]="160">
          {{ data.summary }}
        </p>
      </header>

      <!-- ============ SKILL GROUPS ============ -->
      <section class="groups">
        <ui-grid min="19rem" [gap]="4">
          @for (group of data.skillGroups; track group.title; let gi = $index) {
            <ui-card padding="lg" uiReveal="up" [revealDelay]="gi * 80">
              <div card-header class="ch font-mono">
                <span class="ch__num">{{ (gi + 1).toString().padStart(2, '0') }}</span>
                <span class="ch__title">{{ group.title }}</span>
              </div>

              <ul class="skills">
                @for (s of group.items; track s.name) {
                  <li class="skill">
                    <div class="skill__top">
                      <span class="skill__name">{{ s.name }}</span>
                      @if (s.note) {
                        <span class="skill__note">{{ s.note }}</span>
                      }
                      <ui-badge [tone]="levelTone(s.level)">
                        {{ s.level }}@if (s.years) { · {{ s.years }}y }
                      </ui-badge>
                    </div>
                    <ui-progress-bar
                      [value]="levelPercent(s.level)"
                      [tone]="levelTone(s.level)"
                      [label]="s.name + ' proficiency'"
                    />
                  </li>
                }
              </ul>
            </ui-card>
          }
        </ui-grid>
      </section>

      <!-- ============ TOOLING ============ -->
      <section class="tools" uiReveal="up">
        <ui-divider />
        <p class="tools__label font-mono">// tooling</p>
        <div class="tools__cloud">
          @for (t of data.tools; track t; let ti = $index) {
            <span uiReveal="up" [revealDelay]="ti * 50">
              <ui-chip uiMagnetic>{{ t }}</ui-chip>
            </span>
          }
        </div>
      </section>
    </div>
  `,
  styles: `
    :host { display: block; }
    .wrap {
      max-width: 72rem;
      margin: 0 auto;
      padding: clamp(3.5rem, 8vw, 7rem) 1.25rem 6rem;
      display: flex;
      flex-direction: column;
      gap: clamp(3rem, 8vw, 6rem);
    }

    /* header */
    .head { display: flex; flex-direction: column; gap: 1.5rem; }
    .title {
      margin: 0.5rem 0 0;
      font-size: clamp(2.8rem, 10vw, 7rem);
      line-height: 0.94;
      letter-spacing: -0.04em;
      display: flex;
      flex-direction: column;
      color: var(--ui-color-text);
    }
    .title .accent {
      font-style: italic;
      font-size: clamp(1.2rem, 3.5vw, 2.4rem);
      line-height: 1.05;
      margin-top: 0.75rem;
      max-width: 22ch;
    }
    .intro {
      max-width: 52ch;
      font-size: clamp(1.02rem, 2.4vw, 1.2rem);
      line-height: 1.65;
      color: var(--ui-color-text-muted);
    }

    /* skill cards */
    .ch { display: flex; align-items: baseline; gap: 0.6rem;
      font-size: 11px; letter-spacing: 0.28em; text-transform: uppercase; }
    .ch__num { color: var(--ui-color-primary); }
    .ch__title { color: var(--ui-color-text); }

    .skills { list-style: none; margin: 0; padding: 0;
      display: flex; flex-direction: column; gap: 1.1rem; }
    .skill { display: flex; flex-direction: column; gap: 0.55rem; }
    .skill__top { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
    .skill__name { flex: 1 1 auto; font-size: 0.95rem; color: var(--ui-color-text); }
    .skill__note { font-size: 11px; color: var(--ui-color-text-muted); }

    /* tooling */
    .tools { display: flex; flex-direction: column; gap: 1.25rem; }
    .tools__label {
      font-size: 10.5px; letter-spacing: 0.4em; text-transform: uppercase;
      color: var(--ui-color-text-muted); margin: 0;
    }
    .tools__cloud { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .tools__cloud > span { display: inline-flex; }
  `,
})
export class DevelopmentPage {
  protected readonly data = devPageData;

  /** Map a proficiency level to a bar fill percentage. */
  protected levelPercent(level: Proficiency): number {
    switch (level) {
      case 'Expert': return 96;
      case 'Advanced': return 82;
      case 'Working': return 64;
      case 'Learning': return 40;
    }
  }

  /** Map a proficiency level to a semantic UI tone. */
  protected levelTone(level: Proficiency): Tone {
    switch (level) {
      case 'Expert': return 'success';
      case 'Advanced': return 'primary';
      case 'Working': return 'warning';
      case 'Learning': return 'danger';
    }
  }
}
