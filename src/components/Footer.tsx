import { usePlatform } from '../context/PlatformContext';
import { BrandLogo } from './BrandLogo';
import { LanguageSwitch } from './LanguageSwitch';

export function Footer() {
  const { setActiveView, theme, t } = usePlatform();
  const isLight = theme === 'light';

  return (
    <footer
      className={`border-t transition-colors ${
        isLight
          ? 'border-[#1570D4]/18 bg-[#E4EEF8] text-[#28426E]'
          : 'border-[#8EA4E8]/18 bg-[#050917] text-[#9CB0DB]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-12 space-y-6 sm:space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <BrandLogo />
            <p className={`text-xs font-mono max-w-md leading-relaxed ${isLight ? 'text-[#28426E]' : 'text-[#9CB0DB]'}`}>
              FROM POTENTIAL TO REAL IMPACT · {t.hero.launchBadge}
            </p>
          </div>
          <LanguageSwitch />
        </div>

        <div
          className={`flex flex-wrap items-center justify-between gap-4 pt-5 sm:pt-6 border-t text-xs ${
            isLight ? 'border-[#1570D4]/15' : 'border-[#8EA4E8]/15'
          }`}
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:gap-5 font-official text-sm font-medium">
            <button
              type="button"
              onClick={() => setActiveView('talent-map')}
              className={`transition-colors ${isLight ? 'hover:text-[#1570D4]' : 'hover:text-[#D4FF00]'}`}
            >
              {t.nav.talentMap}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('school-hack')}
              className={`transition-colors ${isLight ? 'hover:text-[#1570D4]' : 'hover:text-[#D4FF00]'}`}
            >
              {t.nav.schoolHack}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('knowledge-bridge')}
              className={`transition-colors ${isLight ? 'hover:text-[#1570D4]' : 'hover:text-[#D4FF00]'}`}
            >
              {t.nav.knowledgeBridge}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('opportunity-relay')}
              className={`transition-colors ${isLight ? 'hover:text-[#1570D4]' : 'hover:text-[#D4FF00]'}`}
            >
              {t.nav.opportunityRelay}
            </button>
            <button
              type="button"
              onClick={() => setActiveView('dashboard')}
              className={`transition-colors ${isLight ? 'hover:text-[#1570D4]' : 'hover:text-[#D4FF00]'}`}
            >
              {t.nav.dashboard}
            </button>
          </div>

          <p className={`font-mono ${isLight ? 'text-[#506C99]' : 'text-[#6E82B0]'}`}>
            © {new Date().getFullYear()} TALENT TO IMPACT · Every talent deserves an opportunity.
          </p>
        </div>
      </div>
    </footer>
  );
}
