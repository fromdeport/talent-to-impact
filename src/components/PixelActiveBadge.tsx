import { usePlatform } from '../context/PlatformContext';
import type { Language } from '../types/platform';

/**
 * Hand-drawn 4x5 crisp pixel-art bitmap glyphs for all 3 languages:
 * - UZ: "FAOL"
 * - RU: "АКТИВНО"
 * - EN: "ACTIVE"
 */
const GLYPHS: Record<string, string[]> = {
  // Latin
  A: ['.11.', '1..1', '1111', '1..1', '1..1'],
  C: ['.111', '1...', '1...', '1...', '.111'],
  E: ['1111', '1...', '111.', '1...', '1111'],
  F: ['1111', '1...', '111.', '1...', '1...'],
  I: ['111', '.1.', '.1.', '.1.', '111'],
  L: ['1...', '1...', '1...', '1...', '1111'],
  O: ['.11.', '1..1', '1..1', '1..1', '.11.'],
  T: ['111', '.1.', '.1.', '.1.', '.1.'],
  V: ['1..1', '1..1', '1..1', '.11.', '.11.'],
  // Cyrillic
  А: ['.11.', '1..1', '1111', '1..1', '1..1'],
  К: ['1..1', '1.1.', '11..', '1.1.', '1..1'],
  Т: ['111', '.1.', '.1.', '.1.', '.1.'],
  И: ['1..1', '1..1', '1.11', '11.1', '1..1'],
  В: ['111.', '1..1', '111.', '1..1', '111.'],
  Н: ['1..1', '1..1', '1111', '1..1', '1..1'],
  О: ['.11.', '1..1', '1..1', '1..1', '.11.'],
};

const WORD_BY_LANG: Record<Language, string> = {
  uz: 'FAOL',
  ru: 'АКТИВНО',
  en: 'ACTIVE',
};

interface PixelActiveBadgeProps {
  /** Offset animation phase slightly per card so badges twinkle organically like stars */
  delayMs?: number;
}

/**
 * Hand-drawn pixel-art ACTIVE / FAOL / АКТИВНО wordmark that periodically radiates
 * emerald-green starlight with twinkling pixel cross-stars (+).
 */
export function PixelActiveBadge({ delayMs = 0 }: PixelActiveBadgeProps) {
  const { language, theme } = usePlatform();
  const isLight = theme === 'light';
  const word = WORD_BY_LANG[language] || 'ACTIVE';

  const padX = 5;
  const padY = 4;
  const rects: { x: number; y: number }[] = [];
  let cursorX = padX;

  for (const ch of word) {
    const bitmap = GLYPHS[ch];
    if (!bitmap) {
      cursorX += 3;
      continue;
    }
    const width = bitmap[0].length;
    for (let row = 0; row < bitmap.length; row++) {
      for (let col = 0; col < width; col++) {
        if (bitmap[row][col] === '1') {
          rects.push({ x: cursorX + col, y: padY + row });
        }
      }
    }
    cursorX += width + 1;
  }

  const totalW = cursorX - 1 + padX;
  const totalH = 5 + padY * 2;
  const scale = 2.4;

  const mainFill = isLight ? '#059669' : '#39FF7A';
  const starPrimary = isLight ? '#10B981' : '#8CFFB0';
  const starSecondary = isLight ? '#16A34A' : '#D4FF00';

  return (
    <span
      className="inline-flex items-center shrink-0 select-none"
      role="status"
      aria-label={word}
      title={word}
    >
      <svg
        width={Math.round(totalW * scale)}
        height={Math.round(totalH * scale)}
        viewBox={`0 0 ${totalW} ${totalH}`}
        shapeRendering="crispEdges"
        className={isLight ? 'pixel-active-glow-light' : 'pixel-active-glow-dark'}
        style={{ animationDelay: `${delayMs}ms` }}
      >
        {/* Top-left twinkling pixel cross-star (+) */}
        <g
          className="pixel-star-twinkle-a"
          style={{ animationDelay: `${delayMs}ms` }}
          fill={starPrimary}
        >
          <rect x="1" y="1" width="1" height="3" />
          <rect x="0" y="2" width="3" height="1" />
        </g>

        {/* Bottom-right twinkling pixel cross-star (+) */}
        <g
          className="pixel-star-twinkle-b"
          style={{ animationDelay: `${delayMs + 950}ms` }}
          fill={starSecondary}
        >
          <rect x={totalW - 2} y={totalH - 4} width="1" height="3" />
          <rect x={totalW - 3} y={totalH - 3} width="3" height="1" />
        </g>

        {/* Subtle single-pixel star glints */}
        <rect
          x={Math.floor(totalW * 0.55)}
          y="1"
          width="1"
          height="1"
          fill={starSecondary}
          className="pixel-star-twinkle-b"
          style={{ animationDelay: `${delayMs + 450}ms` }}
        />
        <rect
          x="2"
          y={totalH - 2}
          width="1"
          height="1"
          fill={starPrimary}
          className="pixel-star-twinkle-a"
          style={{ animationDelay: `${delayMs + 1400}ms` }}
        />

        {/* Crisp hand-drawn pixel bitmap letters */}
        <g fill={mainFill}>
          {rects.map((r, idx) => (
            <rect key={idx} x={r.x} y={r.y} width="1" height="1" />
          ))}
        </g>
      </svg>
    </span>
  );
}
