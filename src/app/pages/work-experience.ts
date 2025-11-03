import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  signal,
} from '@angular/core';
import {
  ExperienceItem,
  workExperienceData,
} from '../data/work-experience.data';

@Component({
  selector: 'app-work-experience',
  standalone: true,
  imports: [CommonModule],
  styles: [
    `
      .tab-rail {
        position: relative;
      }
      .tab-btn {
        padding: 0.5rem 1rem;
        color: #9ca3af;
        transition: color 0.2s ease;
      }
      .tab-btn.active,
      .tab-btn:hover {
        color: #fff;
      }

      .tab-slider {
        position: absolute;
        left: 0;
        bottom: -1px;
        height: 2px;
        background: linear-gradient(90deg, #f59e0b, #fb7185);
        border-radius: 9999px;
        transition: transform 0.28s ease, width 0.28s ease;
        will-change: transform, width;
      }

      @keyframes fadeSlideIn {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes popDot {
        0% {
          transform: scale(0.6);
          opacity: 0.4;
        }
        60% {
          transform: scale(1.15);
          opacity: 1;
        }
        100% {
          transform: scale(1);
        }
      }
      .enter-list {
        animation: fadeSlideIn 0.28s ease both;
      }
      .enter-item {
        animation: fadeSlideIn 0.32s ease both;
      }
      .enter-dot {
        animation: popDot 0.36s cubic-bezier(0.2, 0.9, 0.2, 1) both;
      }
    `,
  ],
  template: `
    <section class="relative min-h-screen w-full px-4 py-16">
      <div class="mx-auto w-full max-w-5xl space-y-10">
        <!-- Header -->
        <header
          class="rounded-3xl border border-white/10 bg-linear-to-br from-white/10 to-white/5
                 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)]
                 px-6 py-8 sm:px-10 sm:py-12"
        >
          <h1
            class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white"
          >
            Experience
          </h1>
          <p class="mt-2 text-sm sm:text-base text-gray-300">
            A journey through development, leadership, and teaching.
          </p>

          <!-- Tabs -->
          <div
            #rail
            class="mt-6 tab-rail flex gap-4 border-b border-white/10 pb-2"
          >
            <button
              #workTab
              (click)="switch('work')"
              class="tab-btn -mb-px"
              [class.active]="activeTab() === 'work'"
            >
              Work
            </button>

            <button
              #acadTab
              (click)="switch('academic')"
              class="tab-btn -mb-px"
              [class.active]="activeTab() === 'academic'"
            >
              Academic
            </button>

            <!-- underline slider -->
            <div
              class="tab-slider"
              [style.transform]="'translateX(' + sliderX() + 'px)'"
              [style.width.px]="sliderW()"
            ></div>
          </div>
        </header>

        <!-- Timeline -->
        <section
          class="rounded-3xl border border-white/10 bg-linear-to-br from-white/5 to-white/2
                 backdrop-blur-xl shadow-[0_12px_50px_rgba(0,0,0,0.25)] p-6 sm:p-8"
        >
          @if (activeTab() === 'work') {
          <div class="relative pl-6 enter-list">
            <div class="absolute left-3 top-0 bottom-0 w-px bg-white/10"></div>

            @for (e of workItems; track e.org; let i = $index) {
            <article
              class="relative mb-8 last:mb-0 enter-item"
              [style.animationDelay.ms]="i * 60"
            >
              <div
                class="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_0_4px_rgba(251,191,36,0.15)] enter-dot"
              ></div>

              <div class="rounded-2xl border border-white/10 bg-white/3 p-4">
                <div
                  class="flex flex-wrap items-baseline justify-between gap-2"
                >
                  <div>
                    <h3 class="text-white font-semibold">{{ e.role }}</h3>
                    <p class="text-gray-300/90">
                      {{ e.org }}
                      @if (e.location) { <span> · {{ e.location }}</span> }
                    </p>
                  </div>
                  <p class="text-xs text-gray-400">{{ e.period }}</p>
                </div>

                <ul
                  class="mt-3 list-disc list-inside text-gray-300/90 space-y-1"
                >
                  @for (h of e.highlights; track h) {
                  <li>{{ h }}</li>
                  }
                </ul>

                @if (e.stack?.length) {
                <div class="mt-3 flex flex-wrap gap-2">
                  @for (s of e.stack; track s) {
                  <span
                    class="px-2.5 py-1 rounded-full border text-[11px] bg-white/10 border-white/10 text-white"
                  >
                    {{ s }}
                  </span>
                  }
                </div>
                }
              </div>
            </article>
            }
          </div>
          } @else {
          <div class="relative pl-6 enter-list">
            <div class="absolute left-3 top-0 bottom-0 w-px bg-white/10"></div>

            @for (e of academicItems; track e.org; let i = $index) {
            <article
              class="relative mb-8 last:mb-0 enter-item"
              [style.animationDelay.ms]="i * 60"
            >
              <div
                class="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_0_4px_rgba(251,191,36,0.15)] enter-dot"
              ></div>

              <div class="rounded-2xl border border-white/10 bg-white/3 p-4">
                <div
                  class="flex flex-wrap items-baseline justify-between gap-2"
                >
                  <div>
                    <h3 class="text-white font-semibold">{{ e.role }}</h3>
                    <p class="text-gray-300/90">
                      {{ e.org }}
                      @if (e.location) { <span> · {{ e.location }}</span> }
                    </p>
                  </div>
                  <p class="text-xs text-gray-400">{{ e.period }}</p>
                </div>

                <ul
                  class="mt-3 list-disc list-inside text-gray-300/90 space-y-1"
                >
                  @for (h of e.highlights; track h) {
                  <li>{{ h }}</li>
                  }
                </ul>

                @if (e.stack?.length) {
                <div class="mt-3 flex flex-wrap gap-2">
                  @for (s of e.stack; track s) {
                  <span
                    class="px-2.5 py-1 rounded-full border text-[11px] bg-white/10 border-white/10 text-white"
                  >
                    {{ s }}
                  </span>
                  }
                </div>
                }
              </div>
            </article>
            }
          </div>
          }
        </section>
      </div>
    </section>
  `,
})
export class WorkExperiencePage implements AfterViewInit {
  activeTab = signal<'work' | 'academic'>('work');

  workItems: ExperienceItem[] = workExperienceData.filter(
    (i) => i.type === 'work'
  );
  academicItems: ExperienceItem[] = workExperienceData.filter(
    (i) => i.type === 'lecturer'
  );

  // slider state
  sliderX = signal(0);
  sliderW = signal(0);

  // elements to measure
  @ViewChild('rail', { static: true }) rail!: ElementRef<HTMLDivElement>;
  @ViewChild('workTab', { static: true })
  workTab!: ElementRef<HTMLButtonElement>;
  @ViewChild('acadTab', { static: true })
  acadTab!: ElementRef<HTMLButtonElement>;

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
    // position slider relative to the rail
    const railRect = this.rail.nativeElement.getBoundingClientRect();
    const tabRect = this.targetTabEl().getBoundingClientRect();
    this.sliderX.set(tabRect.left - railRect.left);
    this.sliderW.set(tabRect.width);
  };

  switch(tab: 'work' | 'academic') {
    if (this.activeTab() !== tab) {
      this.activeTab.set(tab);
      // wait for DOM to update then measure
      queueMicrotask(this.measure);
    }
  }

  ngOnDestroy() {
    this.ro?.disconnect();
    window.removeEventListener('resize', this.measure as any);
  }
}
