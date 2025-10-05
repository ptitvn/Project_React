// src/pages/auth/Login.tsx
import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGooglePlusG } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../services/authApi";

const ILLU = encodeURI("/img/draw2.webp.png"); // ảnh để trong public/img
const PLACEHOLDER = "/img/placeholder.png";     // tùy chọn

type Errors = { email?: string; password?: string };

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const successMsg = location?.state?.msg as string | undefined;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [serverErr, setServerErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Errors = {};
    if (!email.trim()) e.email = "Email không được để trống";
    if (!password) e.password = "Mật khẩu không được để trống";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (submitting) return;
    setServerErr(null);

    if (!validate()) return;

    try {
      setSubmitting(true);
      const user = await loginUser(email, password);
      if (!user) {
        setServerErr("Email hoặc mật khẩu không đúng");
        return;
      }

      // (tuỳ chọn) lưu thông tin nhẹ vào localStorage
      localStorage.setItem("authUser", JSON.stringify({ id: user.id, email: user.email, name: user.fullName || user.firstName }));

      // Đăng nhập thành công -> chuyển BlogPage
      navigate("/BlogPage", { replace: true });
    } catch {
      setServerErr("Không thể đăng nhập. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl items-center">
          <div className="flex justify-center">
            <img
              src={ILLU}
              alt="Login illustration"
              className="max-w-sm w-full"
              onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
            />
          </div>

          <div className="w-full max-w-md">
            {/* social */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg font-semibold whitespace-nowrap">Sign in with</span>
              <div className="flex gap-2">
                <button className="flex items-center justify-center w-8 h-8 rounded-md bg-[#1877F2] text-white hover:opacity-90">
                  <FaFacebookF className="text-sm" />
                </button>
                <button className="flex items-center justify-center w-8 h-8 rounded-md bg-[#1DA1F2] text-white hover:opacity-90">
                  <FaTwitter className="text-sm" />
                </button>
                <button className="flex items-center justify-center w-8 h-8 rounded-md bg-[#0A66C2] text-white hover:opacity-90">
                  <FaLinkedinIn className="text-sm" />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 font-medium mb-4">Or</p>

            {/* thông báo success từ trang Register */}
            {successMsg && (
              <div className="mb-3 rounded-md bg-green-50 text-green-700 px-3 py-2 text-sm">
                {successMsg}
              </div>
            )}
            {/* lỗi đăng nhập */}
            {serverErr && (
              <div className="mb-3 rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm">
                {serverErr}
              </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit} noValidate>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter a valid email address"
                  className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-400" : ""}`}
                  autoComplete="email"
                />
                <label className="block text-sm mb-1 font-medium">Email address</label>
                {errors.email && <p className="text-xs text-red-600 -mt-1">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className={`w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-400" : ""}`}
                  autoComplete="current-password"
                />
                <label className="block text-sm mb-1 font-medium">Password</label>
                {errors.password && <p className="text-xs text-red-600 -mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold disabled:opacity-60"
              >
                {submitting ? "Processing..." : "Login"}
              </button>
            </form>

            <p className="mt-4 text-sm text-gray-600">
              Don’t have an account?{" "}
              <a href="/register" className="text-red-500 font-semibold">Register</a>
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-blue-600 text-white py-3 text-sm">
        <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-center justify-between px-3 gap-3">
          <p>Copyright © 2020. All rights reserved.</p>
          <div className="flex gap-4 text-lg">
            <a href="#" className="hover:text-gray-200"><FaFacebookF /></a>
            <a href="#" className="hover:text-gray-200"><FaTwitter /></a>
            <a href="#" className="hover:text-gray-200"><FaGooglePlusG /></a>
            <a href="#" className="hover:text-gray-200"><FaLinkedinIn /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
