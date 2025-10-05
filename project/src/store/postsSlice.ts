import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Post } from '../services/postApi';

type PostsState = {
  items: Post[];
};

const initialState: PostsState = {
  items: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.items = action.payload;
    },
    addPostLocal: (state, action: PayloadAction<Post>) => {
      state.items.unshift(action.payload);
    },
    updatePostLocal: (state, action: PayloadAction<Post>) => {
      const i = state.items.findIndex(p => p.id === action.payload.id);
      if (i !== -1) state.items[i] = action.payload;
    },
    deletePostLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
  },
});

export const { setPosts, addPostLocal, updatePostLocal, deletePostLocal } = postsSlice.actions;
export default postsSlice.reducer;
