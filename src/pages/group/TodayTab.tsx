import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Group, TiffinType } from "@/types";
import { TiffinOption } from "@/components/TiffinOption";
import { Button } from "@/components/ui/Button";
import { useTodayTiffin, useSelectTiffin } from "@/api/generated/tiffin";
import { useTranslation } from "react-i18next";

export function TodayTab({ group }: { group: Group }) {
  const { t } = useTranslation();
  const { data: todayRecord, isLoading } = useTodayTiffin(group.id);
  const selectTiffin = useSelectTiffin(group.id);
  const [pending, setPending] = useState<TiffinType | null>(null);

  useEffect(() => {
    setPending(todayRecord?.type ?? null);
  }, [todayRecord?.type]);

  const isLocked = group.status !== "ACTIVE";

  async function confirm() {
    if (!pending) return;
    await selectTiffin.mutateAsync(pending);
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
      <TiffinOption
        type="NONE"
        label={t("tiffin.none")}
        price={0}
        selected={pending === "NONE"}
        disabled={isLocked}
        onSelect={() => setPending("NONE")}
      />

      <Button
        onClick={confirm}
        isLoading={selectTiffin.isPending}
        disabled={!pending || isLocked || pending === todayRecord?.type}
        className="mt-2"
      >
        {t("tiffin.confirm")}
      </Button>

      {selectTiffin.isError && (
        <p className="text-sm text-danger text-center">
          {(selectTiffin.error as any)?.friendlyMessage ?? t("tiffin.cutoffPassed")}
        </p>
      )}

      {todayRecord && !selectTiffin.isPending && (
        <div className="flex items-center justify-center gap-2 rounded-xl bg-success/10 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4" />
          {t("tiffin.confirmed")}: {todayRecord.type}
        </div>
      )}

      <p className="text-center text-xs text-ink-muted">
        Cutoff: {group.cutoffTime} · {isLocked ? t("tiffin.selectionLocked") : t("tiffin.changeSelection")}
      </p>
    </div>
  );
}
