import { createLandscape, projectLandscape, grainRandom, type LandscapePoint } from './intro-landscape';

type Phase = 'scattered' | 'assembling' | 'ready' | 'leaving';
type InkParticle = LandscapePoint & {
  depth: number;
  x: number; y: number; drawSize: number; drawAlpha: number; drawTone: number;
  startX: number; startY: number; startSize: number; startAlpha: number;
  targetX: number; targetY: number; targetSize: number; targetAlpha: number;
};

export function setupIntro() {
  const root = document.documentElement;
  const releaseBoot = () => root.removeAttribute('data-intro-boot');
  const dialog = document.querySelector<HTMLDialogElement>('[data-intro-splash]');
  const canvas = dialog?.querySelector<HTMLCanvasElement>('[data-intro-canvas]');
  const stage = dialog?.querySelector<HTMLButtonElement>('[data-intro-stage]');
  const skip = dialog?.querySelector<HTMLButtonElement>('[data-intro-skip]');
  const instruction = dialog?.querySelector<HTMLElement>('[data-intro-instruction]');
  const sequence = dialog?.querySelector<HTMLElement>('[data-intro-sequence]');
  const status = dialog?.querySelector<HTMLElement>('[data-intro-status]');
  const replay = document.querySelector<HTMLButtonElement>('[data-intro-replay]');
  const context = canvas?.getContext('2d');
  if (!dialog || !canvas || !stage || !skip || !instruction || !sequence || !status || !context || !dialog.showModal) {
    releaseBoot();
    return;
  }

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const seenKey = 'ai4la-intro-seen-v1';
  let phase: Phase = 'scattered';
  let frame = 0;
  let closeTimer = 0;
  let width = 0;
  let height = 0;
  let unit = 0;
  let terrainScaleX = 1;
  let terrainScaleY = 1;
  let terrainOffsetX = 0;
  let terrainOffsetY = 0;
  let grainSize = 1;
  let ambientStartedAt = 0;
  let startedAt = 0;
  let readyAt = 0;
  let lastWheel = 0;
  let lastPaint = 0;
  let touchY = 0;
  let returnFocus: HTMLElement | null = null;
  let particles: InkParticle[] = [];
  const inkPalette = ['#111111', '#050505', '#696969', '#bcbcbc', '#ffffff'];
  const grainRadii = [.18, .27, .41, .61, .92, 1.38, 2.07, 3.1];
  const alphaLevels = 8;
  const bucketsPerTone = alphaLevels * grainRadii.length;
  const inkBuckets: InkParticle[][] = Array.from({ length: inkPalette.length * bucketsPerTone }, () => []);

  // Sample a system font once: the logo stays crisp without a font or 3D download.
  const stencil = document.createElement('canvas');
  const ink = stencil.getContext('2d');
  if (!ink) { releaseBoot(); return; }
  const logoFont = `900 200px ${getComputedStyle(dialog).fontFamily}`;
  ink.font = logoFont;
  stencil.width = Math.ceil(ink.measureText('AI4LA').width) + 12;
  stencil.height = 220;
  ink.font = logoFont;
  ink.textBaseline = 'top';
  ink.fillText('AI4LA', 0, 0);
  const pixels = ink.getImageData(0, 0, stencil.width, stencil.height).data;
  const points: { x: number; y: number }[] = [];
  for (let y = 0; y < stencil.height; y += 3) {
    for (let x = 0; x < stencil.width; x += 3) {
      if (pixels[(y * stencil.width + x) * 4 + 3] > 150) points.push({ x: x / 3, y: y / 3 });
    }
  }
  if (!points.length) { releaseBoot(); return; }
  const minX = Math.min(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y));
  const columns = Math.max(...points.map((p) => p.x)) - minX + 1;
  const rows = Math.max(...points.map((p) => p.y)) - minY + 1;
  const setPhase = (next: Phase) => {
    phase = next;
    dialog.dataset.phase = next;
  };

  const layout = () => {
    width = dialog.clientWidth;
    height = dialog.clientHeight;
    if (!width || !height) return;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const mobile = width <= 650;
    const logoWidth = Math.min(width * (mobile ? .83 : .59), 880, height * (mobile ? 1.2 : 1.65));
    unit = logoWidth / columns;
    const groupWidth = logoWidth + (mobile ? 0 : 225);
    const left = (width - groupWidth) / 2;
    const top = height * (mobile ? .44 : .49) - rows * unit / 2;
    dialog.style.setProperty('--explore-x', `${mobile ? width / 2 : left + logoWidth + 48}px`);
    dialog.style.setProperty('--explore-y', `${mobile ? top + rows * unit + 58 : top + rows * unit / 2}px`);
    const landscape = createLandscape(Math.max(.48, Math.min(1.4, width / 1280)));
    particles = landscape.map((sample, index) => {
      // Jitter within each sampled letter cell preserves the fine grain in the word.
      const point = points[index % points.length];
      const particle: InkParticle = {
        ...sample,
        depth: (sample.u + 1.35) / 2.7 * .7 + sample.ribbon / 5 * .3,
        x: 0, y: 0, drawSize: 0, drawAlpha: sample.alpha, drawTone: sample.tone,
        startX: 0, startY: 0, startSize: 0, startAlpha: sample.alpha,
        targetX: left + (point.x - minX + (grainRandom(index + 17) - .5) * .85) * unit,
        targetY: top + (point.y - minY + (grainRandom(index + 91) - .5) * .85) * unit,
        targetSize: Math.min(1.05, unit * (.14 + grainRandom(index + 57) * .08)),
        targetAlpha: .52 + grainRandom(index + 47) * .28,
      };
      return particle;
    });
    // Vertical fitting includes the skyline. Horizontal overscan is independent:
    // a short or narrow viewport must never add blank margins beside the ribbons.
    let yMin = Infinity, yMax = -Infinity;
    for (const time of [0, 1.6, 3.2, 4.8, 6.4, 8, 9.6, 11.2, 12.8]) {
      for (const voxel of particles) {
        const point = projectLandscape(voxel, time);
        yMin = Math.min(yMin, point.y); yMax = Math.max(yMax, point.y);
      }
    }
    terrainScaleX = width / 2.45;
    terrainScaleY = Math.min(height * .65 / (yMax - yMin), width * .75);
    terrainOffsetX = width * .5;
    terrainOffsetY = height * .5 - (yMin + yMax) / 2 * terrainScaleY;
    grainSize = Math.max(.8, Math.min(1.25, width / 1100));
    if (phase === 'assembling') startedAt = performance.now();
  };

  const scatter = (voxel: InkParticle, now: number) => {
    const time = (now - ambientStartedAt) * .00014;
    const point = projectLandscape(voxel, time);
    voxel.x = terrainOffsetX + point.x * terrainScaleX;
    voxel.y = terrainOffsetY + point.y * terrainScaleY;
    const breath = voxel.kind === 'ribbon' ? Math.sin(time * 1.9 + voxel.u * 4 + voxel.ribbon) : 0;
    voxel.drawSize = grainSize * voxel.size * (1 + breath * .22);
    voxel.drawAlpha = voxel.alpha * (1 + breath * .12);
    voxel.drawTone = voxel.tone;
  };

  // Paint the tonal ribbons first, then the fine landscape on top so pale
  // ribbon highlights cannot erase the foreground crowns and facades.
  const drawGrains = () => {
    for (const bucket of inkBuckets) bucket.length = 0;
    for (const particle of particles) {
      if (particle.x < -4 || particle.x > width + 4 || particle.y < -4 || particle.y > height + 4) continue;
      const ink = Math.max(0, Math.min(alphaLevels - 1, Math.round(particle.drawAlpha * alphaLevels) - 1));
      const radius = Math.max(0, Math.min(grainRadii.length - 1, Math.round(Math.log2(Math.max(.18, particle.drawSize) / .18) * 1.7)));
      inkBuckets[particle.drawTone * bucketsPerTone + ink * grainRadii.length + radius].push(particle);
    }
    for (const tone of [1, 2, 3, 4, 0]) {
      context.fillStyle = inkPalette[tone];
      for (let index = 0; index < bucketsPerTone; index++) {
        const bucket = inkBuckets[tone * bucketsPerTone + index];
        if (!bucket.length) continue;
        context.globalAlpha = (Math.floor(index / grainRadii.length) + 1) / alphaLevels;
        const radius = grainRadii[index % grainRadii.length];
        context.beginPath();
        for (const particle of bucket) {
          context.moveTo(particle.x + radius, particle.y);
          context.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        }
        context.fill();
      }
    }
    context.globalAlpha = 1;
  };

  const markReady = (now: number) => {
    setPhase('ready');
    readyAt = now;
    stage.setAttribute('aria-label', 'AI4LA. Click to explore the articles.');
    instruction.textContent = 'A new perspective on landscape';
    sequence.textContent = '02 / 02';
    status.textContent = 'AI4LA assembled. Click to explore, scroll again, or press Enter.';
  };

  const paint = (now: number) => {
    if (!dialog.open || phase === 'leaving') return;
    // The terrain only needs 30 fps; assembly uses the display refresh rate.
    if (phase === 'scattered' && now - lastPaint < 30) {
      frame = requestAnimationFrame(paint);
      return;
    }
    lastPaint = now;
    context.clearRect(0, 0, width, height);
    const elapsed = now - startedAt;
    if (phase === 'scattered') {
      for (const voxel of particles) scatter(voxel, now);
    }
    for (const voxel of particles) {
      let progress = phase === 'ready' ? 1 : 0;
      if (phase === 'assembling') {
        const delay = voxel.depth * 110;
        const t = Math.max(0, Math.min(1, (elapsed - delay) / 740));
        progress = 1 - Math.pow(1 - t, 4);
        const arc = Math.sin(t * Math.PI) * (1 - t);
        voxel.x = voxel.startX + (voxel.targetX - voxel.startX) * progress + voxel.v * 75 * arc;
        voxel.y = voxel.startY + (voxel.targetY - voxel.startY) * progress - voxel.u * 65 * arc;
        voxel.drawSize = voxel.startSize * (1 - progress) + voxel.targetSize * progress;
        voxel.drawAlpha = voxel.startAlpha * (1 - progress) + voxel.targetAlpha * progress;
        voxel.drawTone = Math.round(voxel.tone * (1 - progress));
      } else if (phase === 'ready') {
        voxel.x = voxel.targetX; voxel.y = voxel.targetY;
        voxel.drawSize = voxel.targetSize; voxel.drawAlpha = voxel.targetAlpha;
        voxel.drawTone = 0;
      }
    }
    drawGrains();
    if (phase === 'assembling' && elapsed >= 870) markReady(now);
    if (phase !== 'ready') frame = requestAnimationFrame(paint);
  };

  const finish = (immediate = false) => {
    if (!dialog.open || (phase === 'leaving' && !immediate)) return;
    setPhase('leaving');
    cancelAnimationFrame(frame);
    try { sessionStorage.setItem(seenKey, '1'); } catch { /* Storage may be unavailable in private browsing. */ }
    const close = () => {
      dialog.close();
      document.documentElement.classList.remove('intro-is-open');
      if (returnFocus) returnFocus.focus({ preventScroll: true });
      else document.querySelector<HTMLAnchorElement>('.brand')?.focus({ preventScroll: true });
    };
    if (immediate || reducedMotion.matches) close();
    else closeTimer = window.setTimeout(close, 270);
  };

  const activate = () => {
    if (phase === 'scattered') {
      for (const voxel of particles) {
        scatter(voxel, performance.now());
        voxel.startX = voxel.x; voxel.startY = voxel.y;
        voxel.startSize = voxel.drawSize;
        voxel.startAlpha = voxel.drawAlpha;
      }
      startedAt = performance.now();
      setPhase('assembling');
      stage.setAttribute('aria-label', 'Assembling AI4LA.');
      instruction.textContent = 'Bringing ideas together.';
      status.textContent = 'Assembling AI4LA.';
    } else if (phase === 'ready') finish();
  };

  const open = (isReplay = false) => {
    clearTimeout(closeTimer);
    cancelAnimationFrame(frame);
    returnFocus = isReplay ? replay : null;
    setPhase(reducedMotion.matches ? 'ready' : 'scattered');
    stage.setAttribute('aria-label', 'Assemble AI4LA. Click, scroll, or press Enter.');
    instruction.textContent = 'Click anywhere or scroll to assemble';
    sequence.textContent = '01 / 02';
    status.textContent = '';
    lastWheel = 0;
    ambientStartedAt = performance.now();
    document.documentElement.classList.add('intro-is-open');
    dialog.showModal();
    stage.focus({ preventScroll: true });
    layout();
    if (reducedMotion.matches) markReady(performance.now());
    // Draw the first scene synchronously before releasing the first-paint gate.
    paint(performance.now());
    releaseBoot();
  };

  stage.addEventListener('click', activate);
  skip.addEventListener('click', () => finish());
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); finish(); });
  dialog.addEventListener('wheel', (event) => {
    event.preventDefault();
    if (Math.abs(event.deltaY) < 3) return;
    const now = performance.now();
    // A single trackpad gesture should assemble the logo, then let it be read.
    if (phase === 'scattered' || (phase === 'ready' && now - lastWheel > 220 && now - readyAt > 350)) activate();
    lastWheel = now;
  }, { passive: false });
  stage.addEventListener('touchstart', (event) => { touchY = event.touches[0].clientY; }, { passive: true });
  stage.addEventListener('touchend', (event) => {
    if (Math.abs(event.changedTouches[0].clientY - touchY) > 24) { event.preventDefault(); activate(); }
  }, { passive: false });
  const observer = new ResizeObserver(() => {
    if (!dialog.open || phase === 'leaving') return;
    if (width === dialog.clientWidth && height === dialog.clientHeight) return;
    cancelAnimationFrame(frame);
    const wasAssembling = phase === 'assembling';
    if (wasAssembling) markReady(performance.now());
    layout();
    frame = requestAnimationFrame(paint);
  });
  observer.observe(dialog);
  document.addEventListener('visibilitychange', () => {
    cancelAnimationFrame(frame);
    if (!document.hidden && dialog.open && phase !== 'leaving') frame = requestAnimationFrame(paint);
  });
  window.addEventListener('pagehide', () => {
    cancelAnimationFrame(frame);
    clearTimeout(closeTimer);
    if (dialog.open) finish(true);
  });
  replay?.addEventListener('click', () => open(true));
  if (replay) replay.hidden = false;

  let seen = false;
  try { seen = sessionStorage.getItem(seenKey) === '1'; } catch { /* Show the intro without requiring storage. */ }
  // Deep links go directly to the requested section. Browsing back never adds a gate.
  const bootSkipped = root.dataset.introBoot === 'skipped' || root.dataset.introBoot === 'expired';
  if (!seen && !location.hash && !bootSkipped) open();
  releaseBoot();
}
