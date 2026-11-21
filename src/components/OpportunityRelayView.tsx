import { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  PixelBookmark as Bookmark,
  PixelBookmarkCheck as BookmarkCheck,
  PixelShieldCheck as ShieldCheck,
} from './PixelIcons';
import { usePlatform } from '../context/PlatformContext';
import { db, formatTimestamp, generateSafeId, handleFirestoreError, OperationType } from '../lib/firebase';
import type { OpportunityCategory, SavedOpportunity, VerifiedOpportunity } from '../types/platform';
import { MODULE_ASSETS } from '../config/moduleAssets';
import { ModuleBanner } from './ModuleBanner';

const CATEGORIES: OpportunityCategory[] = [
  'program',
  'olympiad',
  'internship',
  'mentorship',
  'entrepreneurship',
];

export function OpportunityRelayView() {
  const { user, isCoordinator, t, signInWithGoogle, setActiveView } = usePlatform();

  const [selectedCategory, setSelectedCategory] = useState<OpportunityCategory | 'all'>('all');
  const [opportunities, setOpportunities] = useState<VerifiedOpportunity[]>([]);
  const [savedMap, setSavedMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      setLoading(true);
      try {
        const oppQuery = query(collection(db, 'opportunities'), where('status', '==', 'verified'));
        const oppSnap = await getDocs(oppQuery);
        if (!mounted) return;
        const list = oppSnap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<VerifiedOpportunity, 'id'>) }))
          .sort((a, b) => {
            const ta = (a.createdAt as { seconds?: number })?.seconds ?? 0;
            const tb = (b.createdAt as { seconds?: number })?.seconds ?? 0;
            return tb - ta;
          });
        setOpportunities(list);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'opportunities');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedMap({});
      return;
    }
    let mounted = true;
    const loadSaved = async () => {
      try {
        const q = query(collection(db, 'saved_opportunities'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        if (!mounted) return;
        const map: Record<string, string> = {};
        snap.docs.forEach((d) => {
          const data = d.data() as SavedOpportunity;
          map[data.opportunityId] = d.id;
        });
        setSavedMap(map);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'saved_opportunities');
      }
    };
    loadSaved();
    return () => {
      mounted = false;
    };
  }, [user]);

  const toggleSave = async (opp: VerifiedOpportunity) => {
    if (!user) {
      signInWithGoogle();
      return;
    }
    const existingSavedId = savedMap[opp.id];
    if (existingSavedId) {
      const path = `saved_opportunities/${existingSavedId}`;
      try {
        await deleteDoc(doc(db, 'saved_opportunities', existingSavedId));
        setSavedMap((prev) => {
          const copy = { ...prev };
          delete copy[opp.id];
          return copy;
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, path);
      }
      return;
    }

    const savedId = generateSafeId('sav');
    const path = `saved_opportunities/${savedId}`;
    try {
      await setDoc(doc(db, 'saved_opportunities', savedId), {
        userId: user.uid,
        opportunityId: opp.id,
        opportunityTitle: opp.title.slice(0, 180),
        category: opp.category,
        createdAt: serverTimestamp(),
      });
      setSavedMap((prev) => ({ ...prev, [opp.id]: savedId }));
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const filtered = opportunities.filter((o) => selectedCategory === 'all' || o.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#050608] text-[#F4F5F7] pb-20">
      <ModuleBanner
        code="04. OPPORTUNITY RELAY"
        title={t.opportunityRelayPage.title}
        subtitle={t.opportunityRelayPage.subtitle}
        image={MODULE_ASSETS.opportunityRelay}
        imageAlt="04. OPPORTUNITY RELAY — Discover Opportunities"
        accent="secondary"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Strict Verification Governance Notice */}
        <div className="p-5 rounded-md bg-[#0C0F16] border border-[#5CE1E6]/35 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3 max-w-3xl">
            <ShieldCheck className="w-5 h-5 text-[#D9FF00] shrink-0 mt-0.5" />
            <p className="text-sm text-slate-200 leading-relaxed">
              {t.opportunityRelayPage.verificationPolicy}
            </p>
          </div>
          {isCoordinator && (
            <button
              type="button"
              onClick={() => setActiveView('admin')}
              className="px-4 py-2 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
            >
              {t.adminPage.publishOpportunityTitle}
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-md bg-[#0C0F16] border border-white/12 w-full sm:w-fit">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-sm text-xs font-mono font-medium transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === 'all' ? 'bg-[#D9FF00] text-[#050608] font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            {t.opportunityRelayPage.allCategories}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-sm text-xs font-mono font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat ? 'bg-[#D9FF00] text-[#050608] font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.opportunityCategories[cat]}
            </button>
          ))}
        </div>

        {/* Verified Listings */}
        {loading ? (
          <p className="text-sm font-mono text-slate-400 py-10">{t.common.loading}</p>
        ) : filtered.length === 0 ? (
          <div className="p-12 rounded-md bg-[#0C0F16] border border-white/10 text-center space-y-4">
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              {t.opportunityRelayPage.emptyOpportunities}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filtered.map((opp) => {
              const isSaved = Boolean(savedMap[opp.id]);
              return (
                <article
                  key={opp.id}
                  className="p-5 sm:p-7 rounded-md bg-[#0C0F16] border border-white/10 flex flex-col justify-between space-y-5 sm:space-y-6"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
                      <p className="text-xs font-mono text-[#5CE1E6]">
                        {t.opportunityCategories[opp.category]} · {opp.region}
                      </p>
                      <button
                        type="button"
                        onClick={() => toggleSave(opp)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors whitespace-nowrap shrink-0 ${
                          isSaved
                            ? 'bg-[#D9FF00]/15 text-[#D9FF00] border border-[#D9FF00]/45'
                            : 'bg-[#050608] text-slate-300 hover:text-white border border-white/12'
                        }`}
                      >
                        {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                        {isSaved ? t.opportunityRelayPage.savedLabel : t.opportunityRelayPage.saveOpportunity}
                      </button>
                    </div>

                    <h3 className="font-display text-lg font-bold text-white">{opp.title}</h3>
                    <p className="text-xs font-mono text-[#D9FF00] font-medium">{opp.organization}</p>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{opp.description}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-2 text-xs text-slate-400">
                    <p>
                      <span className="text-slate-200 font-medium">{t.opportunityRelayPage.eligibilityLabel}:</span>{' '}
                      {opp.eligibility}
                    </p>
                    <p>
                      <span className="text-slate-200 font-medium">{t.opportunityRelayPage.deadlineLabel}:</span>{' '}
                      <span className="font-mono text-[#D9FF00]">{opp.deadline || '—'}</span>
                    </p>
                    <p>
                      <span className="text-slate-200 font-medium">{t.opportunityRelayPage.sourceLabel}:</span>{' '}
                      {opp.verificationSource}
                    </p>
                    <p className="text-slate-500 font-mono">
                      {t.opportunityRelayPage.verifiedBy}: {opp.verifiedByName} · {formatTimestamp(opp.createdAt)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
