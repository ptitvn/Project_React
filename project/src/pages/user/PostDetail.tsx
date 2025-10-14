import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { HandThumbUpIcon, ChatBubbleLeftIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

/* API  */
const POSTS = "http://localhost:8080/posts";
const USERS = "http://localhost:8080/users";
const COMMENTS = "http://localhost:8080/comments";

/* UI const */
const PLACEHOLDER = "/img/placeholder.png";
const FEAT_FRAME = "relative w-full aspect-[16/9] max-h-[360px] overflow-hidden rounded-lg";

/* Types  */
type Post = {
  id: string | number;
  title: string;
  desc?: string;
  content?: string;
  image?: string;
  authorId?: string | number;
  authorEmail?: string;
  likes?: number;
};
type User = {
  id: string | number;
  email: string;
  fullName?: string;
  role?: "admin" | "user";
};
type Comment = {
  id: string | number;
  postId: string | number;
  userId?: string | number;
  userEmail?: string;
  text: string;
  createdAt?: string;
};

const Stat: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-1 text-gray-500">
    <span className="h-4 w-4">{icon}</span>
    <span className="text-xs">{label}</span>
  </div>
);

const avatarUrl = (key: string) => `https://i.pravatar.cc/80?u=${encodeURIComponent(key || "u")}`;
const getAuth = () => {
  try { const raw = sessionStorage.getItem("authUser"); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
};

/* Comment Row */
const CommentRow: React.FC<{ c: Comment; me: any; onDelete: (id: string | number) => void; }> = ({ c, me, onDelete }) => {
  const isMine =
    (me?.id != null && String(me.id) === String(c.userId ?? "")) ||
    (!!me?.email && me.email.toLowerCase() === String(c.userEmail || "").toLowerCase());
  const isAdmin = String(me?.role || "").toLowerCase() === "admin";

  return (
    <li className="flex items-start gap-3">
      <img
        src={avatarUrl(c.userEmail || String(c.userId || c.id))}
        alt="avatar"
        className="mt-1 h-8 w-8 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="relative rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          {(isMine || isAdmin) && (
            <button
              onClick={() => onDelete(c.id)}
              className="absolute right-2 top-2 text-xs text-red-500 hover:underline"
              title="Delete comment"
            >
              Delete
            </button>
          )}
          <div className="text-gray-800 whitespace-pre-wrap" style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
            {c.text}
          </div>
          <div className="mt-2 flex items-center gap-4">
            <Stat icon={<HandThumbUpIcon className="h-4 w-4" />} label="0 Like" />
            <Stat icon={<ChatBubbleLeftIcon className="h-4 w-4" />} label="0 Replies" />
          </div>
        </div>
      </div>
    </li>
  );
};

/* Page  */
const PostDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id: idParam } = useParams<{ id: string }>();
  const location = useLocation();

  const postFromState = (location.state as any)?.post as Post | undefined;
  const postId = postFromState?.id ?? idParam;

  const [post, setPost] = useState<Post | null>(postFromState ?? null);
  const [owner, setOwner] = useState<User | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showAll, setShowAll] = useState(false);

  const [newText, setNewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const me = useMemo(getAuth, []);
  const content = (post?.content ?? post?.desc ?? "").toString();
  const totalComments = comments.length;
  const rendered = showAll ? comments : comments.slice(0, 2);

  const ownerAvatar = useMemo(() => {
    const key =
      post?.authorEmail ||
      owner?.email ||
      (owner?.id != null ? String(owner.id) : "") ||
      "anonymous";
    return avatarUrl(key);
  }, [post?.authorEmail, owner?.email, owner?.id]);

  /* Load post + owner + comments */
  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        let p = post;
        if (!p && postId != null) {
          const { data } = await axios.get<Post>(`${POSTS}/${postId}`);
          p = data;
        }
        if (!p || !alive) return;
        setPost(p);

        try {
          if (p.authorId != null) {
            const { data } = await axios.get<User[]>(USERS, { params: { id: p.authorId } });
            if (alive && data?.[0]) setOwner(data[0]);
          } else if (p.authorEmail) {
            const { data } = await axios.get<User[]>(USERS, { params: { email: p.authorEmail } });
            if (alive && data?.[0]) setOwner(data[0]);
          } else {
            setOwner(null);
          }
        } catch { setOwner(null); }

        const rc = await axios.get<Comment[]>(COMMENTS, {
          params: { postId: p.id, _sort: "createdAt", _order: "asc" },
        });
        if (alive) setComments(Array.isArray(rc.data) ? rc.data : []);
      } catch 
    };

    load();
    return () => { alive = false; };
  }, [postId]); 

  /* Actions */
  const addComment = async () => {
    if (!newText.trim() || !post?.id) return;
    if (!me) return alert("Vui lòng đăng nhập để bình luận.");

    setSubmitting(true);
    setErrMsg(null);
    try {
      const payload: Comment = {
        id: Date.now().toString(),
        postId: post.id,
        userId: me.id,
        userEmail: me.email,
        text: newText.trim(),
        createdAt: new Date().toISOString(),
      };
      await axios.post(COMMENTS, payload);
      setComments((prev) => [...prev, payload]);
      setNewText("");
      window.dispatchEvent(new Event("post:changed"));
    } catch (e: any) {
      setErrMsg(e?.message || "Không thể gửi bình luận.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (id: string | number) => {
    if (!confirm("Xoá bình luận này?")) return;
    try {
      await axios.delete(`${COMMENTS}/${id}`);
      setComments((prev) => prev.filter((c) => String(c.id) !== String(id)));
      window.dispatchEvent(new Event("post:changed"));
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <button
          aria-label="Back"
          onClick={() => navigate(-1)}
          className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <span className="-translate-x-[1px] text-lg leading-none">&lt;</span>
        </button>

        <div className="flex items-start gap-3">
          <img src={ownerAvatar} alt="author" className="h-9 w-9 rounded-full object-cover" />
          <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5">
            <h1 className="mb-2 text-center text-xl font-semibold text-gray-900 break-words">
              {post?.title || "Untitled"}
            </h1>

            <div className="my-3">
              <div className={FEAT_FRAME}>
                <img
                  src={(post?.image as string) || PLACEHOLDER}
                  onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                  alt={post?.title || "post image"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>

            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap" style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
              {content}
            </p>
            <div className="mt-3 flex items-center gap-4">
              <Stat icon={<HandThumbUpIcon className="h-4 w-4" />} label={`${post?.likes ?? 0} Like`} />
              <Stat icon={<ChatBubbleLeftIcon className="h-4 w-4" />} label={`${totalComments} Replies`} />
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAll((s) => !s)}
          className="mt-4 inline-flex items-center gap-1 rounded px-2 py-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          View all {totalComments} comments
          <ChevronDownIcon className={`h-4 w-4 transition ${showAll ? "rotate-180" : ""}`} />
        </button>

        <ul className="mt-3 space-y-3">
          {rendered.map((c) => (
            <CommentRow key={String(c.id)} c={c} me={me} onDelete={deleteComment} />
          ))}
        </ul>

        {/* New comment */}
        <div className="mt-4 flex items-start gap-3">
          <img
            src={avatarUrl(me?.email || "guest@example.com")}
            alt="me"
            className="mt-1 h-8 w-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <textarea
              rows={2}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
              style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}
            />
            <div className="mt-2 flex items-center gap-3">
              <button
                onClick={addComment}
                disabled={submitting || !newText.trim()}
                className="rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-60 hover:bg-emerald-700"
              >
                {submitting ? "Posting..." : "Post"}
              </button>
              {errMsg && <span className="text-sm text-red-600">{errMsg}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
