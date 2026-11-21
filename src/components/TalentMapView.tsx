import { useEffect, useState } from 'react';
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  PixelArrowRight as ArrowRight,
  PixelBrain as BrainCircuit,
  PixelCheckCircle as CheckCircle2,
  PixelRotateCcw as RotateCcw,
  PixelSparkles as Sparkles,
} from './PixelIcons';
import { usePlatform } from '../context/PlatformContext';
import { computeTalentScores, DEFAULT_TALENT_QUESTIONS, TALENT_DOMAINS } from '../data/defaultQuestions';
import { db, formatTimestamp, generateSafeId, handleFirestoreError, OperationType } from '../lib/firebase';
import type { TalentDomainKey, TalentQuestion, TalentResult } from '../types/platform';
import { MODULE_ASSETS } from '../config/moduleAssets';
import { ModuleBanner } from './ModuleBanner';
import { TalentRadarChart } from './TalentRadarChart';

export function TalentMapView() {
  const { user, profile, language, t, signInWithGoogle, setActiveView, setPrefilledIdea } = usePlatform();

  const [questions, setQuestions] = useState<TalentQuestion[]>(DEFAULT_TALENT_QUESTIONS);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [history, setHistory] = useState<TalentResult[]>([]);
  const [activeResult, setActiveResult] = useState<TalentResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [takingTest, setTakingTest] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadQuestions = async () => {
      try {
        const q = query(collection(db, 'talent_questions'), where('active', '==', true));
        const snap = await getDocs(q);
        if (mounted && !snap.empty) {
          const loaded = snap.docs
            .map((d) => ({ id: d.id, ...(d.data() as Omit<TalentQuestion, 'id'>) }))
            .sort((a, b) => a.order - b.order);
          setQuestions(loaded);
        }
      } catch {
        // Keep canonical default rubric if collection has not yet been seeded
      }
    };
    loadQuestions();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }
    let mounted = true;
    const loadHistory = async () => {
      const path = 'talent_results';
      try {
        const q = query(collection(db, path), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        if (!mounted) return;
        const docs = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<TalentResult, 'id'>) }))
          .sort((a, b) => {
            const ta = (a.createdAt as { seconds?: number })?.seconds ?? 0;
            const tb = (b.createdAt as { seconds?: number })?.seconds ?? 0;
            return tb - ta;
          });
        setHistory(docs);
        if (docs.length > 0 && !activeResult) {
          setActiveResult(docs[0]);
          setTakingTest(false);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, path);
      }
    };
    loadHistory();
    return () => {
      mounted = false;
    };
  }, [user]);

  const answeredCount = questions.filter((q) => typeof answers[q.id] === 'number').length;
  const allAnswered = answeredCount === questions.length && questions.length > 0;

  const getQuestionText = (q: TalentQuestion) => {
    if (language === 'ru') return q.textRu;
    if (language === 'en') return q.textEn;
    return q.textUz;
  };

  const handleComputeAndSave = async () => {
    setErrorMsg(null);
    if (!allAnswered) {
      setErrorMsg(t.talentMapPage.answerAllNotice);
      return;
    }

    const computed = computeTalentScores(questions, answers);

    if (!user) {
      const transientResult: TalentResult = {
        id: 'local_preview',
        userId: 'guest',
        answersCount: computed.answersCount,
        scores: computed.scores,
        primaryDomain: computed.primaryDomain,
        secondaryDomain: computed.secondaryDomain,
        language,
        createdAt: new Date(),
      };
      setActiveResult(transientResult);
      setTakingTest(false);
      return;
    }

    setSaving(true);
    const resultId = generateSafeId('res');
    const path = `talent_results/${resultId}`;
    try {
      const payload = {
        userId: user.uid,
        answersCount: computed.answersCount,
        scores: computed.scores,
        primaryDomain: computed.primaryDomain,
        secondaryDomain: computed.secondaryDomain,
        language,
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'talent_results', resultId), payload);

      const savedLocal: TalentResult = {
        id: resultId,
        ...payload,
        createdAt: new Date(),
      };
      setActiveResult(savedLocal);
      setHistory((prev) => [savedLocal, ...prev]);
      setTakingTest(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateAiRoadmap = async () => {
    if (!activeResult) return;
    setErrorMsg(null);
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/talent-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scores: activeResult.scores,
          primaryDomain: t.domains[activeResult.primaryDomain].label,
          secondaryDomain: t.domains[activeResult.secondaryDomain].label,
          grade: profile?.grade || '',
          region: profile?.region || 'Navoiy viloyati',
          interests: profile?.interests || [],
          language,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'AI service returned an error.');
      }

      const aiSummary = String(data.summary || '').slice(0, 2900);
      const aiRoadmap = Array.isArray(data.roadmap) ? data.roadmap.slice(0, 8).map(String) : [];
      const aiProjectIdeas = Array.isArray(data.projectIdeas) ? data.projectIdeas.slice(0, 5).map(String) : [];

      const updated: TalentResult = {
        ...activeResult,
        aiSummary,
        aiRoadmap,
        aiProjectIdeas,
      };
      setActiveResult(updated);

      if (user && activeResult.id !== 'local_preview') {
        const path = `talent_results/${activeResult.id}`;
        try {
          await updateDoc(doc(db, 'talent_results', activeResult.id), {
            aiSummary,
            aiRoadmap,
            aiProjectIdeas,
          });
          setHistory((prev) => prev.map((item) => (item.id === activeResult.id ? updated : item)));
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, path);
        }
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to generate AI roadmap.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleStartIdeaProject = (idea: string) => {
    setPrefilledIdea(idea);
    setActiveView('school-hack');
  };

  return (
    <div className="min-h-screen bg-[#050608] text-[#F4F5F7] pb-20">
      <ModuleBanner
        code="01. TALENT MAP"
        title={t.talentMapPage.title}
        subtitle={t.talentMapPage.subtitle}
        image={MODULE_ASSETS.talentMap}
        imageAlt="01. TALENT MAP — Discover your strengths"
        accent="primary"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 space-y-6 sm:space-y-10">
        {!user && (
          <div className="p-4 sm:p-5 rounded-md bg-[#0C0F16] border border-[#D9FF00]/35 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-200">{t.talentMapPage.signInPrompt}</p>
            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full sm:w-auto px-4 py-2 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
            >
              {t.common.signInGoogle}
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-md bg-rose-950/50 border border-rose-500/40 text-sm text-rose-200">
            {t.common.errorPrefix}: {errorMsg}
          </div>
        )}

        {/* Mode Switcher when a result already exists */}
        {activeResult && (
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTakingTest(false)}
                className={`px-4 py-2 rounded-md text-xs font-mono font-semibold uppercase tracking-wider transition-colors ${
                  !takingTest ? 'bg-[#D9FF00] text-[#050608]' : 'bg-[#0C0F16] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {t.talentMapPage.resultTitle}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setTakingTest(true);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-mono font-semibold uppercase tracking-wider transition-colors ${
                  takingTest ? 'bg-[#D9FF00] text-[#050608]' : 'bg-[#0C0F16] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t.talentMapPage.retakeTest}
              </button>
            </div>
            <p className="text-xs font-mono text-slate-400">{t.talentMapPage.deterministicNotice}</p>
          </div>
        )}

        {/* DIAGNOSTIC QUESTIONNAIRE */}
        {takingTest && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-md bg-[#0C0F16] border border-white/12">
              <div>
                <p className="text-xs font-mono text-slate-400">{t.talentMapPage.progressLabel}</p>
                <p className="font-mono text-lg font-semibold text-white tabular-nums">
                  {answeredCount} / {questions.length}
                </p>
              </div>
              <div className="w-full sm:w-72 h-1.5 bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#D9FF00] transition-all duration-200"
                  style={{ width: `${questions.length ? (answeredCount / questions.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              {questions.map((q, index) => {
                const selectedVal = answers[q.id];
                return (
                  <div
                    key={q.id}
                    className="p-4 sm:p-6 rounded-md bg-[#0C0F16] border border-white/10 space-y-3.5 sm:space-y-4"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-mono text-xs text-[#5CE1E6] tabular-nums">
                        {String(index + 1).padStart(2, '0')} · {t.domains[q.domain]?.label}
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-white font-medium leading-relaxed">
                      {getQuestionText(q)}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((val) => {
                        const active = selectedVal === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: val }))}
                            className={`px-3 py-2.5 rounded-md border text-xs font-medium transition-colors text-left sm:text-center ${
                              active
                                ? 'bg-[#D9FF00] border-[#D9FF00] text-[#050608] font-semibold'
                                : 'bg-[#050608] border-white/12 text-slate-300 hover:border-[#D9FF00]/50 hover:text-white'
                            }`}
                          >
                            <span className="font-mono mr-1.5 sm:block sm:mr-0 sm:mb-0.5 tabular-nums">{val}</span>
                            <span>{t.talentMapPage.likertLabels[val - 1]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <p className="text-xs font-mono text-slate-400">{t.talentMapPage.deterministicNotice}</p>
              <button
                type="button"
                disabled={!allAnswered || saving}
                onClick={handleComputeAndSave}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] disabled:opacity-40 disabled:cursor-not-allowed text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                {saving ? t.talentMapPage.savingTest : t.talentMapPage.submitTest}
              </button>
            </div>
          </div>
        )}

        {/* RESULT VISUALIZATION & GEMINI 4 AI ROADMAP */}
        {!takingTest && activeResult && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            {/* Left Column: Radar + Deterministic Scores */}
            <div className="lg:col-span-5 p-5 sm:p-7 rounded-md bg-[#0C0F16] border border-white/12 space-y-6">
              <div>
                <p className="font-mono text-xs text-[#5CE1E6] tabular-nums">
                  {formatTimestamp(activeResult.createdAt)} · {activeResult.answersCount} Q
                </p>
                <h2 className="font-display text-xl font-bold text-white mt-1">
                  {t.talentMapPage.resultTitle}
                </h2>
              </div>

              <TalentRadarChart scores={activeResult.scores} labels={t.domains} />

              <div className="space-y-3 pt-2 border-t border-white/10">
                {TALENT_DOMAINS.map((domain) => {
                  const val = activeResult.scores[domain] ?? 0;
                  return (
                    <div key={domain} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-200 font-medium">{t.domains[domain].label}</span>
                        <span className="font-mono text-[#D9FF00] tabular-nums">{val}%</span>
                      </div>
                      <div className="h-1 bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#5CE1E6] to-[#D9FF00]"
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Primary Strengths + Gemini 4 AI Synthesis */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-md bg-[#0C0F16] border border-[#D9FF00]/40 space-y-2">
                  <p className="text-xs font-mono text-[#D9FF00]">{t.talentMapPage.primaryStrength}</p>
                  <h3 className="font-display text-lg font-bold text-white">
                    {t.domains[activeResult.primaryDomain as TalentDomainKey]?.label}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {t.domains[activeResult.primaryDomain as TalentDomainKey]?.desc}
                  </p>
                </div>

                <div className="p-6 rounded-md bg-[#0C0F16] border border-[#5CE1E6]/35 space-y-2">
                  <p className="text-xs font-mono text-[#5CE1E6]">{t.talentMapPage.secondaryStrength}</p>
                  <h3 className="font-display text-lg font-bold text-white">
                    {t.domains[activeResult.secondaryDomain as TalentDomainKey]?.label}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {t.domains[activeResult.secondaryDomain as TalentDomainKey]?.desc}
                  </p>
                </div>
              </div>

              {/* Gemini 4 AI Roadmap Panel */}
              <div className="p-5 sm:p-7 rounded-md bg-[#0C0F16] border border-white/12 space-y-5 sm:space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <BrainCircuit className="w-5 h-5 text-[#D9FF00]" />
                    <h3 className="font-display text-base font-semibold text-white">
                      {t.talentMapPage.aiSummaryTitle}
                    </h3>
                  </div>
                  <button
                    type="button"
                    disabled={aiLoading}
                    onClick={handleGenerateAiRoadmap}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] disabled:opacity-50 text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {aiLoading ? t.talentMapPage.aiAnalyzing : t.talentMapPage.aiAnalyzeBtn}
                  </button>
                </div>

                {activeResult.aiSummary ? (
                  <div className="space-y-6">
                    <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                      {activeResult.aiSummary}
                    </p>

                    {activeResult.aiRoadmap && activeResult.aiRoadmap.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-white/10">
                        <h4 className="font-mono text-xs font-semibold text-[#5CE1E6] uppercase tracking-wider">
                          {t.talentMapPage.aiRoadmapTitle}
                        </h4>
                        <ol className="space-y-2.5">
                          {activeResult.aiRoadmap.map((step, i) => (
                            <li key={i} className="flex gap-3 text-sm text-slate-200 leading-relaxed">
                              <span className="font-mono text-xs text-[#D9FF00] pt-0.5 tabular-nums">
                                0{i + 1}.
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {activeResult.aiProjectIdeas && activeResult.aiProjectIdeas.length > 0 && (
                      <div className="space-y-3 pt-4 border-t border-white/10">
                        <h4 className="font-mono text-xs font-semibold text-[#D9FF00] uppercase tracking-wider">
                          {t.talentMapPage.aiIdeasTitle}
                        </h4>
                        <div className="space-y-3">
                          {activeResult.aiProjectIdeas.map((idea, i) => (
                            <div
                              key={i}
                              className="p-4 rounded-md bg-[#050608] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                              <p className="text-sm text-slate-200 leading-relaxed">{idea}</p>
                              <button
                                type="button"
                                onClick={() => handleStartIdeaProject(idea)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#0C0F16] hover:bg-[#D9FF00] hover:text-[#050608] border border-white/15 text-xs font-mono font-medium text-white transition-colors whitespace-nowrap shrink-0"
                              >
                                {t.talentMapPage.startProjectFromIdea}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {t.talentMapPage.aiAnalyzeBtn}
                  </p>
                )}
              </div>

              {/* Saved Assessment History */}
              {history.length > 1 && (
                <div className="p-6 rounded-md bg-[#0C0F16] border border-white/10 space-y-3">
                  <h3 className="font-mono text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    {t.talentMapPage.historyTitle}
                  </h3>
                  <div className="divide-y divide-white/10">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveResult(item)}
                        className={`w-full py-3 flex items-center justify-between text-left text-sm transition-colors ${
                          activeResult.id === item.id ? 'text-[#D9FF00]' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        <span>
                          {t.domains[item.primaryDomain as TalentDomainKey]?.label} ·{' '}
                          {t.domains[item.secondaryDomain as TalentDomainKey]?.label}
                        </span>
                        <span className="font-mono text-xs text-slate-400 tabular-nums">
                          {formatTimestamp(item.createdAt)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
