// src/pages/auth/Register.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEmailTaken, registerUser } from "../../services/authApi";

type Errors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirm?: string;
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [errors, setErrors]       = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = async () => {
    const e: Errors = {};
    // Họ và tên không được để trống
    if (!firstName.trim() || !lastName.trim()) {
      e.firstName = "Họ và tên không được để trống";
      e.lastName  = "Họ và tên không được để trống";
    }
    // Email không được để trống & đúng định dạng
    if (!email.trim()) e.email = "Email không được để trống";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Email phải đúng định dạng";

    // Mật khẩu
    if (!password) e.password = "Mật khẩu không được để trống";
    else if (password.length < 6) e.password = "Mật khẩu tối thiểu 6 ký tự";

    // Xác nhận mật khẩu
    if (!confirm) e.confirm = "Mật khẩu xác nhận không được để trống";
    else if (confirm !== password) e.confirm = "Mật khẩu phải trùng khớp";

    // Email tồn tại?
    if (!e.email) {
      const taken = await isEmailTaken(email.trim());
      if (taken) e.email = "Email đã tồn tại";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const ok = await validate();
      if (!ok) return;

      await registerUser({ firstName, lastName, email, password });

      // Đăng ký thành công -> chuyển về login kèm thông báo
      navigate("/login", {
        state: { msg: "Đăng ký thành công! Vui lòng đăng nhập." },
        replace: true,
      });
    } catch (err) {
      // có thể hiển thị toast/alert nếu cần
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] overflow-hidden">
      {/* Background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600 opacity-30 blur-3xl rounded-full" />
      <div className="absolute bottom-0 -right-32 w-[28rem] h-[28rem] bg-pink-500 opacity-30 blur-3xl rounded-full" />

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 p-6 md:p-12">
        {/* Left content */}
        <div className="flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-3xl font-bold">Welcome to the website</h1>
          <p className="mt-6 text-lg text-purple-200 font-semibold">
            RIKKEI EDUCATION
          </p>
        </div>

        {/* Right form */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-gray-800">
          <form className="space-y-6" onSubmit={onSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 ${errors.firstName ? "border-red-400" : ""}`}
                />
                <label className="block text-xs mt-1 text-gray-500">First name</label>
                {errors.firstName && (
                  <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 ${errors.lastName ? "border-red-400" : ""}`}
                />
                <label className="block text-xs mt-1 text-gray-500">Last name</label>
                {errors.lastName && (
                  <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-400" : ""}`}
              />
              <label className="block text-xs mt-1 text-gray-500">Email address</label>
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-400" : ""}`}
              />
              <label className="block text-xs mt-1 text-gray-500">Password</label>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 ${errors.confirm ? "border-red-400" : ""}`}
              />
              <label className="block text-xs mt-1 text-gray-500">Confirm Password</label>
              {errors.confirm && (
                <p className="text-xs text-red-600 mt-1">{errors.confirm}</p>
              )}
            </div>

            <div className="flex justify-start">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold disabled:opacity-60"
              >
                {submitting ? "Processing..." : "Sign Up"}
              </button>
            </div>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-red-500 font-semibold">login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
