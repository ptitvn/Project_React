// src/pages/admin/ManagerUser.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  NewspaperIcon,
  ArrowLeftOnRectangleIcon,
  EnvelopeIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

/* ===== Types & constants ===== */
type Member = {
  id: string | number;
  name: string;
  handle: string;
  email: string;
  avatar: string;
  status: "hoạt động" | "bị chặn";
};

const API = "http://localhost:8080/members";
const PAGE_SIZE = 10;
const ADMIN_EMAIL = "admin@site.com";

/* ===== Utils ===== */
const isAdmin = () => {
  try {
    const raw = sessionStorage.getItem("authUser");
    const u = raw ? JSON.parse(raw) : null;
    const email = String(u?.email || "").toLowerCase();
    const role = String(u?.role || "").toLowerCase();
    return role === "admin" || email === ADMIN_EMAIL.toLowerCase();
  } catch {
    return false;
  }
};

const pageList = (cur: number, total: number): (number | string)[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 4) return [1, 2, 3, 4, "…", total - 1, total];
  if (cur >= total - 3) return [1, 2, "…", total - 3, total - 2, total - 1, total];
  return [1, "…", cur - 1, cur, cur + 1, "…", total];
};

/* ===== Reusable ===== */
const SidebarLink = ({ icon, label, to }: { icon: React.ReactNode; label: string; to: string }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 rounded bg-blue-50 hover:bg-blue-100 w-full text-sm font-semibold text-blue-700"
  >
    {icon}
    {label}
  </Link>
);

/* ===== Page ===== */
const ManagerUser: React.FC = () => {
  const navigate = useNavigate();

  // Guard admin
  useEffect(() => {
    if (!isAdmin()) {
      sessionStorage.setItem("flash_msg", "Vui lòng đăng nhập quản trị.");
      navigate("/login", { replace: true, state: { msg: "Vui lòng đăng nhập quản trị." } });
    }
  }, [navigate]);

  // Data
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI
  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  // Load members
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get<Member[]>(API);
      setMembers(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Fetch error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onChanged = () => load();
    window.addEventListener("members:changed", onChanged);
    return () => window.removeEventListener("members:changed", onChanged);
  }, [load]);

  // Search + sort + paginate
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) => m.name.toLowerCase().includes(q) || m.handle.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [members, query]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      const cmp = a.name.localeCompare(b.name, "vi", { sensitivity: "base" });
      return sortAsc ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sorted.slice(start, start + PAGE_SIZE);
  }, [sorted, page]);

  const pages = useMemo(() => pageList(page, totalPages), [page, totalPages]);
  const goto = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  useEffect(() => {
    setPage(1);
  }, [query]);

  // Logout
  const handleLogout = () => {
    if (!confirm("Bạn có chắc muốn đăng xuất không?")) return;
    try {
      sessionStorage.removeItem("authUser");
    } catch {}
    sessionStorage.setItem("flash_msg", "Đăng xuất thành công.");
    navigate("/login", { replace: true, state: { msg: "Đăng xuất thành công." } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow px-6 py-3 flex items-center justify-end gap-6">
        <EnvelopeIcon className="w-6 h-6 text-gray-600 hover:text-black" />
        <BellIcon className="w-6 h-6 text-gray-600 hover:text-black" />
        <img src="https://i.pravatar.cc/40?img=8" alt="User avatar" className="w-9 h-9 rounded-full border select-none pointer-events-none" />
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 p-6 flex flex-col gap-3">
          <SidebarLink to="/ManagerUser" icon={<UserGroupIcon className="w-5 h-5 text-orange-500" />} label="Manage Users" />
          <SidebarLink to="/CategoryManager" icon={<ClipboardDocumentListIcon className="w-5 h-5 text-orange-500" />} label="Manage Entries" />
          <SidebarLink to="/ArticleManager" icon={<NewspaperIcon className="w-5 h-5 text-orange-500" />} label="Manage Articles" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded bg-blue-50 hover:bg-blue-100 w-full text-sm font-semibold text-blue-700"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 text-orange-500" />
            Log out
          </button>
        </aside>

        {/* Main */}
        <main className="flex-1 px-8 py-6">
          <div className="mx-auto max-w-5xl">
            {/* Title + total + search */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">Team members</h2>
                <span className="rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                  {filtered.length} users
                </span>
              </div>

              <div className="relative w-full max-w-sm">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search user"
                  className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-6 py-3 font-medium">
                      <div className="inline-flex items-center gap-2">
                        <span>Name</span>
                        <button
                          onClick={() => setSortAsc((s) => !s)}
                          className="text-[12px] font-medium text-gray-600 hover:text-gray-900"
                          title="Sắp xếp theo tên (A→Z/Z→A)"
                        >
                          Az
                        </button>
                      </div>
                    </th>
                    <th className="px-6 py-3 font-medium">
                      <span className="inline-flex items-center gap-1">
                        Status <span className="text-gray-400 text-sm leading-none">↓</span>
                      </span>
                    </th>
                    <th className="px-6 py-3 font-medium">Email address</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading && (
                    <tr>
                      <td colSpan={4} className="px-6 py-6 text-gray-500">Đang tải…</td>
                    </tr>
                  )}
                  {error && !loading && (
                    <tr>
                      <td colSpan={4} className="px-6 py-6 text-red-600">Lỗi: {error}</td>
                    </tr>
                  )}
                  {!loading &&
                    !error &&
                    pageItems.map((m) => (
                      <tr key={String(m.id)} className="border-t border-gray-100">
                        {/* Name */}
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <img src={m.avatar} alt={m.name} className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200" />
                            <div className="leading-tight">
                              <div className="font-medium text-gray-900">{m.name}</div>
                              <div className="text-xs text-gray-500">{m.handle}</div>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-3">
                          <span className="text-gray-600">{m.status}</span>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-3 text-gray-700">{m.email}</td>

                        {/* Actions (UI giữ nguyên) */}
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <button className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100">
                              block
                            </button>
                            <button className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100">
                              unblock
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between text-sm">
              <button
                onClick={() => goto(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                ← Previous
              </button>

              <div className="flex items-center gap-1">
                {pages.map((it, idx) =>
                  typeof it === "string" ? (
                    <span key={`e-${idx}`} className="px-2 text-gray-500">
                      …
                    </span>
                  ) : (
                    <button
                      key={it}
                      onClick={() => goto(it)}
                      className={`h-8 w-8 rounded-lg ${
                        it === page ? "bg-purple-100 text-purple-700 font-semibold" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {it}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => goto(page + 1)}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerUser;
