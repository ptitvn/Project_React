import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Auth
  const [authUser, setAuthUser] = React.useState<any>(null);
  React.useEffect(() => {
    const read = () => {
      try {
        const raw = sessionStorage.getItem("authUser");
        setAuthUser(raw ? JSON.parse(raw) : null);
      } catch { setAuthUser(null); }
    };
    read();
    const onStorage = (e: StorageEvent) => { if (e.key === "authUser") read(); };
    const onAuthChanged = () => read();
    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:changed", onAuthChanged);
    window.addEventListener("auth:logout", onAuthChanged);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:changed", onAuthChanged);
      window.removeEventListener("auth:logout", onAuthChanged);
    };
  }, []);

  const userEmail = authUser?.email || "guest@example.com";
  const userName  = authUser ? (userEmail.split("@")[0] || "User") : "Guest";

  // Dropdown avatar
  const [open, setOpen] = React.useState(false);
  const boxRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Search realtime
  const [term, setTerm] = React.useState(
    () => new URLSearchParams(location.search).get("search") || ""
  );
  React.useEffect(() => {
    setTerm(new URLSearchParams(location.search).get("search") || "");
  }, [location.search]);

  const inManage = location.pathname.toLowerCase().includes("/managepost");
  const basePath = inManage ? "/ManagePost" : "/BlogPage";

  // Debounce điều hướng khi gõ
  React.useEffect(() => {
    const q = term.trim();
    const t = setTimeout(() => {
      if (!q) navigate(basePath, { replace: true });
      else navigate(`${basePath}?search=${encodeURIComponent(q)}`, { replace: true });
    }, 300);
    return () => clearTimeout(t);
  }, [term, basePath, navigate]);

  const doSearch = React.useCallback(() => {
    const q = term.trim();
    if (!q) navigate(basePath, { replace: true });
    else navigate(`${basePath}?search=${encodeURIComponent(q)}`, { replace: true });
    setOpen(false);
  }, [navigate, term, basePath]);

  const handleLogout = () => {
    if (!authUser) return;
    if (!confirm("Bạn có chắc muốn đăng xuất không?")) return;
    sessionStorage.removeItem("authUser");
    window.dispatchEvent(new Event("auth:logout"));
    window.dispatchEvent(new Event("auth:changed"));
    navigate("/login", { replace: true, state: { msg: "Đăng xuất thành công." } });
  };

  return (
    <header className="bg-white shadow px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 bg-orange-500 rounded-full" />
        <h1
          className="font-bold text-lg cursor-pointer select-none"
          onClick={() => navigate("/BlogPage")}
          title="Go to BlogPage"
        >
          RIKKEI_EDU_BLOG
        </h1>
      </div>

      <div className="flex-1 max-w-md mx-6 relative">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doSearch()}
          placeholder="Search for articles..."
          className="w-full border rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Search articles"
        />
        <button
          type="button"
          aria-label="Search"
          onClick={doSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
        >
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Avatar + Dropdown */}
      <div className="relative" ref={boxRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden ring-1 ring-gray-200"
          title={userEmail}
        >
          <img
            src={`https://i.pravatar.cc/40?u=${encodeURIComponent(userEmail)}`}
            alt="avatar"
            className="w-9 h-9 object-cover"
          />
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg z-50">
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="inline-block w-8 h-8 rounded-full overflow-hidden ring-1 ring-gray-200">
                  <img
                    src={`https://i.pravatar.cc/40?u=${encodeURIComponent(userEmail)}`}
                    alt="avatar"
                    className="w-8 h-8 object-cover"
                  />
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-medium text-gray-900">{userName}</div>
                  <div className="text-xs text-gray-500">{userEmail}</div>
                </div>
              </div>
            </div>

            <div className="py-1 text-sm">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-50"
                      onClick={() => { setOpen(false); navigate("/BlogPage"); }}>
                Home
              </button>
              <button className="w-full text-left px-3 py-2 hover:bg-gray-50"
                      onClick={() => { setOpen(false); navigate("/ManagePost"); }}>
                Manage posts
              </button>

              {authUser ? (
                <button onClick={handleLogout}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600">
                  Log out
                </button>
              ) : (
                <>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-blue-600"
                          onClick={() => { setOpen(false); navigate("/login"); }}>
                    Sign in
                  </button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50"
                          onClick={() => { setOpen(false); navigate("/"); }}>
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
