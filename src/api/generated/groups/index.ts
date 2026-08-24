import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Group, GroupMember, Duration, GroupProvider, GroupPricing } from "@/types";

export const groupKeys = {
  all: ["groups"] as const,
  detail: (id: string) => ["groups", id] as const,
  members: (id: string) => ["groups", id, "members"] as const,
};

export interface CreateGroupPayload {
  name: string;
  provider: GroupProvider;
  pricing: GroupPricing;
  startDate: string;
  duration: Duration;
  endDate?: string;
  cutoffTime?: string;
}

export function useMyGroups() {
  return useQuery({
    queryKey: groupKeys.all,
    queryFn: async () => {
      const { data } = await api.get<{ groups: Group[] }>("/groups");
      return data.groups;
    },
  });
}

export function useGroup(groupId: string | undefined) {
  return useQuery({
    queryKey: groupKeys.detail(groupId ?? ""),
    queryFn: async () => {
      const { data } = await api.get<{ group: Group }>(`/groups/${groupId}`);
      return data.group;
    },
    enabled: !!groupId,
  });
}

export function useGroupMembers(groupId: string | undefined) {
  return useQuery({
    queryKey: groupKeys.members(groupId ?? ""),
    queryFn: async () => {
      const { data } = await api.get<{ members: GroupMember[] }>(`/groups/${groupId}/members`);
      return data.members;
    },
    enabled: !!groupId,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateGroupPayload) => {
      const { data } = await api.post<{ group: Group }>("/groups", payload);
      return data.group;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.all }),
  });
}

export function useJoinGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (inviteCode: string) => {
      const { data } = await api.post<{ group: Group }>("/groups/join", { inviteCode });
      return data.group;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.all }),
  });
}

export function useUpdateGroup(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<CreateGroupPayload>) => {
      const { data } = await api.patch<{ group: Group }>(`/groups/${groupId}`, payload);
      return data.group;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.detail(groupId) }),
  });
}

export function useRemoveMember(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/groups/${groupId}/members/${userId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.members(groupId) }),
  });
}

export function useCloseGroup(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ group: Group }>(`/groups/${groupId}/close`);
      return data.group;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.all }),
  });
}

export function useRenewGroup(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { duration: Duration; endDate?: string }) => {
      const { data } = await api.post<{ group: Group }>(`/groups/${groupId}/renew`, payload);
      return data.group;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: groupKeys.all }),
  });
}
