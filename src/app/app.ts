import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BgCanvasComponent } from './layout/background';
import { NavigationComponent } from './layout/navbar';
import { CursorComponent } from './components/cursor.component';
import { ScrollProgressComponent } from './components/scroll-progress.component';
import { IntroLoaderComponent } from './components/intro-loader.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    BgCanvasComponent,
    NavigationComponent,
    CursorComponent,
    ScrollProgressComponent,
    IntroLoaderComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
