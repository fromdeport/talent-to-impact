import { usePlatform } from '../context/PlatformContext';
import type { ActiveView } from '../types/platform';
import { MODULE_ASSETS } from '../config/moduleAssets';
import { LanguageSwitch } from './LanguageSwitch';
import { PixelActiveBadge } from './PixelActiveBadge';
import {
  PixelArrowUpRight,
  PixelCompass,
  PixelCpu,
  PixelGlobe,
  PixelLayers,
  PixelShieldCheck,
  PixelUsers,
} from './PixelIcons';
import { PixelSkyBackdrop } from './PixelSkyBackdrop';

export function HomeView() {
  const { setActiveView, user, signInWithGoogle, theme, t } = usePlatform();
  const isLight = theme === 'light';

  const modules: {
    id: ActiveView;
    code: string;
    title: string;
    tagline: string;
    desc: string;
    image: string;
    accent: string;
  }[] = [
    {
      id: 'talent-map',
      ...t.modules.talentMap,
      image: MODULE_ASSETS.talentMap,
      accent: isLight ? 'text-[#1570D4]' : 'text-[#D4FF00]',
    },
    {
      id: 'school-hack',
      ...t.modules.schoolHack,
      image: MODULE_ASSETS.schoolHack,
      accent: isLight ? 'text-[#0B4EA2]' : 'text-[#8FD3FF]',
    },
    {
      id: 'knowledge-bridge',
      ...t.modules.knowledgeBridge,
      image: MODULE_ASSETS.knowledgeBridge,
      accent: isLight ? 'text-[#1570D4]' : 'text-[#D4FF00]',
    },
    {
      id: 'opportunity-relay',
      ...t.modules.opportunityRelay,
      image: MODULE_ASSETS.opportunityRelay,
      accent: isLight ? 'text-[#0B4EA2]' : 'text-[#8FD3FF]',
    },
  ];

  const scalabilityTracks = [
    { name: 'AI & Engineering', active: true, icon: PixelCpu },
    { name: 'Research & Science', active: true, icon: PixelCompass },
    { name: 'Entrepreneurship', active: true, icon: PixelLayers },
    { name: 'Leadership Development', active: true, icon: PixelUsers },
    { name: 'Finance & Economics', active: false, icon: PixelShieldCheck },
    { name: 'International Education', active: false, icon: PixelGlobe },
  ];

  const scrollToModules = () => {
    const el = document.getElementById('ecosystem-modules');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className={`min-h-screen transition-colors ${
        isLight ? 'bg-[#EAF6FF] text-[#0B1A36]' : 'bg-[#090E23] text-[#F4F7FF]'
      }`}
    >
      {/* HERO SECTION — Native 60fps Pixel Sky Backdrop (Zero Watermark) */}
      <section
        className={`relative overflow-hidden border-b ${
          isLight ? 'border-[#1570D4]/20' : 'border-[#8EA4E8]/18'
        }`}
      >
        <PixelSkyBackdrop variant="hero" />

        {/* Theme-tuned atmospheric scrim: preserves full text readability while letting the Pixel Sky shine */}
        {isLight ? (
          <>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#EAF6FF]/82 via-[#EAF6FF]/42 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#EAF6FF]/90 via-transparent to-[#4FA3E8]/15" />
          </>
        ) : (
          <>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#090E23]/76 via-[#090E23]/34 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090E23]/92 via-transparent to-[#090E23]/20" />
          </>
        )}

        <div className="pointer-events-none relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-14 sm:pt-6 sm:pb-20 lg:pt-8 lg:pb-28">
          {/* Clean right-aligned language switcher (top launch-region badge removed) */}
          <div className="flex items-center justify-end pb-3 sm:pb-4">
            <div className="pointer-events-auto">
              <LanguageSwitch />
            </div>
          </div>

          <div className="mt-4 sm:mt-8 lg:mt-12 max-w-2xl space-y-5 sm:space-y-7">
            <p
              className={`pointer-events-auto inline-block text-xs sm:text-base font-pixel font-semibold tracking-wide ${
                isLight
                  ? 'text-[#1570D4]'
                  : 'text-[#8FD3FF] drop-shadow-[0_2px_10px_rgba(9,14,35,0.85)]'
              }`}
            >
              {t.hero.eyebrow}
            </p>

            <h1
              className={`pointer-events-auto font-display font-bold text-[1.7rem] sm:text-5xl lg:text-[3.35rem] leading-[1.08] sm:leading-[1.06] tracking-[-0.03em] ${
                isLight
                  ? 'text-[#0B1A36]'
                  : 'text-[#F4F7FF] drop-shadow-[0_4px_24px_rgba(9,14,35,0.8)]'
              }`}
            >
              TALENT TO IMPACT
              <span
                className={`block mt-2 sm:mt-3 ${
                  isLight ? 'text-[#1570D4]' : 'text-[#D4FF00]'
                }`}
              >
                {t.hero.headline}
              </span>
            </h1>

            <p
              className={`pointer-events-auto font-pixel text-xl sm:text-3xl font-medium leading-snug ${
                isLight
                  ? 'text-[#14305C]'
                  : 'text-[#FFF3B8] drop-shadow-[0_2px_14px_rgba(9,14,35,0.85)]'
              }`}
            >
              {t.hero.subheadline}
            </p>

            <p
              className={`pointer-events-auto text-sm sm:text-base leading-relaxed max-w-xl ${
                isLight
                  ? 'text-[#1F3A66] font-medium'
                  : 'text-[#D6E1FA] drop-shadow-[0_2px_12px_rgba(9,14,35,0.85)]'
              }`}
            >
              {t.hero.mission}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pointer-events-auto pt-1 sm:pt-2 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-3.5">
              <button
                type="button"
                onClick={() => setActiveView('talent-map')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#D4FF00] hover:bg-[#C2EC00] text-[#090E23] text-sm font-pixel font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                {t.hero.ctaDiscover}
                <PixelArrowUpRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setActiveView('school-hack')}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border text-sm font-pixel font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                  isLight
                    ? 'bg-white/90 hover:bg-white border-[#1570D4]/30 text-[#0B1A36]'
                    : 'bg-[#101733]/85 hover:bg-[#172145] border-[#8EA4E8]/30 text-[#F4F7FF]'
                }`}
              >
                {t.hero.ctaProject}
              </button>

              <button
                type="button"
                onClick={scrollToModules}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-md text-sm font-pixel font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                  isLight
                    ? 'text-[#0B1A36] hover:text-[#1570D4]'
                    : 'text-[#C5D3F0] hover:text-[#D4FF00] drop-shadow-[0_2px_8px_rgba(9,14,35,0.85)]'
                }`}
              >
                {t.hero.ctaExplore}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOUR CORE MODULES — Alternating 12-Col Architectural Showcase */}
      <section id="ecosystem-modules" className="py-14 sm:py-20 lg:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-9 sm:mb-14 space-y-2.5 sm:space-y-3">
          <h2
            className={`font-display text-2xl sm:text-4xl font-bold leading-tight ${
              isLight ? 'text-[#0B1A36]' : 'text-[#F4F7FF]'
            }`}
          >
            {t.home.modulesTitle}
          </h2>
          <p
            className={`font-pixel text-lg sm:text-2xl leading-snug ${
              isLight ? 'text-[#28426E]' : 'text-[#B9C9EE]'
            }`}
          >
            {t.home.modulesSubtitle}
          </p>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {modules.map((mod, idx) => {
            const reversed = idx % 2 === 1;
            return (
              <article
                key={mod.id}
                className={`group grid grid-cols-1 lg:grid-cols-12 rounded-md overflow-hidden border items-stretch transition-colors ${
                  isLight
                    ? 'border-[#1570D4]/20 bg-white shadow-[0_8px_28px_rgba(21,112,212,0.08)] hover:border-[#1570D4]/45'
                    : 'border-[#8EA4E8]/18 bg-[#101733] hover:border-[#8FD3FF]/40'
                }`}
              >
                <div
                  className={`lg:col-span-6 relative min-h-[210px] sm:min-h-[260px] lg:min-h-[340px] bg-white p-5 sm:p-8 flex items-center justify-center overflow-hidden border-b lg:border-b-0 ${
                    isLight
                      ? reversed
                        ? 'lg:border-l border-[#1570D4]/15'
                        : 'lg:border-r border-[#1570D4]/15'
                      : reversed
                        ? 'lg:border-l border-[#8EA4E8]/18'
                        : 'lg:border-r border-[#8EA4E8]/18'
                  } ${reversed ? 'lg:order-2' : 'lg:order-1'}`}
                >
                  <img
                    src={mod.image}
                    alt={`${mod.code} — ${mod.title}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full max-h-[195px] sm:max-h-[260px] lg:max-h-[275px] object-contain group-hover:scale-[1.04] transition-transform duration-300"
                  />
                </div>

                <div
                  className={`lg:col-span-6 p-5 sm:p-8 lg:p-12 flex flex-col justify-between space-y-5 sm:space-y-6 ${
                    reversed ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <div className="space-y-3 sm:space-y-4">
                    <p className={`font-pixel text-xs sm:text-base font-semibold tracking-wider ${mod.accent}`}>
                      {mod.code}
                    </p>
                    <h3
                      className={`font-display text-xl sm:text-3xl font-bold leading-tight ${
                        isLight ? 'text-[#0B1A36]' : 'text-[#F4F7FF]'
                      }`}
                    >
                      {mod.title}
                    </h3>
                    <p
                      className={`font-pixel text-lg sm:text-2xl leading-snug ${
                        isLight ? 'text-[#1570D4]' : 'text-[#FFF3B8]'
                      }`}
                    >
                      {mod.tagline}
                    </p>
                    <p
                      className={`text-sm sm:text-base leading-relaxed ${
                        isLight ? 'text-[#28426E]' : 'text-[#C5D3F0]'
                      }`}
                    >
                      {mod.desc}
                    </p>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setActiveView(mod.id)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#D4FF00] hover:bg-[#C2EC00] text-[#090E23] text-sm font-pixel font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
                    >
                      {t.home.openModule}
                      <PixelArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* SCALABILITY ARCHITECTURE & HONEST DEVELOPMENT PRINCIPLES */}
      <section
        className={`border-t py-14 sm:py-20 transition-colors ${
          isLight
            ? 'border-[#1570D4]/20 bg-[#DCEFFF]'
            : 'border-[#8EA4E8]/18 bg-[#0D142E]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h2
                className={`font-display text-2xl sm:text-3xl font-bold ${
                  isLight ? 'text-[#0B1A36]' : 'text-[#F4F7FF]'
                }`}
              >
                {t.home.scalabilityTitle}
              </h2>
              <p
                className={`font-pixel text-lg sm:text-xl leading-snug ${
                  isLight ? 'text-[#28426E]' : 'text-[#C5D3F0]'
                }`}
              >
                {t.home.scalabilitySubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              {scalabilityTracks.map((track, idx) => {
                const Icon = track.icon;
                return (
                  <div
                    key={track.name}
                    className={`p-4 sm:p-5 rounded-md border flex items-center justify-between gap-3 sm:gap-4 transition-colors ${
                      isLight
                        ? 'bg-white border-[#1570D4]/20 shadow-xs'
                        : 'bg-[#101733] border-[#8EA4E8]/16'
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isLight ? 'text-[#1570D4]' : 'text-[#8FD3FF]'
                          }`}
                        />
                        <h3
                          className={`font-display text-xs sm:text-sm font-semibold leading-snug ${
                            isLight ? 'text-[#0B1A36]' : 'text-[#F4F7FF]'
                          }`}
                        >
                          {track.name}
                        </h3>
                      </div>
                      <p
                        className={`text-xs font-mono ${
                          isLight ? 'text-[#506C99]' : 'text-[#889BC7]'
                        }`}
                      >
                        {track.active ? t.home.activeStatus : t.home.inDevelopmentStatus}
                      </p>
                    </div>
                    {track.active ? (
                      <PixelActiveBadge delayMs={idx * 420} />
                    ) : (
                      <span
                        className={`font-pixel text-xs font-semibold tracking-wider shrink-0 ${
                          isLight ? 'text-[#7C95BC]' : 'text-[#5D709E]'
                        }`}
                      >
                        DEV
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div
              className={`p-5 sm:p-7 rounded-md border space-y-5 ${
                isLight
                  ? 'bg-white border-[#1570D4]/20 shadow-xs'
                  : 'bg-[#101733] border-[#8EA4E8]/18'
              }`}
            >
              <h3
                className={`font-display text-lg font-bold ${
                  isLight ? 'text-[#0B1A36]' : 'text-[#F4F7FF]'
                }`}
              >
                {t.home.aboutTitle}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  isLight ? 'text-[#28426E]' : 'text-[#C5D3F0]'
                }`}
              >
                {t.home.aboutBody}
              </p>

              <div
                className={`pt-4 border-t space-y-3 ${
                  isLight ? 'border-[#1570D4]/15' : 'border-[#8EA4E8]/15'
                }`}
              >
                <h4
                  className={`font-pixel text-sm font-semibold uppercase tracking-wider ${
                    isLight ? 'text-[#1570D4]' : 'text-[#D4FF00]'
                  }`}
                >
                  {t.home.principlesTitle}
                </h4>
                <ul
                  className={`space-y-2.5 text-sm ${
                    isLight ? 'text-[#28426E]' : 'text-[#C5D3F0]'
                  }`}
                >
                  {t.home.principlesItems.map((item) => (
                    <li key={item} className="leading-relaxed">
                      — {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL VISION SECTION — Native 60fps Pixel Sky Backdrop */}
      <section
        className={`relative overflow-hidden border-t py-16 sm:py-24 ${
          isLight ? 'border-[#1570D4]/20' : 'border-[#8EA4E8]/18'
        }`}
      >
        <PixelSkyBackdrop variant="ambient" />
        <div
          className={`pointer-events-none absolute inset-0 ${
            isLight
              ? 'bg-gradient-to-t from-[#EAF6FF]/88 via-[#EAF6FF]/52 to-[#EAF6FF]/72'
              : 'bg-gradient-to-t from-[#090E23]/88 via-[#090E23]/48 to-[#090E23]/76'
          }`}
        />

        <div className="pointer-events-none relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 sm:space-y-6">
          <h2
            className={`pointer-events-auto font-display text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${
              isLight
                ? 'text-[#0B1A36]'
                : 'text-[#F4F7FF] drop-shadow-[0_4px_24px_rgba(9,14,35,0.8)]'
            }`}
          >
            {t.home.visionTitle}
          </h2>
          <p
            className={`pointer-events-auto font-pixel text-lg sm:text-2xl leading-relaxed max-w-2xl mx-auto ${
              isLight
                ? 'text-[#14305C]'
                : 'text-[#FFF3B8] drop-shadow-[0_2px_12px_rgba(9,14,35,0.8)]'
            }`}
          >
            {t.home.visionSubtitle}
          </p>
          <div className="pointer-events-auto pt-2 sm:pt-4 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setActiveView('talent-map')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#D4FF00] hover:bg-[#C2EC00] text-[#090E23] text-sm font-pixel font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
            >
              {t.hero.ctaDiscover}
              <PixelArrowUpRight className="w-4 h-4" />
            </button>
            {!user && (
              <button
                type="button"
                onClick={signInWithGoogle}
                className={`w-full sm:w-auto px-6 py-3 rounded-md border text-sm font-pixel font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 ${
                  isLight
                    ? 'border-[#1570D4]/30 bg-white/90 hover:bg-white text-[#0B1A36]'
                    : 'border-[#8EA4E8]/30 bg-[#101733]/85 hover:bg-[#172145] text-[#F4F7FF]'
                }`}
              >
                {t.common.signInGoogle}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
