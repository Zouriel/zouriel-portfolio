import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SocialLinksComponent } from '../components/social-links.component';
import { homePageData, SocialLinks } from '../data/home-page.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, SocialLinksComponent],
  styles: [
    `
      /* --- keyframes --- */
      @keyframes fadeUp {
        from {
          opacity: 0;
          transform: translateY(16px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes fade {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes glowLine {
        from {
          transform: scaleX(0);
          opacity: 0;
        }
        to {
          transform: scaleX(1);
          opacity: 1;
        }
      }
      @keyframes pulseDot {
        0% {
          transform: scale(0.9);
          opacity: 0.6;
        }
        50% {
          transform: scale(1.05);
          opacity: 1;
        }
        100% {
          transform: scale(0.9);
          opacity: 0.6;
        }
      }

      .enter-0 {
        animation: fadeUp 0.45s ease both;
      }
      .enter-1 {
        animation: fadeUp 0.45s ease 0.08s both;
      }
      .enter-2 {
        animation: fadeUp 0.45s ease 0.16s both;
      }
      .enter-3 {
        animation: fadeUp 0.45s ease 0.24s both;
      }
      .enter-4 {
        animation: fadeUp 0.45s ease 0.32s both;
      }

      .accent-underline {
        position: relative;
        display: inline-block;
      }
      .accent-underline::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -10px;
        height: 3px;
        border-radius: 9999px;
        background: linear-gradient(90deg, #d97706, #f59e0b, #fb7185);
        transform-origin: left center;
        animation: glowLine 0.6s ease 0.12s both;
        box-shadow: 0 0 20px rgba(251, 113, 133, 0.35);
      }

      /* subtle ambient dots (optional flair) */
      .ambient {
        position: absolute;
        inset: 0;
        pointer-events: none;
        overflow: hidden;
      }
      .ambient i {
        position: absolute;
        width: 6px;
        height: 6px;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.12);
        animation: pulseDot 3.6s ease-in-out infinite;
      }
      .ambient i:nth-child(2) {
        left: 12%;
        top: 28%;
        animation-delay: 0.4s;
      }
      .ambient i:nth-child(3) {
        left: 78%;
        top: 22%;
        animation-delay: 1.1s;
      }
      .ambient i:nth-child(4) {
        left: 18%;
        top: 72%;
        animation-delay: 0.8s;
      }
      .ambient i:nth-child(5) {
        left: 68%;
        top: 68%;
        animation-delay: 1.6s;
      }

      /* reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .enter-0,
        .enter-1,
        .enter-2,
        .enter-3,
        .enter-4 {
          animation: none !important;
        }
        .accent-underline::after {
          animation: none !important;
          transform: none !important;
        }
        .ambient i {
          animation: none !important;
          opacity: 0.2;
        }
      }
    `,
  ],
  template: `
    <section
      class="relative min-h-screen w-full flex items-center justify-center px-4 py-16"
    >
      <!-- tiny ambient dots (can remove if you want pure minimal) -->
      <div class="ambient"><i></i><i></i><i></i><i></i><i></i></div>

      <div class="w-full max-w-4xl text-center">
        <!-- Name -->
        <h1
          class="enter-0 text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight"
        >
          <span class="block accent-underline text-amber-600">{{
            firstName
          }}</span>
          <span class="block text-white mt-2">{{ lastName }}</span>
        </h1>

        <!-- Role Summary -->
        <p class="enter-1 mt-6 text-base sm:text-lg md:text-xl text-gray-300">
          {{ data.designation }}
        </p>

        <!-- Bio -->
        <p class="enter-2 mt-4 text-gray-400 max-w-2xl mx-auto">
          {{ data.description }}
        </p>

        <!-- Social Links -->
        <div class="enter-3 mt-8 flex justify-center">
          <app-social-links [links]="links"></app-social-links>
        </div>

        <!-- Call to Action Buttons -->
        <div class="enter-4 mt-8 flex flex-wrap gap-4 justify-center">
          <div class="relative group">
            <a
              href="mailto:{{ data.email }}"
              class="px-6 py-2.5 rounded-xl border border-white/15 bg-white/5 text-white/90
             hover:bg-white/10 hover:text-white transition"
            >
              Email Me
            </a>
            <!-- Tooltip -->
            <span
              class="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 
             rounded-md bg-black/80 text-white text-sm px-3 py-1 opacity-0 
             group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-200 
             whitespace-nowrap shadow z-50"
            >
              {{ data.email }}
            </span>
          </div>

          <!--
  <a
    href="/assets/CV_Zouriel.pdf"
    target="_blank"
    rel="noopener"
    class="px-6 py-2.5 rounded-xl border border-white/15 bg-white/[.03] text-white/80
           hover:bg-white/10 hover:text-white transition"
  >
    Download CV
  </a>
  -->
        </div>
      </div>
    </section>
  `,
})
export class HomePage {
  links = SocialLinks;
  data = homePageData;

  firstName: string;
  lastName: string;

  constructor() {
    const parts = this.data.name.trim().split(/\s+/);
    this.firstName = parts.shift() ?? '';
    this.lastName = parts.join(' ');
  }
}
