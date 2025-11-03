import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { IconComponent } from '../data/nav-icon';
import { NavigationConfig } from '../data/nav-items';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, IconComponent],
  template: `
    <!-- DESKTOP: pinned vertical rail with hover labels -->
    <nav class="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <div
        class="flex flex-col gap-6 bg-black/30 backdrop-blur-md p-6 rounded-full border border-white/10 shadow-lg"
      >
        @for (item of nav(); track item.route) {
        <a
          class="group relative w-12 h-12 flex items-center text-amber-50 justify-center rounded-full hover:bg-white/10 transition"
          [routerLink]="item.route"
          routerLinkActive="bg-amber-800 text-white"
          [routerLinkActiveOptions]="{ exact: item.exact ?? true }"
          [attr.aria-label]="item.label"
        >
          <app-icon [name]="item.icon" />
          <!-- hover label -->
          <span
            class="pointer-events-none absolute left-full ml-4 top-1/2 -translate-y-1/2 rounded-md bg-black/80 text-white text-sm px-3 py-1 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 whitespace-nowrap shadow"
          >
            {{ item.label }}
          </span>
        </a>
        }
      </div>
    </nav>

    <!-- MOBILE: floating toggle + collapsible menu -->
    <button
      #toggleBtn
      class="md:hidden fixed left-4 bottom-6 z-50 grid place-items-center w-12 h-12 rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-sm shadow-lg active:scale-95 transition"
      (click)="toggle()"
      [attr.aria-expanded]="isOpen()"
      aria-controls="mobile-nav"
      aria-label="Open navigation"
    >
      <!-- hamburger / close -->
      <svg
        *ngIf="!isOpen()"
        class="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <svg
        *ngIf="isOpen()"
        class="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>

    <nav
      #mobilePanel
      id="mobile-nav"
      class="md:hidden fixed left-4 bottom-24 z-50"
      [class.pointer-events-none]="!isOpen()"
    >
      <div
        class="origin-bottom-left transform-gpu transition-all duration-200"
        [class.opacity-0]="!isOpen()"
        [class.scale-95]="!isOpen()"
        [class.opacity-100]="isOpen()"
        [class.scale-100]="isOpen()"
      >
        <div
          class="flex flex-col gap-3 bg-black/70 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-2xl"
        >
          @for (item of nav(); track item.route) {
          <a
            class="flex items-center gap-3 px-4 py-2 rounded-xl text-amber-50 transition hover:bg-white/10"
            [routerLink]="item.route"
            routerLinkActive="bg-amber-800 text-white"
            [routerLinkActiveOptions]="{ exact: item.exact ?? true }"
            (click)="close()"
          >
            <app-icon [name]="item.icon" />
            <span class="text-sm">{{ item.label }}</span>
          </a>
          }
        </div>
      </div>
    </nav>
  `,
})
export class NavigationComponent {
  nav = signal(NavigationConfig);
  isOpen = signal(false);

  @ViewChild('mobilePanel') mobilePanelRef!: ElementRef<HTMLElement>;
  @ViewChild('toggleBtn') toggleBtnRef!: ElementRef<HTMLButtonElement>;

  toggle() {
    this.isOpen.update((v) => !v);
  }
  close() {
    this.isOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.close();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.isOpen()) return;
    const panel = this.mobilePanelRef?.nativeElement;
    const toggle = this.toggleBtnRef?.nativeElement;
    const target = ev.target as Node;
    if (panel && toggle && !panel.contains(target) && !toggle.contains(target))
      this.close();
  }

  // if resized to desktop, ensure closed
  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 768 && this.isOpen()) this.close();
  }
}
