// src/pages/admin/ManagerUser.tsx
import React, { useEffect, useMemo, useState } from "react";
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

/* ========= Types ========= */
type Member = {
  id: string;
  name: string;
  handle: string;   // @olivia
  email: string;
  avatar: string;
  status: "hoạt động" | "bị chặn";
};

/* ========= Sidebar item ========= */
const SidebarItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex items-center gap-3 px-4 py-3 rounded bg-blue-50 hover:bg-blue-100 w-full text-sm font-semibold text-blue-700">
    {icon}
    {label}
  </button>
);

const API = "http://localhost:8080/members";

/* ========= Page ========= */
const ManagerUser: React.FC = () => {
  // thay SEED bằng data từ server
  const [data, setData] = useState<Member[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1); // chỉ để đổi màu active như UI gốc

  // fetch 1 lần từ server
  useEffect(() => {
    axios.get<Member[]>(API).then((res) => setData(res.data)).catch(() => {});
  }, []);

  // giữ nguyên như code cũ: tính filtered nhưng KHÔNG dùng để render (UI tĩnh)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.handle.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
    );
  }, [data, query]);

  // UI tĩnh: render tất cả dòng (không slice/không phân trang thật)
  const rows = data;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow px-6 py-3 flex items-center justify-end gap-6">
        <EnvelopeIcon className="w-6 h-6 text-gray-600 hover:text-black cursor-pointer" />
        <BellIcon className="w-6 h-6 text-gray-600 hover:text-black cursor-pointer" />
        <img
          src="https://i.pravatar.cc/40?img=8"
          alt="User avatar"
          className="w-9 h-9 rounded-full border cursor-pointer"
        />
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 p-6 flex flex-col gap-3">
          <SidebarItem icon={<UserGroupIcon className="w-5 h-5 text-orange-500" />} label="Manage Users" />
          <SidebarItem icon={<ClipboardDocumentListIcon className="w-5 h-5 text-orange-500" />} label="Manage Menu Item" />
          <SidebarItem icon={<NewspaperIcon className="w-5 h-5 text-orange-500" />} label="Manage Articles" />
          <SidebarItem icon={<ArrowLeftOnRectangleIcon className="w-5 h-5 text-orange-500" />} label="Log out" />
        </aside>

        {/* Main content: giữ UI y hệt */}
        <main className="flex-1 px-8 py-6">
          <div className="mx-auto max-w-5xl">
            {/* Title + total (tĩnh) + Search */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">Team members</h2>
                <span className="rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                  103 users
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
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Email address</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((m) => (
                    <tr key={m.id} className="border-t border-gray-100">
                      {/* Name */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={m.avatar}
                            alt={m.name}
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200"
                          />
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

                      {/* Actions: chỉ UI, không thêm logic */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700 hover:bg-violet-100">
                            block
                          </button>
                          <button className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100">
                            unblock
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination dưới cùng: tĩnh, đúng layout bạn gửi */}
              <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between text-sm">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 px-3 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, "…", 8, 9, 10].map((it, idx) =>
                    typeof it === "string" ? (
                      <span key={idx} className="px-2 text-gray-500">…</span>
                    ) : (
                      <button
                        key={it}
                        onClick={() => setPage(it)}
                        className={`h-8 w-8 rounded-lg ${
                          it === page
                            ? "bg-purple-100 text-purple-700 font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {it}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(10, p + 1))}
                  className="flex items-center gap-1 px-3 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ManagerUser;
