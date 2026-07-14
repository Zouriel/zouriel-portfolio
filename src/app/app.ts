import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiCursor, UiGrain, UiIntroLoader, UiScrollProgress } from 'ui/fx';
import { UiThemeService } from 'ui/theme';

import { NavigationComponent } from './layout/navbar';
import { SubmissionBubbleComponent } from './components/submission-bubble.component';

const INTRO_KEY = 'zouriel:intro-seen';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    UiScrollProgress,
    UiCursor,
    UiGrain,
    UiIntroLoader,
    NavigationComponent,
    SubmissionBubbleComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private theme = inject(UiThemeService);
  protected showIntro = signal(false);

  constructor() {
    this.syncSystemTheme();

    try {
      this.showIntro.set(!sessionStorage.getItem(INTRO_KEY));
    } catch {
      this.showIntro.set(true);
    }
  }

  protected endIntro(): void {
    this.showIntro.set(false);
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {
      /* private mode — no-op */
    }
  }

  /**
   * Default to light mode, and still switch live if the OS colour scheme
   * changes during the session (dark → darkOrange, light → lightOrange).
   */
  private syncSystemTheme(): void {
    this.theme.set('lightOrange');
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', (e) =>
      this.theme.set(e.matches ? 'darkOrange' : 'lightOrange'),
    );
  }
}
