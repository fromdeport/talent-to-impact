export type Language = 'uz' | 'ru' | 'en';

export type UserRole = 'student' | 'mentor' | 'coordinator' | 'admin';

export type TalentDomainKey =
  | 'ai_engineering'
  | 'research_science'
  | 'entrepreneurship'
  | 'leadership'
  | 'design_architecture'
  | 'social_impact';

export type ProjectTrack =
  | 'ai_engineering'
  | 'research_science'
  | 'entrepreneurship'
  | 'leadership'
  | 'ecology_smart_city'
  | 'education_tech';

export type ProjectStatus = 'draft' | 'in_progress' | 'submitted' | 'approved' | 'revision_needed';
export type ProjectVisibility = 'public' | 'private';

export type CommunitySlug =
  | 'ai_engineering'
  | 'research_science'
  | 'entrepreneurship'
  | 'leadership'
  | 'navoi_schools';

export type PostType = 'material' | 'debate' | 'event';

export type OpportunityCategory =
  | 'program'
  | 'olympiad'
  | 'internship'
  | 'mentorship'
  | 'entrepreneurship';

export type ActiveView =
  | 'home'
  | 'talent-map'
  | 'school-hack'
  | 'knowledge-bridge'
  | 'opportunity-relay'
  | 'dashboard'
  | 'admin';

// Synchronized verbatim with firebase-blueprint.json & firestore.rules
export const FIELD_LIMITS = {
  displayNameMax: 120,
  regionMax: 100,
  districtMax: 100,
  schoolMax: 160,
  gradeMax: 30,
  bioMax: 600,
  interestsMaxCount: 10,
  projectTitleMin: 3,
  projectTitleMax: 140,
  projectSummaryMin: 10,
  projectSummaryMax: 500,
  projectProblemMin: 10,
  projectProblemMax: 1500,
  projectSolutionMin: 10,
  projectSolutionMax: 1500,
  teamMembersMaxCount: 8,
  tasksMaxCount: 25,
  postTitleMin: 4,
  postTitleMax: 180,
  postContentMin: 15,
  postContentMax: 3000,
  commentMin: 2,
  commentMax: 1200,
  opportunityTitleMin: 4,
  opportunityTitleMax: 180,
  opportunityOrgMax: 160,
  opportunityDescMin: 15,
  opportunityDescMax: 2500,
  opportunityEligibilityMax: 300,
  verificationSourceMin: 5,
  verificationSourceMax: 400,
  questionTextMin: 5,
  questionTextMax: 400,
} as const;

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  region: string;
  district?: string;
  school: string;
  grade: string;
  bio?: string;
  interests?: string[];
  language: Language;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface TalentQuestion {
  id: string;
  order: number;
  domain: TalentDomainKey;
  textUz: string;
  textRu: string;
  textEn: string;
  active: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export interface TalentResult {
  id: string;
  userId: string;
  answersCount: number;
  scores: Record<TalentDomainKey, number>;
  primaryDomain: TalentDomainKey;
  secondaryDomain: TalentDomainKey;
  aiSummary?: string;
  aiRoadmap?: string[];
  aiProjectIdeas?: string[];
  language: Language;
  createdAt: unknown;
}

export interface ProjectTask {
  id: string;
  title: string;
  assignee: string;
  done: boolean;
}

export interface StudentProject {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  track: ProjectTrack;
  summary: string;
  problem: string;
  solution: string;
  region: string;
  school: string;
  teamMembers: string[];
  tasks: ProjectTask[];
  progress: number;
  status: ProjectStatus;
  visibility: ProjectVisibility;
  moderatorNote?: string;
  aiReview?: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRegion: string;
  community: CommunitySlug;
  postType: PostType;
  title: string;
  content: string;
  eventDate?: string;
  status: 'published' | 'archived';
  createdAt: unknown;
  updatedAt: unknown;
}

export interface CommunityComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: unknown;
}

export interface VerifiedOpportunity {
  id: string;
  title: string;
  category: OpportunityCategory;
  organization: string;
  description: string;
  eligibility: string;
  region: string;
  deadline: string;
  verificationSource: string;
  verifiedByUid: string;
  verifiedByName: string;
  status: 'verified' | 'archived';
  createdAt: unknown;
  updatedAt: unknown;
}

export interface SavedOpportunity {
  id: string;
  userId: string;
  opportunityId: string;
  opportunityTitle: string;
  category: OpportunityCategory;
  createdAt: unknown;
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  kind: 'system' | 'project' | 'opportunity' | 'role';
  read: boolean;
  createdAt: unknown;
}

export interface PlatformSetting {
  launchRegion: string;
  announcement?: string;
  allowPublicRegistration: boolean;
  updatedAt: unknown;
}
