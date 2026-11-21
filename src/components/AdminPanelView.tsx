import { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  PixelBarChart as BarChart3,
  PixelCompass as Compass,
  PixelFolderKanban as FolderKanban,
  PixelMessageSquare as MessageSquare,
  PixelPlus as Plus,
  PixelSettings as Settings,
  PixelShieldCheck as ShieldCheck,
  PixelTrash as Trash2,
  PixelUsers as Users,
} from './PixelIcons';
import { usePlatform } from '../context/PlatformContext';
import { DEFAULT_TALENT_QUESTIONS, TALENT_DOMAINS } from '../data/defaultQuestions';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  db,
  formatTimestamp,
  generateSafeId,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import {
  FIELD_LIMITS,
  type CommunityPost,
  type OpportunityCategory,
  type PlatformSetting,
  type StudentProject,
  type TalentDomainKey,
  type TalentQuestion,
  type UserProfile,
  type UserRole,
  type VerifiedOpportunity,
} from '../types/platform';
import { LanguageSwitch } from './LanguageSwitch';

type AdminTab = 'overview' | 'users' | 'projects' | 'questions' | 'opportunities' | 'posts' | 'settings';

export function AdminPanelView() {
  const { user, profile, isAdmin, isCoordinator, t } = usePlatform();

  const [tab, setTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Real database datasets
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [resultsCount, setResultsCount] = useState(0);
  const [projectsList, setProjectsList] = useState<StudentProject[]>([]);
  const [questionsList, setQuestionsList] = useState<TalentQuestion[]>([]);
  const [opportunitiesList, setOpportunitiesList] = useState<VerifiedOpportunity[]>([]);
  const [postsList, setPostsList] = useState<CommunityPost[]>([]);
  const [settings, setSettings] = useState<PlatformSetting>({
    launchRegion: 'Navoiy viloyati, O‘zbekiston',
    announcement: '',
    allowPublicRegistration: true,
    updatedAt: null,
  });

  // Moderation notes map
  const [noteDrafts, setNoteDrafts] = useState<Record<string, string>>({});

  // New Question Form
  const [qDomain, setQDomain] = useState<TalentDomainKey>('ai_engineering');
  const [qUz, setQUz] = useState('');
  const [qRu, setQRu] = useState('');
  const [qEn, setQEn] = useState('');

  // New Verified Opportunity Form
  const [oppTitle, setOppTitle] = useState('');
  const [oppCategory, setOppCategory] = useState<OpportunityCategory>('olympiad');
  const [oppOrg, setOppOrg] = useState('');
  const [oppDesc, setOppDesc] = useState('');
  const [oppElig, setOppElig] = useState('7–11-sinf o‘quvchilari');
  const [oppRegion, setOppRegion] = useState('Navoiy viloyati / O‘zbekiston');
  const [oppDeadline, setOppDeadline] = useState('');
  const [oppSource, setOppSource] = useState('');

  const isBootstrap =
    Boolean(user?.emailVerified) && user?.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

  const loadAdminData = async () => {
    if (!user || !isCoordinator) return;
    setLoading(true);
    try {
      const projQuery = isBootstrap
        ? collection(db, 'projects')
        : query(collection(db, 'projects'), where('visibility', '==', 'public'));
      const postQuery = isBootstrap
        ? collection(db, 'community_posts')
        : query(collection(db, 'community_posts'), where('status', '==', 'published'));
      const oppQuery = isBootstrap
        ? collection(db, 'opportunities')
        : query(collection(db, 'opportunities'), where('status', '==', 'verified'));
      const qQuery = isBootstrap
        ? collection(db, 'talent_questions')
        : query(collection(db, 'talent_questions'), where('active', '==', true));

      const [projSnap, postSnap, oppSnap, qSnap, settingSnap] = await Promise.all([
        getDocs(projQuery),
        getDocs(postQuery),
        getDocs(oppQuery),
        getDocs(qQuery),
        getDoc(doc(db, 'platform_settings', 'global')),
      ]);

      setProjectsList(projSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<StudentProject, 'id'>) })));
      setPostsList(postSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CommunityPost, 'id'>) })));
      setOpportunitiesList(oppSnap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<VerifiedOpportunity, 'id'>) })));
      setQuestionsList(
        qSnap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<TalentQuestion, 'id'>) }))
          .sort((a, b) => a.order - b.order),
      );
      if (settingSnap.exists()) {
        setSettings(settingSnap.data() as PlatformSetting);
      }

      if (isBootstrap) {
        const [uSnap, rSnap] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'talent_results')),
        ]);
        setUsersList(uSnap.docs.map((d) => d.data() as UserProfile));
        setResultsCount(rSnap.size);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'admin_console');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user, isCoordinator]);

  if (!user || !isCoordinator) {
    return (
      <div className="min-h-[70vh] bg-[#050608] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-md bg-[#0C0F16] border border-white/15 text-center space-y-4">
          <h1 className="font-display text-xl font-bold text-white uppercase tracking-tight">{t.adminPage.title}</h1>
          <p className="text-sm text-zinc-400">{t.adminPage.accessDenied}</p>
        </div>
      </div>
    );
  }

  const handleRoleChange = async (target: UserProfile, newRole: UserRole) => {
    if (!isAdmin) return;
    setStatusMessage(null);
    try {
      await updateDoc(doc(db, 'users', target.uid), {
        role: newRole,
        updatedAt: serverTimestamp(),
      });

      if (newRole === 'admin' || newRole === 'coordinator') {
        await setDoc(doc(db, 'admins', target.uid), {
          uid: target.uid,
          email: target.email,
          accessLevel: newRole,
          assignedAt: serverTimestamp(),
        });
      } else {
        try {
          await deleteDoc(doc(db, 'admins', target.uid));
        } catch {
          // ignore if not in admins registry
        }
      }

      const notifId = generateSafeId('ntf');
      await setDoc(doc(db, 'notifications', notifId), {
        userId: target.uid,
        title: 'Role Updated',
        message: `Your TALENT TO IMPACT role is now: ${t.roles[newRole]}`,
        kind: 'role',
        read: false,
        createdAt: serverTimestamp(),
      });

      setUsersList((prev) => prev.map((u) => (u.uid === target.uid ? { ...u, role: newRole } : u)));
      setStatusMessage(`${target.displayName} → ${t.roles[newRole]}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${target.uid}`);
    }
  };

  const handleModerateProject = async (
    proj: StudentProject,
    nextStatus: 'approved' | 'revision_needed',
  ) => {
    setStatusMessage(null);
    const note = (noteDrafts[proj.id] ?? proj.moderatorNote ?? '').trim().slice(0, 600);
    try {
      await updateDoc(doc(db, 'projects', proj.id), {
        status: nextStatus,
        moderatorNote: note,
        updatedAt: serverTimestamp(),
      });
      const notifId = generateSafeId('ntf');
      await setDoc(doc(db, 'notifications', notifId), {
        userId: proj.ownerId,
        title: `SCHOOL HACK 72: ${proj.title.slice(0, 80)}`,
        message: `${t.projectStatus[nextStatus]}${note ? ` — ${note}` : ''}`.slice(0, 580),
        kind: 'project',
        read: false,
        createdAt: serverTimestamp(),
      });
      setProjectsList((prev) =>
        prev.map((p) => (p.id === proj.id ? { ...p, status: nextStatus, moderatorNote: note } : p)),
      );
      setStatusMessage(`${proj.title} → ${t.projectStatus[nextStatus]}`);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${proj.id}`);
    }
  };

  const handleSeedDefaultQuestions = async () => {
    if (!isAdmin) return;
    setStatusMessage(null);
    try {
      for (const q of DEFAULT_TALENT_QUESTIONS) {
        await setDoc(doc(db, 'talent_questions', q.id), {
          order: q.order,
          domain: q.domain,
          textUz: q.textUz,
          textRu: q.textRu,
          textEn: q.textEn,
          active: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      await loadAdminData();
      setStatusMessage('12 diagnostic questions loaded into Firestore.');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'talent_questions');
    }
  };

  const handleAddQuestion = async () => {
    if (!isAdmin) return;
    if (qUz.trim().length < 5 || qRu.trim().length < 5 || qEn.trim().length < 5) return;
    const id = generateSafeId('tq');
    try {
      await setDoc(doc(db, 'talent_questions', id), {
        order: questionsList.length + 1,
        domain: qDomain,
        textUz: qUz.trim().slice(0, FIELD_LIMITS.questionTextMax),
        textRu: qRu.trim().slice(0, FIELD_LIMITS.questionTextMax),
        textEn: qEn.trim().slice(0, FIELD_LIMITS.questionTextMax),
        active: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setQUz('');
      setQRu('');
      setQEn('');
      await loadAdminData();
      setStatusMessage('Question added.');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `talent_questions/${id}`);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteDoc(doc(db, 'talent_questions', id));
      setQuestionsList((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `talent_questions/${id}`);
    }
  };

  const handlePublishOpportunity = async () => {
    if (
      oppTitle.trim().length < FIELD_LIMITS.opportunityTitleMin ||
      oppDesc.trim().length < FIELD_LIMITS.opportunityDescMin ||
      oppSource.trim().length < FIELD_LIMITS.verificationSourceMin
    ) {
      setStatusMessage('Please fill title, description, and official verification source.');
      return;
    }
    const id = generateSafeId('opp');
    try {
      await setDoc(doc(db, 'opportunities', id), {
        title: oppTitle.trim().slice(0, FIELD_LIMITS.opportunityTitleMax),
        category: oppCategory,
        organization: oppOrg.trim().slice(0, FIELD_LIMITS.opportunityOrgMax) || 'TALENT TO IMPACT',
        description: oppDesc.trim().slice(0, FIELD_LIMITS.opportunityDescMax),
        eligibility: oppElig.trim().slice(0, FIELD_LIMITS.opportunityEligibilityMax) || '7–11-sinf',
        region: oppRegion.trim().slice(0, FIELD_LIMITS.regionMax),
        deadline: oppDeadline.trim().slice(0, 60),
        verificationSource: oppSource.trim().slice(0, FIELD_LIMITS.verificationSourceMax),
        verifiedByUid: user.uid,
        verifiedByName: (profile?.displayName || user.displayName || 'Coordinator').slice(0, FIELD_LIMITS.displayNameMax),
        status: 'verified',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setOppTitle('');
      setOppOrg('');
      setOppDesc('');
      setOppDeadline('');
      setOppSource('');
      await loadAdminData();
      setStatusMessage('Verified opportunity published.');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `opportunities/${id}`);
    }
  };

  const handleToggleOpportunityStatus = async (opp: VerifiedOpportunity) => {
    const next = opp.status === 'verified' ? 'archived' : 'verified';
    try {
      await updateDoc(doc(db, 'opportunities', opp.id), {
        status: next,
        updatedAt: serverTimestamp(),
      });
      setOpportunitiesList((prev) => prev.map((o) => (o.id === opp.id ? { ...o, status: next } : o)));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `opportunities/${opp.id}`);
    }
  };

  const handleTogglePostStatus = async (post: CommunityPost) => {
    const next = post.status === 'published' ? 'archived' : 'published';
    try {
      await updateDoc(doc(db, 'community_posts', post.id), {
        status: next,
        updatedAt: serverTimestamp(),
      });
      setPostsList((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: next } : p)));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `community_posts/${post.id}`);
    }
  };

  const handleSaveSettings = async () => {
    if (!isAdmin) return;
    try {
      await setDoc(doc(db, 'platform_settings', 'global'), {
        launchRegion: settings.launchRegion.trim().slice(0, 120) || 'Navoiy viloyati, O‘zbekiston',
        announcement: (settings.announcement || '').trim().slice(0, 500),
        allowPublicRegistration: Boolean(settings.allowPublicRegistration),
        updatedAt: serverTimestamp(),
      });
      setStatusMessage('Platform settings saved.');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'platform_settings/global');
    }
  };

  const navItems: { id: AdminTab; label: string; icon: typeof BarChart3 }[] = [
    { id: 'overview', label: t.adminPage.tabs.overview, icon: BarChart3 },
    { id: 'users', label: t.adminPage.tabs.users, icon: Users },
    { id: 'projects', label: t.adminPage.tabs.projects, icon: FolderKanban },
    { id: 'questions', label: t.adminPage.tabs.questions, icon: Compass },
    { id: 'opportunities', label: t.adminPage.tabs.opportunities, icon: ShieldCheck },
    { id: 'posts', label: t.adminPage.tabs.posts, icon: MessageSquare },
    { id: 'settings', label: t.adminPage.tabs.settings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#050608] text-[#F4F5F7] pb-20">
      <div className="border-b border-white/12 bg-[#080A0F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-mono text-xs text-[#D9FF00]">ADMINISTRATION · RBAC</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">{t.adminPage.title}</h1>
            <p className="text-sm text-slate-400">{t.adminPage.subtitle}</p>
          </div>
          <LanguageSwitch />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <aside className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-1 gap-2 lg:gap-1.5 content-start">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md text-xs font-mono font-medium transition-colors ${
                  active
                    ? 'bg-[#D9FF00] text-[#050608] font-semibold'
                    : 'bg-[#0C0F16] text-slate-300 hover:bg-[#131823] hover:text-white border border-white/8'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </aside>

        <main className="lg:col-span-9 space-y-6">
          {statusMessage && (
            <div className="p-4 rounded-md bg-[#D9FF00]/10 border border-[#D9FF00]/40 text-xs font-mono text-[#D9FF00]">
              {statusMessage}
            </div>
          )}

          {loading ? (
            <p className="text-sm font-mono text-slate-400">{t.common.loading}</p>
          ) : (
            <>
              {/* OVERVIEW: STRICT REAL DATABASE METRICS */}
              {tab === 'overview' && (
                <div className="space-y-6">
                  <p className="text-xs font-mono text-slate-400">{t.adminPage.realStatsNotice}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-6 rounded-md bg-[#0C0F16] border border-white/12 space-y-1">
                      <p className="text-xs font-mono text-slate-400">{t.adminPage.stats.users}</p>
                      <p className="font-mono text-3xl font-bold text-white tabular-nums">{usersList.length}</p>
                    </div>
                    <div className="p-6 rounded-md bg-[#0C0F16] border border-white/12 space-y-1">
                      <p className="text-xs font-mono text-slate-400">{t.adminPage.stats.talentTests}</p>
                      <p className="font-mono text-3xl font-bold text-[#D9FF00] tabular-nums">{resultsCount}</p>
                    </div>
                    <div className="p-6 rounded-md bg-[#0C0F16] border border-white/12 space-y-1">
                      <p className="text-xs font-mono text-slate-400">{t.adminPage.stats.projects}</p>
                      <p className="font-mono text-3xl font-bold text-[#5CE1E6] tabular-nums">{projectsList.length}</p>
                    </div>
                    <div className="p-6 rounded-md bg-[#0C0F16] border border-white/12 space-y-1">
                      <p className="text-xs font-mono text-slate-400">{t.adminPage.stats.communityPosts}</p>
                      <p className="font-mono text-3xl font-bold text-white tabular-nums">{postsList.length}</p>
                    </div>
                    <div className="p-6 rounded-md bg-[#0C0F16] border border-white/12 space-y-1">
                      <p className="text-xs font-mono text-slate-400">{t.adminPage.stats.verifiedOpportunities}</p>
                      <p className="font-mono text-3xl font-bold text-[#D9FF00] tabular-nums">
                        {opportunitiesList.filter((o) => o.status === 'verified').length}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* USERS & ROLE MANAGEMENT */}
              {tab === 'users' && (
                <div className="rounded-md bg-[#0C0F16] border border-white/12 overflow-x-auto">
                  <table className="w-full min-w-[520px] text-left text-sm">
                    <thead className="border-b border-white/10 text-xs font-mono text-slate-400">
                      <tr>
                        <th className="py-3.5 px-4">User</th>
                        <th className="py-3.5 px-4">Region / School</th>
                        <th className="py-3.5 px-4">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {usersList.map((u) => (
                        <tr key={u.uid} className="hover:bg-white/[0.02]">
                          <td className="py-3.5 px-4">
                            <p className="font-medium text-white">{u.displayName}</p>
                            <p className="text-xs text-slate-400 font-mono">{u.email}</p>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300 text-xs">
                            {u.region}
                            {u.school ? ` · ${u.school}` : ''}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              disabled={!isAdmin || u.email === BOOTSTRAP_ADMIN_EMAIL}
                              value={u.role}
                              onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                              className="px-3 py-1.5 rounded-md bg-[#050608] border border-white/15 text-xs text-white disabled:opacity-50"
                            >
                              <option value="student">{t.roles.student}</option>
                              <option value="mentor">{t.roles.mentor}</option>
                              <option value="coordinator">{t.roles.coordinator}</option>
                              <option value="admin">{t.roles.admin}</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* PROJECT MODERATION */}
              {tab === 'projects' && (
                <div className="space-y-4">
                  {projectsList.map((proj) => (
                    <div
                      key={proj.id}
                      className="p-6 rounded-md bg-[#0C0F16] border border-white/12 space-y-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-xs text-[#5CE1E6]">
                            {t.tracks[proj.track]} · {t.projectStatus[proj.status]} · {proj.progress}%
                          </p>
                          <h3 className="font-display text-base font-bold text-white mt-1">{proj.title}</h3>
                          <p className="text-xs text-slate-400">
                            {proj.ownerName} · {proj.region} · {formatTimestamp(proj.updatedAt)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-300">{proj.summary}</p>
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <input
                          type="text"
                          value={noteDrafts[proj.id] ?? proj.moderatorNote ?? ''}
                          onChange={(e) => setNoteDrafts((prev) => ({ ...prev, [proj.id]: e.target.value }))}
                          placeholder={t.schoolHackPage.moderatorFeedback}
                          className="flex-1 px-3.5 py-2 rounded-md bg-[#050608] border border-white/15 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleModerateProject(proj, 'approved')}
                          className="px-4 py-2 rounded-md bg-[#D9FF00] text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider whitespace-nowrap shrink-0"
                        >
                          {t.adminPage.approveBtn}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleModerateProject(proj, 'revision_needed')}
                          className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-medium whitespace-nowrap shrink-0"
                        >
                          {t.adminPage.requestRevisionBtn}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TALENT MAP TEST EDITOR */}
              {tab === 'questions' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-md bg-[#0C0F16] border border-white/12 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h2 className="font-display text-base font-bold text-white">{t.adminPage.addQuestionTitle}</h2>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={handleSeedDefaultQuestions}
                          className="px-3.5 py-2 rounded-md bg-white/10 hover:bg-[#D9FF00] hover:text-[#050608] text-xs font-mono font-medium text-white transition-colors"
                        >
                          {t.adminPage.seedDefaultQuestions}
                        </button>
                      )}
                    </div>

                    <select
                      value={qDomain}
                      onChange={(e) => setQDomain(e.target.value as TalentDomainKey)}
                      className="w-full sm:w-72 px-3.5 py-2 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                    >
                      {TALENT_DOMAINS.map((d) => (
                        <option key={d} value={d}>
                          {t.domains[d].label}
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        value={qUz}
                        onChange={(e) => setQUz(e.target.value)}
                        placeholder="O‘zbekcha savol matni"
                        className="w-full px-3.5 py-2 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                      />
                      <input
                        type="text"
                        value={qRu}
                        onChange={(e) => setQRu(e.target.value)}
                        placeholder="Текст вопроса на русском"
                        className="w-full px-3.5 py-2 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                      />
                      <input
                        type="text"
                        value={qEn}
                        onChange={(e) => setQEn(e.target.value)}
                        placeholder="Question text in English"
                        className="w-full px-3.5 py-2 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={!isAdmin}
                      onClick={handleAddQuestion}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] disabled:opacity-50 text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider"
                    >
                      <Plus className="w-4 h-4" />
                      {t.adminPage.addQuestionTitle}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {questionsList.map((q) => (
                      <div
                        key={q.id}
                        className="p-5 rounded-md bg-[#0C0F16] border border-white/10 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <p className="font-mono text-xs text-[#5CE1E6]">
                            #{q.order} · {t.domains[q.domain]?.label}
                          </p>
                          <p className="text-sm text-white">{q.textUz}</p>
                          <p className="text-xs text-slate-400">{q.textRu}</p>
                        </div>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="p-2 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VERIFIED OPPORTUNITIES PUBLISHER */}
              {tab === 'opportunities' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-md bg-[#0C0F16] border border-white/12 space-y-4">
                    <h2 className="font-display text-base font-bold text-white">
                      {t.adminPage.publishOpportunityTitle}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={oppTitle}
                        onChange={(e) => setOppTitle(e.target.value)}
                        placeholder={t.knowledgeBridgePage.fieldTitle}
                        className="px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                      />
                      <select
                        value={oppCategory}
                        onChange={(e) => setOppCategory(e.target.value as OpportunityCategory)}
                        className="px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                      >
                        <option value="olympiad">{t.opportunityCategories.olympiad}</option>
                        <option value="program">{t.opportunityCategories.program}</option>
                        <option value="internship">{t.opportunityCategories.internship}</option>
                        <option value="mentorship">{t.opportunityCategories.mentorship}</option>
                        <option value="entrepreneurship">{t.opportunityCategories.entrepreneurship}</option>
                      </select>
                      <input
                        type="text"
                        value={oppOrg}
                        onChange={(e) => setOppOrg(e.target.value)}
                        placeholder="Organization"
                        className="px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                      />
                      <input
                        type="text"
                        value={oppDeadline}
                        onChange={(e) => setOppDeadline(e.target.value)}
                        placeholder={`${t.opportunityRelayPage.deadlineLabel} (2026-12-30)`}
                        className="px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                      />
                      <input
                        type="text"
                        value={oppElig}
                        onChange={(e) => setOppElig(e.target.value)}
                        placeholder={t.opportunityRelayPage.eligibilityLabel}
                        className="px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                      />
                      <input
                        type="text"
                        value={oppRegion}
                        onChange={(e) => setOppRegion(e.target.value)}
                        placeholder={t.dashboardPage.regionLabel}
                        className="px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                      />
                    </div>
                    <textarea
                      rows={3}
                      value={oppDesc}
                      onChange={(e) => setOppDesc(e.target.value)}
                      placeholder={t.knowledgeBridgePage.fieldContent}
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                    />
                    <input
                      type="text"
                      value={oppSource}
                      onChange={(e) => setOppSource(e.target.value)}
                      placeholder={`${t.opportunityRelayPage.sourceLabel} (Official URL / Decree / Letter)`}
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-[#5CE1E6]/40 text-sm text-white"
                    />
                    <button
                      type="button"
                      onClick={handlePublishOpportunity}
                      className="px-5 py-2.5 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider"
                    >
                      {t.knowledgeBridgePage.publishBtn}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {opportunitiesList.map((opp) => (
                      <div
                        key={opp.id}
                        className="p-5 rounded-md bg-[#0C0F16] border border-white/10 flex flex-wrap items-center justify-between gap-4"
                      >
                        <div>
                          <p className="font-mono text-xs text-[#5CE1E6]">
                            {t.opportunityCategories[opp.category]} · {opp.status}
                          </p>
                          <h3 className="font-display text-sm font-bold text-white">{opp.title}</h3>
                          <p className="text-xs text-slate-400">{opp.verificationSource}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleOpportunityStatus(opp)}
                          className="px-3.5 py-1.5 rounded-md bg-white/10 hover:bg-[#D9FF00] hover:text-[#050608] text-xs font-mono font-medium text-white transition-colors"
                        >
                          {opp.status === 'verified' ? t.adminPage.archiveBtn : t.adminPage.restoreBtn}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* KNOWLEDGE BRIDGE CONTENT MODERATION */}
              {tab === 'posts' && (
                <div className="space-y-3">
                  {postsList.map((post) => (
                    <div
                      key={post.id}
                      className="p-5 rounded-md bg-[#0C0F16] border border-white/10 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <p className="font-mono text-xs text-[#5CE1E6]">
                          {t.communities[post.community]} · {post.status}
                        </p>
                        <h3 className="font-display text-sm font-bold text-white">{post.title}</h3>
                        <p className="text-xs text-slate-400">
                          {post.authorName} · {post.authorRegion}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleTogglePostStatus(post)}
                        className="px-3.5 py-1.5 rounded-md bg-white/10 hover:bg-[#D9FF00] hover:text-[#050608] text-xs font-mono font-medium text-white transition-colors"
                      >
                        {post.status === 'published' ? t.adminPage.archiveBtn : t.adminPage.restoreBtn}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* PLATFORM SETTINGS */}
              {tab === 'settings' && (
                <div className="p-5 sm:p-7 rounded-md bg-[#0C0F16] border border-white/12 space-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-300">Primary Launch Region</label>
                    <input
                      type="text"
                      value={settings.launchRegion}
                      onChange={(e) => setSettings((prev) => ({ ...prev, launchRegion: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-mono text-slate-300">Global Platform Notice</label>
                    <textarea
                      rows={3}
                      value={settings.announcement || ''}
                      onChange={(e) => setSettings((prev) => ({ ...prev, announcement: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                    />
                  </div>
                  <label className="flex items-center gap-2.5 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={settings.allowPublicRegistration}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, allowPublicRegistration: e.target.checked }))
                      }
                      className="accent-[#D9FF00]"
                    />
                    Open Registration for Uzbekistan Schools
                  </label>
                  <button
                    type="button"
                    disabled={!isAdmin}
                    onClick={handleSaveSettings}
                    className="px-6 py-2.5 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] disabled:opacity-50 text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider"
                  >
                    {t.adminPage.saveSettings}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
