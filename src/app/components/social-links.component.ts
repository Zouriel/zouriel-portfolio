// src/app/ui/social-links/social-links.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type Network =
  | 'instagram'
  | 'facebook'
  | 'discord'
  | 'discordServer'
  | 'github'
  | 'strava'
  | 'linkedin';

export type SocialLinks = Partial<Record<Network, string>>;

@Component({
  selector: 'app-social-links',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-wrap gap-3">
      @for (item of ordered(); track item.key) {
      <a
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl
                 border border-white/15 bg-white/5 text-white/80
                 hover:bg-white/10 hover:text-white transition"
        [href]="item.href"
        target="_blank"
        rel="noopener noreferrer"
        [attr.aria-label]="item.label"
      >
        <!-- Inline SVG; no innerHTML, no sanitiser warning -->
        @switch (item.key) { @case ('instagram') {
        <svg
          class="w-[1.1rem] h-[1.1rem]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <circle cx="17.5" cy="6.5" r="1" />
        </svg>
        } @case ('facebook') {
        <svg
          class="w-[1.1rem] h-[1.1rem]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M13 22v-8h3l.6-4H13V7.5c0-1.1.3-1.9 2-1.9h1.8V2.2C16.3 2.1 15.1 2 13.8 2 10.9 2 9 3.7 9 7v3H6v4h3v8h4z"
          />
        </svg>
        } @case ('discord') {
        <svg
          class="w-[1.1rem] h-[1.1rem]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M20 6.1a16 16 0 0 0-4-1.2l-.2.4a13 13 0 0 1 3 .9c-1.3-.6-2.7-1-4.2-1.2a12.7 12.7 0 0 0-4.8 0 15.5 15.5 0 0 0-4.2 1.2 13 13 0 0 1 3-.9l-.3-.4A16 16 0 0 0 4 6.1C1.8 9.6 1.1 13 1.3 16.4a12 12 0 0 0 4.7 2.4l.6-.9a8 8 0 0 1-2.3-1c.2.1.5.3.7.4 2.7 1.5 5.5 1.8 8 .6.3-.1.5-.2.8-.3.1 0 .2-.1.3-.1 1.1-.5 1.9-.9 2.7-1.6l-.6.9A12 12 0 0 0 22.7 16c.4-3.4-.4-6.8-2.7-9.9ZM9.7 14c-.8 0-1.5-.8-1.5-1.8s.7-1.8 1.5-1.8 1.5.8 1.5 1.8S10.5 14 9.7 14Zm4.6 0c-.8 0-1.5-.8-1.5-1.8s.7-1.8 1.5-1.8 1.5.8 1.5 1.8S15.1 14 14.3 14Z"
          />
        </svg>
        } @case ('discordServer') {
        <svg
          class="w-[1.1rem] h-[1.1rem]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 3l3 6 6 .9-4.5 4.3 1.1 6.5L12 17.8 6.4 20.7 7.5 14.2 3 9.9 9 9l3-6z"
          />
        </svg>
        } @case ('github') {
        <svg
          class="w-[1.1rem] h-[1.1rem]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.7-1.4-1.7-1.1-.8.1-.8.1-.8 1.1.1 1.7 1.2 1.7 1.2 1 .1.7 2 .7 2 .9 1.6 2.5 1.1 3 .8.1-.7.4-1.1.7-1.4-2.7-.3-5.6-1.4-5.6-6.2 0-1.4.5-2.5 1.2-3.4-.1-.3-.5-1.7.1-3.4 0 0 1-.3 3.3 1.3a11.3 11.3 0 0 1 6 0C17.1 6.1 18 6.4 18 6.4c.6 1.7.2 3.1.1 3.4.8.9 1.2 2 1.2 3.4 0 4.8-2.9 5.9-5.7 6.2.4.4.8 1 .8 2v3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"
          />
        </svg>
        } @case ('strava') {
        <svg
          class="w-[1.1rem] h-[1.1rem]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M9.4 2 2 16h4.4l3-5.6L12.5 16H17L9.4 2zm5.2 6 5.4 10h-4.5l-.9-1.8-1 1.8h-4.5L14.6 8z"
          />
        </svg>
        } @case ('linkedin') {
        <svg
          class="w-[1.1rem] h-[1.1rem]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8.5h4V23h-4V8.5zm7 0h3.8v1.9h.1c.5-.9 1.8-2.1 3.9-2.1C20.1 8.3 23 10 23 14.2V23h-4v-7.6c0-1.8-.6-3.1-2.2-3.1-1.2 0-1.9.8-2.2 1.6-.1.3-.1.7-.1 1.1V23h-4c.1-9.7 0-14.5 0-14.5z"
          />
        </svg>
        } }
        <span class="text-sm">{{ item.label }}</span>
      </a>
      }
    </div>
  `,
})
export class SocialLinksComponent {
  @Input({ required: true }) links!: SocialLinks;

  ordered() {
    if (!this.links) return [];
    const order: Network[] = [
      'instagram',
      'facebook',
      'discord',
      'discordServer',
      'github',
      'strava',
      'linkedin',
    ];
    return order
      .filter((key) => !!this.links[key])
      .map((key) => ({
        key,
        href: this.links[key]!,
        label: key === 'discordServer' ? 'Join Server' : this.titleCase(key),
      }));
  }

  private titleCase(x: string) {
    return x.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
  }
}
