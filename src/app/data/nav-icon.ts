// src/app/ui/icon/icon.component.ts
import { Component, Input } from '@angular/core';
import { NavKey } from './nav-items';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    @switch (name) { @case ('home') {
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-5 h-5"
    >
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M5 10.5v8.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8.5" />
      <path d="M9.5 20v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5" />
    </svg>
    } @case ('dev') {
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-5 h-5"
    >
      <path d="M8.5 8.5 4.5 12l4 3.5" />
      <path d="M15.5 8.5 19.5 12l-4 3.5" />
      <path d="M13 6 11 18" />
    </svg>
    } @case ('work') {
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-5 h-5"
    >
      <path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" />
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 12h18" />
      <path d="M12 12v3.5" />
    </svg>
    } @case ('academics') {
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-5 h-5"
    >
      <path d="M3 9l9-4 9 4-9 4-9-4z" />
      <path d="M7 11v4.5c0 2 5 3 5 3s5-1 5-3V11" />
      <path d="M21 9v5" />
    </svg>
    } @case ('military') {
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-5 h-5"
    >
      <path d="M12 3l7 2v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V5l7-2z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
    } @case ('athletics') {
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="w-5 h-5"
    >
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4z" />
      <path d="M5 6H4a2 2 0 0 0 0 4h2" />
      <path d="M19 6h1a2 2 0 0 1 0 4h-2" />
    </svg>
    } }
  `,
})
export class IconComponent {
  @Input({ required: true }) name!: NavKey;
}
