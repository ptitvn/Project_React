// src/pages/auth/Login.tsx
import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGooglePlusG } from "react-icons/fa";
import draw2 from "../../img/draw2.webp.png";

const Login: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <div className="flex flex-1 items-center justify-center px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-6xl items-center">
                    <div className="flex justify-center">
                        <img
                            src={draw2}
                            alt="Login illustration"
                            className="max-w-sm w-full"
                        />

                    </div>

                    <div className="w-full max-w-md">
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

                        <form className="space-y-4">
                            <div>
                                <input
                                    type="email"
                                    placeholder="Enter a valid email address"
                                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                />
                                <label className="block text-sm mb-1 font-medium">Email address</label>

                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500"
                                />
                                <label className="block text-sm mb-1 font-medium">Password</label>

                            </div>

                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold"
                            >
                                Login
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
                <div className="max-w-8xl mx-auto flex flex-col md:flex-row items-center justify-between px-3 gap-3" >
                    <p>Copyright © 2020. All rights reserved.</p>
                    <div className="flex gap-4 text-lg" >
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