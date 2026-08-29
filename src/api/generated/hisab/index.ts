import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { MemberHisab } from "@/types";

export function useGroupHisab(groupId: string | undefined) {
  return useQuery({
    queryKey: ["groups", groupId, "hisab"],
    queryFn: async () => {
      const { data } = await api.get<{ hisab: MemberHisab[] }>(`/groups/${groupId}/hisab`);
      return data.hisab;
    },
    enabled: !!groupId,
  });
}

export function useMemberHisab(groupId: string | undefined, userId?: string) {
  return useQuery({
    queryKey: ["groups", groupId, "hisab", userId ?? "me"],
    queryFn: async () => {
      const path = userId
        ? `/groups/${groupId}/hisab/${userId}`
        : `/groups/${groupId}/hisab/me`;
      const { data } = await api.get<{ hisab: MemberHisab }>(path);
      return data.hisab;
    },
    enabled: !!groupId,
  });
}
