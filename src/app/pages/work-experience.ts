import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  ViewChild,
  signal,
} from '@angular/core';
import {
  ExperienceItem,
  workExperienceData,
} from '../data/work-experience.data';
import { RevealDirective } from '../directives/reveal.directive';
import { SectionLabelComponent } from '../components/section-label.component';

@Component({
  selector: 'app-work-experience',
  standalone: true,
  imports: [CommonModule, RevealDirective, SectionLabelComponent],
  template: `
    <section class="page">
      <div class="wrap">
        <app-section-label index="03" label="experience" />

        <h1 class="title font-display" reveal="up" [revealDelay]="80">
          <span class="title__primary">Field</span>
          <span class="title__accent">notes.</span>
        </h1>

        <p class="intro text-pretty" reveal="up" [revealDelay]="180">
          A journey through development, leadership, and teaching — each
          chapter sharpening the next.
        </p>

        <div class="tabs" #rail>
          <button
            #workTab
            (click)="switch('work')"
            class="tab font-mono"
            [class.is-active]="activeTab() === 'work'"
            data-magnetic
          >
            <span class="tab__num">[01]</span>
            Industry
          </button>
          <button
            #acadTab
            (click)="switch('academic')"
            class="tab font-mono"
            [class.is-active]="activeTab() === 'academic'"
            data-magnetic
          >
            <span class="tab__num">[02]</span>
            Lecture
          </button>
          <div
            class="tab-slider"
            [style.transform]="'translateX(' + sliderX() + 'px)'"
            [style.width.px]="sliderW()"
            aria-hidden="true"
          ></div>
        </div>

        <div class="timeline">
          <div class="timeline__rail" aria-hidden="true"></div>

          @if (activeTab() === 'work') {
            @for (e of workItems; track e.org; let i = $index) {
            <article class="entry" reveal="up" [revealDelay]="i * 80">
              <div class="entry__dot" aria-hidden="true"></div>
              <div class="entry__card">
                <header class="entry__head">
                  <div>
                    <h3 class="entry__role font-display">{{ e.role }}</h3>
                    <p class="entry__org">
                      {{ e.org }}
                      @if (e.location) { <span class="entry__loc"> · {{ e.location }}</span> }
                    </p>
                  </div>
                  <p class="entry__period font-mono">{{ e.period }}</p>
                </header>

                @if (e.summary) {
                <p class="entry__summary">{{ e.summary }}</p>
                }

                <ul class="entry__list">
                  @for (h of e.highlights; track h) {
                  <li>{{ h }}</li>
                  }
                </ul>

                @if (e.stack?.length) {
                <div class="entry__stack">
                  @for (s of e.stack; track s) {
                  <span class="chip font-mono">{{ s }}</span>
                  }
                </div>
                }
              </div>
            </article>
            }
          } @else {
            @for (e of academicItems; track e.org; let i = $index) {
            <article class="entry" reveal="up" [revealDelay]="i * 80">
              <div class="entry__dot" aria-hidden="true"></div>
              <div class="entry__card">
                <header class="entry__head">
                  <div>
                    <h3 class="entry__role font-display">{{ e.role }}</h3>
                    <p class="entry__org">
                      {{ e.org }}
                      @if (e.location) { <span class="entry__loc"> · {{ e.location }}</span> }
                    </p>
                  </div>
                  <p class="entry__period font-mono">{{ e.period }}</p>
                </header>
                @if (e.summary) {
                <p class="entry__summary">{{ e.summary }}</p>
                }
                <ul class="entry__list">
                  @for (h of e.highlights; track h) {
                  <li>{{ h }}</li>
                  }
                </ul>
                @if (e.stack?.length) {
                <div class="entry__stack">
                  @for (s of e.stack; track s) {
                  <span class="chip font-mono">{{ s }}</span>
                  }
                </div>
                }
              </div>
            </article>
            }
          }
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      :host { display: block; }

      .page { position: relative; min-height: 100vh; padding: 6rem 1.5rem 6rem; }
      @media (min-width: 768px) { .page { padding: 6rem 4rem; } }
      .wrap { max-width: 1100px; margin: 0 auto; }

      .title {
        margin-top: 1.5rem;
        font-size: clamp(3rem, 11vw, 9rem);
        font-weight: 700;
        line-height: 0.92;
        letter-spacing: -0.04em;
      }
      .title__primary { display: block; color: #fff; }
      .title__accent {
        display: block;
        font-style: italic;
        font-weight: 300;
        background: linear-gradient(90deg, #d23045, #f59e0b, #fb7185);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        text-shadow: 0 0 30px rgba(245, 158, 11, .35);
      }
      .intro {
        margin-top: 1.5rem;
        max-width: 38rem;
        font-size: 1.05rem;
        color: rgba(255, 255, 255, 0.6);
      }

      .tabs {
        position: relative;
        margin-top: 3.5rem;
        display: flex;
        gap: 0.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        padding-bottom: 0.8rem;
      }
      .tab {
        padding: 0.6rem 1rem;
        font-size: 11px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.5);
        transition: color 0.3s ease;
        display: inline-flex;
        gap: 0.6rem;
        align-items: center;
      }
      .tab__num { color: rgba(255, 255, 255, 0.3); }
      .tab:hover, .tab.is-active { color: #fff; }
      .tab.is-active .tab__num { color: #f59e0b; }
      .tab-slider {
        position: absolute;
        bottom: -1px;
        left: 0;
        height: 2px;
        background: linear-gradient(90deg, #d23045, #f59e0b, #fb7185);
        border-radius: 9999px;
        transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1),
          width 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: 0 0 18px rgba(245, 158, 11, 0.6);
      }

      .timeline {
        position: relative;
        margin-top: 3rem;
        padding-left: 2rem;
      }
      .timeline__rail {
        position: absolute;
        left: 0.5rem;
        top: 0;
        bottom: 0;
        width: 1px;
        background: linear-gradient(180deg,
          transparent 0%,
          rgba(255, 255, 255, 0.12) 8%,
          rgba(255, 255, 255, 0.12) 92%,
          transparent 100%);
      }

      .entry { position: relative; margin-bottom: 2rem; }
      .entry__dot {
        position: absolute;
        left: -1.65rem;
        top: 1.6rem;
        width: 12px;
        height: 12px;
        border-radius: 9999px;
        background: #f59e0b;
        box-shadow: 0 0 0 5px rgba(245, 158, 11, 0.15),
          0 0 18px rgba(245, 158, 11, 0.55);
      }
      .entry__card {
        padding: 1.5rem;
        border-radius: 1.25rem;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.025);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        transition: border-color 0.4s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .entry__card:hover {
        border-color: rgba(245, 158, 11, 0.3);
        transform: translateX(2px);
      }
      .entry__head {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: space-between;
        align-items: baseline;
      }
      .entry__role {
        font-size: 1.35rem;
        font-weight: 600;
        color: #fff;
        letter-spacing: -0.02em;
      }
      .entry__org {
        margin-top: 0.15rem;
        font-size: 0.9rem;
        color: rgba(255, 255, 255, 0.7);
      }
      .entry__loc { color: rgba(255, 255, 255, 0.4); }
      .entry__period {
        font-size: 11px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.4);
      }
      .entry__summary {
        margin-top: 0.9rem;
        font-size: 0.95rem;
        color: rgba(255, 255, 255, 0.65);
        line-height: 1.55;
        font-style: italic;
      }
      .entry__list {
        margin-top: 1rem;
        padding-left: 1rem;
        list-style: disc;
        display: flex;
        flex-direction: column;
        gap: 0.45rem;
        color: rgba(255, 255, 255, 0.78);
        font-size: 0.95rem;
        line-height: 1.55;
      }
      .entry__list li::marker { color: #f59e0b; }
      .entry__stack {
        margin-top: 1.25rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
      }
      .chip {
        font-size: 10.5px;
        padding: 0.3rem 0.65rem;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.04);
        color: rgba(255, 255, 255, 0.7);
      }
    `,
  ],
  host: { class: 'route-enter block' },
})
export class WorkExperiencePage implements AfterViewInit {
  @HostBinding('class.block') hostBlock = true;

  activeTab = signal<'work' | 'academic'>('work');

  workItems: ExperienceItem[] = workExperienceData.filter((i) => i.type === 'work');
  academicItems: ExperienceItem[] = workExperienceData.filter((i) => i.type === 'lecturer');

  sliderX = signal(0);
  sliderW = signal(0);

  @ViewChild('rail', { static: true }) rail!: ElementRef<HTMLDivElement>;
  @ViewChild('workTab', { static: true }) workTab!: ElementRef<HTMLButtonElement>;
  @ViewChild('acadTab', { static: true }) acadTab!: ElementRef<HTMLButtonElement>;

  private ro?: ResizeObserver;

  ngAfterViewInit() {
    this.measure();
    this.ro = new ResizeObserver(() => this.measure());
    this.ro.observe(this.rail.nativeElement);
    window.addEventListener('resize', this.measure, { passive: true });
  }

  private targetTabEl(): HTMLButtonElement {
    return this.activeTab() === 'work'
      ? this.workTab.nativeElement
      : this.acadTab.nativeElement;
  }

  measure = () => {
    const railRect = this.rail.nativeElement.getBoundingClientRect();
    const tabRect = this.targetTabEl().getBoundingClientRect();
    this.sliderX.set(tabRect.left - railRect.left);
    this.sliderW.set(tabRect.width);
  };

  switch(tab: 'work' | 'academic') {
    if (this.activeTab() !== tab) {
      this.activeTab.set(tab);
      queueMicrotask(this.measure);
    }
  }

  ngOnDestroy() {
    this.ro?.disconnect();
    window.removeEventListener('resize', this.measure as any);
  }
}
