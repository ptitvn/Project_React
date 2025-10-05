import React from "react";
import {
  UserGroupIcon,
  ClipboardDocumentListIcon,
  NewspaperIcon,
  ArrowLeftOnRectangleIcon,
  EnvelopeIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

// Ảnh đặt trong public/img. Nếu tên file có dấu/khoảng trắng, dùng encodeURI.
const IMG1 = encodeURI("/img/Bài viết 1.png");
// Nếu bạn đã đổi tên không dấu: const IMG1 = "/img/bai-viet-1.png";
const IMG2 = encodeURI("/img/Bài viết 2.png");
// Fallback (tạo file này trong public/img nếu muốn)
const PLACEHOLDER = "/img/placeholder.png";

const ArticleManager: React.FC = () => {
  const onImgError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    if (PLACEHOLDER) e.currentTarget.src = PLACEHOLDER;
  };

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

      {/* Body layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 p-6 flex flex-col gap-3">
          <SidebarItem
            icon={<UserGroupIcon className="w-5 h-5 text-orange-500" />}
            label="Manage Users"
          />
          <SidebarItem
            icon={<ClipboardDocumentListIcon className="w-5 h-5 text-orange-500" />}
            label="Manage Menu Item"
          />
          <SidebarItem
            icon={<NewspaperIcon className="w-5 h-5 text-orange-500" />}
            label="Manage Articles"
          />
          <SidebarItem
            icon={<ArrowLeftOnRectangleIcon className="w-5 h-5 text-orange-500" />}
            label="Log out"
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 px-8 py-6">
          {/* Nút thêm nằm bên trái */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
              Quản lý bài viết
            </h2>
            <button className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-4 py-2 rounded">
              + Thêm mới bài viết
            </button>
          </div>

          {/* Table */}
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
                {/* Row 1 */}
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3">
                    <img
                      src={IMG1}
                      onError={onImgError}
                      alt="Ảnh bài viết"
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3">Học cách để nấu ăn thật vui</td>
                  <td className="px-4 py-3">Nấu ăn</td>
                  <td className="px-4 py-3">Sở thích được nấu ăn là một niềm vui</td>
                  <td className="px-4 py-3">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      Public
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select className="border rounded px-2 py-1 text-sm">
                      <option>Public</option>
                      <option>Private</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                        Sửa
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="border-b border-gray-100">
                  <td className="px-4 py-3">
                    <img
                      src={IMG2}
                      onError={onImgError}
                      alt="Ảnh bài viết"
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3">Bí kíp viết CV ngành IT</td>
                  <td className="px-4 py-3">IT</td>
                  <td className="px-4 py-3">Chia sẻ cách viết CV ấn tượng...</td>
                  <td className="px-4 py-3">
                    <span className="bg-pink-100 text-pink-700 px-2 py-1 rounded text-xs">
                      Private
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select className="border rounded px-2 py-1 text-sm" defaultValue="Private">
                      <option>Public</option>
                      <option>Private</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                        Sửa
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center text-sm">
            <button className="flex items-center gap-1 px-3 py-1 border rounded text-gray-600 hover:text-black">
              <span className="text-lg">←</span>
              Previous
            </button>

            <div className="flex items-center gap-3">
              {[1, 2, 3, "...", 6, 8].map((page, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 rounded text-sm ${
                    page === 1
                      ? "bg-purple-100 text-purple-700 font-semibold"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-1 px-3 py-1 border rounded text-gray-600 hover:text-black">
              Next
              <span className="text-lg">→</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="flex items-center gap-3 px-4 py-3 rounded bg-blue-50 hover:bg-blue-100 w-full text-sm font-semibold text-blue-700">
    {icon}
    {label}
  </button>
);

export default ArticleManager;
