import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useUpdateGroup, useCloseGroup, useRenewGroup } from "@/api/generated/groups";
import type { Group } from "@/types";
import { useState } from "react";

interface SettingsForm {
  name: string;
  providerName: string;
  providerPhone: string;
  full: number;
  half: number;
  cutoffTime: string;
}

export function SettingsTab({ group }: { group: Group }) {
  const updateGroup = useUpdateGroup(group.id);
  const closeGroup = useCloseGroup(group.id);
  const renewGroup = useRenewGroup(group.id);
  const [confirmingClose, setConfirmingClose] = useState(false);

  const { register, handleSubmit } = useForm<SettingsForm>({
    defaultValues: {
      name: group.name,
      providerName: group.provider.name,
      providerPhone: group.provider.phone,
      full: group.pricing.full,
      half: group.pricing.half,
      cutoffTime: group.cutoffTime,
    },
  });

  function onSubmit(values: SettingsForm) {
    updateGroup.mutate({
      name: values.name,
      provider: { name: values.providerName, phone: values.providerPhone },
      pricing: { full: Number(values.full), half: Number(values.half) },
      cutoffTime: values.cutoffTime,
    });
  }

  return (
    <div className="flex max-w-xl flex-col gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="card flex flex-col gap-4">
        <h3 className="font-display text-lg font-semibold text-ink">Group Settings</h3>
        <Input label="Group Name" {...register("name")} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Provider Name" {...register("providerName")} />
          <Input label="Provider Phone" {...register("providerPhone")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Full Price (₹)" type="number" {...register("full")} />
          <Input label="Half Price (₹)" type="number" {...register("half")} />
        </div>
        <Input label="Cutoff Time" type="time" {...register("cutoffTime")} />
        <Button type="submit" isLoading={updateGroup.isPending} className="self-start">
          Save Changes
        </Button>
      </form>

      <div className="card flex flex-col gap-4">
        <h3 className="font-display text-lg font-semibold text-ink">Group Lifecycle</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            isLoading={renewGroup.isPending}
            onClick={() => renewGroup.mutate({ duration: "1_MONTH" })}
          >
            Renew Group (next 1 month)
          </Button>
          {!confirmingClose ? (
            <Button variant="ghost" onClick={() => setConfirmingClose(true)}>
              Close Group
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-ink-muted">Are you sure?</span>
              <Button
                variant="secondary"
                className="border-danger text-danger"
                isLoading={closeGroup.isPending}
                onClick={() => closeGroup.mutate()}
              >
                Yes, close it
              </Button>
              <Button variant="ghost" onClick={() => setConfirmingClose(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-ink-muted">
          Renewing preserves all historical records under this group's name and starts a fresh
          billing period. Closing stops new tiffin selections but keeps history intact.
        </p>
      </div>
    </div>
  );
}
