// src/services/postApi.ts
import axios from 'axios';

export const BASE_URL = 'http://localhost:8080/posts';

export type Post = {
  id: string | number;
  title: string;
  date: string;           
  desc: string;
  category: string;
  image: string;
  createdAt?: string;      
};

export const fetchPosts = async () => {
  const res = await axios.get<Post[]>(BASE_URL);
  return [...res.data].sort((a, b) => {
    const ka = a.createdAt || a.date || '';
    const kb = b.createdAt || b.date || '';
    if (ka !== kb) return ka < kb ? 1 : -1;     

    const ida = Number(a.id), idb = Number(b.id);
    if (!Number.isNaN(ida) && !Number.isNaN(idb)) return idb - ida;
    return String(b.id).localeCompare(String(a.id));
  });
};

export const fetchPostById = async (id: string | number) => {
  const res = await axios.get<Post>(`${BASE_URL}/${id}`);
  return res.data;
};

export const addPost = async (post: Omit<Post, 'id'>) => {
  const newPost: Post = { ...post, id: Date.now().toString(), createdAt: new Date().toISOString() };
  const res = await axios.post<Post>(BASE_URL, newPost);
  return res.data;
};
export const updatePost = async (id: string | number, patch: Partial<Post>) => {
  const res = await axios.patch<Post>(`${BASE_URL}/${id}`, patch);
  return res.data;
};
export const deletePost = async (id: string | number) => {
  await axios.delete(`${BASE_URL}/${id}`);
};
