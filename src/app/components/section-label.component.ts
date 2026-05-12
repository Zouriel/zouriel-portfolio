import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RevealDirective } from '../directives/reveal.directive';

@Component({
  selector: 'app-section-label',
  standalone: true,
  imports: [CommonModule, RevealDirective],
  template: `
    <div
      reveal="up"
      class="font-mono text-[11px] sm:text-xs uppercase tracking-[0.4em] text-white/40 inline-flex items-center gap-3"
    >
      <span class="text-[#d23045]/80">[</span>
      <span class="text-white/70">{{ index }}</span>
      <span class="text-white/30">·</span>
      <span class="text-white/80">{{ label }}</span>
      <span class="text-[#d23045]/80">]</span>
      <span class="h-px w-12 bg-gradient-to-r from-white/30 to-transparent"></span>
    </div>
  `,
})
export class SectionLabelComponent {
  @Input({ required: true }) index!: string;
  @Input({ required: true }) label!: string;
}
