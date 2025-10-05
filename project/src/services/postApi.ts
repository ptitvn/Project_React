import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/posts';

export type Post = {
  id: string;
  title: string;
  date: string;       // ISO date
  desc: string;
  category: string;
  image: string;      // path từ public, ví dụ: /images/image-1.png
};

export const fetchPosts = async () => {
  const res = await axios.get<Post[]>(BASE_URL);
  // sắp xếp mới → cũ giống UI cũ
  return [...res.data].sort((a, b) => (a.date < b.date ? 1 : -1));
};

export const fetchPostById = async (id: string) => {
  const res = await axios.get<Post>(`${BASE_URL}/${id}`);
  return res.data;
};

// (tuỳ chọn) CRUD nếu sau này bạn cần:
export const addPost = async (post: Omit<Post, 'id'>) => {
  const newPost: Post = { ...post, id: Date.now().toString() };
  const res = await axios.post<Post>(BASE_URL, newPost);
  return res.data;
};
export const updatePost = async (id: string, patch: Partial<Post>) => {
  const res = await axios.patch<Post>(`${BASE_URL}/${id}`, patch);
  return res.data;
};
export const deletePost = async (id: string) => {
  await axios.delete(`${BASE_URL}/${id}`);
};
