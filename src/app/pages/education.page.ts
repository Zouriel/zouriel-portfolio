import { Component } from '@angular/core';
import { UiCard } from 'ui/card';
import { UiChip, UiBadge } from 'ui/badge';
import { UiSectionLabel, UiReveal } from 'ui/fx';
import { UiDivider } from 'ui/divider';

import { educationPageData } from '../data/education.data';

@Component({
  selector: 'app-education',
  standalone: true,
  host: { class: 'route-enter' },
  imports: [UiCard, UiChip, UiBadge, UiSectionLabel, UiReveal, UiDivider],
  template: `
    <div class="wrap">
      <!-- ============ HEADER ============ -->
      <section class="head" uiReveal="up">
        <ui-section-label index="04" label="Academic" />

        <h1 class="head__title font-display">
          {{ data.headline }}, earned
          <span class="accent ui-gradient-text">first class.</span>
        </h1>

        <p class="head__intro text-pretty" uiReveal="blur" [revealDelay]="120">
          {{ data.summary }}
        </p>
      </section>

      <!-- ============ EDUCATION TIMELINE ============ -->
      <section class="edu">
        <ui-divider label="Education" />

        <ol class="timeline">
          @for (item of data.education; track item.degree; let i = $index) {
            <li class="node" uiReveal="up" [revealDelay]="i * 70">
              <span class="dot" aria-hidden="true"></span>
              <div class="node__body">
                <p class="node__period font-mono">{{ item.period }}</p>
                <h2 class="node__degree font-display">{{ item.degree }}</h2>
                <p class="node__inst">
                  {{ item.institution }}
                  @if (item.location) {
                    <span class="node__loc"> · {{ item.location }}</span>
                  }
                </p>

                @if (item.result) {
                  <div class="node__result">
                    <ui-badge tone="success">Result: {{ item.result }}</ui-badge>
                  </div>
                }

                @if (item.highlights?.length) {
                  <ul class="node__hl">
                    @for (h of item.highlights; track h) {
                      <li>{{ h }}</li>
                    }
                  </ul>
                }

                @if (item.coursework?.length) {
                  <div class="node__course">
                    <span class="course__label font-mono">// selected coursework</span>
                    <div class="chips">
                      @for (c of item.coursework; track c) {
                        <ui-chip>{{ c }}</ui-chip>
                      }
                    </div>
                  </div>
                }
              </div>
            </li>
          }
        </ol>
      </section>

      <!-- ============ CERTIFICATIONS ============ -->
      <section class="certs" uiReveal="up">
        <ui-divider label="Certifications & training" />

        <div class="cert-grid">
          @for (c of certs; track c.title; let i = $index) {
            <ui-card
              padding="sm"
              class="cert"
              uiReveal="up"
              [revealDelay]="i * 55"
            >
              <p class="cert__title font-display">{{ c.title }}</p>
              @if (c.issuer !== '—') {
                <p class="cert__issuer font-mono">{{ c.issuer }}</p>
              }
              @if (c.when) {
                <p class="cert__when font-mono">{{ c.when }}</p>
              }
              @if (c.notes?.length) {
                <ul class="cert__notes">
                  @for (n of c.notes; track n) {
                    <li>{{ n }}</li>
                  }
                </ul>
              }
            </ui-card>
          }
        </div>
      </section>
    </div>
  `,
  styles: `
    :host { display: block; }
    .wrap { max-width: 68rem; margin: 0 auto; padding: clamp(3.5rem, 8vw, 7rem) 1.25rem 6rem; display: flex; flex-direction: column; gap: clamp(3.5rem, 9vw, 7rem); }

    /* header */
    .head { display: flex; flex-direction: column; gap: 1.35rem; }
    .head__title { margin: 0.5rem 0 0; font-size: clamp(2.6rem, 9vw, 6rem); line-height: 0.95; letter-spacing: -0.03em; max-width: 15ch; }
    .head__title .accent { font-style: italic; }
    .head__intro { max-width: 52ch; font-size: clamp(1.05rem, 2.5vw, 1.3rem); line-height: 1.6; color: var(--ui-color-text); }

    /* timeline */
    .edu { display: flex; flex-direction: column; gap: 2rem; }
    .timeline { list-style: none; margin: 0; padding: 0; position: relative; display: flex; flex-direction: column; gap: 2.75rem; }
    .timeline::before { content: ''; position: absolute; left: 6px; top: 6px; bottom: 6px; width: 2px;
      background: linear-gradient(to bottom, var(--ui-color-primary), color-mix(in srgb, var(--ui-color-primary) 12%, transparent)); }

    .node { position: relative; padding-left: 2.25rem; }
    .dot { position: absolute; left: 0; top: 6px; width: 14px; height: 14px; border-radius: 999px;
      background: var(--ui-color-primary);
      border: 2px solid var(--ui-color-surface-raised);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-color-primary) 22%, transparent), 0 0 14px 2px var(--ui-color-primary); }

    .node__body { display: flex; flex-direction: column; gap: 0.6rem; }
    .node__period { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ui-color-primary); }
    .node__degree { margin: 0; font-size: clamp(1.3rem, 3.5vw, 1.9rem); line-height: 1.1; letter-spacing: -0.015em; }
    .node__inst { margin: 0; color: var(--ui-color-text-muted); font-size: 1rem; line-height: 1.5; }
    .node__loc { color: var(--ui-color-text-muted); }
    .node__result { display: flex; }

    .node__hl { margin: 0.35rem 0 0; padding: 0; list-style: none; display: grid; gap: 0.45rem; max-width: 56ch; }
    .node__hl li { position: relative; padding-left: 1.1rem; color: var(--ui-color-text-muted); line-height: 1.55; }
    .node__hl li::before { content: '›'; position: absolute; left: 0; color: var(--ui-color-primary); }

    .node__course { display: flex; flex-direction: column; gap: 0.6rem; margin-top: 0.35rem; }
    .course__label { font-size: 11px; letter-spacing: 0.12em; color: var(--ui-color-text-muted); }
    .chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }

    /* certifications */
    .certs { display: flex; flex-direction: column; gap: 2rem; }
    .cert-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
    @media (min-width: 560px) { .cert-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 860px) { .cert-grid { grid-template-columns: repeat(3, 1fr); } }

    .cert { display: block; height: 100%; }
    .cert__title { margin: 0; font-size: 1.05rem; line-height: 1.25; letter-spacing: -0.01em; color: var(--ui-color-text); }
    .cert__issuer { margin: 0.5rem 0 0; font-size: 12px; letter-spacing: 0.04em; color: var(--ui-color-text-muted); }
    .cert__when { margin: 0.3rem 0 0; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ui-color-primary); }
    .cert__notes { margin: 0.6rem 0 0; padding: 0; list-style: none; display: grid; gap: 0.3rem; }
    .cert__notes li { position: relative; padding-left: 0.95rem; font-size: 0.9rem; line-height: 1.45; color: var(--ui-color-text-muted); }
    .cert__notes li::before { content: '·'; position: absolute; left: 0.2rem; color: var(--ui-color-primary); }
  `,
})
export class EducationPage {
  protected readonly data = educationPageData;

  // Stale placeholder entries whose dates pre-date this person's career.
  private readonly excludedTitles = new Set<string>([
    'Basic Seamanship Training',
    'Diesel Engine Repair & Maintenance',
    'Airport Emergency Exercise',
  ]);

  protected readonly certs = educationPageData.certifications
    .filter((c) => !this.excludedTitles.has(c.title))
    .map((c) => ({ ...c, when: this.displayDate(c.date) }));

  /** Returns a clean, showable date or null for placeholders/unknowns. */
  private displayDate(date: string): string | null {
    const d = (date ?? '').trim();
    if (!d || d === '—') return null;
    // Drop hand-written placeholders like "Jun 20–21 (year per your record)".
    if (d.includes('(') || /per your record/i.test(d)) return null;
    return d;
  }
}
