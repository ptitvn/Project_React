import axios from "axios";

export type Member = {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar: string;
  status: "hoạt động" | "bị chặn";
};

const BASE = "http://localhost:8080/members";

export async function fetchMembers(params?: { page?: number; limit?: number; q?: string }) {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 10;
  const q = params?.q ?? "";

  const res = await axios.get<Member[]>(BASE, {
    params: { _page: page, _limit: limit, q }
  });

  const total = Number(res.headers["x-total-count"] || 0);
  return { items: res.data, total };
}

export async function updateMemberStatus(id: string, status: Member["status"]) {
  const res = await axios.patch<Member>(`${BASE}/${id}`, { status });
  return res.data;
}
