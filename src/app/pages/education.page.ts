import { CommonModule } from '@angular/common';
import { Component, HostBinding } from '@angular/core';
import { educationPageData, EducationPageData } from '../data/education.data';
import { RevealDirective } from '../directives/reveal.directive';
import { SectionLabelComponent } from '../components/section-label.component';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, RevealDirective, SectionLabelComponent],
  template: `
    <section class="page">
      <div class="wrap">
        <app-section-label index="04" label="academic" />

        <h1 class="title font-display" reveal="up" [revealDelay]="80">
          <span class="title__primary">{{ data.headline }}</span>
          <span class="title__accent">first class.</span>
        </h1>

        <p class="intro text-pretty" reveal="up" [revealDelay]="180">
          {{ data.summary }}
        </p>

        <div class="timeline">
          <div class="timeline__rail" aria-hidden="true"></div>

          @for (e of data.education; track e.degree; let i = $index) {
          <article class="entry" reveal="up" [revealDelay]="i * 90">
            <div class="entry__dot" aria-hidden="true"></div>
            <div class="entry__card">
              <header class="entry__head">
                <div>
                  <h3 class="entry__role font-display">{{ e.degree }}</h3>
                  <p class="entry__org">
                    {{ e.institution }}
                    @if (e.location) { <span class="entry__loc"> · {{ e.location }}</span> }
                  </p>
                </div>
                <p class="entry__period font-mono">{{ e.period }}</p>
              </header>

              @if (e.result) {
              <p class="entry__result">
                <span class="dot">●</span>
                Result: {{ e.result }}
              </p>
              }
              @if (e.highlights?.length) {
              <ul class="entry__list">
                @for (h of e.highlights; track h) {
                <li>{{ h }}</li>
                }
              </ul>
              }
              @if (e.coursework?.length) {
              <div class="entry__cw">
                <h4 class="entry__cw-h font-mono">// selected coursework</h4>
                <div class="entry__chips">
                  @for (c of e.coursework; track c) {
                  <span class="chip font-mono">{{ c }}</span>
                  }
                </div>
              </div>
              }
            </div>
          </article>
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
        font-size: 0.6em;
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

      .timeline {
        position: relative;
        margin-top: 4rem;
        padding-left: 2rem;
      }
      .timeline__rail {
        position: absolute;
        left: 0.5rem; top: 0; bottom: 0;
        width: 1px;
        background: linear-gradient(180deg,
          transparent 0%, rgba(255,255,255,.12) 8%,
          rgba(255,255,255,.12) 92%, transparent 100%);
      }
      .entry { position: relative; margin-bottom: 2rem; }
      .entry__dot {
        position: absolute;
        left: -1.65rem; top: 1.6rem;
        width: 12px; height: 12px;
        border-radius: 9999px;
        background: #f59e0b;
        box-shadow: 0 0 0 5px rgba(245, 158, 11, .15),
          0 0 18px rgba(245, 158, 11, .55);
      }
      .entry__card {
        padding: 1.5rem;
        border-radius: 1.25rem;
        border: 1px solid rgba(255, 255, 255, .08);
        background: rgba(255, 255, 255, .025);
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
        font-size: 1.25rem;
        font-weight: 600;
        color: #fff;
        letter-spacing: -0.02em;
      }
      .entry__org {
        margin-top: 0.15rem;
        font-size: 0.9rem;
        color: rgba(255, 255, 255, .7);
      }
      .entry__loc { color: rgba(255, 255, 255, .4); }
      .entry__period {
        font-size: 11px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, .4);
      }
      .entry__result {
        margin-top: 0.85rem;
        color: #6ee7b7;
        font-size: 0.92rem;
        display: inline-flex; gap: 0.5rem; align-items: center;
      }
      .entry__result .dot { color: #34d399; }
      .entry__list {
        margin-top: 1rem;
        padding-left: 1rem;
        list-style: disc;
        display: flex; flex-direction: column;
        gap: 0.45rem;
        color: rgba(255, 255, 255, .78);
        font-size: 0.95rem;
      }
      .entry__list li::marker { color: #f59e0b; }
      .entry__cw { margin-top: 1.25rem; }
      .entry__cw-h {
        font-size: 10.5px;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, .4);
      }
      .entry__chips {
        margin-top: 0.65rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
      }
      .chip {
        font-size: 10.5px;
        padding: 0.3rem 0.65rem;
        border-radius: 9999px;
        border: 1px solid rgba(255, 255, 255, .08);
        background: rgba(255, 255, 255, .04);
        color: rgba(255, 255, 255, .8);
      }
    `,
  ],
  host: { class: 'route-enter block' },
})
export class EducationPage {
  @HostBinding('class.block') hostBlock = true;
  data: EducationPageData = educationPageData;
}
