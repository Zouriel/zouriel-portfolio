import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { devPageData, DevPageData, SkillItem } from '../data/development.data';

@Component({
  selector: 'app-development',
  standalone: true,
  imports: [CommonModule],
  styles: [
    `
      /* motion */
      @keyframes fadeSlideIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes growBar {
        from {
          width: 0;
        }
        to {
          width: var(--target, 100%);
        }
      }

      .enter-header {
        animation: fadeSlideIn 0.35s ease both;
      }
      .enter-list {
        animation: fadeSlideIn 0.28s ease both;
      }
      .enter-card {
        animation: fadeSlideIn 0.32s ease both;
      }
      .enter-item {
        animation: fadeSlideIn 0.28s ease both;
      }

      /* respect reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .enter-header,
        .enter-list,
        .enter-card,
        .enter-item {
          animation: none !important;
        }
      }
    `,
  ],
  template: `
    <section class="relative min-h-screen w-full px-4 py-16">
      <div class="mx-auto w-full max-w-6xl space-y-10">
        <!-- Header -->
        <header
          class="rounded-3xl border border-white/10 bg-linear-to-br from-white/6 to-white/2
                 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)]
                 px-6 py-8 sm:px-10 sm:py-12 enter-header"
        >
          <h1
            class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white"
          >
            {{ data.headline }}
          </h1>
          <p
            class="mt-2 font-medium bg-clip-text text-transparent
                    bg-linear-to-r from-amber-400 via-orange-500 to-rose-500"
          >
            {{ data.subhead }}
          </p>
          <p class="mt-4 max-w-3xl text-gray-300">
            {{ data.summary }}
          </p>
        </header>

        <!-- Skill Groups -->
        <section
          class="rounded-3xl border border-white/10 bg-linear-to-br from-white/5 to-white/1.5
                 backdrop-blur-xl shadow-[0_12px_50px_rgba(0,0,0,0.25)] p-6 sm:p-8 enter-list"
        >
          <h2 class="text-xl font-semibold text-white/90">Skillset</h2>

          <div class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (group of data.skillGroups; track group.title; let gi = $index)
            {
            <div
              class="rounded-2xl border border-white/10 bg-white/3 p-4 enter-card"
              [style.animationDelay.ms]="gi * 90"
            >
              <h3 class="text-sm uppercase tracking-wider text-gray-300/90">
                {{ group.title }}
              </h3>

              <ul class="mt-3 space-y-3">
                @for (s of group.items; track s.name; let si = $index) {
                <li class="space-y-1">
                  <!-- Top row: skill + badge -->
                  <div class="flex items-start justify-between gap-3">
                    <span class="text-white/90 wrap-break-word max-w-[70%]">{{
                      s.name
                    }}</span>

                    @if (s.note) {
                    <span class="text-[11px] text-gray-400 whitespace-nowrap"
                      >({{ s.note }})</span
                    >
                    }

                    <span
                      class="text-[11px] px-2 py-0.5 rounded-full border whitespace-nowrap"
                      [ngClass]="levelChipClass(s)"
                    >
                      {{ badge(s) }}
                    </span>
                  </div>

                  <!-- Progress bar -->
                  <div
                    class="h-1.5 w-full rounded-full bg-white/10 overflow-hidden"
                  >
                    <div
                      class="h-full rounded-full"
                      [ngClass]="levelBarClass(s)"
                      [style.width.%]="levelPercent(s)"
                      style="animation: growBar .7s cubic-bezier(.2,.9,.2,1) both;"
                    ></div>
                  </div>
                </li>

                }
              </ul>
            </div>
            }
          </div>

          <!-- Tools -->
          <div class="mt-8 enter-list" style="animation-delay:.12s">
            <h3 class="text-sm uppercase tracking-wider text-gray-300/90">
              Tooling
            </h3>
            <div class="mt-3 flex flex-wrap gap-2">
              @for (t of data.tools; track t; let ti = $index) {
              <span
                class="px-3 py-1 rounded-full border text-xs
                             bg-white/6 border-white/10 text-white/90
                             hover:bg-white/10 transition enter-item"
                [style.animationDelay.ms]="ti * 35"
              >
                {{ t }}
              </span>
              }
            </div>
          </div>
        </section>
      </div>
    </section>
  `,
})
export class DevelopmentPage {
  data: DevPageData = devPageData;

  badge(s: SkillItem): string {
    const yrs = s.years ? ` · ${s.years}y` : '';
    return `${s.level}${yrs}`;
  }

  // --- styling helpers ---
  levelPercent(s: SkillItem): number {
    switch (s.level) {
      case 'Expert':
        return 96;
      case 'Advanced':
        return 82;
      case 'Working':
        return 64;
      case 'Learning':
        return 40;
      default:
        return 60;
    }
  }

  levelChipClass(s: SkillItem) {
    switch (s.level) {
      case 'Expert':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25';
      case 'Advanced':
        return 'bg-sky-500/15 text-sky-300 border-sky-500/25';
      case 'Working':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/25';
      case 'Learning':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/25';
      default:
        return 'bg-white/10 text-white/80 border-white/15';
    }
  }

  levelBarClass(s: SkillItem) {
    switch (s.level) {
      case 'Expert':
        return 'bg-gradient-to-r from-emerald-400 to-teal-400';
      case 'Advanced':
        return 'bg-gradient-to-r from-sky-400 to-indigo-400';
      case 'Working':
        return 'bg-gradient-to-r from-amber-400 to-orange-400';
      case 'Learning':
        return 'bg-gradient-to-r from-rose-400 to-pink-400';
      default:
        return 'bg-white/40';
    }
  }
}
