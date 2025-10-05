// src/services/authApi.ts
import axios from "axios";

const BASE = "http://localhost:8080/users";

export async function isEmailTaken(email: string) {
  const res = await axios.get(BASE, { params: { email } });
  return Array.isArray(res.data) && res.data.length > 0;
}

export async function registerUser(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const payload = {
    id: Date.now().toString(),
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    fullName: `${input.firstName.trim()} ${input.lastName.trim()}`.trim(),
    email: input.email.trim(),
    password: input.password,
    createdAt: new Date().toISOString(),
  };
  const res = await axios.post(BASE, payload);
  return res.data;
}

export async function loginUser(email: string, password: string) {
  const res = await axios.get(BASE, { params: { email: email.trim(), password } });
  return Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;
}
