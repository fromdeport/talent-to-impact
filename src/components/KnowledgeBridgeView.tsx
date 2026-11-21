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
  PixelCalendar as Calendar,
  PixelMessageSquare as MessageSquare,
  PixelPlus as Plus,
  PixelSend as Send,
  PixelTrash as Trash2,
  PixelClose as X,
} from './PixelIcons';
import { usePlatform } from '../context/PlatformContext';
import { db, formatTimestamp, generateSafeId, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  FIELD_LIMITS,
  type CommunityComment,
  type CommunityPost,
  type CommunitySlug,
  type PostType,
} from '../types/platform';
import { MODULE_ASSETS } from '../config/moduleAssets';
import { ModuleBanner } from './ModuleBanner';

const COMMUNITIES: CommunitySlug[] = [
  'ai_engineering',
  'research_science',
  'entrepreneurship',
  'leadership',
  'navoi_schools',
];

const POST_TYPES: PostType[] = ['material', 'debate', 'event'];

export function KnowledgeBridgeView() {
  const { user, profile, t, signInWithGoogle } = usePlatform();

  const [selectedCommunity, setSelectedCommunity] = useState<CommunitySlug | 'all'>('all');
  const [selectedType, setSelectedType] = useState<PostType | 'all'>('all');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Composer state
  const [community, setCommunity] = useState<CommunitySlug>('navoi_schools');
  const [postType, setPostType] = useState<PostType>('material');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [eventDate, setEventDate] = useState('');

  // Comments state per expanded post
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, CommunityComment[]>>({});
  const [commentDraft, setCommentDraft] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'community_posts'), where('status', '==', 'published'));
      const snap = await getDocs(q);
      const list = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<CommunityPost, 'id'>) }))
        .sort((a, b) => {
          const ta = (a.createdAt as { seconds?: number })?.seconds ?? 0;
          const tb = (b.createdAt as { seconds?: number })?.seconds ?? 0;
          return tb - ta;
        });
      setPosts(list);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'community_posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const loadComments = async (postId: string) => {
    const path = `community_posts/${postId}/comments`;
    try {
      const q = query(collection(db, 'community_posts', postId, 'comments'), where('postId', '==', postId));
      const snap = await getDocs(q);
      const list = snap.docs
        .map((d) => ({ id: d.id, ...(d.data() as Omit<CommunityComment, 'id'>) }))
        .sort((a, b) => {
          const ta = (a.createdAt as { seconds?: number })?.seconds ?? 0;
          const tb = (b.createdAt as { seconds?: number })?.seconds ?? 0;
          return ta - tb;
        });
      setComments((prev) => ({ ...prev, [postId]: list }));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    }
  };

  const togglePostComments = async (postId: string) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }
    setExpandedPostId(postId);
    setCommentDraft('');
    await loadComments(postId);
  };

  const handlePublishPost = async () => {
    if (!user) {
      signInWithGoogle();
      return;
    }
    setErrorMsg(null);
    const cleanTitle = title.trim().slice(0, FIELD_LIMITS.postTitleMax);
    const cleanContent = content.trim().slice(0, FIELD_LIMITS.postContentMax);

    if (cleanTitle.length < FIELD_LIMITS.postTitleMin) {
      setErrorMsg(`${t.knowledgeBridgePage.fieldTitle}: min ${FIELD_LIMITS.postTitleMin}`);
      return;
    }
    if (cleanContent.length < FIELD_LIMITS.postContentMin) {
      setErrorMsg(`${t.knowledgeBridgePage.fieldContent}: min ${FIELD_LIMITS.postContentMin}`);
      return;
    }

    setSaving(true);
    const postId = generateSafeId('post');
    const path = `community_posts/${postId}`;
    try {
      const payload: Record<string, unknown> = {
        authorId: user.uid,
        authorName: (profile?.displayName || user.displayName || 'Student').slice(0, FIELD_LIMITS.displayNameMax),
        authorRegion: (profile?.region || 'Navoiy viloyati').slice(0, FIELD_LIMITS.regionMax),
        community,
        postType,
        title: cleanTitle,
        content: cleanContent,
        status: 'published',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (eventDate.trim()) {
        payload.eventDate = eventDate.trim().slice(0, 60);
      }
      await setDoc(doc(db, 'community_posts', postId), payload);
      setTitle('');
      setContent('');
      setEventDate('');
      setComposerOpen(false);
      await loadPosts();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user) {
      signInWithGoogle();
      return;
    }
    const cleanBody = commentDraft.trim().slice(0, FIELD_LIMITS.commentMax);
    if (cleanBody.length < FIELD_LIMITS.commentMin) return;

    setSendingComment(true);
    const commentId = generateSafeId('cmt');
    const path = `community_posts/${postId}/comments/${commentId}`;
    try {
      await setDoc(doc(db, 'community_posts', postId, 'comments', commentId), {
        postId,
        authorId: user.uid,
        authorName: (profile?.displayName || user.displayName || 'Student').slice(0, FIELD_LIMITS.displayNameMax),
        body: cleanBody,
        createdAt: serverTimestamp(),
      });
      setCommentDraft('');
      await loadComments(postId);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setSendingComment(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const path = `community_posts/${postId}`;
    try {
      await deleteDoc(doc(db, 'community_posts', postId));
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (selectedCommunity !== 'all' && p.community !== selectedCommunity) return false;
    if (selectedType !== 'all' && p.postType !== selectedType) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#050608] text-[#F4F5F7] pb-20">
      <ModuleBanner
        code="03. KNOWLEDGE BRIDGE"
        title={t.knowledgeBridgePage.title}
        subtitle={t.knowledgeBridgePage.subtitle}
        image={MODULE_ASSETS.knowledgeBridge}
        imageAlt="03. KNOWLEDGE BRIDGE — Connect, learn, share"
        accent="primary"
        action={
          <button
            type="button"
            onClick={() => {
              if (!user) {
                signInWithGoogle();
                return;
              }
              setComposerOpen((prev) => !prev);
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#D4FF00] hover:bg-[#C2EC00] text-[#090E23] text-xs font-mono font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            {t.knowledgeBridgePage.newPost}
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {!user && (
          <div className="p-5 rounded-md bg-[#0C0F16] border border-white/12 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-300">{t.knowledgeBridgePage.signInToParticipate}</p>
            <button
              type="button"
              onClick={signInWithGoogle}
              className="px-4 py-2 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider"
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

        {/* Community & Format Filters */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-md bg-[#0C0F16] border border-white/12 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedCommunity('all')}
              className={`px-3 py-1.5 rounded-sm text-xs font-mono font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedCommunity === 'all' ? 'bg-[#D9FF00] text-[#050608] font-semibold' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.knowledgeBridgePage.allCommunities}
            </button>
            {COMMUNITIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCommunity(c)}
                className={`px-3 py-1.5 rounded-sm text-xs font-mono font-medium transition-colors whitespace-nowrap shrink-0 ${
                  selectedCommunity === c ? 'bg-[#D9FF00] text-[#050608] font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {t.communities[c]}
              </button>
            ))}
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as PostType | 'all')}
            className="w-full sm:w-auto px-3.5 py-2 rounded-md bg-[#0C0F16] border border-white/12 text-xs sm:text-sm text-white"
          >
            <option value="all">{t.knowledgeBridgePage.fieldType}: All</option>
            {POST_TYPES.map((pt) => (
              <option key={pt} value={pt}>
                {t.postTypes[pt]}
              </option>
            ))}
          </select>
        </div>

        {/* New Post Composer */}
        {composerOpen && (
          <div className="p-4 sm:p-7 rounded-md bg-[#0C0F16] border border-[#5CE1E6]/40 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-display text-base font-bold text-white">{t.knowledgeBridgePage.newPost}</h2>
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="p-1.5 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">{t.knowledgeBridgePage.fieldCommunity}</label>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value as CommunitySlug)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                >
                  {COMMUNITIES.map((c) => (
                    <option key={c} value={c}>
                      {t.communities[c]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">{t.knowledgeBridgePage.fieldType}</label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value as PostType)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                >
                  {POST_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {t.postTypes[pt]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-slate-300">{t.knowledgeBridgePage.fieldEventDate}</label>
                <input
                  type="text"
                  maxLength={60}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="2026-12-15"
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-300">{t.knowledgeBridgePage.fieldTitle}</label>
              <input
                type="text"
                maxLength={FIELD_LIMITS.postTitleMax}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-slate-300">{t.knowledgeBridgePage.fieldContent}</label>
              <textarea
                rows={5}
                maxLength={FIELD_LIMITS.postContentMax}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setComposerOpen(false)}
                className="px-4 py-2 rounded-md border border-white/15 text-xs font-mono text-slate-300"
              >
                {t.common.close}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handlePublishPost}
                className="px-5 py-2 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider transition-colors"
              >
                {t.knowledgeBridgePage.publishBtn}
              </button>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        {loading ? (
          <p className="text-sm font-mono text-slate-400 py-10">{t.common.loading}</p>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 rounded-md bg-[#0C0F16] border border-white/10 text-center space-y-4">
            <p className="text-sm text-slate-300">{t.knowledgeBridgePage.emptyPosts}</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredPosts.map((post) => {
              const isExpanded = expandedPostId === post.id;
              const postComments = comments[post.id] || [];
              return (
                <article
                  key={post.id}
                  className="p-4 sm:p-7 rounded-md bg-[#0C0F16] border border-white/10 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-[#5CE1E6]">
                        {t.communities[post.community]} · {t.postTypes[post.postType]}
                        {post.eventDate ? ` · ${post.eventDate}` : ''}
                      </p>
                      <h3 className="font-display text-lg font-bold text-white">{post.title}</h3>
                      <p className="text-xs text-slate-400">
                        {post.authorName} · {post.authorRegion} · {formatTimestamp(post.createdAt)}
                      </p>
                    </div>
                    {user && post.authorId === user.uid && (
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 rounded-md text-slate-400 hover:text-rose-400 hover:bg-white/5"
                        aria-label="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>

                  {post.eventDate && (
                    <div className="inline-flex items-center gap-2 text-xs text-[#D9FF00] font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.eventDate}
                    </div>
                  )}

                  <div className="pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => togglePostComments(post.id)}
                      className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#D9FF00] hover:text-white transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {t.knowledgeBridgePage.commentsTitle}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="pt-3 space-y-4 border-t border-white/10">
                      <div className="space-y-3">
                        {postComments.length === 0 ? (
                          <p className="text-xs text-slate-500">—</p>
                        ) : (
                          postComments.map((c) => (
                            <div
                              key={c.id}
                              className="p-3.5 rounded-md bg-[#050608] border border-white/10 space-y-1"
                            >
                              <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="font-medium text-slate-200">{c.authorName}</span>
                                <span className="font-mono tabular-nums">{formatTimestamp(c.createdAt)}</span>
                              </div>
                              <p className="text-sm text-slate-300 leading-relaxed">{c.body}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {user && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="text"
                            maxLength={FIELD_LIMITS.commentMax}
                            value={commentDraft}
                            onChange={(e) => setCommentDraft(e.target.value)}
                            placeholder={t.knowledgeBridgePage.commentPlaceholder}
                            className="flex-1 px-3.5 py-2 rounded-md bg-[#050608] border border-white/15 text-sm text-white"
                          />
                          <button
                            type="button"
                            disabled={sendingComment}
                            onClick={() => handleAddComment(post.id)}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md bg-[#D9FF00] hover:bg-[#C6EA00] text-[#050608] text-xs font-mono font-semibold uppercase tracking-wider transition-colors whitespace-nowrap shrink-0"
                          >
                            <Send className="w-3.5 h-3.5" />
                            {t.knowledgeBridgePage.sendComment}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
