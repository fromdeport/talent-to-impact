# TALENT TO IMPACT — Security Specification (Phase 0)

## 1. Data Invariants
1. **PII Isolation**: `/users/{userId}` contains user email and school metadata; only the account owner (`request.auth.uid == userId`) or a verified administrator may read it. Non-owners can never read another user's email or profile document.
2. **No Self-Assigned Privilege Escalation**: On `/users/{userId}` creation, non-admin users MUST strictly have `role == 'student'`. Users can NEVER modify their own `role` field on update.
3. **Immutable Ownership & Timestamps**: `ownerId`, `authorId`, `userId`, and `createdAt` are immutable once written. `createdAt == request.time` on create; `updatedAt == request.time` on update.
4. **Master Gate Relational Sync**: `/community_posts/{postId}/comments/{commentId}` requires parent `/community_posts/{postId}` to exist and have `status == 'published'` before any comment is created.
5. **Verified Opportunities Integrity**: Only verified `admin` or `coordinator` users can create, update, or archive `/opportunities/{opportunityId}`, and `verificationSource` must be a non-empty string (`>= 5` chars).
6. **Bounded Arrays & Strict Key Allowlists**: Every array (`interests <= 10`, `teamMembers <= 8`, `tasks <= 25`, `aiRoadmap <= 8`, `aiProjectIdeas <= 5`) and every string has explicit `.size()` bounds. Shadow/ghost fields are blocked by `keys().hasOnly(...)` and `affectedKeys().hasOnly(...)`.
7. **Secure List Queries**: No `allow list` block performs blanket `isSignedIn()` reads or `get()`/`exists()` calls; every `allow list` evaluates `resource.data` or `isBootstrapAdmin()`.

## 2. The "Dirty Dozen" Adversarial Payloads (All Must Return PERMISSION_DENIED)
1. **Privilege Escalation on Registration**: Student creates `/users/{uid}` with `role: "admin"`.
2. **Self-Role Upgrade on Profile Update**: Student updates `/users/{uid}` changing `role` from `"student"` to `"coordinator"`.
3. **Shadow Ghost Field Injection**: User creates `/projects/{id}` with extra field `isFeatured: true`.
4. **Email Spoofing Attack**: Unverified user (`email_verified: false`) attempts write claiming admin email.
5. **PII Blanket Leak**: Authenticated User B attempts `get` on `/users/{userA}`.
6. **Identity Spoofing on Talent Result**: User A creates `/talent_results/{id}` with `userId: "userB"`.
7. **Orphaned Comment Write**: User creates `/community_posts/nonexistent/comments/c1`.
8. **Resource Poisoning via Oversized ID**: User attempts write to `/projects/` with 200-character junk ID.
9. **Value Poisoning on Whitelisted Update Field**: Project owner updates `progress` to `"100%"` (string instead of integer 0..100) or 1MB title string.
10. **Unauthorized Opportunity Publication**: Regular student attempts to publish a fake opportunity in `/opportunities/{id}`.
11. **Backdated Timestamp Tampering**: User creates `/community_posts/{id}` with forged `createdAt` not matching `request.time`.
12. **Terminal State Mutation**: Student attempts to overwrite an `approved` project's `status` back to `draft` or alter `moderatorNote`.
