import { configureStore } from "@reduxjs/toolkit";
import posts from "./postsSlice";
import members from "./membersSlice";

export const store = configureStore({
  reducer: { posts, members },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
