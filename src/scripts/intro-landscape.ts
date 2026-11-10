export type LandscapePoint = {
  kind: 'ribbon' | 'tree' | 'mountain' | 'building';
  u: number; v: number; ribbon: number;
  localX: number; localY: number; localZ: number;
  size: number; alpha: number; distance: number; tone: number;
};

export function grainRandom(seed: number) {
  const n = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function noise(x: number, y: number) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const tx = x - ix, ty = y - iy;
  const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
  const a = grainRandom(ix * 29 + iy * 131);
  const b = grainRandom((ix + 1) * 29 + iy * 131);
  const c = grainRandom(ix * 29 + (iy + 1) * 131);
  const d = grainRandom((ix + 1) * 29 + (iy + 1) * 131);
  return (a + (b - a) * sx) * (1 - sy) + (c + (d - c) * sx) * sy;
}

function inkNoise(x: number, y: number) {
  return noise(x, y) * .65 + noise(x * 2.7 + 17, y * 2.7 - 9) * .35;
}

export function createLandscape(detail = 1): LandscapePoint[] {
  const points: LandscapePoint[] = [];
  let seed = 1867;
  const random = () => grainRandom(seed++);
  const gaussian = () => Math.sqrt(-2 * Math.log(Math.max(.00001, random()))) * Math.cos(random() * Math.PI * 2);
  const add = (kind: LandscapePoint['kind'], u: number, v: number, ribbon: number, x: number, y: number, z: number, distance: number, alpha: number, size = 1, tone = 0) => {
    points.push({ kind, u, v, ribbon, localX: x, localY: y, localZ: z, distance,
      tone, alpha: Math.min(kind === 'ribbon' ? .98 : .88, alpha),
      size: size * (.45 + random() * .65) * (.55 + distance * .45) });
  };

  // Correlated noise makes dense runs and pale pockets inside three ink sheets.
  // Gaussian halos give their edges a sprayed finish, extending past both sides.
  for (let ribbon = 0; ribbon < 3; ribbon++) {
    const distance = .32 + ribbon * .30;
    for (let i = 0; i < 14000 * detail; i++) {
      const u = random() * 2.82 - 1.41;
      const spread = .055 + .045 * (1 + Math.sin(u * 3.4 + ribbon)) / 2;
      const cross = gaussian() * spread;
      if (Math.abs(cross) > .27) continue;
      const patch = inkNoise(u * 7.5 + ribbon * 4, cross * 29 + ribbon * 3);
      const region = noise(u * 3.2 + ribbon * 11.8, ribbon * 4.7 + .5);
      const core = Math.exp(-Math.pow(cross / spread, 2) * .5);
      if (random() > (.035 + Math.pow(patch, 2) * 1.5) * core * (.2 + region * region * 1.4)) continue;
      const edge = .22 + .78 * core;
      const central = .68 + .32 * Math.exp(-u * u * 2.5);
      // Broad tonal runs distinguish the moving sheets from the fine landscape.
      // Independent grain noise leaves the building and mountain samples intact.
      const light = inkNoise(u * 4.5 + ribbon * 8, cross * 28 + 17);
      const tone = light < .34 ? 4 : light < .46 ? 3 : light < .58 ? 2 : 1;
      const grain = grainRandom(i * 1.73 + ribbon * 23000);
      const size = grain < .43 ? .38 : grain < .79 ? 1.25 : 3.4 + grain * .9;
      add('ribbon', u, (ribbon - 1) * .43 + cross, ribbon * 2,
        gaussian() * .004, 0, gaussian() * .006, distance,
        (.40 + patch * .75) * edge * central * (.8 + region * .4), size, tone);
      if (random() < .12) {
        add('ribbon', u, (ribbon - 1) * .43 + cross, ribbon * 2,
          gaussian() * .025, gaussian() * .035, gaussian() * .035,
          distance, .10 + random() * .13, .40, tone);
      }
    }
  }

  // Left: pale distant towers behind a darker continuous street wall.
  // Windows are negative-density patches rather than painted white tiles.
  for (let row = 0; row < 2; row++) {
    const count = row === 0 ? 23 : 15;
    const distance = row === 0 ? .18 : .85;
    for (let building = 0; building < count; building++) {
      const u = -1.20 + building / (count - 1) * .99;
      const breadth = row === 0 ? .070 + random() * .035 : .085 + random() * .045;
      const nearHeights = [.27,.42,.35,.52,.30,.56,.72,.38,1.02,.45,.66,.64,.51,.29,.40];
      const height = row === 0 ? .17 + random() * .29
        : nearHeights[building] + random() * .025;
      const v = row === 0 ? -.77 : -.30;
      const attempts = Math.round((row === 0 ? 600 : 2400) * detail * height / .5);
      const style = row === 1 && building === 11 ? 3 : building % 5;
      for (let i = 0; i < attempts; i++) {
        const z = random() * height;
        const t = z / height;
        const taper = style === 0 && t > .72 ? .62 : style === 2 ? 1 - t * .22 : 1;
        const x = (random() - .5) * breadth * taper + (style === 2 ? t * .018 : 0);
        const facadeX = (x / breadth + .5) * (row === 0 ? 5 : 4);
        const facadeZ = z / .037;
        const window = facadeX % 1 > .28 && facadeX % 1 < .69 && facadeZ % 1 > .25 && facadeZ % 1 < .65;
        const patch = inkNoise(x * 85 + building * 3.3, z * 16 + row * 9);
        const density = window ? .055 : .34 + patch * .62;
        if (random() > density) continue;
        add('building', u, v, 1, x + gaussian() * .0013, gaussian() * .002,
          z, distance, window ? .12 : (row === 0 ? .10 + patch * .18 : .44 + patch * .40),
          window ? .45 : .82);
      }
      for (let i = 0; i < 24 * detail; i++) {
        const side = random() < .5 ? -1 : 1;
        add('building', u, v, 1, side * breadth * .5 + gaussian() * .009, 0,
          random() * height, distance, .08 + random() * .13, .52);
      }
      const roofHeight = style === 1 || style === 4 ? .075 + random() * .055 : 0;
      if (roofHeight) {
        for (let i = 0; i < (row === 0 ? 260 : 650) * detail; i++) {
          const t = random();
          const x = (random() - .5) * breadth * (1 - t);
          const patch = inkNoise(x * 100 + building, t * 8);
          if (random() > .38 + patch * .55) continue;
          add('building', u, v, 1, x, 0, height + t * roofHeight, distance,
            row === 0 ? .14 + patch * .15 : .44 + patch * .38, .75);
        }
      }
      if (building % 3 === 0 || (row === 1 && building === 8)) {
        const antenna = row === 1 && building === 8 ? .17 : .055 + random() * .07;
        for (let i = 0; i < 130 * detail; i++) {
          add('building', u, v, 1, gaussian() * .001, 0,
            height + roofHeight + random() * antenna, distance, row === 0 ? .22 : .57, .56);
        }
      }
    }
  }

  // Right: a distant pale ridge and a darker, textured foothill layer.
  for (let layer = 0; layer < 2; layer++) {
    const distance = layer === 0 ? .15 : .56;
    const ridge = (x: number) => Math.max(
      .48 * Math.exp(-Math.pow((x + .19) / .21, 2)),
      .38 * Math.exp(-Math.pow((x - .18) / .18, 2)),
      .28 * Math.exp(-Math.pow((x - .45) / .24, 2))) * (layer === 0 ? 1 : .65);
    for (let i = 0; i < 6200 * detail; i++) {
      const x = random() * 1.16 - .49;
      const top = ridge(x) + noise(x * 23, layer * 11) * .018;
      const z = random() * top;
      const patch = inkNoise(x * 13 + layer * 5, z * 21);
      const upper = z / Math.max(top, .01);
      if (random() > .09 + patch * patch * .7 + (upper > .90 ? .10 : 0)) continue;
      add('mountain', .84, layer === 0 ? -.70 : -.16, 2,
        x, gaussian() * .006, z, distance,
        (layer === 0 ? .08 : .25) + patch * (layer === 0 ? .17 : .45), layer === 0 ? .69 : .95);
    }
    // Broken, softly sprayed ridge edges keep the pale mountains legible.
    for (let i = 0; i < (layer === 0 ? 1800 : 1000) * detail; i++) {
      const x = random() * 1.16 - .49;
      const patch = inkNoise(x * 17, layer * 9 + 31);
      if (random() > .18 + patch * .82) continue;
      add('mountain', .84, layer === 0 ? -.70 : -.16, 2,
        x + gaussian() * .003, 0, Math.max(0, ridge(x) + gaussian() * .007),
        distance, (layer === 0 ? .20 : .32) + patch * .22, .82);
    }
  }

  // Three distinct silhouettes: upright towers, tiered firs and full oak crowns.
  // Taller crown proportions compensate for the landscape's shallow projection.
  const trees = [
    {u:.43,v:-.40,scale:.62,distance:.22,form:'tower'},
    {u:.67,v:-.44,scale:.68,distance:.22,form:'oak'},
    {u:.93,v:-.38,scale:.64,distance:.24,form:'fir'},
    {u:.39,v:.34,scale:1.32,distance:.94,form:'oak'},
    {u:.65,v:.43,scale:1.36,distance:1,form:'fir'},
    {u:.87,v:.29,scale:1.20,distance:.93,form:'tower'},
    {u:1.06,v:.30,scale:1.15,distance:.95,form:'oak'},
  ];
  for (const {u, v, scale, distance, form} of trees) {
    const crownWidth = form === 'tower' ? .067 : form === 'fir' ? .105 : .13;
    const crownHeight = form === 'tower' ? .22 : form === 'fir' ? .28 : .25;
    const crownCenter = form === 'oak' ? .40 : form === 'fir' ? .37 : .34;
    const trunkHeight = form === 'oak' ? .31 : .49;
    for (let i = 0; i < 170 * detail; i++) {
      const t = random();
      const branch = i % 4;
      const split = Math.max(0, t - .47);
      const x = (branch - 1.5) * split * (form === 'oak' ? .10 : .025) * scale + gaussian() * .0025;
      add('tree', u, v, 4, x, gaussian() * .002, t * trunkHeight * scale,
        distance, .27 + distance * .44, .63);
    }
    const crownSamples = 1450 * detail * scale * scale * crownWidth * crownHeight / (.105 * .078);
    for (let i = 0; i < crownSamples; i++) {
      const x = (random() * 2 - 1) * crownWidth * scale;
      const z = (random() * 2 - 1) * crownHeight * scale;
      const radius = x * x / Math.pow(crownWidth * scale, 2) + z * z / Math.pow(crownHeight * scale, 2);
      const patch = inkNoise(x * 70 + u * 19, z * 95 + v * 23);
      const t = (z / (crownHeight * scale) + 1) / 2;
      const normalizedX = Math.abs(x) / (crownWidth * scale);
      const firWidth = (1 - t) * (.72 + .28 * (.5 + .5 * Math.cos(t * Math.PI * 10)));
      const towerWidth = Math.pow(Math.sin(t * Math.PI), .6) * (.7 + .3 * t);
      const angle = Math.atan2(z / crownHeight, x / crownWidth);
      const edge = form === 'fir' ? firWidth - normalizedX + (patch - .5) * .12
        : form === 'tower' ? towerWidth - normalizedX + (patch - .5) * .12
        : 1 - radius + (patch - .5) * .35 + Math.sin(angle * 5 + u * 5) * .15 + Math.sin(angle * 9 + v) * .07;
      if (edge < 0 || random() > .11 + patch * .83) continue;
      add('tree', u, v, 4, x, gaussian() * .018,
        (crownCenter * scale) + z, distance, .16 + distance * .44 + patch * .17, .83);
    }
  }
  return points;
}

export function projectLandscape(point: LandscapePoint, time: number) {
  const { u, v, ribbon } = point;
  const x = u * 1.35 + point.localX;
  const sweep = Math.sin(u * 2.8);
  const ripple = Math.sin(u * 5.4 + ribbon * .16);
  const lift = Math.sin(u * 3.7 - ribbon * .43);
  const fold = Math.sin(u * 6.4 + ribbon * .25);
  let y = v + .20 * sweep + .055 * ripple + point.localY;
  let z = .15 * lift + .055 * fold + point.localZ;

  // Only the ribbons move; buildings, trees and ridges use fixed positions.
  if (point.kind === 'ribbon') {
    const motionGain = 2.5;
    y += motionGain * (.20 * (Math.sin(u * 2.8 + time * .45) - sweep)
      + .055 * (Math.sin(u * 5.4 + ribbon * .16 - time * .3) - ripple));
    z += motionGain * (.15 * (Math.sin(u * 3.7 - ribbon * .43 + time) - lift)
      + .055 * (Math.sin(u * 6.4 + ribbon * .25 - time * .7) - fold));
  }
  return { x: x * .93 + y * .27, y: y * .54 - z * .95 - u * .055 };
}

