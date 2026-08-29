import Axios from "axios";
import { authToken } from "./authToken";

// Plain axios instance — no cookies. Every request carries the token
// from localStorage (if present) as a normal Authorization header.
export const api = Axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
});

api.interceptors.request.use((config) => {
  const token = authToken.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ?? "Something went wrong. Please try again.";
    return Promise.reject({ ...error, friendlyMessage: message });
  }
);
