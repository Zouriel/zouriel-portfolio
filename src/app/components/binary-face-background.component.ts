import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-binary-face-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas
      #canvas
      class="bfbg-canvas"
      [class.is-ready]="ready"
      aria-hidden="true"
    ></canvas>
  `,
  styles: [
    `
      :host { display: contents; }
      .bfbg-canvas {
        position: fixed;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 5;
        pointer-events: none;
        opacity: 0.55;
        mix-blend-mode: screen;
      }
    `,
  ],
})
export class BinaryFaceBackgroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ready = false;

  private destroyed = false;
  private rafId = 0;
  private disposers: Array<() => void> = [];

  constructor(private zone: NgZone) {}

  async ngAfterViewInit() {
    if (typeof window === 'undefined') return;
    console.log('[binary-face-bg] component mounted');

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
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isMobile = window.matchMedia('(max-width:760px)').matches;

    // Scroll keyframes: morphs left empty so the face stays at neutral bind-pose.
    // Only the head rotation varies with scroll progress (pitch / yaw / roll).
    const EXPR = [
      { name: 'NEUTRAL-1', w: {} as Record<string, number>, head: [0, 0, 0] },
      { name: 'NEUTRAL-2', w: {} as Record<string, number>, head: [0.05, 0.16, 0] },
      { name: 'NEUTRAL-3', w: {} as Record<string, number>, head: [0.12, -0.26, 0.06] },
      { name: 'NEUTRAL-4', w: {} as Record<string, number>, head: [-0.09, 0.08, 0] },
      { name: 'NEUTRAL-5', w: {} as Record<string, number>, head: [0.02, -0.14, -0.08] },
    ];

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    // r150+ uses outputColorSpace; older builds used outputEncoding. Set whichever exists.
    const anyRenderer = renderer as unknown as { outputColorSpace?: string; outputEncoding?: number };
    if ('outputColorSpace' in renderer) {
      anyRenderer.outputColorSpace = (THREE as any).SRGBColorSpace;
    } else {
      anyRenderer.outputEncoding = (THREE as any).sRGBEncoding;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 20);

    /* ---------- binary post-pass: redraw face as 0s and 1s ---------- */
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

    let CELL = isMobile ? 9 : 12;
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
        // portfolio-themed ramp: lifted rose -> vivid blood -> ember amber.
        // Brighter than the reference's slate/blue/amber so the face reads
        // clearly behind the dark portfolio bg.
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
        // bias the ramp toward the bright end — most of a lit face sits in the
        // mid-luminance band, so we want that mapped to vivid blood-red rather
        // than the deep dim color.
        '  vec3 col=mix(cDim,cMid,smoothstep(.04,.28,lum));' +
        '  col=mix(col,cBright,smoothstep(.32,.72,lum));' +
        '  float glow=smoothstep(.5,1.0,lum)*0.65;' +
        '  vec3 outc=col*(1.1+0.4*g)+glow*g;' +
        '  float vig=smoothstep(1.15,0.35,length(vUv-0.5));' +
        '  gl_FragColor=vec4(outc, g*vis*mix(0.82,1.0,vig));' +
        '}',
    });
    postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat));

    // lighting tuned for the brightness ramp (push lum higher across the face)
    const key = new THREE.DirectionalLight(0xffd9a6, 2.4); key.position.set(-1.2, 1.9, 1.4); scene.add(key);
    const fill = new THREE.DirectionalLight(0x9db4ff, 0.7); fill.position.set(1.6, 1.2, 0.9); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 1.6); rim.position.set(0.4, 1.8, -1.6); scene.add(rim);
    scene.add(new THREE.HemisphereLight(0x6a4a55, 0x14161c, 0.7));

    const morphMeshes: any[] = [];
    let headBone: any = null, neckBone: any = null, eyeL: any = null, eyeR: any = null;
    const headPos = new THREE.Vector3(0, 1.6, 0);

    // r128 ImageBitmapLoader path crashes on iOS Safari with GLB texture blobs.
    try { (self as any).createImageBitmap = undefined; } catch {}

    // Initial sizing so renderer has a viewport before model parse (resize() also
    // recomputes once the model is in scene).
    const initResize = () => {
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      const cx = Math.ceil(w / CELL), cy = Math.ceil(h / CELL);
      rt.setSize(cx, cy);
      postMat.uniforms['cells'].value.set(cx, cy);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    initResize();

    console.log('[binary-face-bg] fetching /face.glb');
    const buffer = await fetch('/face.glb').then((r) => {
      if (!r.ok) throw new Error('face.glb HTTP ' + r.status);
      return r.arrayBuffer();
    });
    console.log('[binary-face-bg] loaded', buffer.byteLength, 'bytes');
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
          console.log('[binary-face-bg] parsed model — head bone:', !!headBone, 'morph meshes:', morphMeshes.length);
          resolve();
        },
        (err: unknown) => reject(err),
      );
    }).catch((err) => {
      console.error('[binary-face-bg] model load failed', err);
      throw err;
    });

    if (this.destroyed) return;

    const camBase = new THREE.Vector3(0, 1.6, 0.6);
    const lookTarget = new THREE.Vector3(0, 1.6, 0);
    const frameCamera = () => {
      // Background framing: centered slightly above visual centre, a touch farther
      // back than the reference (face reads as ambient rather than dominant).
      const lookX = headPos.x;
      const lookY = isMobile ? headPos.y - 0.05 : headPos.y - 0.02;
      camBase.set(headPos.x, headPos.y + 0.04, headPos.z + (isMobile ? 0.85 : 0.78));
      lookTarget.set(lookX, lookY, headPos.z);
      camera.position.copy(camBase);
      camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z);
    };

    const resize = () => {
      isMobile = window.matchMedia('(max-width:760px)').matches;
      CELL = isMobile ? 9 : 12;
      const w = window.innerWidth, h = window.innerHeight;
      renderer.setSize(w, h, false);
      const cx = Math.ceil(w / CELL), cy = Math.ceil(h / CELL);
      rt.setSize(cx, cy);
      postMat.uniforms['cells'].value.set(cx, cy);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      frameCamera();
    };
    window.addEventListener('resize', resize);
    this.disposers.push(() => window.removeEventListener('resize', resize));
    resize();

    // animation state
    const current: Record<string, number> = {};
    const headCur = [0, 0, 0];
    let px = 0, py = 0;
    let pxT = 0, pyT = 0;
    let idleT = 0;
    let autoCur = 1; // smoothed autonomous-vs-cursor blend (1=auto, 0=cursor)
    let blink = 0, nextBlink = 1.6;
    let scrollT = 0, scrollTarget = 0;

    const onScroll = () => {
      const m = document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget = m > 0 ? window.scrollY / m : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    this.disposers.push(() => window.removeEventListener('scroll', onScroll));
    onScroll();

    if (!reduceMotion && !isMobile) {
      const onPointerMove = (e: PointerEvent) => {
        pxT = (e.clientX / window.innerWidth) * 2 - 1;
        pyT = (e.clientY / window.innerHeight) * 2 - 1;
        idleT = 0;
      };
      const onPointerLeave = () => { idleT = 99; };
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave, { passive: true });
      this.disposers.push(() => window.removeEventListener('pointermove', onPointerMove));
      this.disposers.push(() => window.removeEventListener('pointerleave', onPointerLeave));
    }

    // pause when tab hidden
    let paused = false;
    const onVisibility = () => { paused = document.hidden; };
    document.addEventListener('visibilitychange', onVisibility);
    this.disposers.push(() => document.removeEventListener('visibilitychange', onVisibility));

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const damp = (cur: number, tgt: number, rate: number, dt: number) =>
      lerp(cur, tgt, 1 - Math.exp(-rate * dt));

    const targetState = () => {
      const f = scrollT * (EXPR.length - 1);
      const i = Math.min(Math.floor(f), EXPR.length - 2);
      const t = smooth(Math.min(Math.max(f - i, 0), 1));
      const A = EXPR[i], B = EXPR[i + 1];
      const out: Record<string, number> = {};
      for (const k in A.w) out[k] = lerp(A.w[k], B.w[k] || 0, t);
      for (const k in B.w) if (!(k in out)) out[k] = lerp(0, B.w[k], t);
      const head = [
        lerp(A.head[0], B.head[0], t),
        lerp(A.head[1], B.head[1], t),
        lerp(A.head[2], B.head[2], t),
      ];
      return { w: out, head };
    };

    const clock = new THREE.Clock();
    const eu = new THREE.Euler();
    const q = new THREE.Quaternion();

    this.ready = true;
    // mark ready outside zone won't trigger CD; flip class manually
    canvas.classList.add('is-ready');

    const animate = () => {
      if (this.destroyed) return;
      this.rafId = requestAnimationFrame(animate);
      if (paused) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      scrollT = damp(scrollT, scrollTarget, 6, dt);

      idleT += dt;
      // smooth the autonomous-vs-cursor blend so the eyes don't snap when the
      // pointer enters/leaves; targets 0 while cursor is fresh, 1 once it's idle
      const autoTarget = Math.min(idleT / 2.4, 1);
      autoCur = damp(autoCur, autoTarget, 2.2, dt);
      const ax = Math.sin(t * 0.42) * 0.5 + Math.sin(t * 0.17) * 0.32;
      const ay = Math.cos(t * 0.31) * 0.42;
      const wantX = lerp(pxT, ax, autoCur);
      const wantY = lerp(pyT, ay, autoCur);
      px = damp(px, wantX, 4.2, dt);
      py = damp(py, wantY, 4.2, dt);

      const tgt = targetState();

      nextBlink -= dt;
      if (nextBlink <= 0) { blink = 1; nextBlink = 2.6 + Math.random() * 3.6; }
      if (blink > 0) blink = Math.max(0, blink - dt * 6.5);
      const blinkW = Math.sin(Math.min(blink, 1) * Math.PI);

      const keys: Record<string, true> = {};
      for (const k in tgt.w) keys[k] = true;
      for (const k in current) keys[k] = true;
      for (const k in keys) {
        let want = tgt.w[k] || 0;
        if (k === 'eyeBlinkLeft' || k === 'eyeBlinkRight') want = Math.max(want, blinkW);
        current[k] = damp(current[k] || 0, want, 10, dt);
        if (current[k] < 0.001) delete current[k];
      }
      morphMeshes.forEach((m) => {
        const d = m.morphTargetDictionary;
        const inf = m.morphTargetInfluences;
        for (const name in d) inf[d[name]] = current[name] || 0;
        if (blinkW > 0) {
          if ('eyeBlinkLeft' in d) inf[d.eyeBlinkLeft] = Math.max(inf[d.eyeBlinkLeft], blinkW);
          if ('eyeBlinkRight' in d) inf[d.eyeBlinkRight] = Math.max(inf[d.eyeBlinkRight], blinkW);
        }
      });

      const leanX = reduceMotion ? 0 : py * 0.035;
      const leanY = reduceMotion ? 0 : px * 0.09;
      const idleSway = reduceMotion ? 0 : Math.sin(t * 0.55) * 0.008;
      headCur[0] = damp(headCur[0], tgt.head[0] + leanX, 4.5, dt);
      headCur[1] = damp(headCur[1], tgt.head[1] + leanY, 4.5, dt);
      headCur[2] = damp(headCur[2], tgt.head[2] + idleSway, 4.5, dt);
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

      const ex = reduceMotion ? 0 : -py * 0.16;
      const ey = reduceMotion ? 0 : px * 0.26;
      [eyeL, eyeR].forEach((b) => {
        if (!b || !b.userData.q0) return;
        eu.set(ex, ey, 0);
        q.setFromEuler(eu);
        b.quaternion.copy(b.userData.q0).multiply(q);
      });

      if (!reduceMotion) {
        const cx = camBase.x + px * 0.03;
        const cy = camBase.y - py * 0.02;
        camera.position.x = damp(camera.position.x, cx, 3, dt);
        camera.position.y = damp(camera.position.y, cy, 3, dt);
        camera.lookAt(lookTarget.x, lookTarget.y, lookTarget.z);
      }

      postMat.uniforms['time'].value = t;
      renderer.setRenderTarget(rt);
      renderer.clear();
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(postScene, postCam);
    };
    animate();

    // dispose GL resources when destroyed
    this.disposers.push(() => {
      rt.dispose();
      postMat.dispose();
      renderer.dispose();
    });
  }
}
