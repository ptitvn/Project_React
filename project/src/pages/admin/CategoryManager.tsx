import React, { useState } from "react";
import {
  UserGroupIcon,
  DocumentTextIcon,
  NewspaperIcon,
  ArrowLeftOnRectangleIcon,
  EnvelopeIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const CategoryManager: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow px-6 py-3 flex items-center justify-end gap-6">
        <button>
          <EnvelopeIcon className="w-6 h-6 text-gray-600 hover:text-black" />
        </button>
        <button>
          <BellIcon className="w-6 h-6 text-gray-600 hover:text-black" />
        </button>
        <div className="relative">
          <img
            src="https://i.pravatar.cc/40?img=5"
            alt="User avatar"
            className="w-9 h-9 rounded-full border cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-50">
              <div className="px-4 py-3 border-b">
                <p className="font-semibold">Hikari</p>
                <p className="text-sm text-gray-500">example@gmail.com</p>
              </div>
              <ul className="py-2 text-sm">
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">View profile</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">My account settings</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Change password</li>
                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">Log out</li>
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Body layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 p-6 flex flex-col gap-3">
          <SidebarItem icon={<UserGroupIcon className="w-5 h-5 text-orange-500" />} label="Manage Users" />
          <SidebarItem icon={<DocumentTextIcon className="w-5 h-5 text-orange-500" />} label="Manage Entries" />
          <SidebarItem icon={<NewspaperIcon className="w-5 h-5 text-orange-500" />} label="Manage Articles" />
          <SidebarItem icon={<ArrowLeftOnRectangleIcon className="w-5 h-5 text-orange-500" />} label="Log out" />
        </aside>

        {/* Main content */}
        <main className="flex-1 py-6 pl-6 ">
          {/* Search bar */}
          <div className="relative mb-8 mx-auto w-[602.6px]">
            <input
              type="text"
              placeholder="Search Article Categories"
              className="w-full h-[56px] bg-white border border-gray-300 rounded-md pl-10 pr-4 text-base placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Manage Categories box */}
          <div className="bg-white rounded-lg shadow p-8 w-full">
            <div className="max-w-4xl ">
              {/* Title */}
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-6 justify-center">
                📂 Manage Categories
              </h2>

              {/* Form */}
              <div className="flex flex-col gap-4 mb-8">
                <label htmlFor="category" className="text-sm font-medium">
                  Category Name:
                </label>
                <input
                  id="category"
                  type="text"
                  placeholder="Enter category name"
                  className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded px-4 py-3 text-base">
                  Add Category
                </button>
              </div>

              {/* Category list */}
              <div>
                <h3 className="text-lg font-semibold mb-2"> 📋 Category List</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100 text-left text-sm">
                      <th className="border border-gray-300 px-4 py-2">#</th>
                      <th className="border border-gray-300 px-4 py-2">Category Name</th>
                      <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                  </thead>

                </table>
              </div>
            </div>
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

export default CategoryManager;