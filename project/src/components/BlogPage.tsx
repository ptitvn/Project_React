import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

import img from "../img/Image.png";
import img2 from "../img/Image (1).png";
import img3 from "../img/Image (2).png";
import img4 from "../img/Image (3).png";
import img5 from "../img/Image (4).png";
import img6 from "../img/Image (5).png";

const categoryColors: Record<string, string> = {
  "Daily Journal": "bg-purple-100 text-purple-700",
  "Work & Career": "bg-blue-100 text-blue-700",
  "Personal Thoughts": "bg-green-100 text-green-700",
  "Emotions & Feelings": "bg-pink-100 text-pink-700",
};

const BlogPage: React.FC = () => {
  const allPosts = [
    {
      title: "A Productive Day at Work",
      date: "2023-09-25",
      desc: "Today was a really productive day at work. I managed to finish a report ahead of schedule and received positive feedback from my manager.",
      category: "Daily Journal",
      image: img,
    },
    {
      title: "My First Job Interview Experience",
      date: "2023-09-24",
      desc: "I had my first job interview today. I was nervous at first, but as the conversation went on, I became more confident.",
      category: "Work & Career",
      image: img2,
    },
    {
      title: "Overthinking Everything",
      date: "2023-09-23",
      desc: "Lately, I have been overthinking everything, from small decisions to big life choices. It’s exhausting.",
      category: "Personal Thoughts",
      image: img3,
    },
    {
      title: "How collaboration makes us better designers",
      date: "2023-09-22",
      desc: "How collaboration can make our teams stronger, and our individual work better.",
      category: "Work & Career",
      image: img4,
    },
    {
      title: "Our top 10 JavaScript frameworks to use",
      date: "2023-09-21",
      desc: "A comprehensive list of the top 10 JavaScript frameworks to use in your next project.",
      category: "Work & Career",
      image: img5,
    },
    {
      title: "Podcast: Creating a better CX Community",
      date: "2023-09-20",
      desc: "How to build a better community for customer experience professionals.",
      category: "Emotions & Feelings",
      image: img6,
    },
  ];

  const recentPosts = allPosts.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-10 flex-1">
        {/* Recent blog posts */}
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
              {recentPosts.slice(1).map((post, idx) => (
                <div
                  key={idx}
                  className="flex rounded overflow-hidden "
                >
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

        {/* All blog posts / All my posts */}
        <section className="mb-6 flex items-center gap-4">
          <button className="font-semibold text-blue-600">All blog posts</button>
          <button className="text-gray-600 hover:text-black">All my posts</button>
        </section>

        {/* Category tags */}
        <div className="flex flex-wrap gap-3 mb-8">
          {Object.keys(categoryColors).map((cat, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* All posts grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {allPosts.map((post, idx) => (
            <div
              key={idx}
              className="rounded overflow-hidden "
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-1">
                  Published on {post.date}
                </p>

                {/* Tiêu đề + icon ↗ */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{post.title}</h3>
                  <span className="text-gray-500 text-sm">↗</span>
                </div>

                {/* Mô tả ngắn */}
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

        {/* Pagination */}
        <div className="flex items-center mt-8 text-sm justify-between">
          <button className="text-gray-700 hover:underline mr-6">
            ← Previous
          </button>

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

          <button className="text-gray-700 hover:underline ml-6">
            Next →
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;