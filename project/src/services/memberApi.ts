// src/services/memberApi.ts
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

/** Lấy danh sách member (có phân trang + tìm kiếm q) */
export async function fetchMembers(
  { page = 1, limit = 10, q = "" }: { page?: number; limit?: number; q?: string } = {}
) {
  const res = await axios.get<Member[]>(BASE, { params: { _page: page, _limit: limit, q } });
  const total = Number(res.headers?.["x-total-count"] ?? 0);
  return { items: res.data, total };
}

/** Phát sự kiện để các trang lắng nghe (ManagerUser) có thể reload */
export function emitMembersChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("members:changed"));
  }
}

/** Tạo member mới (dùng sau đăng ký) */
export async function createMember(payload: Omit<Member, "id">) {
  const { data } = await axios.post<Member>(BASE, payload);
  emitMembersChanged();
  return data;
}

/** Cập nhật trạng thái hoạt động/chặn */
export async function updateMemberStatus(id: string, status: Member["status"]) {
  const { data } = await axios.patch<Member>(`${BASE}/${id}`, { status });
  emitMembersChanged();
  return data;
}
