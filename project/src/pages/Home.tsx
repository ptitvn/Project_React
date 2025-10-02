import React from "react";
import MainLayout from "./MainLayout";
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";

const posts = [
  {
    title: "A Productive Day at Work",
    description: "Sharing my thoughts on a productive workday...",
    date: "Mar 6",
    image: "https://via.placeholder.com/300x200"
  },
  {
    title: "My first job interview experience",
    description: "Nervous but exciting first interview...",
    date: "Mar 6",
    image: "https://via.placeholder.com/300x200"
  },
  {
    title: "Overthinking Everything",
    description: "How overthinking affects daily life...",
    date: "Mar 6",
    image: "https://via.placeholder.com/300x200"
  }
];

const Home: React.FC = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 grid gap-6">
          {posts.map((post, index) => (
            <PostCard key={index} {...post} />
          ))}
        </div>
        <Sidebar />
      </div>
    </MainLayout>
  );
};

export default Home;