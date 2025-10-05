import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Member } from "../services/memberApi";

type MembersState = {
  items: Member[];
  total: number;
};

const initialState: MembersState = {
  items: [],
  total: 0
};

const membersSlice = createSlice({
  name: "members",
  initialState,
  reducers: {
    setMembers: (s, a: PayloadAction<{ items: Member[]; total: number }>) => {
      s.items = a.payload.items;
      s.total = a.payload.total;
    },
    updateMemberLocal: (s, a: PayloadAction<Member>) => {
      const i = s.items.findIndex(m => m.id === a.payload.id);
      if (i !== -1) s.items[i] = a.payload;
    }
  }
});

export const { setMembers, updateMemberLocal } = membersSlice.actions;
export default membersSlice.reducer;
