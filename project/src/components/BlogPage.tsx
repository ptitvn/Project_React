import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { fetchPosts } from "../services/postApi";
import { setPosts } from "../store/postsSlice";

const categoryColors: Record<string, string> = {
  "Daily Journal": "bg-purple-100 text-purple-700",
  "Work & Career": "bg-blue-100 text-blue-700",
  "Personal Thoughts": "bg-green-100 text-green-700",
  "Emotions & Feelings": "bg-pink-100 text-pink-700",
};

const BlogPage: React.FC = () => {
  const dispatch = useDispatch();
  const posts = useSelector((s: RootState) => s.posts.items);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchPosts();
        if (alive) dispatch(setPosts(data));
      } catch (e: any) {
        if (alive) setError(e.message || "Fetch error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [dispatch]);

  const recentPosts = posts.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="container mx-auto px-6 py-10 flex-1">
          <p className="text-gray-500">Đang tải bài viết...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="container mx-auto px-6 py-10 flex-1">
          <p className="text-red-600">Không tải được dữ liệu: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="container mx-auto px-6 py-10 flex-1">
          <p className="text-gray-600">Chưa có bài viết nào.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto px-6 py-10 flex-1">
        {/* Recent blog posts */}
        {recentPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recent blog posts</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Bài to bên trái */}
              <div className="md:col-span-2 rounded overflow-hidden ">
                <img
                  src={recentPosts[0].image}
                  alt={recentPosts[0].title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    Published on {recentPosts[0].date}
                  </p>
                  <h3 className="font-semibold text-xl mb-2">
                    {recentPosts[0].title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {recentPosts[0].desc}
                  </p>
                  <span
                    className={`inline-block text-xs px-3 py-1 rounded-full ${
                      categoryColors[recentPosts[0].category] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {recentPosts[0].category}
                  </span>
                </div>
              </div>

              {/* Hai bài nhỏ bên phải */}
              <div className="flex flex-col gap-6">
                {recentPosts.slice(1).map((post) => (
                  <div key={post.id} className="flex rounded overflow-hidden ">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-32 h-32 object-cover flex-shrink-0"
                    />
                    <div className="p-4 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Published on {post.date}
                        </p>
                        <h3 className="font-semibold text-base mb-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {post.desc}
                        </p>
                      </div>
                      <span
                        className={`inline-block text-xs px-3 py-1 rounded-full mt-2 ${
                          categoryColors[post.category] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {post.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All posts grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.id} className="rounded overflow-hidden ">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">
                  Published on {post.date}
                </p>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{post.title}</h3>
                  <span className="text-gray-500 text-sm">↗</span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {post.desc}
                </p>
                <span
                  className={`inline-block text-xs px-3 py-1 rounded-full ${
                    categoryColors[post.category] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {post.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
