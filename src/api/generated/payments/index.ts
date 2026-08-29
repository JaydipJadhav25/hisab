import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import type { Payment, PaymentMethod } from "@/types";

export interface RecordPaymentPayload {
  userId: string;
  amount: number;
  method?: PaymentMethod;
  note?: string;
}

export function useGroupPayments(groupId: string | undefined) {
  return useQuery({
    queryKey: ["groups", groupId, "payments"],
    queryFn: async () => {
      const { data } = await api.get<{ payments: Payment[] }>(`/groups/${groupId}/payments`);
      return data.payments;
    },
    enabled: !!groupId,
  });
}

export function useMemberPayments(groupId: string | undefined, userId?: string) {
  return useQuery({
    queryKey: ["groups", groupId, "payments", userId ?? "me"],
    queryFn: async () => {
      const path = userId
        ? `/groups/${groupId}/payments/${userId}`
        : `/groups/${groupId}/payments/me`;
      const { data } = await api.get<{ payments: Payment[] }>(path);
      return data.payments;
    },
    enabled: !!groupId,
  });
}

export function useRecordPayment(groupId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RecordPaymentPayload) => {
      const { data } = await api.post<{ payment: Payment }>(`/groups/${groupId}/payments`, payload);
      return data.payment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups", groupId, "payments"] });
      queryClient.invalidateQueries({ queryKey: ["groups", groupId, "hisab"] });
    },
  });
}
