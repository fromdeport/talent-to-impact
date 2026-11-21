/**
 * Security Rules Specification Verification Suite for TALENT TO IMPACT.
 * Documents the Dirty Dozen adversarial test payloads expected to fail with PERMISSION_DENIED
 * against firestore.rules when executed under the Firebase Rules Unit Testing emulator.
 */

export interface AdversarialPayloadCase {
  id: string;
  name: string;
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  expected: 'PERMISSION_DENIED';
  payload?: Record<string, unknown>;
}

export const DIRTY_DOZEN_CASES: AdversarialPayloadCase[] = [
  {
    id: 'DD-01',
    name: 'Privilege escalation on registration (student sets role=admin)',
    path: 'users/student_uid_1',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { uid: 'student_uid_1', role: 'admin', email: 'student@example.uz' },
  },
  {
    id: 'DD-02',
    name: 'Self role upgrade on profile update',
    path: 'users/student_uid_1',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { role: 'coordinator' },
  },
  {
    id: 'DD-03',
    name: 'Shadow ghost field injection on student project',
    path: 'projects/proj_shadow_1',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { isFeatured: true, ownerId: 'student_uid_1' },
  },
  {
    id: 'DD-04',
    name: 'Email spoofing without email_verified=true',
    path: 'opportunities/opp_spoof_1',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { title: 'Spoofed Grant', status: 'verified' },
  },
  {
    id: 'DD-05',
    name: 'Cross-user PII read on /users/{otherUid}',
    path: 'users/other_student_uid',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-06',
    name: 'Identity spoofing on talent_results creation',
    path: 'talent_results/res_spoof_1',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { userId: 'victim_uid', answersCount: 12 },
  },
  {
    id: 'DD-07',
    name: 'Orphaned comment under non-existent parent community post',
    path: 'community_posts/nonexistent_post/comments/c_orphan',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { postId: 'nonexistent_post', body: 'Orphaned write' },
  },
  {
    id: 'DD-08',
    name: 'Resource poisoning via oversized invalid document ID',
    path: `projects/${'x'.repeat(200)}`,
    operation: 'create',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-09',
    name: 'Value poisoning on whitelisted project progress field',
    path: 'projects/proj_1',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { progress: '999%' },
  },
  {
    id: 'DD-10',
    name: 'Unauthorized student attempt to publish verified opportunity',
    path: 'opportunities/opp_unauth_1',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { title: 'Unverified Olympiad', verificationSource: 'none' },
  },
  {
    id: 'DD-11',
    name: 'Backdated timestamp tampering on community post create',
    path: 'community_posts/post_backdate_1',
    operation: 'create',
    expected: 'PERMISSION_DENIED',
    payload: { createdAt: '2020-01-01T00:00:00Z' },
  },
  {
    id: 'DD-12',
    name: 'Terminal state mutation on approved project by non-admin owner',
    path: 'projects/proj_approved_1',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
    payload: { status: 'draft', moderatorNote: 'Cleared by student' },
  },
];
