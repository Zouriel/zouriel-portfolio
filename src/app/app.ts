import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './layout/navbar';
import { CursorComponent } from './components/cursor.component';
import { ScrollProgressComponent } from './components/scroll-progress.component';
import { IntroLoaderComponent } from './components/intro-loader.component';
import { SubmissionBubbleComponent } from './components/submission-bubble.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavigationComponent,
    CursorComponent,
    ScrollProgressComponent,
    IntroLoaderComponent,
    SubmissionBubbleComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
