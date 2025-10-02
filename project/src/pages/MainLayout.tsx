import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;