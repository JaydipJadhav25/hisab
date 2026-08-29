import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCreateGroup } from "@/api/generated/groups";

const durations = [
  { value: "1_WEEK", label: "1 Week" },
  { value: "2_WEEKS", label: "2 Weeks" },
  { value: "1_MONTH", label: "1 Month" },
  { value: "3_MONTHS", label: "3 Months" },
  { value: "CUSTOM", label: "Custom" },
] as const;

const schema = z
  .object({
    name: z.string().trim().min(2, "Group name is required"),
    providerName: z.string().trim().min(2, "Provider name is required"),
    providerPhone: z.string().trim().min(7, "Enter a valid phone number"),
    full: z.coerce.number().positive("Must be greater than 0"),
    half: z.coerce.number().positive("Must be greater than 0"),
    startDate: z.string().min(1, "Start date is required"),
    duration: z.enum(["1_WEEK", "2_WEEKS", "1_MONTH", "3_MONTHS", "CUSTOM"]),
    endDate: z.string().optional(),
    
  })
  .refine((d) => d.half <= d.full, {
    message: "Half price should usually be less than or equal to full price",
    path: ["half"],
  })
  .refine((d) => d.duration !== "CUSTOM" || !!d.endDate, {
    message: "End date is required for a custom duration",
    path: ["endDate"],
  });

type FormValues = z.infer<typeof schema>;

export function CreateGroup() {
  const navigate = useNavigate();
  const createGroup = useCreateGroup();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    // defaultValues: { cutoffTime: "09:00", duration: "1_MONTH" },
  });
  const duration = watch("duration");

  async function onSubmit(values: FormValues) {
    const group = await createGroup.mutateAsync({
      name: values.name,
      provider: { name: values.providerName, phone: values.providerPhone },
      pricing: { full: values.full, half: values.half },
      startDate: values.startDate,
      duration: values.duration,
      endDate: values.endDate,
      // cutoffTime: values.cutoffTime,
    });
    navigate(`/groups/${group.id}`);
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Create Group</h1>
      <p className="mt-1 text-ink-muted">Set up your tiffin circle in a minute.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 flex flex-col gap-5">
        <Input label="Group Name" placeholder="Kaku Tiffin" error={errors.name?.message} {...register("name")} />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Provider Name"
            placeholder="Kaku Home Food"
            error={errors.providerName?.message}
            {...register("providerName")}
          />
          <Input
            label="Provider Phone"
            placeholder="+91 98765 43210"
            error={errors.providerPhone?.message}
            {...register("providerPhone")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Full Tiffin Price (₹)"
            type="number"
            step="1"
            error={errors.full?.message}
            {...register("full")}
          />
          <Input
            label="Half Tiffin Price (₹)"
            type="number"
            step="1"
            error={errors.half?.message}
            {...register("half")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            error={errors.startDate?.message}
            {...register("startDate")}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Duration</label>
            <select className="input" {...register("duration")}>
              {durations.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {duration === "CUSTOM" && (
          <Input label="End Date" type="date" error={errors.endDate?.message} {...register("endDate")} />
        )}

        {/* <Input
          label="Daily Cutoff Time"
          type="time"
          error={errors.cutoffTime?.message}
          {...register("cutoffTime")}
        /> */}

        {createGroup.isError && (
          <p className="text-sm text-danger">
            {(createGroup.error as any)?.friendlyMessage ?? "Could not create the group."}
          </p>
        )}

        <Button type="submit" isLoading={createGroup.isPending}>
          Create Group
        </Button>
      </form>
    </div>
  );
}
