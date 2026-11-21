import { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  PixelBell as Bell,
  PixelBookmark as Bookmark,
  PixelCheckCircle as Check,
  PixelCompass as Compass,
  PixelFolderKanban as FolderKanban,
  PixelLogOut as LogOut,
  PixelMessageSquare as MessageSquare,
  PixelShieldCheck as Shield,
  PixelUser as UserIcon,
} from './PixelIcons';
import { usePlatform } from '../context/PlatformContext';
import { GRADES, NAVOI_DISTRICTS, UZBEKISTAN_REGIONS } from '../i18n/translations';
import { db, formatTimestamp, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  FIELD_LIMITS,
  type CommunityPost,
  type Language,
  type SavedOpportunity,
  type StudentProject,
  type TalentDomainKey,
  type TalentResult,
  type UserNotification,
} from '../types/platform';
import { LanguageSwitch } from './LanguageSwitch';
import { TalentRadarChart } from './TalentRadarChart';

type DashTab = 'profile' | 'talent' | 'projects' | 'activities' | 'saved' | 'notifications';

export function DashboardView() {
  const {
    user,
    profile,
    isCoordinator,
    language,
    t,
    signInWithGoogle,
    signOutUser,
    updateUserProfile,
    setActiveView,
  } = usePlatform();

  const [activeTab, setActiveTab] = useState<DashTab>('profile');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Profile form fields
  const [displayName, setDisplayName] = useState('');
  const [region, setRegion] = useState<string>('Navoiy viloyati');
  const [district, setDistrict] = useState<string>('Navoiy shahri');
  const [school, setSchool] = useState('');
  const [grade, setGrade] = useState<string>('10-sinf');
  const [bio, setBio] = useState('');
  const [interestsRaw, setInterestsRaw] = useState('');
  const [prefLang, setPrefLang] = useState<Language>(language);

  // User data collections
  const [talentResults, setTalentResults] = useState<TalentResult[]>([]);
  const [myProjects, setMyProjects] = useState<StudentProject[]>([]);
  const [myPosts, setMyPosts] = useState<CommunityPost[]>([]);
  const [savedOpps, setSavedOpps] = useState<SavedOpportunity[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setRegion(profile.region || 'Navoiy viloyati');
      setDistrict(profile.district || '');
      setSchool(profile.school || '');
      setGrade(profile.grade || '10-sinf');
      setBio(profile.bio || '');
      setInterestsRaw((profile.interests || []).join(', '));
      setPrefLang(profile.language || language);
    }
  }, [profile, language]);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    const loadPersonalData = async () => {
      try {
        const [resSnap, projSnap, postSnap, savedSnap, notifSnap] = await Promise.all([
          getDocs(query(collection(db, 'talent_results'), where('userId', '==', user.uid))),
          getDocs(query(collection(db, 'projects'), where('ownerId', '==', user.uid))),
          getDocs(query(collection(db, 'community_posts'), where('authorId', '==', user.uid))),
          getDocs(query(collection(db, 'saved_opportunities'), where('userId', '==', user.uid))),
          getDocs(query(collection(db, 'notifications'), where('userId', '==', user.uid))),
        ]);
        if (!mounted) return;
        setTalentResults(
          resSnap.docs
            .map((d) => ({ id: d.id, ...(d.data() as Omit<TalentResult, 'id'>) }))
            .sort((a, b) => ((b.createdAt as { seconds?: number })?.seconds ?? 0) - ((a.createdAt as { seconds?: number })?.seconds ?? 0)),
        );
        setMyProjects(
          projSnap.docs
            .map((d) => ({ id: d.id, ...(d.data() as Omit<StudentProject, 'id'>) }))
            .sort((a, b) => ((b.updatedAt as { seconds?: number })?.seconds ?? 0) - ((a.updatedAt as { seconds?: number })?.seconds ?? 0)),
        );
        setMyPosts(
          postSnap.docs
            .map((d) => ({ id: d.id, ...(d.data() as Omit<CommunityPost, 'id'>) }))
            .sort((a, b) => ((b.createdAt as { seconds?: number })?.seconds ?? 0) - ((a.createdAt as { seconds?: number })?.seconds ?? 0)),
        );
        setSavedOpps(savedSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SavedOpportunity, 'id'>) })));
        setNotifications(
          notifSnap.docs
            .map((d) => ({ id: d.id, ...(d.data() as Omit<UserNotification, 'id'>) }))
            .sort((a, b) => ((b.createdAt as { seconds?: number })?.seconds ?? 0) - ((a.createdAt as { seconds?: number })?.seconds ?? 0)),
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'dashboard_collections');
      }
    };
    loadPersonalData();
    return () => {
      mounted = false;
    };
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[70vh] bg-[#050608] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-md bg-[#0C0F16] border border-white/12 text-center space-y-5">
          <h1 className="font-display text-2xl font-bold">{t.dashboardPage.title}</h1>
          <p className="text-sm text-slate-300 leading-relaxed">{t.dashboardPage.signInRequired}</p>
          <button
            type="button"
            onClick={signInWithGoogle}
            className="w-full px-5 py-3 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider transition-colors"
          >
            {t.common.signInGoogle}
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setSavedToast(false);
    try {
      await updateUserProfile({
        displayName,
        region,
        district,
        school,
        grade,
        bio,
        interests: interestsRaw
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        language: prefLang,
      });
      setSavedToast(true);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleMarkNotificationRead = async (notifId: string) => {
    const path = `notifications/${notifId}`;
    try {
      await updateDoc(doc(db, 'notifications', notifId), { read: true });
      setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, read: true } : n)));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const handleRemoveSaved = async (savedId: string) => {
    const path = `saved_opportunities/${savedId}`;
    try {
      await deleteDoc(doc(db, 'saved_opportunities', savedId));
      setSavedOpps((prev) => prev.filter((s) => s.id !== savedId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const navButtons: { id: DashTab; label: string; count?: number; icon: typeof UserIcon }[] = [
    { id: 'profile', label: t.dashboardPage.tabs.profile, icon: UserIcon },
    { id: 'talent', label: t.dashboardPage.tabs.talent, count: talentResults.length, icon: Compass },
    { id: 'projects', label: t.dashboardPage.tabs.projects, count: myProjects.length, icon: FolderKanban },
    { id: 'activities', label: t.dashboardPage.tabs.activities, count: myPosts.length, icon: MessageSquare },
    { id: 'saved', label: t.dashboardPage.tabs.saved, count: savedOpps.length, icon: Bookmark },
    { id: 'notifications', label: t.dashboardPage.tabs.notifications, count: unreadCount, icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-[#050608] text-[#F4F5F7] pb-20">
      <div className="border-b border-white/12 bg-[#080A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-mono text-xs text-[#D9FF00]">
              {profile ? t.roles[profile.role] : ''} · {profile?.region || 'Navoiy viloyati'}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {profile?.displayName || user.displayName || t.dashboardPage.title}
            </h1>
            <p className="text-sm text-slate-400">{t.dashboardPage.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <LanguageSwitch />
            {isCoordinator && (
              <button
                type="button"
                onClick={() => setActiveView('admin')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#0C0F16] hover:bg-white/10 border border-[#5CE1E6]/40 text-xs font-mono font-medium text-[#5CE1E6]"
              >
                <Shield className="w-3.5 h-3.5" />
                {t.nav.admin}
              </button>
            )}
            <button
              type="button"
              onClick={signOutUser}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-white/15 hover:bg-white/5 text-xs font-mono font-medium text-slate-300 hover:text-white"
            >
              <LogOut className="w-3.5 h-3.5" />
              {t.nav.signOut}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Sidebar Navigation (compact 2/3-col grid on mobile/tablet, vertical sidebar on lg desktop) */}
        <aside className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 lg:gap-1.5 content-start">
          {navButtons.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-xs font-mono font-medium transition-colors ${
                  active
                    ? 'bg-[#D9FF00] text-[#050608] font-semibold'
                    : 'bg-[#0C0F16] text-slate-300 hover:bg-[#131823] hover:text-white border border-white/8'
                }`}
              >
                <span className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </span>
                {typeof item.count === 'number' && (
                  <span className="font-mono text-xs tabular-nums opacity-85 shrink-0">{item.count}</span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Main Content Viewport */}
        <main className="lg:col-span-9">
          {activeTab === 'profile' && (
            <div className="p-5 sm:p-7 rounded-md bg-[#0C0F16] border border-white/12 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
                <h2 className="font-display text-lg font-bold">{t.dashboardPage.tabs.profile}</h2>
                <span className="font-mono text-xs text-slate-400">
                  {t.dashboardPage.roleLabel}: <strong className="text-[#D9FF00]">{profile ? t.roles[profile.role] : '—'}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300">Name</label>
                  <input
                    type="text"
                    maxLength={FIELD_LIMITS.displayNameMax}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300">Email</label>
                  <input
                    type="text"
                    disabled
                    value={profile?.email || user.email || ''}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#050608]/50 border border-white/10 text-sm text-slate-400 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300">{t.dashboardPage.regionLabel}</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                  >
                    {UZBEKISTAN_REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300">{t.dashboardPage.districtLabel}</label>
                  {region === 'Navoiy viloyati' ? (
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                    >
                      {NAVOI_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      maxLength={FIELD_LIMITS.districtMax}
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                    />
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300">{t.dashboardPage.schoolLabel}</label>
                  <input
                    type="text"
                    maxLength={FIELD_LIMITS.schoolMax}
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="11-sonli ixtisoslashtirilgan maktab"
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-300">{t.dashboardPage.gradeLabel}</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-300">Language</label>
                    <select
                      value={prefLang}
                      onChange={(e) => setPrefLang(e.target.value as Language)}
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                    >
                      <option value="uz">O‘zbekcha</option>
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">{t.dashboardPage.interestsLabel}</label>
                <input
                  type="text"
                  value={interestsRaw}
                  onChange={(e) => setInterestsRaw(e.target.value)}
                  placeholder="AI, Robotics, Physics, Debate"
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">{t.dashboardPage.bioLabel}</label>
                <textarea
                  rows={3}
                  maxLength={FIELD_LIMITS.bioMax}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                {savedToast ? (
                  <p className="text-xs font-mono text-[#D9FF00] inline-flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    {t.dashboardPage.savedSuccess}
                  </p>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  disabled={savingProfile}
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider transition-colors"
                >
                  {t.dashboardPage.saveProfile}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'talent' && (
            <div className="space-y-6">
              {talentResults.length === 0 ? (
                <div className="p-10 rounded-md bg-[#0C0F16] border border-white/10 text-center space-y-4">
                  <p className="text-sm text-slate-300">{t.talentMapPage.noResultsYet}</p>
                  <button
                    type="button"
                    onClick={() => setActiveView('talent-map')}
                    className="px-5 py-2.5 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider"
                  >
                    {t.hero.ctaDiscover}
                  </button>
                </div>
              ) : (
                <div className="p-5 sm:p-7 rounded-md bg-[#0C0F16] border border-white/12 space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs text-[#5CE1E6] tabular-nums">
                        {formatTimestamp(talentResults[0].createdAt)}
                      </p>
                      <h2 className="font-display text-lg font-bold mt-1">
                        {t.domains[talentResults[0].primaryDomain as TalentDomainKey]?.label} ·{' '}
                        {t.domains[talentResults[0].secondaryDomain as TalentDomainKey]?.label}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveView('talent-map')}
                      className="px-4 py-2 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] text-xs font-mono font-semibold uppercase tracking-wider text-[#050608]"
                    >
                      {t.home.openModule}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <TalentRadarChart scores={talentResults[0].scores} labels={t.domains} />
                    <div className="space-y-4">
                      {talentResults[0].aiSummary && (
                        <p className="text-sm text-slate-200 leading-relaxed">{talentResults[0].aiSummary}</p>
                      )}
                      {talentResults[0].aiRoadmap && talentResults[0].aiRoadmap.length > 0 && (
                        <ol className="space-y-2 text-xs text-slate-300">
                          {talentResults[0].aiRoadmap.map((step, idx) => (
                            <li key={idx}>
                              <span className="font-mono text-[#D9FF00] mr-2">0{idx + 1}.</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-4">
              {myProjects.length === 0 ? (
                <div className="p-10 rounded-md bg-[#0C0F16] border border-white/10 text-center space-y-4">
                  <p className="text-sm text-slate-300">{t.schoolHackPage.emptyProjects}</p>
                  <button
                    type="button"
                    onClick={() => setActiveView('school-hack')}
                    className="px-5 py-2.5 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider"
                  >
                    {t.schoolHackPage.newProject}
                  </button>
                </div>
              ) : (
                myProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-6 rounded-md bg-[#0C0F16] border border-white/10 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-xl">
                      <p className="text-xs font-mono text-[#5CE1E6]">
                        {t.tracks[proj.track]} · {t.projectStatus[proj.status]} · {proj.progress}%
                      </p>
                      <h3 className="font-display text-base font-bold text-white">{proj.title}</h3>
                      <p className="text-sm text-slate-300">{proj.summary}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveView('school-hack')}
                      className="px-4 py-2 rounded-md bg-white/10 hover:bg-[#D9FF00] hover:text-[#050608] text-xs font-mono font-semibold text-white transition-colors"
                    >
                      {t.common.view}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-4">
              {myPosts.length === 0 ? (
                <div className="p-10 rounded-md bg-[#0C0F16] border border-white/10 text-center space-y-4">
                  <p className="text-sm text-slate-300">{t.dashboardPage.noActivities}</p>
                  <button
                    type="button"
                    onClick={() => setActiveView('knowledge-bridge')}
                    className="px-5 py-2.5 rounded-md bg-[#D9FF00] text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider"
                  >
                    {t.home.openModule}
                  </button>
                </div>
              ) : (
                myPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-6 rounded-md bg-[#0C0F16] border border-white/10 space-y-2"
                  >
                    <p className="text-xs font-mono text-[#5CE1E6]">
                      {t.communities[post.community]} · {t.postTypes[post.postType]} · {formatTimestamp(post.createdAt)}
                    </p>
                    <h3 className="font-display text-base font-bold text-white">{post.title}</h3>
                    <p className="text-sm text-slate-300 line-clamp-2">{post.content}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="space-y-4">
              {savedOpps.length === 0 ? (
                <div className="p-10 rounded-md bg-[#0C0F16] border border-white/10 text-center space-y-4">
                  <p className="text-sm text-slate-300">{t.dashboardPage.noSaved}</p>
                  <button
                    type="button"
                    onClick={() => setActiveView('opportunity-relay')}
                    className="px-5 py-2.5 rounded-md bg-[#D9FF00] text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider"
                  >
                    {t.home.openModule}
                  </button>
                </div>
              ) : (
                savedOpps.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-md bg-[#0C0F16] border border-white/10 flex flex-wrap items-center justify-between gap-3 sm:gap-4"
                  >
                    <div>
                      <p className="text-xs font-mono text-[#5CE1E6]">
                        {t.opportunityCategories[item.category]} · {formatTimestamp(item.createdAt)}
                      </p>
                      <h3 className="font-display text-sm font-semibold text-white mt-1">
                        {item.opportunityTitle}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSaved(item.id)}
                      className="text-xs font-mono text-slate-400 hover:text-rose-400"
                    >
                      {t.schoolHackPage.deleteProject}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="p-10 rounded-md bg-[#0C0F16] border border-white/10 text-center">
                  <p className="text-sm text-slate-300">{t.dashboardPage.noNotifications}</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-5 rounded-md border flex flex-wrap items-start justify-between gap-4 ${
                      n.read ? 'bg-[#0C0F16]/50 border-white/8' : 'bg-[#0C0F16] border-[#D9FF00]/45'
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="font-display text-sm font-semibold text-white">{n.title}</p>
                      <p className="text-sm text-slate-300">{n.message}</p>
                      <p className="font-mono text-xs text-slate-500">{formatTimestamp(n.createdAt)}</p>
                    </div>
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => handleMarkNotificationRead(n.id)}
                        className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-[#D9FF00] hover:text-[#050608] text-xs font-mono font-medium text-white transition-colors"
                      >
                        {t.dashboardPage.markRead}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
