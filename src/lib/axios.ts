import Axios, { AxiosRequestConfig } from "axios";

export const api = Axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true,
});

// Add access token to every request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("hisab.accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Mutator function used by Orval-generated hooks.
 */
export const axiosInstance = <T>(
  config: AxiosRequestConfig
): Promise<T> => {
  return api.request<T>(config).then((response) => response.data as T);
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ??
      "Something went wrong. Please try again.";

    return Promise.reject({
      ...error,
      friendlyMessage: message,
    });
  }
);