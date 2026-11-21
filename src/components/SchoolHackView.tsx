import { useEffect, useMemo, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  PixelBrain as BrainCircuit,
  PixelCheckSquare as CheckSquare,
  PixelEdit as Edit3,
  PixelPlus as Plus,
  PixelSearch as Search,
  PixelSquare as Square,
  PixelTrash as Trash2,
  PixelUsers as Users,
  PixelClose as X,
} from './PixelIcons';
import { usePlatform } from '../context/PlatformContext';
import { db, formatTimestamp, generateSafeId, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  FIELD_LIMITS,
  type ProjectStatus,
  type ProjectTask,
  type ProjectTrack,
  type ProjectVisibility,
  type StudentProject,
} from '../types/platform';
import { MODULE_ASSETS } from '../config/moduleAssets';
import { ModuleBanner } from './ModuleBanner';

const TRACK_KEYS: ProjectTrack[] = [
  'ai_engineering',
  'research_science',
  'entrepreneurship',
  'leadership',
  'ecology_smart_city',
  'education_tech',
];

export function SchoolHackView() {
  const { user, profile, language, t, signInWithGoogle, prefilledIdea, setPrefilledIdea } = usePlatform();

  const [tab, setTab] = useState<'public' | 'mine'>('public');
  const [trackFilter, setTrackFilter] = useState<ProjectTrack | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<StudentProject | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiReviewing, setAiReviewing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [track, setTrack] = useState<ProjectTrack>('ai_engineering');
  const [summary, setSummary] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [visibility, setVisibility] = useState<ProjectVisibility>('public');
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [memberDraft, setMemberDraft] = useState('');
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [taskTitleDraft, setTaskTitleDraft] = useState('');
  const [taskAssigneeDraft, setTaskAssigneeDraft] = useState('');

  useEffect(() => {
    if (prefilledIdea) {
      setTitle(prefilledIdea.slice(0, 90));
      setSummary(prefilledIdea.slice(0, 480));
      setProblem('');
      setSolution('');
      setTeamMembers(profile?.displayName ? [`${profile.displayName} — Lead`] : []);
      setTasks([]);
      setEditingId(null);
      setEditorOpen(true);
      setPrefilledIdea('');
    }
  }, [prefilledIdea, profile, setPrefilledIdea]);

  const loadProjects = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      let q;
      if (tab === 'mine' && user) {
        q = query(collection(db, 'projects'), where('ownerId', '==', user.uid));
      } else {
        q = query(collection(db, 'projects'), where('visibility', '==', 'public'));
      }
      const snap = await getDocs(q);
      const list = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<StudentProject, 'id'>) }))
        .sort((a, b) => {
          const ta = (a.updatedAt as { seconds?: number })?.seconds ?? 0;
          const tb = (b.updatedAt as { seconds?: number })?.seconds ?? 0;
          return tb - ta;
        });
      setProjects(list);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [tab, user]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (trackFilter !== 'all' && p.track !== trackFilter) return false;
      if (searchQuery.trim()) {
        const needle = searchQuery.toLowerCase();
        const hay = `${p.title} ${p.summary} ${p.ownerName} ${p.region} ${p.school}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [projects, trackFilter, searchQuery]);

  const openCreateEditor = () => {
    if (!user) {
      signInWithGoogle();
      return;
    }
    setEditingId(null);
    setTitle('');
    setTrack('ai_engineering');
    setSummary('');
    setProblem('');
    setSolution('');
    setVisibility('public');
    setTeamMembers(profile?.displayName ? [`${profile.displayName} — Lead`] : []);
    setTasks([]);
    setErrorMsg(null);
    setEditorOpen(true);
  };

  const openEditEditor = (proj: StudentProject) => {
    setEditingId(proj.id);
    setTitle(proj.title);
    setTrack(proj.track);
    setSummary(proj.summary);
    setProblem(proj.problem);
    setSolution(proj.solution);
    setVisibility(proj.visibility);
    setTeamMembers(Array.isArray(proj.teamMembers) ? proj.teamMembers : []);
    setTasks(Array.isArray(proj.tasks) ? proj.tasks : []);
    setErrorMsg(null);
    setSelectedProject(null);
    setEditorOpen(true);
  };

  const computeProgress = (taskList: ProjectTask[]) => {
    if (taskList.length === 0) return 0;
    const doneCount = taskList.filter((item) => item.done).length;
    return Math.round((doneCount / taskList.length) * 100);
  };

  const handleAddMember = () => {
    const clean = memberDraft.trim().slice(0, 80);
    if (!clean || teamMembers.length >= FIELD_LIMITS.teamMembersMaxCount) return;
    setTeamMembers((prev) => [...prev, clean]);
    setMemberDraft('');
  };

  const handleAddTask = () => {
    const cleanTitle = taskTitleDraft.trim().slice(0, 120);
    if (!cleanTitle || tasks.length >= FIELD_LIMITS.tasksMaxCount) return;
    const newTask: ProjectTask = {
      id: generateSafeId('tsk'),
      title: cleanTitle,
      assignee: taskAssigneeDraft.trim().slice(0, 60) || profile?.displayName || 'Team',
      done: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setTaskTitleDraft('');
    setTaskAssigneeDraft('');
  };

  const handleSaveProject = async (targetStatus: 'draft' | 'in_progress' | 'submitted') => {
    if (!user) return;
    setErrorMsg(null);

    const cleanTitle = title.trim().slice(0, FIELD_LIMITS.projectTitleMax);
    const cleanSummary = summary.trim().slice(0, FIELD_LIMITS.projectSummaryMax);
    const cleanProblem = problem.trim().slice(0, FIELD_LIMITS.projectProblemMax);
    const cleanSolution = solution.trim().slice(0, FIELD_LIMITS.projectSolutionMax);

    if (cleanTitle.length < FIELD_LIMITS.projectTitleMin) {
      setErrorMsg(`${t.schoolHackPage.fieldTitle}: min ${FIELD_LIMITS.projectTitleMin}`);
      return;
    }
    if (cleanSummary.length < FIELD_LIMITS.projectSummaryMin) {
      setErrorMsg(`${t.schoolHackPage.fieldSummary}: min ${FIELD_LIMITS.projectSummaryMin}`);
      return;
    }
    if (cleanProblem.length < FIELD_LIMITS.projectProblemMin) {
      setErrorMsg(`${t.schoolHackPage.fieldProblem}: min ${FIELD_LIMITS.projectProblemMin}`);
      return;
    }
    if (cleanSolution.length < FIELD_LIMITS.projectSolutionMin) {
      setErrorMsg(`${t.schoolHackPage.fieldSolution}: min ${FIELD_LIMITS.projectSolutionMin}`);
      return;
    }

    setSaving(true);
    const progress = computeProgress(tasks);
    const sanitizedMembers = teamMembers.slice(0, FIELD_LIMITS.teamMembersMaxCount);
    const sanitizedTasks = tasks.slice(0, FIELD_LIMITS.tasksMaxCount);

    try {
      if (editingId) {
        const path = `projects/${editingId}`;
        await updateDoc(doc(db, 'projects', editingId), {
          title: cleanTitle,
          track,
          summary: cleanSummary,
          problem: cleanProblem,
          solution: cleanSolution,
          region: (profile?.region || 'Navoiy viloyati').slice(0, FIELD_LIMITS.regionMax),
          school: (profile?.school || '').slice(0, FIELD_LIMITS.schoolMax),
          teamMembers: sanitizedMembers,
          tasks: sanitizedTasks,
          progress,
          status: targetStatus,
          visibility,
          updatedAt: serverTimestamp(),
        });
      } else {
        const newId = generateSafeId('proj');
        const path = `projects/${newId}`;
        try {
          await setDoc(doc(db, 'projects', newId), {
            ownerId: user.uid,
            ownerName: (profile?.displayName || user.displayName || 'Student').slice(0, FIELD_LIMITS.displayNameMax),
            title: cleanTitle,
            track,
            summary: cleanSummary,
            problem: cleanProblem,
            solution: cleanSolution,
            region: (profile?.region || 'Navoiy viloyati').slice(0, FIELD_LIMITS.regionMax),
            school: (profile?.school || '').slice(0, FIELD_LIMITS.schoolMax),
            teamMembers: sanitizedMembers,
            tasks: sanitizedTasks,
            progress,
            status: targetStatus,
            visibility,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, path);
        }
      }
      setEditorOpen(false);
      await loadProjects();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleProjectTask = async (proj: StudentProject, taskId: string) => {
    if (!user || proj.ownerId !== user.uid || proj.status === 'approved') return;
    const updatedTasks = proj.tasks.map((item) =>
      item.id === taskId ? { ...item, done: !item.done } : item,
    );
    const progress = computeProgress(updatedTasks);
    const nextStatus: ProjectStatus =
      proj.status === 'submitted' ? 'submitted' : 'in_progress';
    const path = `projects/${proj.id}`;
    try {
      await updateDoc(doc(db, 'projects', proj.id), {
        tasks: updatedTasks,
        progress,
        status: nextStatus,
        updatedAt: serverTimestamp(),
      });
      const updatedObj = { ...proj, tasks: updatedTasks, progress, status: nextStatus };
      setSelectedProject(updatedObj);
      setProjects((prev) => prev.map((p) => (p.id === proj.id ? updatedObj : p)));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  const handleDeleteProject = async (proj: StudentProject) => {
    if (!user || proj.ownerId !== user.uid || proj.status === 'approved') return;
    const path = `projects/${proj.id}`;
    try {
      await deleteDoc(doc(db, 'projects', proj.id));
      setSelectedProject(null);
      setProjects((prev) => prev.filter((p) => p.id !== proj.id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const handleRequestAiReview = async (proj: StudentProject) => {
    setErrorMsg(null);
    setAiReviewing(true);
    try {
      const response = await fetch('/api/ai/project-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: proj.title,
          track: t.tracks[proj.track],
          summary: proj.summary,
          problem: proj.problem,
          solution: proj.solution,
          tasksCount: proj.tasks?.length || 0,
          teamSize: proj.teamMembers?.length || 1,
          language,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'AI review failed.');
      }
      const formattedReview = String(data.formattedReview || '').slice(0, 3400);
      const updated = { ...proj, aiReview: formattedReview };
      setSelectedProject(updated);

      if (user && proj.ownerId === user.uid && proj.status !== 'approved') {
        const path = `projects/${proj.id}`;
        try {
          await updateDoc(doc(db, 'projects', proj.id), {
            aiReview: formattedReview,
            updatedAt: serverTimestamp(),
          });
          setProjects((prev) => prev.map((p) => (p.id === proj.id ? updated : p)));
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, path);
        }
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'AI review failed.');
    } finally {
      setAiReviewing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-[#F4F5F7] pb-20">
      <ModuleBanner
        code="02. SCHOOL HACK 72"
        title={t.schoolHackPage.title}
        subtitle={t.schoolHackPage.subtitle}
        image={MODULE_ASSETS.schoolHack}
        imageAlt="02. SCHOOL HACK 72 — Build real projects"
        accent="secondary"
        action={
          <button
            type="button"
            onClick={openCreateEditor}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#D4FF00] hover:bg-[#C2EC00] text-[#090E23] text-xs font-mono font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            {t.schoolHackPage.newProject}
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {errorMsg && (
          <div className="p-4 rounded-md bg-rose-950/50 border border-rose-500/40 text-sm text-rose-200">
            {t.common.errorPrefix}: {errorMsg}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-1 p-1 rounded-md bg-[#0C0F16] border border-white/12 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setTab('public')}
              className={`flex-1 sm:flex-initial text-center px-3.5 py-1.5 rounded-sm text-xs font-mono font-semibold transition-colors whitespace-nowrap shrink-0 ${
                tab === 'public' ? 'bg-[#D9FF00] text-[#050608]' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.schoolHackPage.allPublic}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  signInWithGoogle();
                  return;
                }
                setTab('mine');
              }}
              className={`flex-1 sm:flex-initial text-center px-3.5 py-1.5 rounded-sm text-xs font-mono font-semibold transition-colors whitespace-nowrap shrink-0 ${
                tab === 'mine' ? 'bg-[#D9FF00] text-[#050608]' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.schoolHackPage.myProjects}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value as ProjectTrack | 'all')}
              className="w-full sm:w-auto px-3.5 py-2 rounded-md bg-[#0C0F16] border border-white/12 text-xs sm:text-sm text-white"
            >
              <option value="all">{t.schoolHackPage.fieldTrack}: All</option>
              {TRACK_KEYS.map((k) => (
                <option key={k} value={k}>
                  {t.tracks[k]}
                </option>
              ))}
            </select>

            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.common.searchPlaceholder}
                className="pl-9 pr-3.5 py-2 rounded-md bg-[#0C0F16] border border-white/12 text-xs sm:text-sm text-white placeholder:text-slate-500 w-full sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* PROJECT EDITOR FORM */}
        {editorOpen && (
          <div className="p-4 sm:p-7 rounded-md bg-[#0C0F16] border border-[#D9FF00]/45 space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-display text-lg font-bold text-white">
                {editingId ? t.schoolHackPage.editTitle : t.schoolHackPage.createTitle}
              </h2>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">{t.schoolHackPage.fieldTitle}</label>
                <input
                  type="text"
                  maxLength={FIELD_LIMITS.projectTitleMax}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300">{t.schoolHackPage.fieldTrack}</label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value as ProjectTrack)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                  >
                    {TRACK_KEYS.map((k) => (
                      <option key={k} value={k}>
                        {t.tracks[k]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300">{t.schoolHackPage.fieldVisibility}</label>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as ProjectVisibility)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                  >
                    <option value="public">{t.schoolHackPage.publicLabel}</option>
                    <option value="private">{t.schoolHackPage.privateLabel}</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-300">{t.schoolHackPage.fieldSummary}</label>
              <input
                type="text"
                maxLength={FIELD_LIMITS.projectSummaryMax}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">{t.schoolHackPage.fieldProblem}</label>
                <textarea
                  rows={4}
                  maxLength={FIELD_LIMITS.projectProblemMax}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">{t.schoolHackPage.fieldSolution}</label>
                <textarea
                  rows={4}
                  maxLength={FIELD_LIMITS.projectSolutionMax}
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                />
              </div>
            </div>

            {/* Team Builder */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="block text-xs font-mono text-[#5CE1E6]">{t.schoolHackPage.teamSection}</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={memberDraft}
                  onChange={(e) => setMemberDraft(e.target.value)}
                  placeholder={t.schoolHackPage.addMemberPlaceholder}
                  className="flex-1 px-3.5 py-2 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-4 py-2 rounded-md bg-white/10 hover:bg-[#D9FF00] hover:text-[#050608] text-xs font-mono font-semibold text-white transition-colors whitespace-nowrap shrink-0"
                >
                  {t.schoolHackPage.addMemberBtn}
                </button>
              </div>
              {teamMembers.length > 0 && (
                <div className="space-y-1.5">
                  {teamMembers.map((member, i) => (
                    <div
                      key={`${member}-${i}`}
                      className="flex items-center justify-between px-3 py-2 rounded-md bg-[#050608] border border-white/10 text-sm text-slate-200"
                    >
                      <span>{member}</span>
                      <button
                        type="button"
                        onClick={() => setTeamMembers((prev) => prev.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tasks Builder */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <label className="block text-xs font-mono text-[#5CE1E6]">{t.schoolHackPage.tasksSection}</label>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <input
                  type="text"
                  value={taskTitleDraft}
                  onChange={(e) => setTaskTitleDraft(e.target.value)}
                  placeholder={t.schoolHackPage.taskTitlePlaceholder}
                  className="sm:col-span-6 px-3.5 py-2 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                />
                <input
                  type="text"
                  value={taskAssigneeDraft}
                  onChange={(e) => setTaskAssigneeDraft(e.target.value)}
                  placeholder={t.schoolHackPage.taskAssigneePlaceholder}
                  className="sm:col-span-4 px-3.5 py-2 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                />
                <button
                  type="button"
                  onClick={handleAddTask}
                  className="sm:col-span-2 px-4 py-2 rounded-md bg-white/10 hover:bg-[#D9FF00] hover:text-[#050608] text-xs font-mono font-semibold text-white transition-colors"
                >
                  {t.schoolHackPage.addTaskBtn}
                </button>
              </div>
              {tasks.length > 0 && (
                <div className="space-y-1.5">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between px-3 py-2 rounded-md bg-[#050608] border border-white/10 text-sm"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setTasks((prev) =>
                            prev.map((item) => (item.id === task.id ? { ...item, done: !item.done } : item)),
                          )
                        }
                        className="flex items-center gap-2 text-left text-slate-200"
                      >
                        {task.done ? (
                          <CheckSquare className="w-4 h-4 text-[#D9FF00] shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className={task.done ? 'line-through text-slate-400' : ''}>{task.title}</span>
                        <span className="text-xs text-slate-400">· {task.assignee}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTasks((prev) => prev.filter((item) => item.id !== task.id))}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="px-4 py-2 rounded-md border border-white/15 text-xs font-mono text-slate-300 hover:text-white"
              >
                {t.schoolHackPage.cancel}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveProject('in_progress')}
                className="px-5 py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold uppercase tracking-wider transition-colors"
              >
                {t.schoolHackPage.saveDraft}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSaveProject('submitted')}
                className="px-5 py-2 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider transition-colors"
              >
                {t.schoolHackPage.submitProject}
              </button>
            </div>
          </div>
        )}

        {/* SELECTED PROJECT DETAIL VIEW */}
        {selectedProject && (
          <div className="p-4 sm:p-7 rounded-md bg-[#0C0F16] border border-[#5CE1E6]/40 space-y-5 sm:space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div className="space-y-1.5 min-w-0">
                <p className="text-xs font-mono text-[#5CE1E6]">
                  {t.tracks[selectedProject.track]} · {t.projectStatus[selectedProject.status]} ·{' '}
                  {selectedProject.region}
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white">{selectedProject.title}</h2>
                <p className="text-xs text-slate-400">
                  {selectedProject.ownerName}
                  {selectedProject.school ? ` · ${selectedProject.school}` : ''} ·{' '}
                  {formatTimestamp(selectedProject.updatedAt)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {user && selectedProject.ownerId === user.uid && selectedProject.status !== 'approved' && (
                  <>
                    <button
                      type="button"
                      onClick={() => openEditEditor(selectedProject)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-white/10 hover:bg-[#D9FF00] hover:text-[#050608] text-xs font-mono font-medium text-white transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      {t.common.edit}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(selectedProject)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-rose-950/60 hover:bg-rose-900/70 border border-rose-500/30 text-xs font-mono font-medium text-rose-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {t.schoolHackPage.deleteProject}
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {selectedProject.status === 'approved' && user?.uid === selectedProject.ownerId && (
              <p className="text-xs font-mono text-[#D9FF00]">{t.schoolHackPage.approvedLockedNotice}</p>
            )}

            {selectedProject.moderatorNote && (
              <div className="p-4 rounded-md bg-[#050608] border border-[#D9FF00]/35 space-y-1">
                <p className="text-xs font-mono text-[#D9FF00]">{t.schoolHackPage.moderatorFeedback}</p>
                <p className="text-sm text-slate-200">{selectedProject.moderatorNote}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#D9FF00]">{t.schoolHackPage.fieldProblem}</h3>
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{selectedProject.problem}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-[#5CE1E6]">{t.schoolHackPage.fieldSolution}</h3>
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{selectedProject.solution}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
              <div className="space-y-2.5">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#5CE1E6]" />
                  {t.schoolHackPage.teamSection}
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-300">
                  {selectedProject.teamMembers.length > 0 ? (
                    selectedProject.teamMembers.map((m, idx) => <li key={idx}>— {m}</li>)
                  ) : (
                    <li className="text-slate-500">— {selectedProject.ownerName}</li>
                  )}
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">{t.schoolHackPage.progressLabel}</h3>
                  <span className="font-mono text-xs text-[#D9FF00] tabular-nums">{selectedProject.progress}%</span>
                </div>
                <div className="h-1 bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#5CE1E6] to-[#D9FF00]"
                    style={{ width: `${selectedProject.progress}%` }}
                  />
                </div>
                <div className="space-y-1.5">
                  {selectedProject.tasks.map((task) => {
                    const canToggle = user?.uid === selectedProject.ownerId && selectedProject.status !== 'approved';
                    return (
                      <button
                        key={task.id}
                        type="button"
                        disabled={!canToggle}
                        onClick={() => handleToggleProjectTask(selectedProject, task.id)}
                        className="w-full flex items-center gap-2.5 text-left text-sm text-slate-200 py-1 disabled:cursor-default"
                      >
                        {task.done ? (
                          <CheckSquare className="w-4 h-4 text-[#D9FF00] shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <span className={task.done ? 'line-through text-slate-400' : ''}>{task.title}</span>
                        <span className="text-xs text-slate-500 ml-auto">{task.assignee}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Gemini 4 AI Project Architecture Review */}
            <div className="pt-5 border-t border-white/10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-[#D9FF00]" />
                  <h3 className="font-display text-sm font-semibold text-white">
                    {t.schoolHackPage.aiReviewTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  disabled={aiReviewing}
                  onClick={() => handleRequestAiReview(selectedProject)}
                  className="px-4 py-2 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] disabled:opacity-50 text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider transition-colors"
                >
                  {aiReviewing ? t.schoolHackPage.aiReviewLoading : t.schoolHackPage.aiReviewBtn}
                </button>
              </div>
              {selectedProject.aiReview && (
                <div className="p-4 rounded-md bg-[#050608] border border-white/10 text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                  {selectedProject.aiReview}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PROJECT LIST GRID */}
        {loading ? (
          <p className="text-sm font-mono text-slate-400 py-10">{t.common.loading}</p>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 rounded-md bg-[#0C0F16] border border-white/10 text-center space-y-4">
            <p className="text-slate-300 text-sm">{t.schoolHackPage.emptyProjects}</p>
            <button
              type="button"
              onClick={openCreateEditor}
              className="px-5 py-2.5 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider"
            >
              {t.schoolHackPage.newProject}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((proj) => (
              <article
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="p-6 rounded-md bg-[#0C0F16] hover:bg-[#111520] border border-white/10 hover:border-[#D9FF00]/50 transition-colors cursor-pointer flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="text-xs text-slate-400 flex items-center justify-between gap-2">
                    <span className="text-[#5CE1E6] font-mono truncate">{t.tracks[proj.track]}</span>
                    <span className="font-mono shrink-0">{t.projectStatus[proj.status]}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-white leading-snug">{proj.title}</h3>
                  <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed">{proj.summary}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {proj.ownerName} · {proj.region}
                    </span>
                    <span className="font-mono text-[#D9FF00] tabular-nums">{proj.progress}%</span>
                  </div>
                  <div className="h-1 bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#5CE1E6] to-[#D9FF00]"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
