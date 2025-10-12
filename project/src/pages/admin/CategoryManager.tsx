// src/pages/admin/CategoryManager.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  UserGroupIcon,
  NewspaperIcon,
  ArrowLeftOnRectangleIcon,
  EnvelopeIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

type Category = { id: string | number; name: string };

const API = "http://localhost:8080/categories";
const ADMIN_EMAIL = "admin@site.com";

/* ---------------- Helpers ---------------- */
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

const SidebarLink = ({
  icon,
  label,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
}) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 rounded bg-blue-50 hover:bg-blue-100 w-full text-sm font-semibold text-blue-700"
  >
    {icon}
    {label}
  </Link>
);

/* ---------------- Page ---------------- */
const CategoryManager: React.FC = () => {
  const navigate = useNavigate();

  // Guard admin
  useEffect(() => {
    if (!isAdmin()) {
      sessionStorage.setItem("flash_msg", "Vui lòng đăng nhập quản trị.");
      navigate("/login", { replace: true, state: { msg: "Vui lòng đăng nhập quản trị." } });
    }
  }, [navigate]);

  // Data
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI state
  const [q, setQ] = useState("");

  // Add form
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [addMsg, setAddMsg] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [savingId, setSavingId] = useState<string | number | null>(null);

  // Load categories
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get<Category[]>(API);
        setItems(Array.isArray(data) ? data : []);
        setError(null);
      } catch (e: any) {
        setItems([]);
        setError(e?.message || "Fetch error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filter client-side
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((i) => (i.name || "").toLowerCase().includes(needle));
  }, [items, q]);

  // Case-insensitive duplicate check
  const exists = (list: Category[], v: string, excludeId?: Category["id"]) => {
    const k = v.trim().toLowerCase();
    return list.some((it) => it.id !== excludeId && (it.name || "").trim().toLowerCase() === k);
  };

  // Actions
  const addCategory = async () => {
    const v = name.trim();
    setAddMsg(null);
    if (!v) return setAddMsg("Tên chủ đề không được để trống.");
    if (exists(items, v)) return setAddMsg("Tên chủ đề đã tồn tại.");

    try {
      setAdding(true);
      const { data } = await axios.post<Category>(API, { name: v });
      setItems((prev) => [...prev, data]);
      setName("");
      setAddMsg("Đã thêm chủ đề.");
    } catch (e: any) {
      setAddMsg(e?.message || "Không thể thêm chủ đề.");
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (c: Category) => {
    setEditingId(c.id);
    setEditingName(c.name);
  };

  const saveEdit = async (id: string | number) => {
    const v = editingName.trim();
    if (!v) return;

    const origin = items.find((it) => it.id === id)?.name ?? "";
    const unchanged = origin.trim().toLowerCase() === v.toLowerCase();
    if (!unchanged && exists(items, v, id)) {
      alert("Tên chủ đề đã tồn tại.");
      return;
    }

    try {
      setSavingId(id);
      await axios.patch(`${API}/${id}`, { name: v });
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, name: v } : it)));
      setEditingId(null);
      setEditingName("");
    } catch (e: any) {
      alert(e?.message || "Không thể lưu thay đổi.");
    } finally {
      setSavingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const removeCategory = async (id: string | number) => {
    if (!confirm("Xóa chủ đề này?")) return;
    try { await axios.delete(`${API}/${id}`); } catch {}
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleLogout = () => {
    if (!confirm("Bạn có chắc muốn đăng xuất không?")) return;
    sessionStorage.removeItem("authUser");
    sessionStorage.setItem("flash_msg", "Đăng xuất thành công.");
    navigate("/login", { replace: true, state: { msg: "Đăng xuất thành công." } });
  };

  /* ----------- UI (giữ nguyên giao diện) ----------- */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow px-6 py-3 flex items-center justify-end gap-6">
        <EnvelopeIcon className="w-6 h-6 text-gray-600 hover:text-black" />
        <BellIcon className="w-6 h-6 text-gray-600 hover:text-black" />
        <img
          src="https://i.pravatar.cc/40?img=8"
          alt="User avatar"
          className="w-9 h-9 rounded-full border select-none pointer-events-none"
        />
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 p-6 flex flex-col gap-3">
          <SidebarLink
            to="/ManagerUser"
            icon={<UserGroupIcon className="w-5 h-5 text-orange-500" />}
            label="Manage Users"
          />
          <SidebarLink
            to="/CategoryManager"
            icon={<ClipboardDocumentListIcon className="w-5 h-5 text-orange-500" />}
            label="Manage Entries"
          />
          <SidebarLink
            to="/ArticleManager"
            icon={<NewspaperIcon className="w-5 h-5 text-orange-500" />}
            label="Manage Articles"
          />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded bg-blue-50 hover:bg-blue-100 w-full text-sm font-semibold text-blue-700"
          >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 text-orange-500" />
            Log out
          </button>
        </aside>

        {/* Main content */}
        <main className="flex-1 py-6 pl-6">
          {/* Search */}
          <div className="relative mb-8 mx-auto w-[602.6px]">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              type="text"
              placeholder="Search Article Categories"
              className="w-full h-[56px] bg-white border border-gray-300 rounded-md pl-10 pr-4 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Box */}
          <div className="bg-white rounded-lg shadow p-8 w-full">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 justify-center">📂 Manage Categories</h2>

              {/* Add form */}
              <div className="flex flex-col gap-3 mb-8">
                <label htmlFor="category" className="text-sm font-medium">Category Name:</label>
                <input
                  id="category"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCategory()}
                  type="text"
                  placeholder="Enter category name"
                  className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={addCategory}
                  disabled={adding}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded px-4 py-3 text-base disabled:opacity-60"
                >
                  {adding ? "Adding..." : "Add Category"}
                </button>
                {addMsg && <p className="text-sm text-gray-600">{addMsg}</p>}
              </div>

              {/* List */}
              <div>
                <h3 className="text-lg font-semibold mb-2">📋 Category List</h3>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50 text-left text-sm">
                      <tr>
                        <th className="border-b border-gray-200 px-4 py-2 w-16">#</th>
                        <th className="border-b border-gray-200 px-4 py-2">Category Name</th>
                        <th className="border-b border-gray-200 px-4 py-2 w-56">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {loading && (
                        <tr><td colSpan={3} className="px-4 py-4 text-gray-500">Đang tải…</td></tr>
                      )}
                      {error && !loading && (
                        <tr><td colSpan={3} className="px-4 py-4 text-red-600">Lỗi: {error}</td></tr>
                      )}

                      {!loading && !error && filtered.map((c, idx) => (
                        <tr key={String(c.id)} className="border-t border-gray-100">
                          <td className="px-4 py-2">{idx + 1}</td>
                          <td className="px-4 py-2">
                            {editingId === c.id ? (
                              <input
                                autoFocus
                                value={editingName}
                                onChange={(e) => setEditingName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveEdit(c.id);
                                  if (e.key === "Escape") cancelEdit();
                                }}
                                className="w-full bg-white border border-gray-300 rounded px-2 py-1"
                              />
                            ) : (
                              c.name
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {editingId === c.id ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveEdit(c.id)}
                                  disabled={savingId === c.id}
                                  className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-60"
                                >
                                  {savingId === c.id ? "Saving..." : "Save"}
                                </button>
                                <button
                                  onClick={cancelEdit}
                                  className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => startEdit(c)}
                                  className="px-3 py-1 rounded bg-purple-100 text-purple-700 hover:bg-purple-200"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => removeCategory(c.id)}
                                  className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}

                      {!loading && !error && filtered.length === 0 && (
                        <tr><td colSpan={3} className="px-4 py-4 text-gray-500">Không có kết quả.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryManager;
