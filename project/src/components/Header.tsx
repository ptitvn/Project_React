import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"; 

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
        <h1 className="font-bold text-lg">RIKKEI_EDU_BLOG</h1>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-6 relative">
        <input
          type="text"
          placeholder="Search for articles..."
          className="w-full border rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {/* Icon kính lúp */}
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Auth buttons */}
      <div className="flex gap-3">
        <button className="px-4 py-1 border rounded text-sm hover:bg-gray-100">
          Sign Up
        </button>
        <button className="px-4 py-1 border rounded text-sm hover:bg-gray-100">
          Sign In
        </button>
      </div>
    </header>
  );
};

export default Header;