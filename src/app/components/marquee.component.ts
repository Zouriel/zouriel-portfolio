import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-marquee',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="marquee" [style.--marquee-duration]="duration + 's'">
      <div class="marquee__track">
        @for (item of items; track $index) {
        <span class="m-item font-display" [class.m-item--dim]="$index % 2 !== 0">
          {{ item }}
          <span class="m-star">✦</span>
        </span>
        }
      </div>
      <div class="marquee__track" aria-hidden="true">
        @for (item of items; track $index) {
        <span class="m-item font-display" [class.m-item--dim]="$index % 2 !== 0">
          {{ item }}
          <span class="m-star">✦</span>
        </span>
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
      .m-item {
        display: inline-flex;
        align-items: center;
        gap: 0.85rem;
        font-size: clamp(1.25rem, 2.4vw, 2rem);
        font-weight: 500;
        color: #fff;
        white-space: nowrap;
      }
      .m-item--dim { opacity: 0.35; }
      .m-star {
        color: #d23045;
        font-size: 0.7em;
      }
    `,
  ],
})
export class MarqueeComponent {
  @Input({ required: true }) items!: string[];
  @Input() duration = 38;
}
