// src/pages/admin/ArticleManager.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  NewspaperIcon,
  ArrowLeftOnRectangleIcon,
  EnvelopeIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AddArticleForm, { type Category, type Post } from "../../components/AddArticleForm";

const POSTS = "http://localhost:8080/posts";
const CATES = "http://localhost:8080/categories";
const PLACEHOLDER = "/img/placeholder.png";
const PAGE_SIZE = 5;

const ADMIN_EMAIL = "admin@site.com";

/* Chuẩn hoá URL ảnh + fallback */
const normalizeImg = (src?: string) => {
  if (!src) return PLACEHOLDER;
  let s = String(src).trim();
  if (/^https?:\/\//i.test(s)) return s;   // URL ngoài
  s = s.replace(/\\/g, "/");                // windows slash
  if (!s.startsWith("/")) s = "/" + s;      // thêm slash đầu
  return s;
};
const imgFallback: React.ReactEventHandler<HTMLImageElement> = (e) => {
  const img = e.currentTarget;
  if (img.dataset.fallbackApplied === "1") return;
  img.dataset.fallbackApplied = "1";
  img.src = PLACEHOLDER;
};

const normalize = (data: any): Post[] => {
  if (Array.isArray(data)) return data as Post[];
  if (Array.isArray(data?.posts)) return data.posts as Post[];
  if (Array.isArray(data?.items)) return data.items as Post[];
  return [];
};

const ArticleManager: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const raw = sessionStorage.getItem("authUser");
    let isAdmin = false;
    try {
      const u = raw ? JSON.parse(raw) : null;
      const email = String(u?.email || "").toLowerCase();
      const role = String(u?.role || "").toLowerCase();
      isAdmin = role === "admin" || email === ADMIN_EMAIL.toLowerCase();
    } catch {}
    if (!isAdmin) {
      sessionStorage.setItem("flash_msg", "Vui lòng đăng nhập quản trị.");
      navigate("/login", { replace: true, state: { msg: "Vui lòng đăng nhập quản trị." } });
    }
  }, [navigate]);

  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);

  useEffect(() => {
    axios
      .get(CATES)
      .then((r) => setCategories(Array.isArray(r.data) ? r.data : (r.data?.categories ?? [])))
      .catch(() => setCategories([]));
  }, []);

  const loadPosts = async (): Promise<Post[]> => {
    try {
      setLoading(true);
      const r = await axios.get<Post[]>(POSTS);
      const arr = normalize(r.data);
      setAllPosts(arr);
      setErr(null);
      return arr;
    } catch (e: any) {
      setErr(e?.message || "Fetch error");
      setAllPosts([]);
      return [];
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPosts();
  }, []);

  const totalPages = Math.max(1, Math.ceil(allPosts.length / PAGE_SIZE));
  const currentItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allPosts.slice(start, start + PAGE_SIZE);
  }, [allPosts, page]);

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (p: Post) => {
    setEditing(p);
    setOpen(true);
  };

  const onDelete = async (id?: Post["id"]) => {
    if (!id) return;
    if (!confirm("Xóa bài viết này?")) return;
    await axios.delete(`${POSTS}/${id}`).catch(() => {});
    const data = await loadPosts();
    const last = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
    if (page > last) setPage(last);
  };

  const onChangeStatus = async (id: NonNullable<Post["id"]>, value: "public" | "private") => {
    try {
      await axios.patch(`${POSTS}/${id}`, { status: value });
      setAllPosts((prev) => prev.map((it) => (it.id === id ? { ...it, status: value } : it)));
    } catch {}
  };

  const pages = useMemo(() => {
    const n = totalPages, cur = page;
    if (n <= 7) return Array.from({ length: n }, (_, i) => i + 1);
    if (cur <= 4) return [1, 2, 3, 4, "…", n - 1, n] as (number | string)[];
    if (cur >= n - 3) return [1, 2, "…", n - 3, n - 2, n - 1, n] as (number | string)[];
    return [1, "…", cur - 1, cur, cur + 1, "…", n] as (number | string)[];
  }, [page, totalPages]);

  const handleLogout = () => {
    if (!confirm("Bạn có chắc muốn đăng xuất không?")) return;
    try {
      sessionStorage.removeItem("authUser");
    } catch {}
    sessionStorage.setItem("flash_msg", "Đăng xuất thành công.");
    navigate("/login", { replace: true, state: { msg: "Đăng xuất thành công." } });
  };

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col ${open ? "overflow-hidden" : ""}`}>
      <header className="bg-white shadow px-6 py-3 flex items-center justify-end gap-6">
        <EnvelopeIcon className="w-6 h-6 text-gray-600" />
        <BellIcon className="w-6 h-6 text-gray-600" />
        <img src="https://i.pravatar.cc/40?img=8" alt="User avatar" className="w-9 h-9 rounded-full border" />
      </header>

      <div className="flex flex-1">
        <aside className="w-64 p-6 flex flex-col gap-3">
          <SidebarLink icon={<UserGroupIcon className="w-5 h-5 text-orange-500" />} label="Manage Users" to="/ManagerUser" />
          <SidebarLink icon={<ClipboardDocumentListIcon className="w-5 h-5 text-orange-500" />} label="Manage Entries" to="/CategoryManager" />
          <SidebarLink icon={<NewspaperIcon className="w-5 h-5 text-orange-500" />} label="Manage Articles" to="/ArticleManager" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded bg-blue-50 hover:bg-blue-100 w-full text-sm font-semibold text-blue-700"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 text-orange-500" /> Log out
          </button>
        </aside>

        <main className="flex-1 px-8 py-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Quản lý bài viết</h2>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold text-white bg-purple-700 hover:bg-purple-800 border border-purple-800/50"
            >
              + Thêm mới bài viết
            </button>
          </div>

          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-3">Ảnh</th>
                  <th className="px-4 py-3">Tiêu đề</th>
                  <th className="px-4 py-3">Chủ đề</th>
                  <th className="px-4 py-3">Nội dung</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Chỉnh sửa trạng thái</th>
                  <th className="px-4 py-3">Hành động</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-gray-500">Đang tải…</td>
                  </tr>
                )}
                {err && !loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-red-600">Lỗi: {err}</td>
                  </tr>
                )}
                {!loading && !err && currentItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-gray-600">Chưa có bài viết.</td>
                  </tr>
                )}

                {!loading && !err && currentItems.map((p) => (
                  <tr key={String(p.id)} className="border-b border-gray-100">
                    <td className="px-4 py-3">
                      <img
                        src={normalizeImg(p.image)}
                        onError={imgFallback}
                        alt={p.title}
                        className="w-16 h-16 object-cover rounded"
                        loading="lazy"
                        decoding="async"
                      />
                    </td>
                    <td className="px-4 py-3">{p.title}</td>
                    <td className="px-4 py-3">{p.category}</td>
                    <td className="px-4 py-3 line-clamp-2 max-w-[340px]">{p.desc}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          (p.status ?? "public") === "public" ? "bg-green-100 text-green-700" : "bg-pink-100 text-pink-700"
                        }`}
                      >
                        {(p.status ?? "public") === "public" ? "Public" : "Private"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={p.status ?? "public"}
                        onChange={(e) => onChangeStatus(p.id!, e.target.value as "public" | "private")}
                      >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Sửa</button>
                        <button onClick={() => onDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center text-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1 border rounded text-gray-600 hover:text-black disabled:opacity-50"
            >
              <span className="text-lg">←</span> Previous
            </button>

            <div className="flex items-center gap-3">
              {pages.map((pg, i) =>
                typeof pg === "string" ? (
                  <span key={`e-${i}`} className="px-2 text-gray-500">…</span>
                ) : (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`px-3 py-1 rounded text-sm ${pg === page ? "bg-purple-100 text-purple-700 font-semibold" : "text-gray-600 hover:text-black"}`}
                  >
                    {pg}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1 border rounded text-gray-600 hover:text-black disabled:opacity-50"
            >
              Next <span className="text-lg">→</span>
            </button>
          </div>
        </main>
      </div>

      {/* Modal Add/Edit */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-lg">
            <AddArticleForm
              categories={categories}
              initial={editing || undefined}
              onClose={() => setOpen(false)}
              onSaved={async () => {
                const wasEditing = !!editing;
                const currentPage = page;
                setOpen(false);
                setEditing(null);
                const data = await loadPosts();
                if (wasEditing) {
                  setPage(currentPage);
                } else {
                  const last = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
                  setPage(last);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarLink = ({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) => (
  <Link to={to} className="flex items-center gap-3 px-4 py-3 rounded bg-blue-50 hover:bg-blue-100 w-full text-sm font-semibold text-blue-700">
    {icon}
    {label}
  </Link>
);

export default ArticleManager;
