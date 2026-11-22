import { usePlatform } from '../context/PlatformContext';
import type { Language } from '../types/platform';

const LANGS: { code: Language; label: string }[] = [
  { code: 'uz', label: 'UZ' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
];

export function LanguageSwitch() {
  const { language, setLanguage, theme } = usePlatform();
  const isLight = theme === 'light';

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-md border transition-colors ${
        isLight
          ? 'bg-white/90 border-[#1570D4]/25'
          : 'bg-[#101733]/90 border-[#8EA4E8]/25'
      }`}
      role="group"
      aria-label="Language switcher"
    >
      {LANGS.map((item) => {
        const active = language === item.code;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
            className={`px-2.5 py-1 text-xs font-official font-bold tracking-[0.06em] rounded-sm transition-colors whitespace-nowrap shrink-0 ${
              active
                ? isLight
                  ? 'bg-[#1570D4] text-white'
                  : 'bg-[#D4FF00] text-[#070C1D]'
                : isLight
                  ? 'text-[#28426E] hover:text-[#0B1A36]'
                  : 'text-[#9CB0DB] hover:text-white'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
