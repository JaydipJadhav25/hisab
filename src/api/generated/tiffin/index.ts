import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { DailyTiffinRecord, DayCalendarSummary, TiffinType, TodayOrder } from "@/types";

export const tiffinKeys = {
  today: (groupId: string) => ["groups", groupId, "tiffin", "today"] as const,
  order: (groupId: string, date?: string) => ["groups", groupId, "tiffin", "order", date] as const,
  history: (groupId: string, filters?: Record<string, string | undefined>) =>
    ["groups", groupId, "tiffin", "history", filters] as const,
};

export function useTodayTiffin(groupId: string | undefined) {
  return useQuery({
    queryKey: tiffinKeys.today(groupId ?? ""),
    queryFn: async () => {
      const { data } = await api.get<{ record: DailyTiffinRecord | null }>(
        `/groups/${groupId}/tiffin/today`
      );
      return data.record;
    },
    enabled: !!groupId,
  });
}

export function useSelectTiffin(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (type: TiffinType) => {
      const { data } = await api.post<{ record: DailyTiffinRecord }>(
        `/groups/${groupId}/tiffin/today`,
        { type }
      );
      return data.record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tiffinKeys.today(groupId) });
      queryClient.invalidateQueries({ queryKey: ["groups", groupId, "tiffin", "order"] });
    },
  });
}

export function useTodayOrder(groupId: string | undefined, date?: string) {
  return useQuery({
    queryKey: tiffinKeys.order(groupId ?? "", date),
    queryFn: async () => {
      const { data } = await api.get<TodayOrder>(`/groups/${groupId}/tiffin/order`, {
        params: date ? { date } : undefined,
      });
      return data;
    },
    enabled: !!groupId,
  });
}

export function useTiffinHistory(
  groupId: string | undefined,
  filters?: { date?: string; userId?: string; type?: TiffinType }
) {
  return useQuery({
    queryKey: tiffinKeys.history(groupId ?? "", filters),
    queryFn: async () => {
      const { data } = await api.get<{ records: DailyTiffinRecord[] }>(
        `/groups/${groupId}/tiffin/history`,
        { params: filters }
      );
      return data.records;
    },
    enabled: !!groupId,
  });
}

export function useOverrideTiffin(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, type, date }: { userId: string; type: TiffinType; date?: string }) => {
      const { data } = await api.patch<{ record: DailyTiffinRecord }>(
        `/groups/${groupId}/tiffin/${userId}/override`,
        { type, date }
      );
      return data.record;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups", groupId, "tiffin"] });
    },
  });
}


export function useTiffinCalendar(groupId: string | undefined, month: string) {
  return useQuery({
    queryKey: ["groups", groupId ?? "", "tiffin", "calendar", month],
    queryFn: async () => {
      const { data } = await api.get<{ month: string; days: DayCalendarSummary[] }>(
        `/groups/${groupId}/tiffin/calendar`,
        { params: { month } }
      );
      return data.days;
    },
    enabled: !!groupId,
  });
}