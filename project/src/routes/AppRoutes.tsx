import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Header from "../components/Header";
import ManagePost from "../components/ManagePost";
import Footer from "../components/Footer";
import BlogPage from "../components/BlogPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/BlogPage" element={<BlogPage />} />
    <Route path="/Footer" element={<Footer />} />
    <Route path="/ManagePost" element={<ManagePost/>} />
    <Route path="/Header" element={< Header />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    
  </Routes>
);

export default AppRoutes;
