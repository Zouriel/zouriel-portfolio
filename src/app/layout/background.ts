import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  signal,
} from '@angular/core';

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  tw: number; // twinkle phase
  hue: number; // red hue 0..15
  age: number; // seconds alive
  maxAge: number; // seconds till respawn
  idle: number; // seconds under speed floor
};

@Component({
  selector: 'app-bg-canvas',
  standalone: true,
  template: `
    <canvas
      #c
      class="fixed inset-0 -z-10 block pointer-events-none"
      aria-hidden="true"
    ></canvas>
  `,
})
export class BgCanvasComponent implements OnInit, OnDestroy {
  @ViewChild('c', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private raf = 0;
  private dpr = Math.max(1, window.devicePixelRatio || 1);

  private W = 0;
  private H = 0;

  private reduceMotion = signal(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  private stars: Star[] = [];
  private mouse = { x: 0, y: 0, active: false };

  // for stable delta time
  private lastTs = performance.now();

  constructor(private zone: NgZone) {}

  ngOnInit() {
    const c = this.canvasRef.nativeElement;
    this.ctx = c.getContext('2d', { alpha: true })!;

    this.onResize();
    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('pointermove', this.onPointerMove, {
      passive: true,
    });
    window.addEventListener('pointerleave', this.onPointerLeave, {
      passive: true,
    });

    this.initStars();
    this.zone.runOutsideAngular(() => this.loop());
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize as any);
    window.removeEventListener('pointermove', this.onPointerMove as any);
    window.removeEventListener('pointerleave', this.onPointerLeave as any);
  }

  // --- events ---
  private onResize = () => {
    const c = this.canvasRef.nativeElement;
    this.W = Math.floor(window.innerWidth);
    this.H = Math.floor(window.innerHeight);
    c.width = Math.floor(this.W * this.dpr);
    c.height = Math.floor(this.H * this.dpr);
    c.style.width = `${this.W}px`;
    c.style.height = `${this.H}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.initStars();
  };

  private onPointerMove = (e: PointerEvent) => {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
    this.mouse.active = true;
  };

  private onPointerLeave = () => {
    this.mouse.active = false;
  };

  // --- setup ---
  private initStars() {
    const area = this.W * this.H;
    const density = this.reduceMotion() ? 0.00008 : 0.00018;
    const count = Math.max(120, Math.floor(area * density));

    this.stars.length = 0;
    for (let i = 0; i < count; i++) this.respawn(this.stars[i] as any, true);
  }

  private respawn(s?: Star, fresh = false) {
    const star: Star = s || ({} as Star);
    star.x = Math.random() * this.W;
    star.y = Math.random() * this.H;
    star.vx = (Math.random() - 0.5) * 0.8;
    star.vy = (Math.random() - 0.5) * 0.8;
    star.size = 0.8 + Math.random() * 1.8;
    star.tw = Math.random() * Math.PI * 2;
    star.hue = 0 + Math.random() * 15; // red range
    star.age = 0;
    // live 12–28s (less if reduced motion)
    const k = this.reduceMotion() ? 0.7 : 1;
    star.maxAge = (12 + Math.random() * 16) * k;
    star.idle = 0;

    if (!s) this.stars.push(star);
    return star;
  }

  // light flow field
  private fieldAngle(x: number, y: number, t: number): number {
    const s = 0.001;
    return Math.sin(x * s + t * 0.7) * 1.1 + Math.cos(y * s * 1.2 - t * 0.5);
  }

  // --- loop ---
  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);

    const now = performance.now();
    const dt = Math.min(0.05, (now - this.lastTs) / 1000); // clamp dt (50ms max)
    this.lastTs = now;

    const ctx = this.ctx;
    const W = this.W,
      H = this.H;
    const t = now * 0.001;

    // background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, 'rgba(14, 8, 10, 0.96)');
    bg.addColorStop(1, 'rgba(8, 6, 10, 0.96)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'lighter';

    const repelRadius = 120;
    const jitter = this.reduceMotion() ? 0.004 : 0.012; // Brownian
    const friction = 0.992;
    const vmax = this.reduceMotion() ? 1.2 : 2.2;
    const speedFloor = 0.05; // if below, we consider “idle”

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];

      // flow drift
      const ang = this.fieldAngle(s.x, s.y, t);
      s.vx += Math.cos(ang) * 0.02;
      s.vy += Math.sin(ang) * 0.02;

      // micro-jitter to avoid alignment
      s.vx += (Math.random() - 0.5) * jitter;
      s.vy += (Math.random() - 0.5) * jitter;

      // cursor interaction
      if (this.mouse.active) {
        const dx = s.x - this.mouse.x;
        const dy = s.y - this.mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < repelRadius) {
          const f = (1 - d / repelRadius) * 0.9;
          s.vx += (dx / (d || 1)) * f * 0.9;
          s.vy += (dy / (d || 1)) * f * 0.9;
        }
      }

      // friction & clamp
      s.vx *= friction;
      s.vy *= friction;
      const sp = Math.hypot(s.vx, s.vy);
      if (sp > vmax) {
        s.vx = (s.vx / sp) * vmax;
        s.vy = (s.vy / sp) * vmax;
      }

      // integrate
      s.x += s.vx;
      s.y += s.vy;

      // wrap
      if (s.x < -10) s.x = W + 10;
      if (s.x > W + 10) s.x = -10;
      if (s.y < -10) s.y = H + 10;
      if (s.y > H + 10) s.y = -10;

      // ageing / anti-stall
      s.age += dt;
      if (sp < speedFloor) s.idle += dt;
      else s.idle = 0;

      // respawn if too old or stuck
      if (s.age > s.maxAge || s.idle > 2.0) {
        this.respawn(s);
        continue;
      }

      // twinkle
      const tw = Math.sin(t * 3.0 + s.tw) * 0.5 + 0.5;
      const alpha = (this.reduceMotion() ? 0.07 : 0.1) + tw * 0.35;

      // star
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * (0.7 + tw * 0.9), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 80%, 60%, ${alpha})`;
      ctx.fill();

      // flare
      if (!this.reduceMotion()) {
        ctx.beginPath();
        ctx.moveTo(s.x - s.size * 1.8, s.y);
        ctx.lineTo(s.x + s.size * 1.8, s.y);
        ctx.moveTo(s.x, s.y - s.size * 1.8);
        ctx.lineTo(s.x, s.y + s.size * 1.8);
        ctx.lineWidth = 0.7;
        ctx.strokeStyle = `hsla(${s.hue}, 85%, 65%, ${alpha * 0.5})`;
        ctx.stroke();
      }
    }

    ctx.globalCompositeOperation = 'source-over';
  };
}
