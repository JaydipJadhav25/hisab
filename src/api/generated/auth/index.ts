import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { authToken } from "@/lib/authToken";
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

export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: fetchMe,
    retry: false,
    enabled: !!authToken.get(), // don't even try if there's no token yet
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post<{ user: User; token: string }>("/auth/register", payload);
      return data;
    },
    onSuccess: ({ user, token }) => {
      authToken.set(token);
      queryClient.setQueryData(authKeys.me, user);
    },
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await api.post<{ user: User; token: string }>("/auth/login", payload);
      return data;
    },
    onSuccess: ({ user, token }) => {
      authToken.set(token);
      queryClient.setQueryData(authKeys.me, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      authToken.clear();
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me, null);
      queryClient.clear();
    },
  });
}
