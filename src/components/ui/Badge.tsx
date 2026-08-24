import { clsx } from "clsx";

type Tone = "success" | "warning" | "danger" | "neutral" | "primary";

const toneClasses: Record<Tone, string> = {
  success: "bg-success/10 text-green-700",
  warning: "bg-warning/10 text-amber-700",
  danger: "bg-danger/10 text-red-700",
  neutral: "bg-ink/5 text-ink-muted",
  primary: "bg-primary/10 text-primary-deep",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone]
      )}
    >
      {children}
    </span>
  );
}
