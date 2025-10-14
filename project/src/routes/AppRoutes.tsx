import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import CategoryManager from "../pages/admin/CategoryManager";
import ArticleManager from "../pages/admin/ArticleManager";
import ManagerUser from "../pages/admin/ManagerUser";
import AddArticleForm from "../components/AddArticleForm";
import PostDetail from "../pages/user/PostDetail";
import BlogPage from "../components/BlogPage";
import ManagePost from "../pages/admin/ManagePost";

const AppRoutes = () => (
  <Routes>
    <Route path="/ManagePost" element={<ManagePost />} />
    <Route path="/PostDetail" element={<PostDetail />} />

    <Route path="/ManagerUser" element={<ManagerUser />} />

    <Route path="/ArticleManager" element={<ArticleManager />} />

    <Route path="/CategoryManager" element={<CategoryManager />} />

    <Route path="/AddArticleForm" element={<AddArticleForm categories={[]}/>} />

    <Route path="/BlogPage" element={<BlogPage />} />
    
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Register />} />
  </Routes>
);

export default AppRoutes;
