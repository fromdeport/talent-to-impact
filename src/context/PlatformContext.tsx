import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import {
  auth,
  BOOTSTRAP_ADMIN_EMAIL,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
  testConnection,
} from '../lib/firebase';
import { TRANSLATIONS, type TranslationBundle } from '../i18n/translations';
import { FIELD_LIMITS, type ActiveView, type Language, type UserProfile } from '../types/platform';

interface PlatformContextValue {
  user: User | null;
  profile: UserProfile | null;
  authReady: boolean;
  dbConnected: boolean;
  isAdmin: boolean;
  isCoordinator: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  t: TranslationBundle;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  updateUserProfile: (patch: {
    displayName: string;
    region: string;
    district: string;
    school: string;
    grade: string;
    bio: string;
    interests: string[];
    language: Language;
  }) => Promise<void>;
  refreshProfile: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
  prefilledIdea: string;
  setPrefilledIdea: (idea: string) => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

function readSavedLanguage(): Language | null {
  try {
    const saved = localStorage.getItem('tti_lang');
    if (saved === 'uz' || saved === 'ru' || saved === 'en') return saved;
  } catch {
    // ignore storage errors
  }
  return null;
}

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);
  const [adminAccessLevel, setAdminAccessLevel] = useState<'admin' | 'coordinator' | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeView, setActiveViewState] = useState<ActiveView>('home');
  const [prefilledIdea, setPrefilledIdea] = useState('');

  const initialSavedLang = readSavedLanguage();
  const [language, setLanguageState] = useState<Language>(initialSavedLang ?? 'uz');
  const languageRef = useRef<Language>(language);
  const hasExplicitLanguageRef = useRef<boolean>(initialSavedLang !== null);

  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('tti_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // ignore storage errors
    }
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    languageRef.current = language;
    document.documentElement.lang = language;
  }, [language]);

  const setTheme = useCallback((nextTheme: 'dark' | 'light') => {
    setThemeState(nextTheme);
    try {
      localStorage.setItem('tti_theme', nextTheme);
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('tti_theme', next);
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    hasExplicitLanguageRef.current = true;
    languageRef.current = lang;
    setLanguageState(lang);
    try {
      localStorage.setItem('tti_lang', lang);
    } catch {
      // ignore
    }
    document.documentElement.lang = lang;

    setProfile((prev) => (prev ? { ...prev, language: lang } : prev));
    const currentUser = auth.currentUser;
    if (currentUser) {
      updateDoc(doc(db, 'users', currentUser.uid), {
        language: lang,
        updatedAt: serverTimestamp(),
      }).catch(() => {
        // Silent background sync; local language state remains authoritative
      });
    }
  }, []);

  const setActiveView = useCallback((view: ActiveView) => {
    setActiveViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    testConnection().then((ok) => setDbConnected(ok));
  }, []);

  const loadOrBootstrapProfile = useCallback(async (firebaseUser: User) => {
    const userPath = `users/${firebaseUser.uid}`;
    const userRef = doc(db, 'users', firebaseUser.uid);
    const isBootstrap =
      firebaseUser.emailVerified && firebaseUser.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setProfile(data);
        if (
          !hasExplicitLanguageRef.current &&
          (data.language === 'uz' || data.language === 'ru' || data.language === 'en')
        ) {
          languageRef.current = data.language;
          setLanguageState(data.language);
        }
      } else {
        const initialProfile = {
          uid: firebaseUser.uid,
          email: (firebaseUser.email || 'user@talenttoimpact.uz').slice(0, 200),
          displayName: (firebaseUser.displayName || 'Foydalanuvchi').slice(0, FIELD_LIMITS.displayNameMax),
          role: isBootstrap ? ('admin' as const) : ('student' as const),
          region: 'Navoiy viloyati',
          district: 'Navoiy shahri',
          school: '',
          grade: '10-sinf',
          bio: '',
          interests: [] as string[],
          language: languageRef.current,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(userRef, initialProfile);
        const created = await getDoc(userRef);
        if (created.exists()) {
          setProfile(created.data() as UserProfile);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, userPath);
    }

    if (isBootstrap) {
      setAdminAccessLevel('admin');
      return;
    }

    try {
      const adminSnap = await getDoc(doc(db, 'admins', firebaseUser.uid));
      if (adminSnap.exists()) {
        const level = adminSnap.data()?.accessLevel;
        if (level === 'admin' || level === 'coordinator') {
          setAdminAccessLevel(level);
        } else {
          setAdminAccessLevel(null);
        }
      } else {
        setAdminAccessLevel(null);
      }
    } catch {
      setAdminAccessLevel(null);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          await loadOrBootstrapProfile(firebaseUser);
        } catch (err) {
          console.error('Profile bootstrap failed:', err);
          setAuthError(err instanceof Error ? err.message : 'Failed to load profile.');
        }
      } else {
        setProfile(null);
        setAdminAccessLevel(null);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, [loadOrBootstrapProfile]);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Google Sign-In failed.';
      setAuthError(msg);
    }
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(auth);
    setProfile(null);
    setAdminAccessLevel(null);
    setActiveView('home');
  }, [setActiveView]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    }
  }, [user]);

  const updateUserProfile = useCallback(
    async (patch: {
      displayName: string;
      region: string;
      district: string;
      school: string;
      grade: string;
      bio: string;
      interests: string[];
      language: Language;
    }) => {
      if (!user) return;
      const userRef = doc(db, 'users', user.uid);
      const sanitized = {
        displayName: patch.displayName.trim().slice(0, FIELD_LIMITS.displayNameMax) || 'Foydalanuvchi',
        region: patch.region.trim().slice(0, FIELD_LIMITS.regionMax),
        district: patch.district.trim().slice(0, FIELD_LIMITS.districtMax),
        school: patch.school.trim().slice(0, FIELD_LIMITS.schoolMax),
        grade: patch.grade.trim().slice(0, FIELD_LIMITS.gradeMax),
        bio: patch.bio.trim().slice(0, FIELD_LIMITS.bioMax),
        interests: patch.interests
          .map((s) => s.trim().slice(0, 40))
          .filter(Boolean)
          .slice(0, FIELD_LIMITS.interestsMaxCount),
        language: patch.language,
        updatedAt: serverTimestamp(),
      };
      try {
        await updateDoc(userRef, sanitized);
        setLanguage(patch.language);
        await refreshProfile();
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
    },
    [user, refreshProfile, setLanguage],
  );

  const isAdmin = adminAccessLevel === 'admin' || profile?.role === 'admin';
  const isCoordinator =
    adminAccessLevel === 'coordinator' || adminAccessLevel === 'admin' || profile?.role === 'coordinator' || profile?.role === 'admin';

  const value: PlatformContextValue = {
    user,
    profile,
    authReady,
    dbConnected,
    isAdmin,
    isCoordinator,
    language,
    setLanguage,
    theme,
    setTheme,
    toggleTheme,
    t: TRANSLATIONS[language],
    activeView,
    setActiveView,
    signInWithGoogle,
    signOutUser,
    updateUserProfile,
    refreshProfile,
    authError,
    clearAuthError: () => setAuthError(null),
    prefilledIdea,
    setPrefilledIdea,
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform(): PlatformContextValue {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}
