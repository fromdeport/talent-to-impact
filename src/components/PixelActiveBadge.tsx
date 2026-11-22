import { usePlatform } from '../context/PlatformContext';
import type { Language } from '../types/platform';

const WORD_BY_LANG: Record<Language, string> = {
  uz: 'FAOL',
  ru: 'АКТИВНО',
  en: 'ACTIVE',
};

interface PixelActiveBadgeProps {
  /** Offset glow phase slightly per card for calm institutional rhythm */
  delayMs?: number;
}

/**
 * Clean official glowing status wordmark for active ecosystem tracks (UZ / RU / EN).
 * Keeps periodic emerald-green radiance while using crisp official Manrope typography.
 */
export function PixelActiveBadge({ delayMs = 0 }: PixelActiveBadgeProps) {
  const { language, theme } = usePlatform();
  const isLight = theme === 'light';
  const word = WORD_BY_LANG[language] || 'ACTIVE';

  return (
    <span
      className={`inline-flex items-center gap-1.5 shrink-0 select-none font-official text-[11px] font-bold tracking-[0.12em] uppercase ${
        isLight ? 'text-[#059669] pixel-active-glow-light' : 'text-[#39FF7A] pixel-active-glow-dark'
      }`}
      style={{ animationDelay: `${delayMs}ms` }}
      role="status"
      aria-label={word}
      title={word}
    >
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M4 0L8 4L4 8L0 4L4 0Z"
          fill="currentColor"
        />
      </svg>
      <span>{word}</span>
    </span>
  );
}
