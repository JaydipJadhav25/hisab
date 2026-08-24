import Axios, { AxiosRequestConfig } from "axios";

// Backend sets httpOnly cookies for auth, so we always send credentials.
export const api = Axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
});

/**
 * Mutator function used by Orval-generated hooks (see orval.config.ts).
 * Keeping this separate from the raw `api` instance lets generated code
 * stay decoupled from how requests are actually issued.
 */
export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return api.request<T>(config).then((response) => response.data as T);
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ?? "Something went wrong. Please try again.";
    return Promise.reject({ ...error, friendlyMessage: message });
  }
);
