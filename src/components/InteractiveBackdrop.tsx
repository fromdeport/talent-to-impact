import { useEffect, useRef } from 'react';
import { usePlatform } from '../context/PlatformContext';

interface InteractiveBackdropProps {
  /** 'hero' shows right-aligned architectural orbital gyroscope + interactive constellation; 'ambient' uses centered arcs */
  variant?: 'hero' | 'ambient';
}

interface NetworkNode {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  tier: 'primary' | 'secondary' | 'micro';
}

interface PulseWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

function seeded(n: number): number {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return v - Math.floor(v);
}

/**
 * Authoritative 60fps HiDPI Interactive Architectural Constellation & Orbital Trajectory Canvas.
 * Replaces playful pixel sky (moon/clouds) with a serious, executive STEM/institutional visual field:
 * - Dark mode  -> Deep obsidian-midnight gradient, illuminated neural/talent constellation, precision
 *                 3D-tilting meridian gyroscope on the right, cursor-magnetic vector synapses & click ripples.
 * - Light mode -> Clean architectural porcelain-ice canvas, crisp cobalt/slate geometric network,
 *                 drafting coordinate grid, cursor-responsive precision arcs & subtle interactive glow.
 */
export function InteractiveBackdrop({ variant = 'hero' }: InteractiveBackdropProps) {
  const { theme } = usePlatform();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLight = theme === 'light';

    let width = 1;
    let height = 1;
    let dpr = 1;
    let nodes: NetworkNode[] = [];
    const pulses: PulseWave[] = [];

    // Smooth pointer state (in canvas-local coordinates + normalized -1..1 tilt)
    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
      normX: 0,
      normY: 0,
      targetNormX: 0,
      targetNormY: 0,
    };

    const buildNodes = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      dpr = Math.min(2, window.devicePixelRatio || 1);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const area = width * height;
      const baseCount = variant === 'hero' ? Math.round(area / 13500) : Math.round(area / 19000);
      const count = Math.max(38, Math.min(variant === 'hero' ? 96 : 64, baseCount));

      nodes = Array.from({ length: count }, (_, i) => {
        const rx = seeded(i * 5 + 1);
        const ry = seeded(i * 5 + 2);
        const rAngle = seeded(i * 5 + 3) * Math.PI * 2;
        const rSpeed = 6 + seeded(i * 5 + 4) * 11;
        const tier: NetworkNode['tier'] = i % 9 === 0 ? 'primary' : i % 3 === 0 ? 'secondary' : 'micro';
        const px = rx * width;
        const py = ry * height;
        return {
          x: px,
          y: py,
          homeX: px,
          homeY: py,
          vx: Math.cos(rAngle) * rSpeed,
          vy: Math.sin(rAngle) * rSpeed,
          radius: tier === 'primary' ? 2.5 : tier === 'secondary' ? 1.75 : 1.15,
          phase: seeded(i * 11 + 7) * Math.PI * 2,
          tier,
        };
      });
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      pointer.targetNormX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointer.targetNormY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;

      if (lx >= -120 && lx <= rect.width + 120 && ly >= -120 && ly <= rect.height + 120) {
        pointer.x = lx;
        pointer.y = ly;
        pointer.active = true;
      } else {
        pointer.active = false;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (prefersReduced) return;
      const rect = canvas.getBoundingClientRect();
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;
      if (lx >= 0 && lx <= rect.width && ly >= 0 && ly <= rect.height) {
        pulses.push({
          x: lx,
          y: ly,
          radius: 8,
          maxRadius: Math.min(340, Math.max(180, width * 0.24)),
          alpha: isLight ? 0.34 : 0.42,
        });
        if (pulses.length > 4) pulses.shift();
      }
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const drawBackgroundField = () => {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      if (isLight) {
        grad.addColorStop(0, '#F7FAFE');
        grad.addColorStop(0.55, '#ECF3FC');
        grad.addColorStop(1, '#E2EEFA');
      } else {
        grad.addColorStop(0, '#060A18');
        grad.addColorStop(0.52, '#0A1128');
        grad.addColorStop(1, '#080E22');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle architectural coordinate grid shifting gently with pointer parallax
      const spacing = width < 640 ? 48 : 64;
      const offsetX = ((-pointer.normX * 14) % spacing + spacing) % spacing;
      const offsetY = ((-pointer.normY * 10) % spacing + spacing) % spacing;

      ctx.lineWidth = 1;
      ctx.strokeStyle = isLight ? 'rgba(21, 112, 212, 0.055)' : 'rgba(143, 211, 255, 0.048)';
      ctx.beginPath();
      for (let x = offsetX; x < width; x += spacing) {
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
      }
      for (let y = offsetY; y < height; y += spacing) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
      }
      ctx.stroke();

      // Subtle interactive cursor luminance aura
      if (pointer.active) {
        const auraR = Math.min(360, Math.max(200, width * 0.25));
        const aura = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, auraR);
        if (isLight) {
          aura.addColorStop(0, 'rgba(21, 112, 212, 0.11)');
          aura.addColorStop(0.5, 'rgba(21, 112, 212, 0.04)');
          aura.addColorStop(1, 'rgba(21, 112, 212, 0)');
        } else {
          aura.addColorStop(0, 'rgba(212, 255, 0, 0.095)');
          aura.addColorStop(0.45, 'rgba(143, 211, 255, 0.055)');
          aura.addColorStop(1, 'rgba(7, 12, 29, 0)');
        }
        ctx.fillStyle = aura;
        ctx.fillRect(0, 0, width, height);
      }
    };

    const drawOrbitalArchitecture = (elapsed: number) => {
      const isHero = variant === 'hero';
      const cx = (isHero ? (width < 768 ? width * 0.78 : width * 0.76) : width * 0.5) + pointer.normX * 22;
      const cy = (isHero ? height * 0.48 : height * 0.52) + pointer.normY * 16;
      const baseR = Math.min(width, height) * (isHero ? (width < 640 ? 0.36 : 0.4) : 0.46);

      // Soft executive atmospheric glow behind focal orbital hub
      const hubGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 1.45);
      if (isLight) {
        hubGlow.addColorStop(0, 'rgba(21, 112, 212, 0.10)');
        hubGlow.addColorStop(0.55, 'rgba(14, 116, 214, 0.035)');
        hubGlow.addColorStop(1, 'rgba(244, 248, 253, 0)');
      } else {
        hubGlow.addColorStop(0, 'rgba(143, 211, 255, 0.12)');
        hubGlow.addColorStop(0.45, 'rgba(212, 255, 0, 0.04)');
        hubGlow.addColorStop(1, 'rgba(7, 12, 29, 0)');
      }
      ctx.fillStyle = hubGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 1.45, 0, Math.PI * 2);
      ctx.fill();

      // Concentric calibrated reference circles
      const ringFactors = isHero ? [0.42, 0.72, 1.0, 1.24] : [0.55, 0.92, 1.28];
      ringFactors.forEach((factor, idx) => {
        const r = baseR * factor;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.lineWidth = idx === 2 ? 1.1 : 0.85;
        ctx.strokeStyle = isLight
          ? `rgba(21, 112, 212, ${idx === 2 ? 0.18 : 0.1})`
          : `rgba(143, 211, 255, ${idx === 2 ? 0.18 : 0.095})`;
        ctx.stroke();
      });

      // Calibrated degree ticks on outer precision ring (hero only)
      if (isHero) {
        const outerR = baseR * 1.0;
        const tickCount = 48;
        const rotOffset = elapsed * 0.045 + pointer.normX * 0.14;
        ctx.strokeStyle = isLight ? 'rgba(11, 26, 54, 0.18)' : 'rgba(143, 211, 255, 0.24)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < tickCount; i++) {
          const a = (i / tickCount) * Math.PI * 2 + rotOffset;
          const isMajor = i % 4 === 0;
          const len = isMajor ? 8 : 3.5;
          ctx.moveTo(cx + Math.cos(a) * (outerR - len), cy + Math.sin(a) * (outerR - len));
          ctx.lineTo(cx + Math.cos(a) * outerR, cy + Math.sin(a) * outerR);
        }
        ctx.stroke();

        // Crosshair axes through focal hub
        ctx.strokeStyle = isLight ? 'rgba(21, 112, 212, 0.09)' : 'rgba(143, 211, 255, 0.09)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(cx - baseR * 1.32, cy);
        ctx.lineTo(cx + baseR * 1.32, cy);
        ctx.moveTo(cx, cy - baseR * 1.32);
        ctx.lineTo(cx, cy + baseR * 1.32);
        ctx.stroke();
      }

      // Three tilted dynamic orbital ellipses with travelling data beacons
      const orbits = isHero
        ? [
            { rx: baseR * 1.04, ry: baseR * 0.38, rot: -0.34 + pointer.normY * 0.16, speed: 0.34, accent: true },
            { rx: baseR * 0.88, ry: baseR * 0.56, rot: 0.52 - pointer.normX * 0.15, speed: -0.26, accent: false },
            { rx: baseR * 0.64, ry: baseR * 0.26, rot: 1.18 + pointer.normX * 0.12, speed: 0.48, accent: true },
          ]
        : [
            { rx: baseR * 1.08, ry: baseR * 0.32, rot: -0.18 + pointer.normY * 0.12, speed: 0.24, accent: true },
            { rx: baseR * 0.84, ry: baseR * 0.44, rot: 0.26 - pointer.normX * 0.1, speed: -0.2, accent: false },
          ];

      for (let i = 0; i < orbits.length; i++) {
        const orb = orbits[i];
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(orb.rot);

        // Smooth orbital path
        ctx.beginPath();
        ctx.ellipse(0, 0, orb.rx, orb.ry, 0, 0, Math.PI * 2);
        ctx.lineWidth = orb.accent ? 1.15 : 0.9;
        ctx.strokeStyle = isLight
          ? orb.accent
            ? 'rgba(21, 112, 212, 0.24)'
            : 'rgba(11, 26, 54, 0.13)'
          : orb.accent
            ? 'rgba(212, 255, 0, 0.22)'
            : 'rgba(143, 211, 255, 0.18)';
        ctx.stroke();

        // Travelling luminous orbital node + subtle arc wake
        const theta = elapsed * orb.speed + i * 2.1;
        const bx = Math.cos(theta) * orb.rx;
        const by = Math.sin(theta) * orb.ry;

        const beaconGlow = ctx.createRadialGradient(bx, by, 0, bx, by, 12);
        if (isLight) {
          beaconGlow.addColorStop(0, orb.accent ? 'rgba(21, 112, 212, 0.72)' : 'rgba(11, 78, 162, 0.55)');
          beaconGlow.addColorStop(1, 'rgba(21, 112, 212, 0)');
        } else {
          beaconGlow.addColorStop(0, orb.accent ? 'rgba(212, 255, 0, 0.85)' : 'rgba(143, 211, 255, 0.8)');
          beaconGlow.addColorStop(1, 'rgba(212, 255, 0, 0)');
        }
        ctx.fillStyle = beaconGlow;
        ctx.beginPath();
        ctx.arc(bx, by, 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isLight ? (orb.accent ? '#1570D4' : '#0B1A36') : orb.accent ? '#D4FF00' : '#8FD3FF';
        ctx.beginPath();
        ctx.arc(bx, by, 2.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    };

    const drawConstellationAndInteractions = (elapsed: number, dt: number) => {
      const linkDist = width < 640 ? 105 : 138;
      const cursorDist = width < 640 ? 150 : 210;

      // Update nodes with calm laminar drift + responsive magnetic cursor physics
      for (const n of nodes) {
        if (!prefersReduced) {
          n.x += n.vx * dt;
          n.y += n.vy * dt;

          // Wrap smoothly around canvas bounds
          if (n.x < -20) n.x = width + 20;
          if (n.x > width + 20) n.x = -20;
          if (n.y < -20) n.y = height + 20;
          if (n.y > height + 20) n.y = -20;

          // Interactive cursor gravity + subtle orbital deflection
          if (pointer.active) {
            const dx = pointer.x - n.x;
            const dy = pointer.y - n.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 14 && dist < cursorDist) {
              const force = (1 - dist / cursorDist) * 26 * dt;
              // Gently pull toward an interactive halo radius ~68px around pointer
              const dir = dist > 68 ? 1 : -0.75;
              n.x += (dx / dist) * force * dir;
              n.y += (dy / dist) * force * dir;
            }
          }
        }
      }

      // Draw inter-node geometric constellation connections
      ctx.lineWidth = 0.85;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            const strength = 1 - d / linkDist;
            // Boost link brightness when near pointer
            let boost = 1;
            if (pointer.active) {
              const midX = (a.x + b.x) * 0.5;
              const midY = (a.y + b.y) * 0.5;
              const pd = Math.hypot(pointer.x - midX, pointer.y - midY);
              if (pd < cursorDist) {
                boost = 1 + (1 - pd / cursorDist) * 1.9;
              }
            }
            const alpha = Math.min(0.42, strength * (isLight ? 0.16 : 0.19) * boost);
            ctx.strokeStyle = isLight
              ? `rgba(21, 112, 212, ${alpha.toFixed(3)})`
              : `rgba(143, 211, 255, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw direct interactive cursor synapses & node points
      for (const n of nodes) {
        const pulse = 0.72 + 0.28 * Math.sin(elapsed * 1.7 + n.phase);
        let nearCursor = 0;

        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < cursorDist) {
            nearCursor = 1 - d / cursorDist;
            ctx.lineWidth = 0.9 + nearCursor * 0.75;
            ctx.strokeStyle = isLight
              ? `rgba(21, 112, 212, ${(nearCursor * 0.42).toFixed(3)})`
              : `rgba(212, 255, 0, ${(nearCursor * 0.45).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }

        const r = n.radius + nearCursor * 1.4;
        const baseAlpha = n.tier === 'primary' ? 0.78 : n.tier === 'secondary' ? 0.5 : 0.34;
        const alpha = Math.min(1, baseAlpha * pulse + nearCursor * 0.4);

        if (n.tier === 'primary' || nearCursor > 0.35) {
          ctx.fillStyle = isLight
            ? `rgba(21, 112, 212, ${alpha.toFixed(3)})`
            : nearCursor > 0.35
              ? `rgba(212, 255, 0, ${alpha.toFixed(3)})`
              : `rgba(143, 211, 255, ${alpha.toFixed(3)})`;
        } else {
          ctx.fillStyle = isLight
            ? `rgba(11, 26, 54, ${(alpha * 0.65).toFixed(3)})`
            : `rgba(197, 211, 240, ${alpha.toFixed(3)})`;
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        // Precision outer halo ring on primary nodes or strongly activated cursor nodes
        if (n.tier === 'primary' && (nearCursor > 0.2 || variant === 'hero')) {
          ctx.strokeStyle = isLight
            ? `rgba(21, 112, 212, ${(0.18 + nearCursor * 0.35).toFixed(3)})`
            : `rgba(212, 255, 0, ${(0.18 + nearCursor * 0.42).toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 3.2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Draw subtle cursor precision reticle when pointer is inside the section
      if (pointer.active) {
        ctx.strokeStyle = isLight ? 'rgba(21, 112, 212, 0.35)' : 'rgba(212, 255, 0, 0.42)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 12, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = isLight ? 'rgba(21, 112, 212, 0.7)' : 'rgba(212, 255, 0, 0.85)';
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Expanding click/tap radar pulse rings
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.radius += 220 * dt;
        const progress = p.radius / p.maxRadius;
        const a = p.alpha * Math.max(0, 1 - progress);
        if (progress >= 1 || a <= 0.005) {
          pulses.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = isLight
          ? `rgba(21, 112, 212, ${a.toFixed(3)})`
          : `rgba(212, 255, 0, ${a.toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    };

    buildNodes();
    window.addEventListener('resize', buildNodes);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);

    let rafId = 0;
    let lastTs = performance.now();
    let elapsed = 0;

    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;
      if (!prefersReduced) {
        elapsed += dt;
      }

      pointer.normX += (pointer.targetNormX - pointer.normX) * 0.06;
      pointer.normY += (pointer.targetNormY - pointer.normY) * 0.06;

      drawBackgroundField();
      drawOrbitalArchitecture(elapsed);
      drawConstellationAndInteractions(elapsed, dt);

      if (!prefersReduced) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    rafId = window.requestAnimationFrame(renderFrame);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', buildNodes);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [theme, variant]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${theme === 'light' ? 'bg-[#F4F8FD]' : 'bg-[#070C1D]'}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="architectural-canvas w-full h-full block" />
    </div>
  );
}
