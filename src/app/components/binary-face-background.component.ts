import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';

/**
 * `app-binary-face` — the signature head, rendered as a field of flickering
 * 0/1 glyphs (Three.js + a binary post-pass). The original ember-on-dark look,
 * mounted as an interactive hero element sitting on a dark hero panel.
 *
 * - Sizes to its host box (ResizeObserver).
 * - Looks toward the pointer on desktop / the touch point on mobile.
 * - An IntersectionObserver releases it to a calm idle and pauses the render
 *   loop once the hero scrolls out of view.
 */
@Component({
  selector: 'app-binary-face',
  standalone: true,
  template: `
    <canvas #canvas class="bfbg-canvas" [class.is-ready]="ready" aria-hidden="true"></canvas>
  `,
  styles: [
    `
      :host { display: block; position: relative; width: 100%; height: 100%; }
      .bfbg-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        mix-blend-mode: screen;
        opacity: 0;
        transform: scale(1.06);
        transition:
          opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1),
          transform 1.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .bfbg-canvas.is-ready { opacity: var(--bf-opacity, 0.95); transform: scale(1); }

      @media (prefers-reduced-motion: reduce) {
        .bfbg-canvas { transition: opacity 0.4s ease; transform: none; }
      }
    `,
  ],
})
export class BinaryFaceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ready = false;

  private destroyed = false;
  private rafId = 0;
  private disposers: Array<() => void> = [];

  constructor(private zone: NgZone) {}

  async ngAfterViewInit() {
    if (typeof window === 'undefined') return;

    const THREE = await import('three');
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    if (this.destroyed) return;

    this.zone.runOutsideAngular(() => this.setup(THREE, GLTFLoader));
  }

  ngOnDestroy() {
    this.destroyed = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.disposers.forEach((d) => {
      try { d(); } catch {}
    });
  }

  private async setup(
    THREE: typeof import('three'),
    GLTFLoaderCtor: typeof import('three/examples/jsm/loaders/GLTFLoader.js').GLTFLoader,
  ) {
    const canvas = this.canvasRef.nativeElement;
    const host = canvas.parentElement as HTMLElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isMobile = window.matchMedia('(max-width:760px)').matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    const anyRenderer = renderer as unknown as { outputColorSpace?: string; outputEncoding?: number };
    if ('outputColorSpace' in renderer) {
      anyRenderer.outputColorSpace = (THREE as any).SRGBColorSpace;
    } else {
      anyRenderer.outputEncoding = (THREE as any).sRGBEncoding;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 20);

    /* ---------- binary post-pass: redraw face as 0s and 1s (original look) ---------- */
    const makeGlyphAtlas = () => {
      const s = 64;
      const c = document.createElement('canvas');
      c.width = s * 2; c.height = s;
      const x = c.getContext('2d')!;
      x.fillStyle = '#000'; x.fillRect(0, 0, s * 2, s);
      x.fillStyle = '#fff';
      x.font = '700 ' + Math.round(s * 0.84) + 'px ui-monospace,Menlo,Consolas,monospace';
      x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText('0', s * 0.5, s * 0.56);
      x.fillText('1', s * 1.5, s * 0.56);
      const t = new THREE.CanvasTexture(c);
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      return t;
    };

    let CELL = isMobile ? 8 : 7;
    const rt = new THREE.WebGLRenderTarget(2, 2);
    const postScene = new THREE.Scene();
    const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const postMat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        tScene: { value: rt.texture },
        tGlyph: { value: makeGlyphAtlas() },
        cells: { value: new THREE.Vector2(1, 1) },
        time: { value: 0 },
        cDim: { value: new THREE.Color('#5a2832') },
        cMid: { value: new THREE.Color('#e63946') },
        cBright: { value: new THREE.Color('#fbbf24') },
      },
      vertexShader:
        'varying vec2 vUv;' +
        'void main(){ vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }',
      fragmentShader:
        'precision highp float;' +
        'varying vec2 vUv;' +
        'uniform sampler2D tScene,tGlyph;' +
        'uniform vec2 cells; uniform float time;' +
        'uniform vec3 cDim,cMid,cBright;' +
        'float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }' +
        'void main(){' +
        '  vec2 cell=floor(vUv*cells);' +
        '  vec2 cuv=fract(vUv*cells);' +
        '  vec4 scn=texture2D(tScene,(cell+.5)/cells);' +
        '  float lum=dot(scn.rgb,vec3(.299,.587,.114));' +
        '  float vis=smoothstep(.02,.10,lum*scn.a);' +
        '  if(vis<.01){ discard; }' +
        '  float h=hash(cell);' +
        '  float phase=floor(time*0.9 + h*9.0);' +
        '  float flick=step(.86, hash(cell+vec2(phase,7.0)));' +
        '  float which=mod(step(.5,h)+flick,2.);' +
        '  vec2 guv=vec2((cuv.x+which)*.5,cuv.y);' +
        '  float g=texture2D(tGlyph,guv).r;' +
        '  vec3 col=mix(cDim,cMid,smoothstep(.04,.28,lum));' +
        '  col=mix(col,cBright,smoothstep(.32,.72,lum));' +
        '  float glow=smoothstep(.5,1.0,lum)*0.65;' +
        '  vec3 outc=col*(1.1+0.4*g)+glow*g;' +
        '  float vig=smoothstep(1.15,0.35,length(vUv-0.5));' +
        '  gl_FragColor=vec4(outc, g*vis*mix(0.82,1.0,vig));' +
        '}',
    });
    postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat));

    // original lighting tuned for the brightness ramp
    const key = new THREE.DirectionalLight(0xffd9a6, 2.4); key.position.set(-1.2, 1.9, 1.4); scene.add(key);
    const fill = new THREE.DirectionalLight(0x9db4ff, 0.7); fill.position.set(1.6, 1.2, 0.9); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 1.6); rim.position.set(0.4, 1.8, -1.6); scene.add(rim);
    scene.add(new THREE.HemisphereLight(0x6a4a55, 0x14161c, 0.7));

    const morphMeshes: any[] = [];
    let headBone: any = null, neckBone: any = null, eyeL: any = null, eyeR: any = null;
    const headPos = new THREE.Vector3(0, 1.6, 0);

    // r128 ImageBitmapLoader path crashes on iOS Safari with GLB texture blobs.
    try { (self as any).createImageBitmap = undefined; } catch {}

    /* ---------- host-relative sizing ---------- */
    const hostSize = () => {
      const r = host.getBoundingClientRect();
      return { w: Math.max(1, Math.round(r.width)), h: Math.max(1, Math.round(r.height)) };
    };
    const applySize = () => {
      isMobile = window.matchMedia('(max-width:760px)').matches;
      CELL = isMobile ? 8 : 7;
      const { w, h } = hostSize();
      renderer.setSize(w, h, false);
      const cx = Math.ceil(w / CELL), cy = Math.ceil(h / CELL);
      rt.setSize(cx, cy);
      postMat.uniforms['cells'].value.set(cx, cy);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    applySize();

    const buffer = await fetch('/face.glb').then((r) => {
      if (!r.ok) throw new Error('face.glb HTTP ' + r.status);
      return r.arrayBuffer();
    });
    if (this.destroyed) return;

    await new Promise<void>((resolve, reject) => {
      new GLTFLoaderCtor().parse(
        buffer,
        '',
        (gltf: any) => {
          const root = gltf.scene;
          scene.add(root);
          root.traverse((o: any) => {
            if (o.isMesh) o.frustumCulled = false;
            if (o.morphTargetDictionary) morphMeshes.push(o);
            if (o.name === 'Head') headBone = o;
            if (o.name === 'Neck') neckBone = o;
            if (o.name === 'LeftEye') eyeL = o;
            if (o.name === 'RightEye') eyeR = o;
          });
          [headBone, neckBone, eyeL, eyeR].forEach((b) => {
            if (b) b.userData.q0 = b.quaternion.clone();
          });
          if (headBone) {
            root.updateMatrixWorld(true);
            headBone.getWorldPosition(headPos);
          }
          resolve();
        },
        (err: unknown) => reject(err),
      );
    }).catch((err) => {
      console.error('[binary-face] model load failed', err);
      throw err;
    });

    if (this.destroyed) return;

    /* ---------- camera framing ---------- */
    const camBase = new THREE.Vector3(0, 1.6, 0.6);
    const lookTarget = new THREE.Vector3(0, 1.6, 0);
    const frameCamera = () => {
      const dist = isMobile ? 1.02 : 0.76;
      camBase.set(headPos.x, headPos.y + 0.06, headPos.z + dist);
      lookTarget.set(headPos.x, headPos.y + 0.02, headPos.z);
      camera.position.copy(camBase);
      camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z);
    };

    const resize = () => { applySize(); frameCamera(); };
    const ro = new ResizeObserver(() => resize());
    ro.observe(host);
    this.disposers.push(() => ro.disconnect());
    window.addEventListener('resize', resize);
    this.disposers.push(() => window.removeEventListener('resize', resize));
    resize();

    /* ---------- interaction: look toward pointer / touch, gated by visibility ---------- */
    let lxT = 0, lyT = 0;
    let lx = 0, ly = 0;
    let idleT = 5;
    let followRate = 5;
    let visible = true;

    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));
    const aim = (clientX: number, clientY: number, snappy: boolean) => {
      if (!visible) return;
      const r = canvas.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height * 0.42;
      lxT = clamp((clientX - cx) / (r.width * 0.55), 1.4);
      lyT = clamp((clientY - cy) / (r.height * 0.55), 1.4);
      idleT = 0;
      followRate = snappy ? 13 : 5.5;
    };

    if (!reduceMotion) {
      const onPointerMove = (e: PointerEvent) => aim(e.clientX, e.clientY, e.pointerType === 'touch');
      const onPointerDown = (e: PointerEvent) => aim(e.clientX, e.clientY, e.pointerType === 'touch');
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerdown', onPointerDown, { passive: true });
      this.disposers.push(() => window.removeEventListener('pointermove', onPointerMove));
      this.disposers.push(() => window.removeEventListener('pointerdown', onPointerDown));
    }

    let paused = false;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible && !paused && !this.rafId) animate();
      },
      { threshold: 0.05 },
    );
    io.observe(host);
    this.disposers.push(() => io.disconnect());

    const onVisibility = () => { paused = document.hidden; if (!paused && visible && !this.rafId) animate(); };
    document.addEventListener('visibilitychange', onVisibility);
    this.disposers.push(() => document.removeEventListener('visibilitychange', onVisibility));

    /* ---------- animation ---------- */
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const damp = (cur: number, tgt: number, rate: number, dt: number) =>
      lerp(cur, tgt, 1 - Math.exp(-rate * dt));

    const headCur = [0, 0, 0];
    let blink = 0, nextBlink = 1.6;
    let saccade = 0, nextSaccade = 2.2;
    let sacX = 0, sacY = 0;
    const clock = new THREE.Clock();
    const eu = new THREE.Euler();
    const q = new THREE.Quaternion();

    this.ready = true;
    canvas.classList.add('is-ready');

    const animate = () => {
      if (this.destroyed) return;
      if (paused || !visible) { this.rafId = 0; return; }
      this.rafId = requestAnimationFrame(animate);

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      idleT += dt;
      const auto = Math.min(idleT / 2.4, 1);

      nextSaccade -= dt;
      if (nextSaccade <= 0) {
        sacX = (Math.random() * 2 - 1) * 0.5;
        sacY = (Math.random() * 2 - 1) * 0.3;
        saccade = 1;
        nextSaccade = 2.4 + Math.random() * 3.2;
      }
      saccade = Math.max(0, saccade - dt * 1.6);
      const ax = Math.sin(t * 0.4) * 0.3 + Math.sin(t * 0.16 + 1.3) * 0.18 + sacX * saccade * 0.7;
      const ay = Math.cos(t * 0.29) * 0.22 + sacY * saccade * 0.7;

      const wantX = lerp(lxT, ax, auto);
      const wantY = lerp(lyT, ay, auto);
      lx = damp(lx, wantX, followRate, dt);
      ly = damp(ly, wantY, followRate, dt);

      nextBlink -= dt;
      if (nextBlink <= 0) { blink = 1; nextBlink = 2.6 + Math.random() * 3.6; }
      if (blink > 0) blink = Math.max(0, blink - dt * 6.5);
      const blinkW = Math.sin(Math.min(blink, 1) * Math.PI);

      morphMeshes.forEach((m) => {
        const d = m.morphTargetDictionary;
        const inf = m.morphTargetInfluences;
        for (const name in d) inf[d[name]] = 0;
        if (blinkW > 0) {
          if ('eyeBlinkLeft' in d) inf[d.eyeBlinkLeft] = blinkW;
          if ('eyeBlinkRight' in d) inf[d.eyeBlinkRight] = blinkW;
        }
      });

      const sway = Math.sin(t * 0.5) * 0.01;
      const nod = Math.sin(t * 0.7 + 0.6) * 0.006;
      headCur[0] = damp(headCur[0], ly * 0.16 + nod, 4.5, dt);
      headCur[1] = damp(headCur[1], lx * 0.26 + sway, 4.5, dt);
      headCur[2] = damp(headCur[2], lx * 0.05, 4.5, dt);
      if (headBone) {
        eu.set(headCur[0] * 0.7, headCur[1] * 0.7, headCur[2]);
        q.setFromEuler(eu);
        headBone.quaternion.copy(headBone.userData.q0).multiply(q);
      }
      if (neckBone) {
        eu.set(headCur[0] * 0.3, headCur[1] * 0.3, headCur[2] * 0.4);
        q.setFromEuler(eu);
        neckBone.quaternion.copy(neckBone.userData.q0).multiply(q);
      }

      const ex = -ly * 0.2;
      const ey = lx * 0.32;
      [eyeL, eyeR].forEach((b) => {
        if (!b || !b.userData.q0) return;
        eu.set(ex, ey, 0);
        q.setFromEuler(eu);
        b.quaternion.copy(b.userData.q0).multiply(q);
      });

      const cx = camBase.x + lx * 0.04;
      const cy = camBase.y - ly * 0.03;
      camera.position.x = damp(camera.position.x, cx, 3, dt);
      camera.position.y = damp(camera.position.y, cy, 3, dt);
      camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z);

      postMat.uniforms['time'].value = t;
      renderer.setRenderTarget(rt);
      renderer.clear();
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(postScene, postCam);
    };
    clock.start();
    animate();

    this.disposers.push(() => {
      rt.dispose();
      postMat.dispose();
      renderer.dispose();
    });
  }
}
