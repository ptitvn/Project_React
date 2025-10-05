// src/pages/admin/ManagePost.tsx
import React from "react";
import Header from "../../components/Header";
import ArticleCard from "../../components/ArticleCard";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { fetchPosts } from "../../services/postApi";
import { setPosts } from "../../store/postsSlice";

const ManagePost: React.FC = () => {
  const dispatch = useDispatch();
  const posts = useSelector((s: RootState) => s.posts.items);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        // nếu store chưa có thì fetch, còn có rồi thì vẫn render ngay
        if (posts.length === 0) {
          const data = await fetchPosts(); // GET http://localhost:8080/posts
          if (alive) dispatch(setPosts(data));
        }
      } catch (e: any) {
        if (alive) setError(e.message || "Fetch error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-8">
        {/* Tiêu đề căn giữa */}
        <h1 className="text-2xl font-bold text-blue-600 mb-6 uppercase text-center">
          Add New Article
        </h1>

        {/* Loading / Error */}
        {loading && (
          <p className="text-gray-500 text-center">Đang tải bài viết...</p>
        )}
        {error && (
          <p className="text-red-600 text-center">Không tải được dữ liệu: {error}</p>
        )}

        {/* Grid bài viết */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <ArticleCard
                key={p.id}
                title={p.title}
                date={p.date}
                category={p.category}
                description={p.desc}   // map từ API field "desc" sang prop "description"
                image={p.image}        // ví dụ "/img/Image (1).png" từ db.json
              />
            ))}
          </div>
        )}

        {/* Pagination (tĩnh) */}
        <div className="flex justify-center items-center mt-8 text-sm">
          <button className="text-gray-700 hover:underline mr-6">← Previous</button>

          <div className="flex items-center gap-6">
            <button className="px-3 py-1 bg-purple-100 text-purple-600 font-semibold rounded">
              1
            </button>
            <button className="text-gray-700 hover:underline">2</button>
            <button className="text-gray-700 hover:underline">3</button>
            <span className="text-gray-700">...</span>
            <button className="text-gray-700 hover:underline">9</button>
            <button className="text-gray-700 hover:underline">10</button>
          </div>

          <button className="text-gray-700 hover:underline ml-6">Next →</button>
        </div>
      </main>
    </div>
  );
};

export default ManagePost;
