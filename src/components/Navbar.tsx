import { useState } from 'react';
import { usePlatform } from '../context/PlatformContext';
import type { ActiveView } from '../types/platform';
import { BrandLogo } from './BrandLogo';
import { LanguageSwitch } from './LanguageSwitch';
import { PixelClose, PixelMenu, PixelMoon, PixelSun } from './PixelIcons';

export function Navbar() {
  const { user, profile, isCoordinator, activeView, setActiveView, signInWithGoogle, theme, toggleTheme, t } =
    usePlatform();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLight = theme === 'light';

  const navItems: { id: ActiveView; label: string }[] = [
    { id: 'talent-map', label: t.nav.talentMap },
    { id: 'school-hack', label: t.nav.schoolHack },
    { id: 'knowledge-bridge', label: t.nav.knowledgeBridge },
    { id: 'opportunity-relay', label: t.nav.opportunityRelay },
    ...(isCoordinator ? [{ id: 'admin' as ActiveView, label: t.nav.admin }] : []),
  ];

  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-colors ${
        isLight
          ? 'border-[#1570D4]/20 bg-[#EAF6FF]/85'
          : 'border-[#8EA4E8]/18 bg-[#090E23]/82'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-6">
        {/* Zone 1: Brand mark & wordmark */}
        <button
          type="button"
          onClick={() => handleNavigate('home')}
          className="text-left focus-visible:outline-2 focus-visible:outline-offset-4 rounded-sm whitespace-nowrap shrink-0"
          aria-label="TALENT TO IMPACT Home"
        >
          <BrandLogo />
        </button>

        {/* Zone 2: Primary navigation links (Desktop lg+) */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`font-pixel text-[15px] font-medium tracking-wide transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                  active
                    ? isLight
                      ? 'text-[#1570D4] border-[#1570D4]'
                      : 'text-[#D4FF00] border-[#D4FF00]'
                    : isLight
                      ? 'text-[#28426E] border-transparent hover:text-[#0B1A36] hover:border-[#1570D4]/40'
                      : 'text-[#C5D3F0] border-transparent hover:text-white hover:border-[#8FD3FF]/45'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Theme Switcher + Primary Action */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
            title={isLight ? 'Dark Mode' : 'Light Mode'}
            className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 sm:py-2 rounded-md border text-xs font-pixel font-semibold tracking-wider transition-colors whitespace-nowrap shrink-0 ${
              isLight
                ? 'bg-white/90 hover:bg-white border-[#1570D4]/25 text-[#0B1A36]'
                : 'bg-[#101733]/90 hover:bg-[#172145] border-[#8EA4E8]/25 text-[#FFF3B8]'
            }`}
          >
            {isLight ? (
              <PixelMoon className="w-4 h-4 text-[#1570D4]" />
            ) : (
              <PixelSun className="w-4 h-4 text-[#FFF3B8]" />
            )}
            <span className="hidden sm:inline">{isLight ? 'NIGHT' : 'DAY'}</span>
          </button>

          {user ? (
            <button
              type="button"
              onClick={() => handleNavigate('dashboard')}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs font-pixel font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0 max-w-[96px] sm:max-w-none truncate ${
                activeView === 'dashboard'
                  ? isLight
                    ? 'bg-[#1570D4] text-white'
                    : 'bg-[#8FD3FF] text-[#090E23]'
                  : 'bg-[#D4FF00] hover:bg-[#C2EC00] text-[#090E23]'
              }`}
            >
              {profile?.displayName ? profile.displayName.split(' ')[0] : t.nav.dashboard}
            </button>
          ) : (
            <button
              type="button"
              onClick={signInWithGoogle}
              className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs font-pixel font-semibold uppercase tracking-wider bg-[#D4FF00] hover:bg-[#C2EC00] text-[#090E23] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.signIn}
            </button>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`lg:hidden p-1.5 sm:p-2 rounded-md transition-colors ${
              isLight
                ? 'text-[#0B1A36] hover:bg-[#1570D4]/10'
                : 'text-[#C5D3F0] hover:text-white hover:bg-white/5'
            }`}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <PixelClose className="w-5 h-5" /> : <PixelMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet navigation drawer (< lg) */}
      {mobileOpen && (
        <div
          className={`lg:hidden border-t px-4 sm:px-6 py-4 space-y-3 shadow-lg ${
            isLight
              ? 'border-[#1570D4]/20 bg-[#EAF6FF]/98'
              : 'border-[#8EA4E8]/18 bg-[#090E23]/98'
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={`block w-full text-left px-3.5 py-2.5 rounded-md font-pixel text-base font-medium transition-colors ${
                  activeView === item.id
                    ? isLight
                      ? 'bg-[#1570D4]/14 text-[#1570D4] border border-[#1570D4]/25'
                      : 'bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/30'
                    : isLight
                      ? 'text-[#28426E] hover:bg-[#1570D4]/10 hover:text-[#0B1A36] border border-transparent'
                      : 'text-[#C5D3F0] hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <button
                type="button"
                onClick={() => handleNavigate('dashboard')}
                className={`block w-full text-left px-3.5 py-2.5 rounded-md font-pixel text-base font-medium transition-colors ${
                  activeView === 'dashboard'
                    ? isLight
                      ? 'bg-[#1570D4]/14 text-[#1570D4] border border-[#1570D4]/25'
                      : 'bg-[#D4FF00]/15 text-[#D4FF00] border border-[#D4FF00]/30'
                    : isLight
                      ? 'text-[#28426E] hover:bg-[#1570D4]/10 hover:text-[#0B1A36] border border-transparent'
                      : 'text-[#C5D3F0] hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                {t.nav.dashboard}
              </button>
            )}
          </div>

          <div
            className={`pt-3 border-t flex items-center justify-between gap-3 ${
              isLight ? 'border-[#1570D4]/15' : 'border-[#8EA4E8]/15'
            }`}
          >
            <span
              className={`font-pixel text-xs uppercase tracking-wider ${
                isLight ? 'text-[#506C99]' : 'text-[#889BC7]'
              }`}
            >
              {isLight ? 'DAY MODE' : 'NIGHT MODE'}
            </span>
            <LanguageSwitch />
          </div>
        </div>
      )}
    </header>
  );
}
