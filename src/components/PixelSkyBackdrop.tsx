import { useEffect, useRef } from 'react';
import { usePlatform } from '../context/PlatformContext';

interface PixelSkyBackdropProps {
  /** 'hero' has prominent moon/clouds composition; 'ambient' uses gentler framing */
  variant?: 'hero' | 'ambient';
}

// 4x4 Ordered Bayer Dithering Matrix (0..15 normalized to 0..1)
const BAYER_4X4 = [
  [0 / 16, 8 / 16, 2 / 16, 10 / 16],
  [12 / 16, 4 / 16, 14 / 16, 6 / 16],
  [3 / 16, 11 / 16, 1 / 16, 9 / 16],
  [15 / 16, 7 / 16, 13 / 16, 5 / 16],
];

type RGB = [number, number, number];

// Night palette sampled from the pixel starry-night sky reference
const NIGHT_SKY_STOPS: RGB[] = [
  [6, 10, 26],   // deep zenith navy
  [10, 16, 40],  // upper midnight indigo
  [17, 25, 56],  // mid starlight navy
  [27, 34, 71],  // twilight slate indigo
  [38, 42, 82],  // lower atmospheric glow
];

// Day palette sampled from the pixel daytime sky reference
const DAY_SKY_STOPS: RGB[] = [
  [44, 138, 224],  // vibrant upper cerulean
  [68, 160, 236],  // crisp azure
  [106, 187, 245], // mid sky blue
  [152, 213, 250], // soft horizon azure
  [199, 236, 252], // pale mist horizon
];

interface Star {
  nx: number; // normalized 0..1
  ny: number; // normalized 0..1
  depth: number; // 0.3..1.0 for parallax
  kind: 'dot' | 'sparkle' | 'bright';
  color: RGB;
  phase: number;
  speed: number;
}

interface CloudLobe {
  dx: number;
  dy: number;
  rx: number;
  ry: number;
}

interface PixelCloud {
  x: number; // in normalized wrap space 0..1.6
  y: number; // normalized vertical 0..1
  speed: number;
  depth: number; // parallax depth
  layer: 'far' | 'mid' | 'front';
  lobes: CloudLobe[];
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

function hashSeed(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function sampleDitheredPalette(stops: RGB[], t: number, px: number, py: number): RGB {
  const clamped = Math.max(0, Math.min(0.9999, t));
  const scaled = clamped * (stops.length - 1);
  const idx = Math.floor(scaled);
  const frac = scaled - idx;
  const threshold = BAYER_4X4[py & 3][px & 3];
  const pick = frac > threshold ? Math.min(stops.length - 1, idx + 1) : idx;
  return stops[pick];
}

function setPixel(data: Uint8ClampedArray, w: number, h: number, x: number, y: number, rgb: RGB, alpha = 1) {
  const ix = x | 0;
  const iy = y | 0;
  if (ix < 0 || ix >= w || iy < 0 || iy >= h) return;
  const i = (iy * w + ix) * 4;
  if (alpha >= 0.999) {
    data[i] = rgb[0];
    data[i + 1] = rgb[1];
    data[i + 2] = rgb[2];
    data[i + 3] = 255;
  } else {
    const inv = 1 - alpha;
    data[i] = (data[i] * inv + rgb[0] * alpha) | 0;
    data[i + 1] = (data[i + 1] * inv + rgb[1] * alpha) | 0;
    data[i + 2] = (data[i + 2] * inv + rgb[2] * alpha) | 0;
    data[i + 3] = 255;
  }
}

/**
 * Native 60fps zero-watermark Pixel Art Sky Backdrop:
 * - Dark mode  -> Bayer-dithered starry night sky, shaded glowing crescent moon,
 *                 twinkling cross-stars, subtle shooting stars & smooth mouse parallax.
 * - Light mode -> Bayer-dithered daytime azure sky, 3-layer drifting cumulus pixel clouds
 *                 with soft lavender distant peaks & dithered cloud shading + mouse parallax.
 */
export function PixelSkyBackdrop({ variant = 'hero' }: PixelSkyBackdropProps) {
  const { theme } = usePlatform();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLight = theme === 'light';

    // Crisp virtual pixel grid scaled cleanly to viewport
    let pixelSize = window.innerWidth < 768 ? 4 : 5;
    let vw = 1;
    let vh = 1;
    let imageData: ImageData | null = null;
    let skyCache: Uint8ClampedArray | null = null;

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Build deterministic starfield (Dark mode)
    const starCount = variant === 'hero' ? 145 : 85;
    const starColors: RGB[] = [
      [255, 255, 255],
      [255, 244, 200],
      [182, 218, 255],
      [148, 165, 214],
    ];
    const stars: Star[] = Array.from({ length: starCount }, (_, i) => {
      const r1 = hashSeed(i * 3 + 1);
      const r2 = hashSeed(i * 3 + 2);
      const r3 = hashSeed(i * 3 + 3);
      const r4 = hashSeed(i * 7 + 5);
      const kind: Star['kind'] = i % 15 === 0 ? 'sparkle' : i % 6 === 0 ? 'bright' : 'dot';
      return {
        nx: r1,
        // Higher density in upper 82% of sky like the reference
        ny: Math.pow(r2, 1.15) * 0.86 + 0.02,
        depth: 0.25 + r3 * 0.75,
        kind,
        color: starColors[Math.floor(r4 * starColors.length)],
        phase: r4 * Math.PI * 2,
        speed: 0.9 + r3 * 2.2,
      };
    });

    // Build layered cumulus pixel clouds (Light mode) matching reference composition
    const clouds: PixelCloud[] = [
      // Far periwinkle-lavender cloud peak in middle distance
      {
        x: 0.54,
        y: 0.64,
        speed: 0.0022,
        depth: 0.28,
        layer: 'far',
        lobes: [
          { dx: -16, dy: 8, rx: 16, ry: 10 },
          { dx: -4, dy: 2, rx: 14, ry: 12 },
          { dx: 10, dy: -6, rx: 15, ry: 15 },
          { dx: 22, dy: 4, rx: 14, ry: 10 },
        ],
      },
      {
        x: 1.18,
        y: 0.60,
        speed: 0.0022,
        depth: 0.28,
        layer: 'far',
        lobes: [
          { dx: -14, dy: 6, rx: 15, ry: 9 },
          { dx: 2, dy: -3, rx: 16, ry: 13 },
          { dx: 18, dy: 5, rx: 14, ry: 9 },
        ],
      },
      // Midground sunlit puffy cumulus clouds
      {
        x: 0.24,
        y: 0.70,
        speed: 0.005,
        depth: 0.58,
        layer: 'mid',
        lobes: [
          { dx: -20, dy: 4, rx: 17, ry: 10 },
          { dx: -5, dy: -3, rx: 19, ry: 12 },
          { dx: 12, dy: 2, rx: 16, ry: 10 },
          { dx: 25, dy: 7, rx: 12, ry: 7 },
        ],
      },
      {
        x: 0.82,
        y: 0.65,
        speed: 0.0055,
        depth: 0.62,
        layer: 'mid',
        lobes: [
          { dx: -24, dy: 8, rx: 16, ry: 9 },
          { dx: -8, dy: 1, rx: 20, ry: 12 },
          { dx: 10, dy: -4, rx: 21, ry: 13 },
          { dx: 28, dy: 1, rx: 18, ry: 11 },
        ],
      },
      {
        x: 1.38,
        y: 0.56,
        speed: 0.0046,
        depth: 0.52,
        layer: 'mid',
        lobes: [
          { dx: -16, dy: 5, rx: 15, ry: 9 },
          { dx: 0, dy: -2, rx: 18, ry: 11 },
          { dx: 16, dy: 4, rx: 15, ry: 8 },
        ],
      },
      // Foreground bright pixel clouds framing left & right horizons
      {
        x: 0.06,
        y: 0.56,
        speed: 0.0085,
        depth: 0.92,
        layer: 'front',
        lobes: [
          { dx: -24, dy: 2, rx: 24, ry: 14 },
          { dx: -4, dy: -5, rx: 26, ry: 16 },
          { dx: 18, dy: 3, rx: 20, ry: 13 },
          { dx: 34, dy: 10, rx: 14, ry: 8 },
        ],
      },
      {
        x: 0.36,
        y: 0.77,
        speed: 0.0092,
        depth: 0.96,
        layer: 'front',
        lobes: [
          { dx: -14, dy: 2, rx: 13, ry: 7 },
          { dx: 0, dy: -2, rx: 15, ry: 8 },
          { dx: 13, dy: 3, rx: 12, ry: 6 },
        ],
      },
      {
        x: 0.94,
        y: 0.62,
        speed: 0.0088,
        depth: 0.95,
        layer: 'front',
        lobes: [
          { dx: -34, dy: 12, rx: 18, ry: 8 },
          { dx: -14, dy: 5, rx: 24, ry: 12 },
          { dx: 10, dy: -3, rx: 26, ry: 15 },
          { dx: 34, dy: -7, rx: 24, ry: 15 },
        ],
      },
    ];

    let shootingStar: ShootingStar | null = null;
    let nextMeteorTime = 3.2;

    const rebuildSkyBuffer = () => {
      const rect = canvas.getBoundingClientRect();
      const cw = Math.max(1, Math.floor(rect.width));
      const ch = Math.max(1, Math.floor(rect.height));
      pixelSize = cw < 768 ? 4 : 5;
      vw = Math.max(64, Math.ceil(cw / pixelSize));
      vh = Math.max(48, Math.ceil(ch / pixelSize));

      canvas.width = vw;
      canvas.height = vh;
      ctx.imageSmoothingEnabled = false;

      imageData = ctx.createImageData(vw, vh);
      skyCache = new Uint8ClampedArray(vw * vh * 4);
      const stops = isLight ? DAY_SKY_STOPS : NIGHT_SKY_STOPS;

      for (let y = 0; y < vh; y++) {
        const t = y / Math.max(1, vh - 1);
        for (let x = 0; x < vw; x++) {
          const rgb = sampleDitheredPalette(stops, t, x, y);
          const idx = (y * vw + x) * 4;
          skyCache[idx] = rgb[0];
          skyCache[idx + 1] = rgb[1];
          skyCache[idx + 2] = rgb[2];
          skyCache[idx + 3] = 255;
        }
      }
    };

    const drawNightScene = (data: Uint8ClampedArray, elapsed: number, dt: number) => {
      // 1. Crescent moon position (upper-right in hero, gentle center-right in ambient)
      const moonCx = Math.round(vw * (variant === 'hero' ? 0.77 : 0.72) + pointer.x * 7);
      const moonCy = Math.round(vh * (variant === 'hero' ? 0.28 : 0.34) + pointer.y * 5);
      const moonR = Math.max(11, Math.round(Math.min(vw, vh) * (variant === 'hero' ? 0.165 : 0.135)));
      const shadowOffsetX = Math.round(moonR * 0.44);
      const shadowOffsetY = Math.round(-moonR * 0.08);
      const shadowR = Math.round(moonR * 0.88);
      const haloR = Math.round(moonR * 1.95);

      // Soft dithered radial moon halo
      const minHx = Math.max(0, moonCx - haloR);
      const maxHx = Math.min(vw - 1, moonCx + haloR);
      const minHy = Math.max(0, moonCy - haloR);
      const maxHy = Math.min(vh - 1, moonCy + haloR);

      const haloPulse = 0.94 + Math.sin(elapsed * 0.9) * 0.06;
      for (let y = minHy; y <= maxHy; y++) {
        for (let x = minHx; x <= maxHx; x++) {
          const dx = x - moonCx;
          const dy = y - moonCy;
          const dist = Math.hypot(dx, dy);
          if (dist < haloR) {
            const norm = 1 - dist / haloR;
            const strength = norm * norm * 0.55 * haloPulse;
            const threshold = BAYER_4X4[y & 3][x & 3];
            if (strength * 1.65 > threshold) {
              setPixel(data, vw, vh, x, y, [78, 92, 150], Math.min(0.45, strength));
            }
          }
        }
      }

      // 2. Multi-layer twinkling pixel stars
      for (const s of stars) {
        const sx = Math.round(((s.nx * vw + pointer.x * 11 * s.depth) % vw + vw) % vw);
        const sy = Math.round(s.ny * vh + pointer.y * 7 * s.depth);
        const twinkle = 0.5 + 0.5 * Math.sin(elapsed * s.speed + s.phase);

        if (s.kind === 'dot') {
          const alpha = 0.28 + twinkle * 0.72;
          setPixel(data, vw, vh, sx, sy, s.color, alpha);
        } else if (s.kind === 'bright') {
          setPixel(data, vw, vh, sx, sy, [255, 254, 245], 0.65 + twinkle * 0.35);
          if (twinkle > 0.45) {
            const armAlpha = (twinkle - 0.45) * 0.75;
            setPixel(data, vw, vh, sx - 1, sy, s.color, armAlpha);
            setPixel(data, vw, vh, sx + 1, sy, s.color, armAlpha);
            setPixel(data, vw, vh, sx, sy - 1, s.color, armAlpha);
            setPixel(data, vw, vh, sx, sy + 1, s.color, armAlpha);
          }
        } else {
          // Classic pixel 4-point cross sparkle (+)
          const coreAlpha = 0.72 + twinkle * 0.28;
          const armAlpha = 0.32 + twinkle * 0.55;
          setPixel(data, vw, vh, sx, sy, [255, 253, 238], coreAlpha);
          setPixel(data, vw, vh, sx - 1, sy, [238, 234, 210], armAlpha);
          setPixel(data, vw, vh, sx + 1, sy, [238, 234, 210], armAlpha);
          setPixel(data, vw, vh, sx, sy - 1, [238, 234, 210], armAlpha);
          setPixel(data, vw, vh, sx, sy + 1, [238, 234, 210], armAlpha);
          if (twinkle > 0.58) {
            const tipAlpha = (twinkle - 0.58) * 0.85;
            setPixel(data, vw, vh, sx - 2, sy, [160, 178, 224], tipAlpha);
            setPixel(data, vw, vh, sx + 2, sy, [160, 178, 224], tipAlpha);
            setPixel(data, vw, vh, sx, sy - 2, [160, 178, 224], tipAlpha);
            setPixel(data, vw, vh, sx, sy + 2, [160, 178, 224], tipAlpha);
          }
        }
      }

      // 3. Draw crisp pixel crescent moon with subtle inner shading + dark shadow pocket
      const minMx = Math.max(0, moonCx - moonR - 1);
      const maxMx = Math.min(vw - 1, moonCx + moonR + 1);
      const minMy = Math.max(0, moonCy - moonR - 1);
      const maxMy = Math.min(vh - 1, moonCy + moonR + 1);

      for (let y = minMy; y <= maxMy; y++) {
        for (let x = minMx; x <= maxMx; x++) {
          const dx = x - moonCx;
          const dy = y - moonCy;
          const dist = Math.hypot(dx, dy);
          if (dist > moonR) continue;

          const sdx = x - (moonCx + shadowOffsetX);
          const sdy = y - (moonCy + shadowOffsetY);
          const sDist = Math.hypot(sdx, sdy);

          if (sDist < shadowR) {
            // Dark shadow side of the moon (keeps subtle night indigo matching reference)
            setPixel(data, vw, vh, x, y, [11, 16, 38], 0.92);
          } else {
            // Lit crescent surface with smooth directional pixel shading from bright rim to inner edge
            const edgeFactor = Math.min(1, (sDist - shadowR) / Math.max(2, moonR * 0.42));
            const verticalLight = 1 - Math.max(0, (dy + moonR) / (moonR * 2.2)) * 0.22;
            const lum = Math.max(0, Math.min(1, edgeFactor * verticalLight));
            const threshold = BAYER_4X4[y & 3][x & 3];

            let moonColor: RGB;
            if (lum > 0.72 + threshold * 0.14) {
              moonColor = [255, 250, 224]; // bright pale cream-gold
            } else if (lum > 0.44 + threshold * 0.16) {
              moonColor = [243, 232, 186]; // warm lunar gold
            } else if (lum > 0.20 + threshold * 0.15) {
              moonColor = [202, 192, 155]; // mid lunar crater shade
            } else {
              moonColor = [148, 145, 134]; // terminator edge shade
            }
            setPixel(data, vw, vh, x, y, moonColor, 1);
          }
        }
      }

      // 4. Subtle occasional pixel shooting star
      if (!prefersReduced) {
        if (!shootingStar && elapsed >= nextMeteorTime) {
          const startX = vw * (0.28 + hashSeed(elapsed * 13) * 0.52);
          const startY = vh * (0.06 + hashSeed(elapsed * 29) * 0.22);
          shootingStar = {
            x: startX,
            y: startY,
            vx: -38 - hashSeed(elapsed * 7) * 18,
            vy: 14 + hashSeed(elapsed * 11) * 10,
            life: 0,
            maxLife: 0.85,
          };
          nextMeteorTime = elapsed + 5.5 + hashSeed(elapsed * 19) * 5.0;
        }

        if (shootingStar) {
          shootingStar.life += dt;
          shootingStar.x += shootingStar.vx * dt;
          shootingStar.y += shootingStar.vy * dt;
          const progress = shootingStar.life / shootingStar.maxLife;
          const fade = progress < 0.2 ? progress / 0.2 : Math.max(0, 1 - (progress - 0.2) / 0.8);

          for (let step = 0; step < 9; step++) {
            const tx = Math.round(shootingStar.x - (shootingStar.vx * step) / 36);
            const ty = Math.round(shootingStar.y - (shootingStar.vy * step) / 36);
            const tailAlpha = fade * (1 - step / 9);
            const color: RGB = step === 0 ? [255, 255, 245] : step < 3 ? [212, 255, 180] : [143, 211, 255];
            setPixel(data, vw, vh, tx, ty, color, tailAlpha);
          }

          if (shootingStar.life >= shootingStar.maxLife) {
            shootingStar = null;
          }
        }
      }
    };

    const drawDayScene = (data: Uint8ClampedArray, elapsed: number) => {
      const wrapSpan = 1.65;
      const scaleRef = Math.max(0.65, Math.min(1.45, vw / 260));

      // Gentle drifting pixel sun-glint dust high in sky
      for (let i = 0; i < 18; i++) {
        const bx = ((hashSeed(i * 11 + 3) + elapsed * 0.004 * (0.6 + hashSeed(i))) % 1) * vw;
        const by = hashSeed(i * 17 + 7) * vh * 0.42;
        const pulse = 0.25 + 0.45 * Math.sin(elapsed * 1.4 + i);
        setPixel(data, vw, vh, bx + pointer.x * 3, by + pointer.y * 2, [255, 255, 255], pulse * 0.55);
      }

      // Draw pixel clouds back-to-front (far -> mid -> front)
      for (const cloud of clouds) {
        const driftX = prefersReduced ? cloud.x : (cloud.x + elapsed * cloud.speed) % wrapSpan;
        const cx = (driftX - 0.28) * vw + pointer.x * 12 * cloud.depth;
        const cy = cloud.y * vh + pointer.y * 5 * cloud.depth;

        // Compute tight bounding box across all lobes of this cloud
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        for (const lobe of cloud.lobes) {
          const lx = cx + lobe.dx * scaleRef;
          const ly = cy + lobe.dy * scaleRef;
          const rx = lobe.rx * scaleRef;
          const ry = lobe.ry * scaleRef;
          if (lx - rx < minX) minX = lx - rx;
          if (lx + rx > maxX) maxX = lx + rx;
          if (ly - ry < minY) minY = ly - ry;
          if (ly + ry > maxY) maxY = ly + ry;
        }

        const startX = Math.max(0, Math.floor(minX));
        const endX = Math.min(vw - 1, Math.ceil(maxX));
        const startY = Math.max(0, Math.floor(minY));
        const endY = Math.min(vh - 1, Math.ceil(maxY));
        if (startX > endX || startY > endY) continue;

        const cloudHeight = Math.max(1, maxY - minY);

        for (let y = startY; y <= endY; y++) {
          const vNorm = (y - minY) / cloudHeight; // 0 = bright top, 1 = shaded underside
          for (let x = startX; x <= endX; x++) {
            // Soft union test across cloud lobes
            let insideScore = 0;
            for (const lobe of cloud.lobes) {
              const nx = (x - (cx + lobe.dx * scaleRef)) / (lobe.rx * scaleRef);
              const ny = (y - (cy + lobe.dy * scaleRef)) / (lobe.ry * scaleRef);
              const d2 = nx * nx + ny * ny;
              if (d2 < 1) {
                const s = 1 - d2;
                if (s > insideScore) insideScore = s;
              }
            }
            if (insideScore <= 0) continue;

            const threshold = BAYER_4X4[y & 3][x & 3];

            if (cloud.layer === 'far') {
              // Soft periwinkle-lavender distant cloud peak matching reference middle cloud
              if (insideScore < 0.24 && insideScore * 4.2 < threshold) continue;
              const col: RGB = vNorm < 0.55 ? [174, 192, 238] : [156, 178, 232];
              setPixel(data, vw, vh, x, y, col, 0.72);
            } else {
              // Crisp puffy daytime pixel cloud with dithered soft blue underside
              if (vNorm > 0.80 && insideScore < 0.35) {
                // Dithered airy bottom fringe
                if (insideScore * 2.8 < threshold) continue;
                setPixel(data, vw, vh, x, y, [164, 208, 245], 1);
              } else if (vNorm > 0.66 + threshold * 0.14) {
                // Cool sky-blue underside shadow
                setPixel(data, vw, vh, x, y, [186, 222, 250], 1);
              } else if (vNorm > 0.50 + threshold * 0.16) {
                // Soft ice-white midtone
                setPixel(data, vw, vh, x, y, [229, 244, 255], 1);
              } else {
                // Pure crisp sunlit cloud white
                setPixel(data, vw, vh, x, y, [255, 255, 255], 1);
              }
            }
          }
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointer.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    rebuildSkyBuffer();
    window.addEventListener('resize', rebuildSkyBuffer);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let rafId = 0;
    let lastTs = performance.now();
    let elapsed = 0;

    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;
      if (!prefersReduced) {
        elapsed += dt;
      }

      pointer.x += (pointer.targetX - pointer.x) * 0.06;
      pointer.y += (pointer.targetY - pointer.y) * 0.06;

      if (imageData && skyCache) {
        // Fast copy pre-dithered sky gradient into active frame buffer
        imageData.data.set(skyCache);

        if (isLight) {
          drawDayScene(imageData.data, elapsed);
        } else {
          drawNightScene(imageData.data, elapsed, dt);
        }

        ctx.putImageData(imageData, 0, 0);
      }

      if (!prefersReduced) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    rafId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', rebuildSkyBuffer);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [theme, variant]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${theme === 'light' ? 'bg-[#64B5F6]' : 'bg-[#090E23]'}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="pixel-art-canvas w-full h-full block"
      />
    </div>
  );
}
