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
  tw: number;
  hue: number;
  layer: number; // 0..2 — parallax depth
  age: number;
  maxAge: number;
  idle: number;
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
    <div class="bg-vignette" aria-hidden="true"></div>
    <div class="bg-grid" aria-hidden="true"></div>
  `,
  styles: [
    `
      .bg-vignette {
        position: fixed;
        inset: 0;
        z-index: -8;
        pointer-events: none;
        background:
          radial-gradient(ellipse 60% 50% at 20% 0%, rgba(245, 158, 11, 0.08), transparent 70%),
          radial-gradient(ellipse 50% 40% at 90% 90%, rgba(210, 48, 69, 0.12), transparent 70%),
          radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, rgba(0, 0, 0, 0.6) 100%);
      }
      .bg-grid {
        position: fixed;
        inset: 0;
        z-index: -9;
        pointer-events: none;
        background-image:
          linear-gradient(to right, rgba(255, 255, 255, 0.022) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
        background-size: 80px 80px;
        mask-image: radial-gradient(ellipse at center, #000 30%, transparent 80%);
        -webkit-mask-image: radial-gradient(ellipse at center, #000 30%, transparent 80%);
      }
    `,
  ],
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
  private mouse = { x: 0, y: 0, active: false, sx: 0, sy: 0 };

  private lastTs = performance.now();

  constructor(private zone: NgZone) {}

  ngOnInit() {
    const c = this.canvasRef.nativeElement;
    this.ctx = c.getContext('2d', { alpha: true })!;

    this.onResize();
    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    window.addEventListener('scroll', this.onScroll, { passive: true });

    this.initStars();
    this.zone.runOutsideAngular(() => this.loop());
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize as any);
    window.removeEventListener('pointermove', this.onPointerMove as any);
    window.removeEventListener('pointerleave', this.onPointerLeave as any);
    window.removeEventListener('scroll', this.onScroll as any);
  }

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

  private scrollY = 0;
  private onScroll = () => {
    this.scrollY = window.scrollY;
  };

  private initStars() {
    const area = this.W * this.H;
    const density = this.reduceMotion() ? 0.00006 : 0.00016;
    const count = Math.max(140, Math.floor(area * density));

    this.stars.length = 0;
    for (let i = 0; i < count; i++) this.respawn(undefined, true);
  }

  private respawn(s?: Star, fresh = false) {
    const star: Star = s || ({} as Star);
    star.x = Math.random() * this.W;
    star.y = Math.random() * this.H;
    star.vx = (Math.random() - 0.5) * 0.6;
    star.vy = (Math.random() - 0.5) * 0.6;
    star.size = 0.6 + Math.random() * 1.8;
    star.tw = Math.random() * Math.PI * 2;
    star.hue = 0 + Math.random() * 20;
    star.layer = Math.floor(Math.random() * 3); // 0..2
    star.age = 0;
    const k = this.reduceMotion() ? 0.7 : 1;
    star.maxAge = (14 + Math.random() * 18) * k;
    star.idle = 0;

    if (!s) this.stars.push(star);
    return star;
  }

  private fieldAngle(x: number, y: number, t: number): number {
    const s = 0.0008;
    return Math.sin(x * s + t * 0.6) * 1.1 + Math.cos(y * s * 1.2 - t * 0.4);
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);

    const now = performance.now();
    const dt = Math.min(0.05, (now - this.lastTs) / 1000);
    this.lastTs = now;

    const ctx = this.ctx;
    const W = this.W,
      H = this.H;
    const t = now * 0.001;

    // smooth mouse for parallax
    this.mouse.sx += (this.mouse.x - this.mouse.sx) * 0.08;
    this.mouse.sy += (this.mouse.y - this.mouse.sy) * 0.08;

    // background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, 'rgba(10, 6, 8, 0.98)');
    bg.addColorStop(1, 'rgba(18, 10, 13, 0.98)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'lighter';

    const repelRadius = 140;
    const jitter = this.reduceMotion() ? 0.003 : 0.01;
    const friction = 0.991;
    const vmax = this.reduceMotion() ? 1.2 : 2;
    const speedFloor = 0.05;

    // parallax mouse offsets per layer
    const cx = W * 0.5,
      cy = H * 0.5;
    const mx = this.mouse.active ? (this.mouse.sx - cx) / cx : 0;
    const my = this.mouse.active ? (this.mouse.sy - cy) / cy : 0;
    const scrollOffset = this.scrollY * 0.04;

    // update + draw stars (with layer-based offsets)
    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];

      const ang = this.fieldAngle(s.x, s.y, t);
      s.vx += Math.cos(ang) * 0.018;
      s.vy += Math.sin(ang) * 0.018;

      s.vx += (Math.random() - 0.5) * jitter;
      s.vy += (Math.random() - 0.5) * jitter;

      if (this.mouse.active) {
        const dx = s.x - this.mouse.x;
        const dy = s.y - this.mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < repelRadius) {
          const f = (1 - d / repelRadius) * 0.85;
          s.vx += (dx / (d || 1)) * f * 0.8;
          s.vy += (dy / (d || 1)) * f * 0.8;
        }
      }

      s.vx *= friction;
      s.vy *= friction;
      const sp = Math.hypot(s.vx, s.vy);
      if (sp > vmax) {
        s.vx = (s.vx / sp) * vmax;
        s.vy = (s.vy / sp) * vmax;
      }
      s.x += s.vx;
      s.y += s.vy;

      if (s.x < -10) s.x = W + 10;
      if (s.x > W + 10) s.x = -10;
      if (s.y < -10) s.y = H + 10;
      if (s.y > H + 10) s.y = -10;

      s.age += dt;
      if (sp < speedFloor) s.idle += dt;
      else s.idle = 0;

      if (s.age > s.maxAge || s.idle > 2.0) {
        this.respawn(s);
        continue;
      }

      // parallax offset
      const depth = (s.layer + 1) * 6;
      const ox = mx * depth + 0;
      const oy = my * depth - scrollOffset * (s.layer + 1) * 0.5;
      const dx = s.x + ox;
      const dy = s.y + oy;

      const tw = Math.sin(t * 3.0 + s.tw) * 0.5 + 0.5;
      const alpha = (this.reduceMotion() ? 0.06 : 0.08) + tw * 0.32;
      const layerAlpha = 0.45 + s.layer * 0.27;

      ctx.beginPath();
      ctx.arc(dx, dy, s.size * (0.7 + tw * 0.9), 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, 82%, 62%, ${alpha * layerAlpha})`;
      ctx.fill();

      if (!this.reduceMotion() && s.size > 1.5) {
        ctx.beginPath();
        ctx.moveTo(dx - s.size * 2, dy);
        ctx.lineTo(dx + s.size * 2, dy);
        ctx.moveTo(dx, dy - s.size * 2);
        ctx.lineTo(dx, dy + s.size * 2);
        ctx.lineWidth = 0.7;
        ctx.strokeStyle = `hsla(${s.hue}, 90%, 65%, ${alpha * 0.4 * layerAlpha})`;
        ctx.stroke();
      }
    }

    // constellation lines (only near cursor)
    if (!this.reduceMotion() && this.mouse.active) {
      const linkR = 130;
      const linkR2 = linkR * linkR;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < this.stars.length; i++) {
        const a = this.stars[i];
        if (a.layer !== 2) continue;
        const dax = a.x - this.mouse.x;
        const day = a.y - this.mouse.y;
        if (dax * dax + day * day > linkR2 * 2) continue;
        for (let j = i + 1; j < this.stars.length; j++) {
          const b = this.stars[j];
          if (b.layer !== 2) continue;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < linkR2) {
            const dm =
              Math.hypot((a.x + b.x) / 2 - this.mouse.x, (a.y + b.y) / 2 - this.mouse.y);
            if (dm > 200) continue;
            const alpha = (1 - d2 / linkR2) * (1 - dm / 220) * 0.5;
            if (alpha <= 0) continue;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 85%, 65%, ${alpha})`;
            ctx.stroke();
          }
        }
      }
    }

    ctx.globalCompositeOperation = 'source-over';
  };
}
