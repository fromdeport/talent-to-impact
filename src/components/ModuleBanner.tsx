import type { ReactNode } from 'react';
import { usePlatform } from '../context/PlatformContext';
import { LanguageSwitch } from './LanguageSwitch';

interface ModuleBannerProps {
  code: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  accent?: 'primary' | 'secondary';
  action?: ReactNode;
}

/**
 * Full-bleed architectural Module Banner adapted cleanly for BOTH themes:
 * - Dark mode  -> Deep obsidian-midnight gradient with softly blended atmospheric 3D visual
 *                 and crisp executive typography (#F4F7FF / #C9DAFA).
 * - Light mode -> Clean porcelain-ice architectural gradient (#E4EFFB -> #F2F7FD -> #FFFFFF)
 *                 where the white-background 3D illustration blends seamlessly via mix-blend-multiply
 *                 with crisp deep-navy typography (#0B1A36 / #1570D4).
 */
export function ModuleBanner({
  code,
  title,
  subtitle,
  image,
  imageAlt,
  accent = 'primary',
  action,
}: ModuleBannerProps) {
  const { theme } = usePlatform();
  const isLight = theme === 'light';

  const codeClass =
    accent === 'primary'
      ? isLight
        ? 'text-[#1570D4]'
        : 'text-[#D4FF00]'
      : isLight
        ? 'text-[#0B4EA2]'
        : 'text-[#8FD3FF]';

  return (
    <section
      className={`relative border-b overflow-hidden transition-colors ${
        isLight
          ? 'border-[#1570D4]/18 bg-gradient-to-r from-[#E4EFFB] via-[#F2F7FD] to-[#FFFFFF]'
          : 'border-[#8EA4E8]/18 bg-[#070C1D]'
      }`}
    >
      {/* Full-bleed atmospheric backdrop adapted per theme */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {isLight ? (
          <>
            {/* Subtle architectural coordinate grid */}
            <div className="absolute inset-0 sci-grid-bg opacity-65" />
            {/* White-studio 3D illustration blended seamlessly into the light architectural surface */}
            <div className="absolute inset-y-0 right-0 w-full md:w-[58%] lg:w-[48%] flex items-center justify-end pr-4 sm:pr-10">
              <img
                src={image}
                alt={imageAlt}
                referrerPolicy="no-referrer"
                className="h-[88%] max-w-full object-contain opacity-15 sm:opacity-35 md:opacity-55 mix-blend-multiply"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#E4EFFB] via-[#F2F7FD]/88 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 sci-grid-bg opacity-80" />
            {/* Soft-edge full-bleed atmospheric visual on the right of the dark banner */}
            <div
              className="absolute inset-y-0 right-0 w-full md:w-[58%] lg:w-[50%] flex items-center justify-end pr-4 sm:pr-10"
              style={{
                maskImage: 'linear-gradient(to left, rgba(0,0,0,0.85) 35%, transparent 96%)',
                WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.85) 35%, transparent 96%)',
              }}
            >
              <img
                src={image}
                alt={imageAlt}
                referrerPolicy="no-referrer"
                className="h-[92%] max-w-full object-contain opacity-12 sm:opacity-20 md:opacity-24 contrast-110 brightness-90 rounded-md"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#070C1D] via-[#070C1D]/84 to-[#070C1D]/35" />
          </>
        )}
      </div>

      {/* Exact original wide full-bleed content layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 space-y-3.5 sm:space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <p className={`font-official text-xs sm:text-sm font-bold uppercase tracking-[0.1em] ${codeClass}`}>
            {code}
          </p>
          <LanguageSwitch />
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-2.5 max-w-2xl">
            <h1
              className={`font-display text-2xl sm:text-4xl font-bold leading-tight ${
                isLight ? 'text-[#0B1A36]' : 'text-[#F4F7FF]'
              }`}
            >
              {title}
            </h1>
            <p
              className={`font-official text-base sm:text-xl font-medium leading-snug ${
                isLight ? 'text-[#28426E]' : 'text-[#C9DAFA]'
              }`}
            >
              {subtitle}
            </p>
          </div>
          {action && <div className="shrink-0 w-full sm:w-auto">{action}</div>}
        </div>
      </div>
    </section>
  );
}
