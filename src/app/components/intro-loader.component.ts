import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  HostBinding,
  OnDestroy,
  signal,
} from '@angular/core';

const SESSION_KEY = 'zouriel:intro-seen';

@Component({
  selector: 'app-intro-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible()) {
    <div class="intro" [class.intro--out]="leaving()" aria-hidden="true">
      <div class="intro__top">
        <div class="intro__brand font-mono">
          <span class="dot"></span>
          <span>zouriel.dev</span>
        </div>
        <div class="intro__meta font-mono">[ booting · v2026 ]</div>
      </div>

      <div class="intro__center">
        <div class="intro__label font-mono">
          <span class="line"></span>
          <span>full-stack · marine · lecturer</span>
          <span class="line"></span>
        </div>
        <h1 class="intro__name font-display">
          <span>M</span><span>O</span><span>H</span><span>A</span><span>M</span><span>E</span><span>D</span>
          <span class="sp">&nbsp;</span>
          <span>I</span><span>M</span><span>D</span><span>A</span><span>A</span><span>H</span>
        </h1>
        <div class="intro__progress">
          <div class="intro__progress-bar" [style.width.%]="pct()"></div>
        </div>
        <div class="intro__pct font-mono">{{ pct() | number: '2.0-0' }} / 100</div>
      </div>

      <div class="intro__bottom">
        <span class="font-mono">Malé · Maldives</span>
        <span class="font-mono">2026 © Zouriel</span>
      </div>

      <div class="intro__curtain intro__curtain--top"></div>
      <div class="intro__curtain intro__curtain--bot"></div>
    </div>
    }
  `,
  styles: [
    `
      :host {
        position: fixed;
        inset: 0;
        z-index: 90;
        pointer-events: none;
      }
      .intro {
        position: fixed;
        inset: 0;
        background: radial-gradient(
            ellipse at center,
            #1b0d10 0%,
            #0a0608 70%
          ),
          #0a0608;
        display: grid;
        grid-template-rows: auto 1fr auto;
        padding: 1.5rem 1.5rem;
        color: rgba(255, 255, 255, 0.85);
        overflow: hidden;
        z-index: 90;
        pointer-events: auto;
      }
      .intro__top,
      .intro__bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 11px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        opacity: 0.6;
      }
      .intro__brand {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      .intro__brand .dot {
        width: 8px;
        height: 8px;
        border-radius: 9999px;
        background: #f59e0b;
        box-shadow: 0 0 14px #f59e0b;
        animation: introPulse 1.4s ease-in-out infinite;
      }
      .intro__center {
        display: grid;
        place-items: center;
        gap: 1.5rem;
        text-align: center;
      }
      .intro__label {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 11px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        color: rgba(255, 255, 255, 0.55);
      }
      .intro__label .line {
        width: 64px;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(245, 158, 11, 0.6),
          transparent
        );
      }
      .intro__name {
        font-size: clamp(2.5rem, 11vw, 8rem);
        font-weight: 700;
        line-height: 0.9;
        letter-spacing: -0.04em;
        display: inline-flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0;
      }
      .intro__name span {
        display: inline-block;
        opacity: 0;
        transform: translateY(.8em);
        animation: introChar 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
      }
      .intro__name span:nth-child(1)  { animation-delay: .05s; }
      .intro__name span:nth-child(2)  { animation-delay: .09s; }
      .intro__name span:nth-child(3)  { animation-delay: .13s; }
      .intro__name span:nth-child(4)  { animation-delay: .17s; }
      .intro__name span:nth-child(5)  { animation-delay: .21s; }
      .intro__name span:nth-child(6)  { animation-delay: .25s; }
      .intro__name span:nth-child(7)  { animation-delay: .29s; }
      .intro__name span:nth-child(8)  { animation-delay: .33s; }
      .intro__name span:nth-child(9)  { animation-delay: .42s; }
      .intro__name span:nth-child(10) { animation-delay: .46s; }
      .intro__name span:nth-child(11) { animation-delay: .50s; }
      .intro__name span:nth-child(12) { animation-delay: .54s; }
      .intro__name span:nth-child(13) { animation-delay: .58s; }
      .intro__name span:nth-child(14) { animation-delay: .62s; }
      .intro__name span:nth-child(15) { animation-delay: .66s; }
      .intro__name .sp {
        width: 0.5em;
        opacity: 1 !important;
      }
      .intro__progress {
        margin-top: 0.5rem;
        width: min(420px, 60vw);
        height: 1px;
        background: rgba(255, 255, 255, 0.08);
        overflow: hidden;
      }
      .intro__progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #d23045, #f59e0b);
        box-shadow: 0 0 18px rgba(245, 158, 11, 0.7);
        transition: width 0.18s linear;
      }
      .intro__pct {
        font-size: 11px;
        letter-spacing: 0.22em;
        color: rgba(255, 255, 255, 0.45);
      }

      .intro__curtain {
        position: absolute;
        left: 0;
        right: 0;
        height: 51%;
        background: #0a0608;
        z-index: 2;
        pointer-events: none;
        transform: translateY(0);
      }
      .intro__curtain--top { top: 0; }
      .intro__curtain--bot { bottom: 0; }

      .intro--out .intro__curtain--top {
        animation: curtainTop 0.95s cubic-bezier(0.7, 0, 0.2, 1) forwards;
      }
      .intro--out .intro__curtain--bot {
        animation: curtainBot 0.95s cubic-bezier(0.7, 0, 0.2, 1) forwards;
      }
      .intro--out .intro__top,
      .intro--out .intro__bottom,
      .intro--out .intro__center {
        animation: introFade 0.45s ease forwards;
      }

      @keyframes introPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50%      { transform: scale(0.7); opacity: 0.55; }
      }
      @keyframes introChar {
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes curtainTop {
        from { transform: translateY(0); }
        to   { transform: translateY(-100%); }
      }
      @keyframes curtainBot {
        from { transform: translateY(0); }
        to   { transform: translateY(100%); }
      }
      @keyframes introFade {
        to { opacity: 0; transform: translateY(-12px); }
      }

      @media (prefers-reduced-motion: reduce) {
        :host { display: none; }
      }
    `,
  ],
})
export class IntroLoaderComponent implements AfterViewInit, OnDestroy {
  @HostBinding('attr.aria-hidden') readonly ariaHidden = true;

  visible = signal(true);
  leaving = signal(false);
  pct = signal(0);

  private timer?: ReturnType<typeof setInterval>;
  private leaveTimer?: ReturnType<typeof setTimeout>;
  private hideTimer?: ReturnType<typeof setTimeout>;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') {
      this.visible.set(false);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.visible.set(false);
      return;
    }
    if (sessionStorage.getItem(SESSION_KEY)) {
      this.visible.set(false);
      return;
    }

    const start = performance.now();
    const duration = 1500;
    this.timer = setInterval(() => {
      const t = Math.min(1, (performance.now() - start) / duration);
      // ease out
      const eased = 1 - Math.pow(1 - t, 3);
      this.pct.set(Math.round(eased * 100));
      if (t >= 1 && this.timer) {
        clearInterval(this.timer);
        this.timer = undefined;
        this.leaveTimer = setTimeout(() => {
          this.leaving.set(true);
          this.hideTimer = setTimeout(() => {
            this.visible.set(false);
            sessionStorage.setItem(SESSION_KEY, '1');
          }, 1000);
        }, 220);
      }
    }, 30);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
    if (this.leaveTimer) clearTimeout(this.leaveTimer);
    if (this.hideTimer) clearTimeout(this.hideTimer);
  }
}
