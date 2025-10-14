import React from "react";

type Props = {
  title: string;
  date: string;
  category: string;
  description: string;
  image?: string;
};

const ArticleCard: React.FC<Props> = ({ title, date, category, description, image }) => {
  //  category
  const categoryColor =
    category === "Work & Career"
      ? "text-blue-500"
      : category === "Personal Thoughts"
      ? "text-indigo-500"
      : "text-orange-500";

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      {/* Thumbnail */}
      <div className="h-40 bg-gray-200 rounded mb-3 overflow-hidden">
        {image && <img src={image} alt={title} className="w-full h-full object-cover" />}
      </div>

      {/* Date */}
      <p className="text-xs text-indigo-500 mb-1">Date: {date}</p>

      {/* Title */}
      <h2 className="text-lg font-semibold mb-2">{title}</h2>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-3">{description}</p>

      {/* Category + Edit */}
      <div className="flex justify-between items-center text-sm">
        <span className={`${categoryColor} font-medium`}>{category}</span>
        <button className="text-pink-500 hover:underline">Edit your post</button>
      </div>
    </div>
  );
};

export default ArticleCard;