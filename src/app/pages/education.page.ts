import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { educationPageData, EducationPageData } from '../data/education.data';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  styles: [
    `
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
      .enter {
        animation: fadeSlideIn 0.35s ease both;
      }
      .enter-s {
        animation: fadeSlideIn 0.3s ease both;
      }
      .enter-xs {
        animation: fadeSlideIn 0.24s ease both;
      }
      @media (prefers-reduced-motion: reduce) {
        .enter,
        .enter-s,
        .enter-xs {
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
          class="enter rounded-3xl border border-white/10 bg-linear-to-br from-white/8 to-white/3
                 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.35)]
                 px-6 py-8 sm:px-10 sm:py-12"
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

        <!-- Degrees / Formal Education -->
        <section
          class="enter-s rounded-3xl border border-white/10 bg-linear-to-br from-white/6 to-white/2
                 backdrop-blur-xl shadow-[0_12px_50px_rgba(0,0,0,0.25)] p-6 sm:p-8"
        >
          <h2 class="text-xl font-semibold text-white/90">
            Degrees & Formal Education
          </h2>

          <div class="relative mt-6 pl-6">
            <div class="absolute left-3 top-0 bottom-0 w-px bg-white/10"></div>

            @for (e of data.education; track e.degree; let i = $index) {
            <article
              class="relative mb-8 last:mb-0 enter-xs"
              [style.animationDelay.ms]="i * 80"
            >
              <div
                class="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-amber-500
                            shadow-[0_0_0_4px_rgba(251,191,36,0.15)]"
              ></div>

              <div class="rounded-2xl border border-white/10 bg-white/3 p-4">
                <div
                  class="flex flex-wrap items-baseline justify-between gap-2"
                >
                  <div>
                    <h3 class="text-white font-semibold">{{ e.degree }}</h3>
                    <p class="text-gray-300/90">
                      {{ e.institution }} @if (e.location) {
                      <span> · {{ e.location }}</span> }
                    </p>
                  </div>
                  <p class="text-xs text-gray-400">{{ e.period }}</p>
                </div>

                @if (e.result) {
                <p class="mt-2 text-sm text-emerald-300/90">
                  Result: {{ e.result }}
                </p>
                } @if (e.highlights?.length) {
                <ul
                  class="mt-3 list-disc list-inside text-gray-300/90 space-y-1"
                >
                  @for (h of e.highlights; track h) {
                  <li>{{ h }}</li>
                  }
                </ul>
                } @if (e.coursework?.length) {
                <div class="mt-3">
                  <h4
                    class="text-[13px] uppercase tracking-wide text-gray-300/90"
                  >
                    Selected Coursework
                  </h4>
                  <div class="mt-2 flex flex-wrap gap-2">
                    @for (c of e.coursework; track c) {
                    <span
                      class="px-2.5 py-1 rounded-full border text-[11px]
                                       bg-white/10 border-white/10 text-white/90"
                    >
                      {{ c }}
                    </span>
                    }
                  </div>
                </div>
                }
              </div>
            </article>
            }
          </div>
        </section>

        <!-- Certifications & Training -->
        <!-- <section
          class="enter-s rounded-3xl border border-white/10 bg-linear-to-br from-white/6 to-white/2
                 backdrop-blur-xl shadow-[0_12px_50px_rgba(0,0,0,0.25)] p-6 sm:p-8"
        >
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-white/90">
              Certifications & Training
            </h2>
          </div>

          <div class="mt-6 grid gap-6 md:grid-cols-2">
            @for (c of data.certifications; track c.title; let i = $index) {
            <article
              class="rounded-2xl border border-white/10 bg-white/3 p-4 enter-xs"
              [style.animationDelay.ms]="i * 80"
            >
              <div class="flex items-baseline justify-between gap-2">
                <h3 class="text-white font-semibold">
                  {{ c.title }}
                  @if (c.category) {
                  <span class="ml-2 text-xs text-white/60"
                    >({{ c.category }})</span
                  >
                  }
                </h3>
                <p class="text-xs text-gray-400">{{ c.date }}</p>
              </div>
              <p class="text-gray-300/90">
                {{ c.issuer }} @if (c.location) {
                <span> · {{ c.location }}</span> }
              </p>

              @if (c.notes?.length) {
              <ul class="mt-2 list-disc list-inside text-gray-300/90 space-y-1">
                @for (n of c.notes; track n) {
                <li>{{ n }}</li>
                }
              </ul>
              }
            </article>
            }
          </div>
        </section> -->
      </div>
    </section>
  `,
})
export class EducationPage {
  data: EducationPageData = educationPageData;
}
