import React from "react";

const Register: React.FC = () => {
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
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
                />
                <label className="block text-xs mt-1 text-gray-500">
                  First name
                </label>
              </div>
              <div>
                <input
                  type="text"
                  className="w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
                />
                <label className="block text-xs mt-1 text-gray-500">
                  Last name
                </label>
              </div>
            </div>

            <div>
              <input
                type="email"
                className="w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-xs mt-1 text-gray-500">
                Email address
              </label>
            </div>

            <div>
              <input
                type="password"
                className="w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-xs mt-1 text-gray-500">
                Password
              </label>
            </div>

            <div>
              <input
                type="password"
                className="w-full border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
              />
              <label className="block text-xs mt-1 text-gray-500">
                Confirm Password
              </label>
            </div>

            {/* Nút nhỏ, căn trái */}
            <div className="flex justify-start">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-red-500 font-semibold">
              login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;