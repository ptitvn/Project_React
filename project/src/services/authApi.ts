import axios from "axios";

const BASE = "http://localhost:8080/users";

/* Types*/
export type User = {
  id: string | number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email: string;
  password?: string;
  role?: "admin" | "user";
  createdAt?: string;
};

type PublicUser = Omit<User, "password">;

/*Helpers */
const toList = <T,>(data: any): T[] => (Array.isArray(data) ? data : []);
const lower = (s: string) => s.trim().toLowerCase();

/** Bỏ password + role mặc định "user" */
function sanitize(u: User | null | undefined): PublicUser | null {
  if (!u) return null;
  const { password, role, ...rest } = u;
  return { ...rest, role: (role as "admin" | "user") ?? "user" };
}

/*API */

/** Kiểm tra email đã tồn tại (không phân biệt hoa/thường) */
export async function isEmailTaken(email: string) {
  const trimmed = email.trim();

  // 1) Khớp tuyệt đối theo email
  const r1 = await axios.get<User[]>(BASE, { params: { email: trimmed } });
  if (toList<User>(r1.data).length > 0) return true;

  // 2) Fallback: tìm theo q rồi so sánh .toLowerCase()
  const r2 = await axios.get<User[]>(BASE, { params: { q: trimmed } });
  return toList<User>(r2.data).some((u) => lower(u.email || "") === lower(trimmed));
}

/** Đăng ký (role mặc định: user) */
export async function registerUser(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const email = input.email.trim();

  if (await isEmailTaken(email)) throw new Error("Email đã tồn tại.");

  const payload: User = {
    id: Date.now().toString(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    fullName: `${input.firstName.trim()} ${input.lastName.trim()}`.trim(),
    email,
    password: input.password,
    role: "user",
    createdAt: new Date().toISOString(),
  };

  const { data } = await axios.post<User>(BASE, payload);
  return sanitize(data)!;
}

export async function loginUser(email: string, password: string) {
  const trimmed = email.trim();

  const rexact = await axios.get<User[]>(BASE, { params: { email: trimmed, password } });
  const exactUser = toList<User>(rexact.data)[0];
  if (exactUser) return sanitize(exactUser);

  const rq = await axios.get<User[]>(BASE, { params: { q: trimmed } });
  const user = toList<User>(rq.data).find((u) => lower(u.email || "") === lower(trimmed));
  if (!user || user.password !== password) return null;

  return sanitize(user);
}
