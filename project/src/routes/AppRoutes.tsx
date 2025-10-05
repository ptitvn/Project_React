import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import CategoryManager from "../pages/admin/CategoryManager";
import ArticleManager from "../pages/admin/ArticleManager";
import ManagerUser from "../pages/admin/ManagerUser";
import AddArticleForm from "../components/AddArticleForm";
import PostDetail from "../pages/user/PostDetail";
import BlogPage from "../components/BlogPage";

const AppRoutes = () => (
  <Routes>
    {/* phần chi tiết bài viết n2*/}
    <Route path="/PostDetail" element={<PostDetail />} />
    {/* phần quản lý user */}
    <Route path="/ManagerUser" element={<ManagerUser />} />
    {/* phần quản lý bài viết n2*/}
    <Route path="/ArticleManager" element={<ArticleManager />} />
    {/* phần quản lý danh mục */}
    <Route path="/CategoryManager" element={<CategoryManager />} />
    {/* phần thêm bài viết n2*/}
    <Route path="/AddArticleForm" element={<AddArticleForm />} />
    {/* phần trang blog n1*/}
    <Route path="/BlogPage" element={<BlogPage />} />
    {/* phần đăng ký đăng nhập n1 */}
    <Route path="/login" element={<Login />} />
    <Route path="/Register" element={<Register />} />

  </Routes>
);

export default AppRoutes;
