import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { User, Language } from "@/types";

export interface RegisterPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  preferredLanguage?: Language;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authKeys = {
  me: ["auth", "me"] as const,
};

async function fetchMe(): Promise<User> {
  const { data } = await api.get<{ user: User }>("/auth/me");
  return data.user;
}

export function useMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: fetchMe,
    retry: false,
    enabled: options?.enabled ?? true,
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post<{ user: User }>("/auth/register", payload);
      return data.user;
    },
    onSuccess: (user) => queryClient.setQueryData(authKeys.me, user),
  });
}

// export function useLogin() {
//   const queryClient = useQueryClient();

//   return useMutation({

//     mutationFn: async (payload: LoginPayload) => {
//       const { data } = await api.post<{ user: User }>("/auth/login", payload);
//       return data.user;
//     },
//     onSuccess: (user) => queryClient.setQueryData(authKeys.me, user),
    
//   });
// }


export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<{
        user: User;
        accessToken: string;
        refreshToken: string;
      }>("/auth/login", payload);
        console.log("data : " , data);
      // Save tokens
      localStorage.setItem("hisab.accessToken", data.accessToken);
      localStorage.setItem("hisab.refreshToken", data.refreshToken);

      return data.user;
    },

    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me, user);
    },
  });
}



// export function useLogout() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async () => {
//       await api.post("/auth/logout");
//     },
//     onSuccess: () => {
//       queryClient.setQueryData(authKeys.me, null);
//       queryClient.clear();
//     },
//   });
// }



export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },

    onSuccess: () => {
      // Clear tokens from localStorage
      localStorage.removeItem("hisab.accessToken");
      localStorage.removeItem("hisab.refreshToken");

      // Clear user data
      queryClient.setQueryData(authKeys.me, null);
      queryClient.clear();
    },
  });
}
