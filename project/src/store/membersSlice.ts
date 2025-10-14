import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Member } from "../services/memberApi";

export type MembersState = {
  items: Member[];
  total: number;
};

const initialState: MembersState = { items: [], total: 0 };

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setMembers: (state, { payload }: PayloadAction<MembersState>) => {
      state.items = payload.items;
      state.total = payload.total;
    },
    updateMemberLocal: (state, { payload }: PayloadAction<Member>) => {
      const idx = state.items.findIndex((m) => m.id === payload.id);
      if (idx !== -1) state.items[idx] = payload;
    },
  },
});

export const { setMembers, updateMemberLocal } = membersSlice.actions;
export default membersSlice.reducer;
