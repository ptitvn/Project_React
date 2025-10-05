import React, { useState } from "react";
import {HandThumbUpIcon,
  ChatBubbleLeftIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

// ===== Mock data (UI tĩnh) =====
const POST = {
  title: "A Productive Day at Work",
  content:
    "Today was a really productive day at work. I managed to finish a report ahead of schedule and received positive feedback from my manager. After work, I went for a walk in the park, enjoying the fresh air. Looking forward to another great day tomorrow!",
  likes: 15,
  replies: 6,
};

const COMMENTS = [
  {
    id: 1,
    author: "Alex",
    avatar: "https://i.pravatar.cc/80?img=12",
    text: "very good!",
    likes: 15,
    replies: 6,
  },
  {
    id: 2,
    author: "Marry",
    avatar: "https://i.pravatar.cc/80?img=14",
    text: "hello rikkei!",
    likes: 15,
    replies: 6,
  },
];

// ===== Subcomponents =====
const Stat: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-1 text-gray-500">
    <span className="h-4 w-4">{icon}</span>
    <span className="text-xs">{label}</span>
  </div>
);

const CommentItem: React.FC<{
  avatar: string;
  text: string;
  likes: number;
  replies: number;
}> = ({ avatar, text, likes, replies }) => (
  <li className="flex items-start gap-3">
    <img src={avatar} alt="avatar" className="mt-1 h-8 w-8 rounded-full object-cover" />
    <div className="flex-1">
      <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
        <div className="text-gray-800">{text}</div>
        <div className="mt-2 flex items-center gap-4">
          <Stat icon={<HandThumbUpIcon className="h-4 w-4" />} label={`${likes} Like`} />
          <Stat icon={<ChatBubbleLeftIcon className="h-4 w-4" />} label={`${replies} Replies`} />
        </div>
      </div>
    </div>
  </li>
);

// ===== Page =====
const PostDetail: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const rendered = showAll ? COMMENTS : COMMENTS.slice(0, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Back */}
        <button
          aria-label="Back"
          className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <span className="-translate-x-[1px] text-lg leading-none">&lt;</span>
        </button>

        {/* Header row with avatar left & post card */}
        <div className="flex items-start gap-3">
          <img
            src="https://i.pravatar.cc/80?img=11"
            alt="author"
            className="h-9 w-9 rounded-full object-cover"
          />

          <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5">
            <h1 className="mb-2 text-center text-xl font-semibold text-gray-900">
              {POST.title}
            </h1>
            <p className="text-gray-800 leading-relaxed">
              {POST.content}
            </p>

            <div className="mt-3 flex items-center gap-4">
              <Stat icon={<HandThumbUpIcon className="h-4 w-4" />} label={`${POST.likes} Like`} />
              <Stat icon={<ChatBubbleLeftIcon className="h-4 w-4" />} label={`${POST.replies} Replies`} />
            </div>
          </div>
        </div>

        {/* View all comments */}
        <button
          onClick={() => setShowAll((s) => !s)}
          className="mt-4 inline-flex items-center gap-1 rounded px-2 py-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          View all 12 comments
          <ChevronDownIcon className={`h-4 w-4 transition ${showAll ? "rotate-180" : ""}`} />
        </button>

        {/* Comments list */}
        <ul className="mt-3 space-y-3">
          {rendered.map((c) => (
            <CommentItem key={c.id} avatar={c.avatar} text={c.text} likes={c.likes} replies={c.replies} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostDetail;
