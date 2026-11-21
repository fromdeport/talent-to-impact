import { usePlatform } from '../context/PlatformContext';

interface BrandLogoProps {
  compact?: boolean;
}

/**
 * Custom TALENT TO IMPACT abstract Neon-Lime "T" mark + wordmark.
 * Matches the user's supplied Neon Lime Abstract T Mark with razor-sharp vector clarity
 * across both Dark (Starry Midnight) and Light (Daytime Pixel Sky) themes.
 */
export function BrandLogo({ compact = false }: BrandLogoProps) {
  const { theme } = usePlatform();
  const isLight = theme === 'light';

  return (
    <span className="inline-flex items-center gap-2 sm:gap-2.5 whitespace-nowrap shrink-0">
      <span
        className={`inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-md shrink-0 transition-colors ${
          isLight
            ? 'bg-[#0B1A36] border border-[#0B1A36] shadow-sm'
            : 'bg-[#101733]/90 border border-[#D4FF00]/30'
        }`}
        aria-hidden="true"
      >
        <svg
          className="w-5 h-[19px] sm:w-6 sm:h-[22px]"
          viewBox="0 0 100 92"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Upper slanted bar of abstract T mark */}
          <path
            d="M7.5 43.5L26.5 13.5C28.4 10.6 31.6 9 35 9H88.5C92.5 9 94.9 13.4 92.7 16.8L80.2 35.8C78.4 38.5 75.3 40.2 72 40.2H52.5C48.3 40.2 46.1 41.8 44.5 45.2H9.2C7.4 45.2 6.5 44.8 7.5 43.5Z"
            fill="#D4FF00"
          />
          {/* Lower angled stem with rounded right shoulder meeting at geometric pinch */}
          <path
            d="M44.5 45.2H56.8C64.2 45.2 69.1 52.8 65.8 59.4L55.2 79.4C53.9 81.9 51.5 83.7 48.7 84.3L26.2 88.8C23.8 89.3 22 86.8 23.2 84.7L44.5 45.2Z"
            fill="#D4FF00"
          />
        </svg>
      </span>
      {!compact && (
        <span
          className={`font-display font-semibold tracking-[-0.03em] text-[13px] sm:text-[15px] transition-colors ${
            isLight ? 'text-[#0B1A36]' : 'text-[#F4F7FF]'
          }`}
        >
          TALENT{' '}
          <span
            className={`font-pixel font-semibold text-sm sm:text-lg px-0.5 ${
              isLight ? 'text-[#1570D4]' : 'text-[#D4FF00]'
            }`}
          >
            to
          </span>{' '}
          IMPACT
        </span>
      )}
    </span>
  );
}
