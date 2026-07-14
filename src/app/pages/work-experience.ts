import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { UiTabs, UiTab } from 'ui/tabs';
import { UiCard } from 'ui/card';
import { UiChip, UiBadge } from 'ui/badge';
import { UiSectionLabel, UiReveal } from 'ui/fx';

import {
  ExperienceItem,
  workExperienceData,
} from '../data/work-experience.data';

@Component({
  selector: 'app-work-experience',
  standalone: true,
  host: { class: 'route-enter' },
  imports: [
    NgTemplateOutlet,
    UiTabs,
    UiTab,
    UiCard,
    UiChip,
    UiBadge,
    UiSectionLabel,
    UiReveal,
  ],
  template: `
    <div class="wrap">
      <!-- ============ HEADER ============ -->
      <header class="head">
        <ui-section-label index="03" label="Experience" />

        <h1 class="title font-display" uiReveal="up" [revealDelay]="80">
          Field <span class="accent ui-gradient-text">notes.</span>
        </h1>

        <p class="intro text-pretty" uiReveal="blur" [revealDelay]="160">
          A trail through engineering, service, and teaching — each posting
          sharpening the next.
        </p>
      </header>

      <!-- ============ TABS ============ -->
      <ui-tabs [(selectedIndex)]="tab">
        <ui-tab label="Industry">
          <ng-container
            [ngTemplateOutlet]="timeline"
            [ngTemplateOutletContext]="{ items: workItems }"
          />
        </ui-tab>
        <ui-tab label="Lecture">
          <ng-container
            [ngTemplateOutlet]="timeline"
            [ngTemplateOutletContext]="{ items: academicItems }"
          />
        </ui-tab>
      </ui-tabs>
    </div>

    <!-- ============ TIMELINE (shared) ============ -->
    <ng-template #timeline let-items="items">
      <ol class="tl" role="list">
        @for (e of items; track e.org; let i = $index) {
          <li class="node" uiReveal="up" [revealDelay]="i * 90">
            <span class="node__dot" aria-hidden="true"></span>

            <ui-card class="node__card" padding="lg" [glass]="true">
              <div card-header class="node__head">
                <div class="node__ident">
                  <h3 class="node__role font-display">{{ e.role }}</h3>
                  <p class="node__org">
                    {{ e.org }}
                    @if (e.location) {
                      <span class="node__loc">· {{ e.location }}</span>
                    }
                  </p>
                </div>
                <ui-badge
                  class="node__period"
                  [tone]="isCurrent(e) ? 'primary' : 'neutral'"
                >
                  {{ e.period }}
                </ui-badge>
              </div>

              @if (e.summary) {
                <p class="node__summary">{{ e.summary }}</p>
              }

              <ul class="node__list">
                @for (h of e.highlights; track h) {
                  <li>{{ h }}</li>
                }
              </ul>

              @if (e.stack?.length) {
                <div card-footer class="node__stack">
                  @for (s of e.stack; track s) {
                    <ui-chip>{{ s }}</ui-chip>
                  }
                </div>
              }
            </ui-card>
          </li>
        }
      </ol>
    </ng-template>
  `,
  styles: `
    :host { display: block; }
    .wrap { max-width: 68rem; margin: 0 auto; padding: clamp(3.5rem, 8vw, 7rem) 1.25rem 6rem; display: flex; flex-direction: column; gap: clamp(2.5rem, 6vw, 4rem); }

    /* header */
    .head { display: flex; flex-direction: column; gap: 1.25rem; }
    .title { margin: 0.5rem 0 0; font-size: clamp(3rem, 12vw, 8.5rem); line-height: 0.92; letter-spacing: -0.04em; color: var(--ui-color-text); }
    .title .accent { font-style: italic; }
    .intro { max-width: 40ch; font-size: clamp(1.05rem, 2.4vw, 1.3rem); line-height: 1.6; color: var(--ui-color-text-muted); }

    /* timeline */
    .tl { position: relative; list-style: none; margin: 2rem 0 0; padding: 0 0 0 2rem; }
    .tl::before {
      content: ''; position: absolute; left: 0.5rem; top: 0.4rem; bottom: 0.4rem; width: 1px;
      background: linear-gradient(180deg,
        transparent 0%,
        color-mix(in srgb, var(--ui-color-primary) 55%, transparent) 8%,
        color-mix(in srgb, var(--ui-color-primary) 55%, transparent) 92%,
        transparent 100%);
      box-shadow: 0 0 14px color-mix(in srgb, var(--ui-color-primary) 40%, transparent);
    }

    .node { position: relative; margin-bottom: 1.75rem; }
    .node:last-child { margin-bottom: 0; }
    .node__dot {
      position: absolute; left: -1.63rem; top: 1.9rem;
      width: 12px; height: 12px; border-radius: 999px;
      background: var(--ui-color-primary);
      box-shadow:
        0 0 0 5px color-mix(in srgb, var(--ui-color-primary) 15%, transparent),
        0 0 18px color-mix(in srgb, var(--ui-color-primary) 65%, transparent);
    }

    .node__card { display: block; transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
    .node__card:hover { transform: translateX(2px); }

    .node__head { display: flex; flex-wrap: wrap; gap: 0.6rem 1rem; justify-content: space-between; align-items: baseline; }
    .node__ident { min-width: 0; }
    .node__role { margin: 0; font-size: clamp(1.2rem, 3vw, 1.45rem); font-weight: 600; letter-spacing: -0.02em; color: var(--ui-color-text); }
    .node__org { margin: 0.2rem 0 0; font-size: 0.9rem; color: var(--ui-color-text); }
    .node__loc { color: var(--ui-color-text-muted); }
    .node__period { flex: none; }
    .node__period ::ng-deep .ui-badge { letter-spacing: 0.08em; text-transform: uppercase; font-family: var(--ui-font-mono, monospace); }

    .node__summary { margin: 1rem 0 0; font-size: 0.95rem; line-height: 1.55; font-style: italic; color: var(--ui-color-text-muted); }

    .node__list { margin: 1rem 0 0; padding-left: 1.1rem; list-style: disc; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.95rem; line-height: 1.55; color: var(--ui-color-text); }
    .node__list li::marker { color: var(--ui-color-primary); }

    .node__stack { display: flex; flex-wrap: wrap; gap: 0.4rem; }
  `,
})
export class WorkExperiencePage {
  /** ui-tabs owns tab state; this model just mirrors the active index. */
  protected tab = 0;

  protected readonly workItems: ExperienceItem[] = workExperienceData.filter(
    (i) => i.type === 'work',
  );
  protected readonly academicItems: ExperienceItem[] = workExperienceData.filter(
    (i) => i.type === 'lecturer',
  );

  protected isCurrent(e: ExperienceItem): boolean {
    return /present/i.test(e.period);
  }
}
