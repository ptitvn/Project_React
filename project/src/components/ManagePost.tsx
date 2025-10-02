import React from "react";
import Header from "../components/Header";
import ArticleCard from "../components/ArticleCard";
import img from "../img/Image.png";
import img2 from "../img/Image (1).png";
import img3 from "../img/Image (2).png";
import img4 from "../img/Image (3).png";
import img5 from "../img/Image (4).png";
import img6 from "../img/Image (5).png";

const ManagePost: React.FC = () => {
    const articles = [
        {
            title: "A Productive Day at Work",
            date: "2022-06-22",
            category: "Work & Career",
            description: "How to maximize your productivity and stay focused throughout the day.",
            image: img,
        },
        {
            title: "My First Job Interview Experience",
            date: "2022-06-20",
            category: "Work & Career",
            description: "Tips and lessons learned from my first job interview.",
            image: img2,

        },
        {
            title: "Overthinking Everything",
            date: "2022-06-18",
            category: "Personal Thoughts",
            description: "How to stop overthinking everything, from small decisions to large ones.",
            image: img3,
        },
        {
            title: "How collaboration makes us better designers",
            date: "2022-06-15",
            category: "Work & Career",
            description: "How collaboration can make our teams stronger, and our individual work better.",
            image: img4,
        },
        {
            title: "Podcast: Creating a better CX Community",
            date: "2022-06-12",
            category: "Personal Thoughts",
            description: "How to build a better community for customer experience professionals.",
            image: img5,
        },
        {
            title: "Our top 10 Javascript frameworks to use",
            date: "2022-06-10",
            category: "Work & Career",
            description: "A comprehensive list of the top 10 Javascript frameworks to use in your next project.",
            image: img6,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto px-6 py-8">
                {/* Tiêu đề căn giữa */}
                <h1 className="text-2xl font-bold text-blue-600 mb-6 uppercase text-center">
                    Add New Article
                </h1>

                {/* Grid bài viết */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article, idx) => (
                        <ArticleCard key={idx} {...article} />
                    ))}
                </div>

                {/* Pagination */}
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