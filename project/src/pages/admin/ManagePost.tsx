import React from "react";
import Header from "../../components/Header";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { fetchPosts } from "../../services/postApi";
import { setPosts } from "../../store/postsSlice";
import { useNavigate, useLocation } from "react-router-dom";
import AddArticleForm, { type Category, type Post } from "../../components/AddArticleForm";
import axios from "axios";
import { HandThumbUpIcon, ChatBubbleLeftIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

const CATES = "http://localhost:8080/categories";
const COMMENTS_API = "http://localhost:8080/comments";
const PAGE_SIZE = 5;
const PLACEHOLDER = "/img/placeholder.png";

/* Chuẩn hoá URL ảnh + fallback */
const normalizeImg = (src?: string) => {
  if (!src) return PLACEHOLDER;
  let s = String(src).trim();
  if (/^https?:\/\//i.test(s)) return s;
  s = s.replace(/\\/g, "/");
  if (!s.startsWith("/")) s = "/" + s;
  return s;
};
const imgFallback: React.ReactEventHandler<HTMLImageElement> = (e) => {
  const img = e.currentTarget;
  if (img.dataset.fallbackApplied === "1") return;
  img.dataset.fallbackApplied = "1";
  img.src = PLACEHOLDER;
};

type Comment = {
  id: string | number;
  postId: string | number;
  authorId?: string | number;
  authorEmail?: string;
  avatar?: string;
  text: string;
  createdAt: string;
};

const Stat: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-1 text-gray-500">
    <span className="h-4 w-4">{icon}</span>
    <span className="text-xs">{label}</span>
  </div>
);

const DetailModal: React.FC<{ post: Post; onClose: () => void }> = ({ post, onClose }) => {
  const [showAll, setShowAll] = React.useState(false);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [loadingCmt, setLoadingCmt] = React.useState(true);
  const [newText, setNewText] = React.useState("");

  const me = React.useMemo(() => {
    try { const raw = sessionStorage.getItem("authUser"); return raw ? JSON.parse(raw) : null; }
    catch { return null; }
  }, []);

  const isOwnerOrAdmin = React.useMemo(() => {
    if (!me) return false;
    const role = String(me.role || "user").toLowerCase();
    const ownerEmail = String((post as any)?.authorEmail || "").toLowerCase();
    const ownerId = (post as any)?.authorId;
    const emailMe = String(me.email || "").toLowerCase();
    return role === "admin" || emailMe === ownerEmail || (ownerId != null && String(ownerId) === String(me.id));
  }, [me, post]);

  const canDelete = React.useCallback((c: Comment) => {
    if (!me) return false;
    if (isOwnerOrAdmin) return true;
    const emailMe = String(me.email || "").toLowerCase();
    return String(c.authorEmail || "").toLowerCase() === emailMe || String(c.authorId || "") === String(me.id || "");
  }, [me, isOwnerOrAdmin]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoadingCmt(true);
        const r = await axios.get<Comment[]>(COMMENTS_API, {
          params: { postId: post.id, _sort: "createdAt", _order: "asc" },
        });
        if (alive) setComments(Array.isArray(r.data) ? r.data : []);
      } finally {
        if (alive) setLoadingCmt(false);
      }
    })();
    return () => { alive = false; };
  }, [post.id]);

  const addComment = async () => {
    if (!me) { alert("Vui lòng đăng nhập để bình luận."); return; }
    const text = newText.trim(); if (!text) return;
    const payload: Comment = {
      id: Date.now().toString(),
      postId: post.id!,
      authorId: me.id,
      authorEmail: me.email,
      avatar: `https://i.pravatar.cc/80?u=${encodeURIComponent(me.email || "me")}`,
      text,
      createdAt: new Date().toISOString(),
    };
    try { await axios.post(COMMENTS_API, payload); } catch {}
    setComments((prev) => [...prev, payload]);
    setNewText("");
  };

  const deleteComment = async (id: Comment["id"]) => {
    const c = comments.find((x) => String(x.id) === String(id));
    if (!c) return;
    if (!canDelete(c)) { alert("Bạn không có quyền xoá bình luận này."); return; }
    if (!confirm("Xoá bình luận này?")) return;
    try { await axios.delete(`${COMMENTS_API}/${id}`); } catch {}
    setComments((prev) => prev.filter((x) => String(x.id) !== String(id)));
  };

  const rendered = showAll ? comments : comments.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl rounded-lg bg-white shadow-lg">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <button
            aria-label="Back"
            onClick={onClose}
            className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <span className="-translate-x-[1px] text-lg leading-none">&lt;</span>
          </button>

          <div className="flex items-start gap-3">
            <img
              src={`https://i.pravatar.cc/80?u=${encodeURIComponent(
                (post as any)?.authorEmail || (post as any)?.authorId || post.id || "owner"
              )}`}
              alt="author"
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="rounded-2xl border border-gray-200 bg-white/70 px-6 py-5 shadow-sm">
                <h1 className="mb-1 text-center text-xl font-semibold text-gray-900 break-words">
                  {post.title}
                </h1>
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap" style={{ overflowWrap: "anywhere" }}>
                  {post.desc}
                </p>
                <div className="mt-2 flex items-center gap-4">
                  <Stat icon={<HandThumbUpIcon className="h-4 w-4" />} label={"0 Like"} />
                  <Stat icon={<ChatBubbleLeftIcon className="h-4 w-4" />} label={`${comments.length} Replies`} />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAll(s => !s)}
            className="mt-4 inline-flex items-center gap-1 rounded px-2 py-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View all {comments.length} comments
            <ChevronDownIcon className={`h-4 w-4 transition ${showAll ? "rotate-180" : ""}`} />
          </button>

          <ul className="mt-3 space-y-3">
            {loadingCmt && <li className="text-gray-500">Đang tải bình luận…</li>}
            {!loadingCmt &&
              rendered.map((c) => (
                <li key={String(c.id)} className="flex items-start gap-3">
                  <img
                    src={c.avatar || `https://i.pravatar.cc/80?u=${encodeURIComponent(c.authorEmail || String(c.authorId || c.id))}`}
                    alt="avatar"
                    className="mt-1 h-8 w-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="relative rounded-xl bg-gray-100 px-4 py-2">
                      {canDelete(c) && (
                        <button
                          onClick={() => deleteComment(c.id)}
                          className="absolute right-2 top-2 text-xs text-red-500 hover:underline"
                          title="Delete"
                        >
                          Delete
                        </button>
                      )}
                      <div className="text-gray-800 whitespace-pre-wrap" style={{ overflowWrap: "anywhere" }}>
                        {c.text}
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-gray-500">
                        <Stat icon={<HandThumbUpIcon className="h-4 w-4" />} label={"0 Like"} />
                        <Stat icon={<ChatBubbleLeftIcon className="h-4 w-4" />} label={"0 Replies"} />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>

          <div className="mt-4 flex items-start gap-3">
            <img
              src={`https://i.pravatar.cc/80?u=${encodeURIComponent(me?.email || "guest")}`}
              alt="me"
              className="mt-1 h-8 w-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                <textarea
                  rows={2}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full bg-transparent outline-none text-gray-800"
                  style={{ overflowWrap: "anywhere" }}
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={addComment}
                    className="px-3 py-1 text-sm rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                    disabled={!newText.trim()}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const ManagePost: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const posts = useSelector((s: RootState) => s.posts.items);

  // ======= GUARD: chặn truy cập khi không đăng nhập + chặn Back =======
  React.useEffect(() => {
    const check = () => {
      if (!sessionStorage.getItem("authUser")) {
        navigate("/login", { replace: true, state: { msg: "Vui lòng đăng nhập để tiếp tục." } });
      }
    };
    check(); // khi mount
    window.addEventListener("auth:changed", check);
    window.addEventListener("auth:logout", check);
    window.addEventListener("popstate", check); // khi back/forward
    return () => {
      window.removeEventListener("auth:changed", check);
      window.removeEventListener("auth:logout", check);
      window.removeEventListener("popstate", check);
    };
  }, [navigate]);
  // ================================================================

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Post | null>(null);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [detailPost, setDetailPost] = React.useState<Post | null>(null);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    (async () => {
      try {
        const r = await axios.get<Category[]>(CATES);
        setCategories(Array.isArray(r.data) ? r.data : []);
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  const load = React.useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const data = await fetchPosts();
      dispatch(setPosts(data));
    } catch (e: any) {
      setError(e.message || "Fetch error");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  React.useEffect(() => {
    load();
    const onChanged = () => load();
    window.addEventListener("post:changed", onChanged);
    return () => window.removeEventListener("post:changed", onChanged);
  }, [load]);

  const meSig = React.useMemo(() => sessionStorage.getItem("authUser") || "", [location.key]);
  const myPosts = React.useMemo(() => {
    try {
      const me = meSig ? JSON.parse(meSig) : null;
      if (!me) return [];
      const myId = String(me.id ?? "");
      const myEmail = String(me.email ?? "").toLowerCase();
      return posts.filter((p: any) => {
        const pid = p?.authorId != null ? String(p.authorId) : "";
        const pmail = String(p?.authorEmail || "").toLowerCase();
        return (pid && pid === myId) || (pmail && pmail === myEmail);
      });
    } catch { return []; }
  }, [posts, meSig]);

  const searchKey = React.useMemo(() => new URLSearchParams(location.search).get("search")?.trim() || "", [location.search]);
  const filtered = React.useMemo(() => {
    if (!searchKey) return myPosts;
    const q = (searchKey || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return myPosts.filter((p: any) =>
      ((p?.title || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(q)) ||
      ((p?.desc || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(q))
    );
  }, [myPosts, searchKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  React.useEffect(() => { setPage(1); }, [searchKey, filtered.length]);
  React.useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);
  const pageItems = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const pages = React.useMemo<(number | string)[]>(() => {
    const n = totalPages, cur = page;
    if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1);
    if (cur <= 4) return [1, 2, 3, 4, "…", n - 1, n];
    if (cur >= n - 3) return [1, 2, "…", n - 3, n - 2, n - 1, n];
    return [1, "…", cur - 1, cur, cur + 1, "…", n];
  }, [page, totalPages]);
  const goto = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  return (
    <div className={`min-h-screen bg-gray-50 ${open || detailPost ? "overflow-hidden" : ""}`}>
      <Header />

      <main className="container mx-auto px-6 py-8">
        <h1
          className="text-2xl font-bold text-blue-600 mb-6 uppercase text-center"
          onClick={() => { setEditing(null); setOpen(true); }}
          title="Nhấn để thêm bài viết mới"
        >
          ADD NEW ARTICLE
        </h1>

        {loading && <p className="text-gray-500 text-center">Đang tải bài viết...</p>}
        {error && <p className="text-red-600 text-center">Không tải được dữ liệu: {error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageItems.map((post: Post) => (
              <div
                key={String(post.id)}
                className="rounded overflow-hidden cursor-pointer"
                onClick={() => setDetailPost(post)}
                onDoubleClick={(e) => { e.stopPropagation(); setEditing(post); setOpen(true); }}
                title="Click để xem chi tiết • Double-click để sửa"
              >
                <img
                  src={normalizeImg(post.image)}
                  onError={imgFallback}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />

                <div className="p-4">
                  <p className="text-xs text-indigo-600 mb-1">Date: {post.date}</p>

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold break-words">{post.title}</h3>
                    <span className="text-gray-500 text-sm leading-none">↗</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 break-words">
                    {post.desc && post.desc.length > 160 ? post.desc.slice(0, 160).trim() + "…" : (post.desc || "")}
                  </p>

                  <div className="flex items-center gap-3">
                    <span className="inline-block text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                      {post.category}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setEditing(post); setOpen(true); }}
                      className="ml-auto inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 text-red-500 hover:bg-gray-200"
                    >
                      Edit your post
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {Math.ceil(filtered.length / PAGE_SIZE) > 1 && (
          <div className="mt-8 flex items-center justify-between text-sm">
            <button
              onClick={() => goto(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1 border rounded text-gray-600 hover:text-black disabled:opacity-50"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-1">
              {pages.map((it, idx) =>
                typeof it === "string" ? (
                  <span key={`e-${idx}`} className="px-2 text-gray-500">…</span>
                ) : (
                  <button
                    key={it}
                    onClick={() => goto(it)}
                    className={`h-8 w-8 rounded-lg ${it === page ? "bg-purple-100 text-purple-700 font-semibold" : "text-gray-700 hover:bg-gray-100"}`}
                  >
                    {it}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => goto(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1 border rounded text-gray-600 hover:text-black disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        )}
      </main>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-lg">
            <AddArticleForm
              categories={categories}
              initial={editing || undefined}
              onClose={() => setOpen(false)}
              onSaved={async () => { setOpen(false); await load(); }}
            />
          </div>
        </div>
      )}

      {detailPost && <DetailModal post={detailPost} onClose={() => setDetailPost(null)} />}
    </div>
  );
};

export default ManagePost;
