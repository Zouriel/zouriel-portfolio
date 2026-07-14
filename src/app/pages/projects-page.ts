import { Component, computed, signal } from '@angular/core';
import { UiCard } from 'ui/card';
import { UiChip, UiBadge } from 'ui/badge';
import { UiButton } from 'ui/button';
import { UiGrid } from 'ui/layout';
import { UiSectionLabel, UiReveal, UiMarquee } from 'ui/fx';

import { Project, ProjectFilter, projectFilters, projects } from '../data/projects.data';

const ACCENTS = ['#f59e0b', '#a78bfa', '#22d3ee', '#fb7185', '#34d399', '#60a5fa', '#f97316', '#facc15'];

@Component({
  selector: 'app-projects-page',
  standalone: true,
  host: { class: 'route-enter' },
  imports: [UiCard, UiChip, UiBadge, UiButton, UiGrid, UiSectionLabel, UiReveal, UiMarquee],
  template: `
    <div class="wrap">
      <!-- ============ HEADER ============ -->
      <header class="head">
        <ui-section-label index="01" label="Works" />

        <h1 class="title font-display glow-amber" uiReveal="up" [revealDelay]="80">
          Selected <span class="accent ui-gradient-text">works.</span>
        </h1>

        <p class="intro text-pretty" uiReveal="blur" [revealDelay]="160">
          Government platforms, SaaS products, developer tools and back-end services —
          shipped end-to-end across Next.js, Laravel, .NET, Angular and Go. {{ projects.length }}
          projects, mostly as sole developer or core team.
        </p>

        <!-- filters -->
        <div class="filters" uiReveal="up" [revealDelay]="240">
          @for (f of filters; track f.key) {
            <ui-button
              size="sm"
              [variant]="activeFilter() === f.key ? 'primary' : 'ghost'"
              (click)="activeFilter.set(f.key)"
            >
              {{ f.label }}
            </ui-button>
          }
        </div>
      </header>

      <!-- ============ GRID ============ -->
      <div>
        <ui-grid [min]="'340px'" [gap]="4">
          @for (p of filtered(); track p.name; let i = $index) {
            <ui-card
              padding="lg"
              class="card"
              uiReveal="up"
              [revealDelay]="(i % 6) * 70"
              [class.card--featured]="p.featured"
              [style.--accent]="accentFor(i)"
            >
              <!-- header: type · dot · year · status/live -->
              <div card-header class="chead font-mono">
                <span class="chead__type">
                  <span class="dot" aria-hidden="true"></span>{{ p.projectType }}
                </span>
                <span class="chead__right">
                  @if (p.live) { <ui-badge tone="success">LIVE</ui-badge> }
                  <ui-badge [tone]="p.status === 'active' ? 'primary' : 'neutral'">
                    {{ p.status === 'active' ? 'Active' : 'Completed' }}
                  </ui-badge>
                </span>
              </div>

              <!-- body -->
              <h2 class="name font-display" [class.name--big]="p.featured">{{ p.name }}</h2>
              <p class="meta font-mono">
                {{ p.organization }} · {{ p.role }}<span class="sep"> · </span>{{ p.yearRange }}
              </p>
              <p class="desc text-pretty">{{ p.description }}</p>

              <div class="stack">
                @for (s of visibleStack(p); track s) {
                  <ui-chip><span class="chiptxt" [title]="s">{{ s }}</span></ui-chip>
                }
                @if (p.stackFlat.length > stackCap) {
                  <ui-chip tone="primary">+{{ p.stackFlat.length - stackCap }}</ui-chip>
                }
              </div>

              <!-- footer -->
              <div card-footer class="cfoot">
                @if (p.live) {
                  <a class="link-line" [href]="p.live" target="_blank" rel="noopener noreferrer">
                    <ui-button variant="ghost" size="sm">Visit live site ↗</ui-button>
                  </a>
                } @else if (publicRepo(p); as repo) {
                  <a class="link-line" [href]="repo" target="_blank" rel="noopener noreferrer">
                    <ui-button variant="ghost" size="sm">View source ↗</ui-button>
                  </a>
                } @else {
                  <span class="cfoot__note font-mono">
                    {{ p.repositories.length }} repositories · {{ p.teamSize > 1 ? 'team of ' + p.teamSize : 'private' }}
                  </span>
                }
              </div>
            </ui-card>
          }
        </ui-grid>
      </div>

      <!-- ============ MARQUEE ============ -->
      <section class="ribbon">
        <div class="ribbon__label font-mono">Stacks crossed</div>
        <ui-marquee [items]="topStack" [duration]="44" />
      </section>
    </div>
  `,
  styles: `
    :host { display: block; }
    .wrap {
      max-width: 68rem; margin: 0 auto;
      padding: clamp(3.5rem, 8vw, 7rem) 1.25rem 6rem;
      display: flex; flex-direction: column; gap: clamp(3.5rem, 8vw, 6rem);
    }

    /* header */
    .head { display: flex; flex-direction: column; gap: 1.5rem; }
    .title { margin: 0.5rem 0 0; font-size: clamp(3rem, 12vw, 8rem); line-height: 0.92; letter-spacing: -0.04em; }
    .title .accent { font-style: italic; }
    .intro { max-width: 48ch; font-size: clamp(1.05rem, 2.5vw, 1.3rem); line-height: 1.6; color: var(--ui-color-text-muted); }
    .filters { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem; }

    /* card */
    .card { position: relative; transition: border-color 0.4s ease, transform 0.4s ease; }
    .card:hover { transform: translateY(-3px); }

    .chead {
      display: flex; align-items: center; justify-content: space-between;
      gap: 0.75rem; width: 100%;
      font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
      color: var(--ui-color-text-muted);
    }
    .chead__type { display: inline-flex; align-items: center; gap: 0.55rem; min-width: 0; }
    .chead__type { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .chead__right { display: inline-flex; align-items: center; gap: 0.45rem; flex: 0 0 auto; }
    .dot {
      flex: 0 0 auto; width: 8px; height: 8px; border-radius: 999px;
      background: var(--accent, var(--ui-color-primary));
      box-shadow: 0 0 10px var(--accent, var(--ui-color-primary));
    }

    .name { margin: 0.35rem 0 0; font-size: clamp(1.5rem, 4vw, 1.9rem); line-height: 1.05; letter-spacing: -0.02em; color: var(--ui-color-text); }
    .name--big { font-size: clamp(1.9rem, 5vw, 2.5rem); }
    .meta { margin: 0.5rem 0 0; font-size: 12px; letter-spacing: 0.02em; color: var(--ui-color-text-muted); }
    .meta .sep { opacity: 0.4; }
    .desc { margin: 1rem 0 0; font-size: 0.95rem; line-height: 1.6; color: var(--ui-color-text); }

    .stack { margin-top: 1.25rem; display: flex; flex-wrap: wrap; gap: 0.4rem; }
    /* keep each stack pill to a single line; truncate the long ones */
    .chiptxt { display: block; max-width: 13rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

    .cfoot { display: flex; align-items: center; width: 100%; }
    .cfoot a { text-decoration: none; }
    .cfoot__note { font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ui-color-text-muted); }

    /* featured emphasis */
    .card--featured { border-color: color-mix(in srgb, var(--accent) 45%, var(--ui-color-border)) !important; }
    @media (min-width: 820px) { .card--featured { grid-column: span 2; } }

    /* marquee */
    .ribbon { border-block: 1px solid var(--ui-color-border); padding-block: 1.75rem; }
    .ribbon__label { font-size: 10.5px; letter-spacing: 0.4em; text-transform: uppercase; color: var(--ui-color-text-muted); margin-bottom: 1.25rem; }

    @media (prefers-reduced-motion: reduce) { .card { transition: none; } }
  `,
})
export class ProjectsPage {
  protected readonly projects = projects;
  protected readonly filters = projectFilters;
  protected readonly stackCap = 10;
  protected readonly activeFilter = signal<ProjectFilter>('all');

  protected readonly filtered = computed(() => {
    const f = this.activeFilter();
    if (f === 'all') return projects;
    if (f === 'live') return projects.filter((p) => !!p.live);
    return projects.filter((p) => p.status === f);
  });

  /** Most common stack technologies across all projects, for the marquee. */
  protected readonly topStack = (() => {
    const counts = new Map<string, number>();
    for (const p of projects) for (const s of p.stackFlat) counts.set(s, (counts.get(s) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14).map(([s]) => s);
  })();

  protected accentFor(i: number): string {
    return ACCENTS[i % ACCENTS.length];
  }

  protected visibleStack(p: Project): string[] {
    return p.stackFlat.slice(0, this.stackCap);
  }

  protected publicRepo(p: Project): string | null {
    return p.repositories.find((r) => r.visibility === 'public')?.url ?? null;
  }
}
