// src/store/postsSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "../services/postApi";

type PostsState = { items: Post[] };
const initialState: PostsState = { items: [] };

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, { payload }: PayloadAction<Post[]>) => {
      state.items = payload;
    },
    addPostLocal: (state, { payload }: PayloadAction<Post>) => {
      state.items.unshift(payload);
    },
    updatePostLocal: (state, { payload }: PayloadAction<Post>) => {
      const i = state.items.findIndex((p) => p.id === payload.id);
      if (i !== -1) state.items[i] = payload;
    },
    deletePostLocal: (state, { payload }: PayloadAction<Post["id"]>) => {
      state.items = state.items.filter((p) => p.id !== payload);
    },
  },
});

export const { setPosts, addPostLocal, updatePostLocal, deletePostLocal } = postsSlice.actions;
export default postsSlice.reducer;
