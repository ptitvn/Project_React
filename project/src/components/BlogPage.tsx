import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { fetchPosts } from "../services/postApi";
import { setPosts } from "../store/postsSlice";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { HandThumbUpIcon, ChatBubbleLeftIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

/* Constants */
const COMMENTS_API = "http://localhost:8080/comments";
const PAGE_SIZE = 5;
const FEAT_PLACEHOLDER = "/img/placeholder.png";
const FEAT_FRAME = "relative w-full aspect-[16/9] max-h-[360px] overflow-hidden rounded-lg";
const categoryColors: Record<string, string> = {
  "Daily Journal": "bg-purple-100 text-purple-700",
  "Work & Career": "bg-blue-100 text-blue-700",
  "Personal Thoughts": "bg-green-100 text-green-700",
  "Emotions & Feelings": "bg-pink-100 text-pink-700",
};

/* Helpers  */
const normalize = (s: string) =>
  (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const shorten = (s: string, max = 140) =>
  s && s.length > max ? s.slice(0, max).trim() + "…" : s || "";

/*  Small stat pill */
const Stat: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-1 text-gray-500">
    <span className="h-4 w-4">{icon}</span>
    <span className="text-xs">{label}</span>
  </div>
);

/*Detail modal*/
const DetailModal: React.FC<{ post: any; onClose: () => void }> = ({ post, onClose }) => {
  const [showAll, setShowAll] = React.useState(false);
  const [comments, setComments] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newText, setNewText] = React.useState("");

  const me = React.useMemo(() => {
    try { const raw = sessionStorage.getItem("authUser"); return raw ? JSON.parse(raw) : null; }
    catch { return null; }
  }, []);

  const isMine = React.useCallback((c: any) => {
    if (!me) return false;
    const sameId = me.id != null && String(me.id) === String(c.authorId ?? c.userId ?? "");
    const sameMail = !!me.email && me.email.toLowerCase() === String(c.authorEmail ?? c.userEmail ?? "").toLowerCase();
    return sameId || sameMail;
  }, [me]);

  React.useEffect(() => {
    let ok = true;
    (async () => {
      try {
        setLoading(true);
        const r = await axios.get(COMMENTS_API, {
          params: { postId: post.id, _sort: "createdAt", _order: "asc" },
        });
        const list = (Array.isArray(r.data) ? r.data : []).map((c: any) => ({
          ...c,
          authorId: c.authorId ?? c.userId,
          authorEmail: c.authorEmail ?? c.userEmail,
        }));
        if (ok) setComments(list);
      } finally { if (ok) setLoading(false); }
    })();
    return () => { ok = false; };
  }, [post.id]);

  const addComment = async () => {
    if (!me) { alert("Vui lòng đăng nhập để bình luận."); return; }
    const text = newText.trim(); if (!text) return;
    const payload = {
      id: Date.now().toString(),
      postId: post.id,
      authorId: me.id,
      authorEmail: me.email,
      text,
      createdAt: new Date().toISOString(),
    };
    try { await axios.post(COMMENTS_API, payload); } catch {}
    setComments((prev) => [...prev, payload]);
    setNewText("");
  };

  const deleteComment = async (id: string | number) => {
    const c = comments.find((x) => String(x.id) === String(id));
    if (!c) return;
    if (!isMine(c)) { alert("Bạn chỉ có thể xoá bình luận của mình."); return; }
    if (!confirm("Xoá bình luận này?")) return;
    try { await axios.delete(`${COMMENTS_API}/${id}`); } catch {}
    setComments((prev) => prev.filter((x) => String(x.id) !== String(id)));
  };

  const likes = 15, replies = comments.length;
  const rendered = showAll ? comments : comments.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl rounded-lg bg-white shadow-lg max-h-[90vh] overflow-y-auto">
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
                post?.authorEmail || post?.authorId || post.id || "owner"
              )}`}
              alt="author"
              className="h-9 w-9 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="rounded-2xl border border-gray-200 bg-white/70 px-6 py-5 shadow-sm">
                <h1 className="text-center text-xl font-semibold text-gray-900 break-words">
                  {post.title}
                </h1>

                <div className="my-3">
                  <div className={FEAT_FRAME}>
                    <img
                      src={post.image || FEAT_PLACEHOLDER}
                      onError={(e) => (e.currentTarget.src = FEAT_PLACEHOLDER)}
                      alt={post.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </div>

                <p className="text-gray-800 leading-relaxed break-words break-all whitespace-pre-wrap">
                  {post.desc}
                </p>
                <div className="mt-2 flex items-center gap-4">
                  <Stat icon={<HandThumbUpIcon className="h-4 w-4" />} label={`${likes} Like`} />
                  <Stat icon={<ChatBubbleLeftIcon className="h-4 w-4" />} label={`${replies} Replies`} />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowAll((s) => !s)}
            className="mt-4 inline-flex items-center gap-1 rounded px-2 py-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            View all {comments.length} comments
            <ChevronDownIcon className={`h-4 w-4 transition ${showAll ? "rotate-180" : ""}`} />
          </button>

          <ul className="mt-3 space-y-3">
            {loading && <li className="text-gray-500">Đang tải bình luận…</li>}
            {!loading && rendered.map((c) => (
              <li key={String(c.id)} className="flex items-start gap-3">
                <img
                  src={`https://i.pravatar.cc/80?u=${encodeURIComponent(c.authorEmail || String(c.authorId || c.id))}`}
                  alt="avatar"
                  className="mt-1 h-8 w-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="relative rounded-xl bg-gray-100 px-4 py-2">
                    {isMine(c) && (
                      <button
                        onClick={() => deleteComment(c.id)}
                        className="absolute right-2 top-2 text-xs text-red-500 hover:underline"
                        title="Delete"
                      >
                        Delete
                      </button>
                    )}
                    <div className="text-gray-800 break-words break-all whitespace-pre-wrap">{c.text}</div>
                    <div className="mt-2 flex items-center gap-4 text-gray-500">
                      <Stat icon={<HandThumbUpIcon className="h-4 w-4" />} label="0 Like" />
                      <Stat icon={<ChatBubbleLeftIcon className="h-4 w-4" />} label="0 Replies" />
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
                  className="w-full bg-transparent outline-none text-gray-800 break-words break-all whitespace-pre-wrap"
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

/* ===== Page ===== */
const BlogPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const posts = useSelector((s: RootState) => s.posts.items);

  /* AUTH GUARD */
  React.useEffect(() => {
    const ensure = () => {
      if (!sessionStorage.getItem("authUser")) {
        navigate("/login", { replace: true, state: { msg: "Vui lòng đăng nhập để tiếp tục." } });
      }
    };
    ensure();
    const onStorage = (e: StorageEvent) => { if (e.key === "authUser") ensure(); };
    const onAuth = () => ensure();
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:changed", onAuth);
    window.addEventListener("auth:logout", onAuth);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:changed", onAuth);
      window.removeEventListener("auth:logout", onAuth);
    };
  }, [navigate, location.key]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [activeCate, setActiveCate] = React.useState<string | null>(null);
  const [detailPost, setDetailPost] = React.useState<any | null>(null);

  const searchKey = React.useMemo(
    () => (new URLSearchParams(location.search).get("search") || "").trim(),
    [location.search]
  );

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchPosts();
        if (alive) dispatch(setPosts(data));
      } catch (e: any) {
        if (alive) setError(e.message || "Fetch error");
      } finally { if (alive) setLoading(false); }
    })();
    return () => { alive = false; };
  }, [dispatch]);

  const list = React.useMemo(() => {
    let arr = posts;
    if (activeCate) arr = arr.filter((p: any) => p?.category === activeCate);
    if (searchKey) {
      const q = normalize(searchKey);
      arr = arr.filter((p: any) => normalize(p?.title || "").includes(q) || normalize(p?.desc || "").includes(q));
    }
    return arr;
  }, [posts, activeCate, searchKey]);

  React.useEffect(() => { setPage(1); }, [activeCate, searchKey]);

  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  React.useEffect(() => { if (page > totalPages) setPage(totalPages); }, [page, totalPages]);

  const pageItems = React.useMemo(
    () => list.slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE),
    [list, page]
  );

  const pages = React.useMemo<(number | string)[]>(() => {
    const n = totalPages, cur = page;
    if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1);
    if (cur <= 4) return [1, 2, 3, 4, "…", n - 1, n];
    if (cur >= n - 3) return [1, 2, "…", n - 3, n - 2, n - 1, n];
    return [1, "…", cur - 1, cur, cur + 1, "…", n];
  }, [page, totalPages]);

  const goto = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  const recentPosts = list.slice(0, 3);
  const categoryNames = React.useMemo(
    () => Array.from(new Set(list.map((p: any) => p?.category).filter(Boolean))) as string[],
    [list]
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="container mx-auto px-6 py-10 flex-1">
          <p className="text-gray-500">Đang tải bài viết...</p>
        </main>
        <Footer />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="container mx-auto px-6 py-10 flex-1">
          <p className="text-red-600">Không tải được dữ liệu: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }
  if (list.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="container mx-auto px-6 py-10 flex-1">
          <p className="text-gray-600">Chưa có bài viết nào.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-10 flex-1">
        {/* Recent */}
        {recentPosts.length > 0 && !searchKey && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recent blog posts</h2>

            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {/* LEFT */}
              <article
                className="md:col-span-2 rounded overflow-hidden cursor-pointer"
                onClick={() => setDetailPost(recentPosts[0])}
                title="Xem chi tiết"
              >
                <div className="relative w-full overflow-hidden rounded">
                  <img
                    src={recentPosts[0].image}
                    alt={recentPosts[0].title}
                    className="w-full h-[220px] md:h-[260px] lg:h-[300px] object-cover object-[70%_center]"
                  />
                </div>

                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">Date: {recentPosts[0].date}</p>
                  <h3 className="font-semibold text-xl mb-2 break-words">{recentPosts[0].title}</h3>

                  <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap [overflow-wrap:anywhere] line-clamp-2">
                    {recentPosts[0].desc}
                  </p>
                  <span className={`w-fit inline-flex text-xs px-3 py-1 rounded-full ${categoryColors[recentPosts[0].category] || "bg-gray-100 text-gray-700"}`}>
                    {recentPosts[0].category}
                  </span>
                </div>
              </article>

              <div className="grid grid-rows-2 gap-6">
                {recentPosts.slice(1).map((post) => (
                  <article
                    key={post.id}
                    className="rounded overflow-hidden cursor-pointer min-h-[150px] md:min-h-[180px] lg:min-h-[200px] flex"
                    onClick={() => setDetailPost(post)}
                    title="Xem chi tiết"
                  >
                    <div className="relative h-full w-40 md:w-44 lg:w-48 flex-shrink-0">
                      <img src={post.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
                    </div>

                    <div className="p-4 flex-1 min-w-0 flex flex-col justify-between">
                      <div className="min-w-0">
                        <p className="text-xs text-indigo-600 mb-1">Date: {post.date}</p>
                        <h3 className="font-semibold text-base mb-2 break-words">{post.title}</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap [overflow-wrap:anywhere] line-clamp-2">
                          {post.desc}
                        </p>
                      </div>
                      <span className={`w-fit inline-flex text-xs px-3 py-1 rounded-full mt-2 ${categoryColors[post.category] || "bg-gray-100 text-gray-700"}`}>
                        {post.category}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Tabs */}
        <div className="mb-3 flex items-center gap-6">
          <button
            type="button"
            onClick={() => setActiveCate(null)}
            className={`text-sm font-medium ${activeCate == null ? "text-blue-600" : "text-gray-600 hover:text-gray-900 hover:underline"}`}
            title="Hiển thị tất cả bài viết"
          >
            All blog posts
          </button>

          <button
            onClick={() => navigate("/ManagePost", { replace: true })}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline"
          >
            All my posts
          </button>
        </div>

        {/* Categories filter */}
        {categoryNames.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-4 text-sm text-gray-700">
            {categoryNames.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setActiveCate(name)}
                className={`cursor-pointer hover:underline ${activeCate === name ? "font-semibold text-blue-600" : ""}`}
                title="Lọc theo chủ đề"
              >
                {name}
              </button>
            ))}
          </div>
        )}

        {/* Grid list */}
        <div className="grid md:grid-cols-3 gap-6">
          {pageItems.map((post) => (
            <div key={post.id} className="rounded overflow-hidden cursor-pointer" onClick={() => setDetailPost(post)} title="Xem chi tiết">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img src={post.image} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">Date: {post.date}</p>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold break-words">{post.title}</h3>
                  <span className="text-gray-500 text-sm">↗</span>
                </div>
                <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap [overflow-wrap:anywhere] line-clamp-2">
                  {post.desc}
                </p>
                <span className={`w-fit inline-flex text-xs px-3 py-1 rounded-full ${categoryColors[post.category] || "bg-gray-100 text-gray-700"}`}>
                  {post.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {Math.ceil(list.length / PAGE_SIZE) > 1 && (
          <div className="mt-6 flex items-center justify-between text-sm">
            <button onClick={() => goto(page - 1)} disabled={page === 1} className="flex items-center gap-1 px-3 py-1 border rounded text-gray-600 hover:text-black disabled:opacity-50">
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

            <button onClick={() => goto(page + 1)} disabled={page === totalPages} className="flex items-center gap-1 px-3 py-1 border rounded text-gray-600 hover:text-black disabled:opacity-50">
              Next →
            </button>
          </div>
        )}
      </main>

      <Footer />

      {/* Detail modal */}
      {detailPost && <DetailModal  post={detailPost} onClose={() => setDetailPost(null)} />}
    </div>
  );
};

export default BlogPage;
