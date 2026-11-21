import { AdminPanelView } from './components/AdminPanelView';
import { DashboardView } from './components/DashboardView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { KnowledgeBridgeView } from './components/KnowledgeBridgeView';
import { Navbar } from './components/Navbar';
import { OpportunityRelayView } from './components/OpportunityRelayView';
import { SchoolHackView } from './components/SchoolHackView';
import { TalentMapView } from './components/TalentMapView';
import { PlatformProvider, usePlatform } from './context/PlatformContext';

function PlatformShell() {
  const { activeView, authError, clearAuthError } = usePlatform();

  return (
    <div className="min-h-screen flex flex-col overflow-x-clip bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors">
      <Navbar />

      {authError && (
        <div className="bg-rose-950/80 border-b border-rose-500/40 px-4 py-2.5 text-center text-xs text-rose-200 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <span>{authError}</span>
          <button type="button" onClick={clearAuthError} className="underline hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      <div className="flex-1">
        {activeView === 'home' && <HomeView />}
        {activeView === 'talent-map' && <TalentMapView />}
        {activeView === 'school-hack' && <SchoolHackView />}
        {activeView === 'knowledge-bridge' && <KnowledgeBridgeView />}
        {activeView === 'opportunity-relay' && <OpportunityRelayView />}
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'admin' && <AdminPanelView />}
      </div>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PlatformProvider>
        <PlatformShell />
      </PlatformProvider>
    </ErrorBoundary>
  );
}
