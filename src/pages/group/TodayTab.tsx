import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Group, TiffinType } from "@/types";
import { TiffinOption } from "@/components/TiffinOption";
import { Button } from "@/components/ui/Button";
import { useTodayTiffin, useSelectTiffin } from "@/api/generated/tiffin";
import { useTranslation } from "react-i18next";

export function TodayTab({ group }: { group: Group }) {
  const { t } = useTranslation();
  // Ensure your backend endpoint returns an array of today's logs or the count 
  const { data: todayRecord, isLoading } = useTodayTiffin(group.id);
  const selectTiffin = useSelectTiffin(group.id);
  
  // 1. Start with no pre-selected active option to encourage fresh placements
  const [pending, setPending] = useState<TiffinType | null>(null);

  console.log("response : ", selectTiffin.error);

  const isLocked = group.status !== "ACTIVE";

  async function confirm() {
    if (!pending) return;
    await selectTiffin.mutateAsync(pending, {
      onSuccess: () => {
        // 2. Clear state selection after a successful order so they can order again
        setPending(null);
      }
    });
  }

  if (isLoading) return <p className="text-ink-muted">{t("common.loading")}</p>;

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <h2 className="font-display text-xl font-semibold text-ink">{t("tiffin.today")}</h2>

      <TiffinOption
        type="FULL"
        label={t("tiffin.full")}
        price={group.pricing.full}
        selected={pending === "FULL"}
        disabled={isLocked}
        onSelect={() => setPending("FULL")}
      />
      <TiffinOption
        type="HALF"
        label={t("tiffin.half")}
        price={group.pricing.half}
        selected={pending === "HALF"}
        disabled={isLocked}
        onSelect={() => setPending("HALF")}
      />

      <Button
        onClick={confirm}
        isLoading={selectTiffin.isPending}
        // 3. REMOVED: "pending === todayRecord?.type" block logic 
        disabled={!pending || isLocked}
        className="mt-2"
      >
        {t("tiffin.confirm")}
      </Button>

      {selectTiffin.isError && (
        <p className="text-sm text-danger text-center">
          {(selectTiffin.error as any)?.friendlyMessage ?? t("tiffin.cutoffPassed")}
        </p>
      )}

      {/* 4. Displays confirmation banner if they ordered at least one item today */}
      {todayRecord && !selectTiffin.isPending && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          {t("tiffin.confirmed")}! {t("tiffin.successMessage") || "Order processed successfully."}
        </div>
      )}

      <p className="text-center text-xs text-ink-muted">
        Cutoff: {group.cutoffTime} · {isLocked ? t("tiffin.selectionLocked") : "You can select and add multiple meals for today."}
      </p>
    </div>
  );
}
