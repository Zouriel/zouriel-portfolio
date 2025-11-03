import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BgCanvasComponent } from './layout/background';
import { NavigationComponent } from './layout/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BgCanvasComponent, NavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
