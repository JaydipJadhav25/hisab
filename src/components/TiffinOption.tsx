import { clsx } from "clsx";
import { Check } from "lucide-react";
import type { TiffinType } from "@/types";

const OPTION_META: Record<TiffinType, { emoji: string; labelKey: string }> = {
  FULL: { emoji: "🍱", labelKey: "tiffin.full" },
  HALF: { emoji: "🥣", labelKey: "tiffin.half" },
  NONE: { emoji: "❌", labelKey: "tiffin.none" },
};

interface TiffinOptionProps {
  type: TiffinType;
  label: string;
  price: number;
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export function TiffinOption({ type, label, price, selected, disabled, onSelect }: TiffinOptionProps) {
  const meta = OPTION_META[type];
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={clsx(
        "flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-all",
        "focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed",
        selected
          ? "border-primary bg-primary/5 shadow-cardHover"
          : "border-border bg-white hover:border-primary/40"
      )}
    >
      <span className="flex items-center gap-3">
        <span className="text-2xl">{meta.emoji}</span>
        <span className="font-medium text-ink">{label}</span>
      </span>
      <span className="flex items-center gap-3">
        <span className="text-ink-muted">{price > 0 ? `₹${price}` : "₹0"}</span>
        {selected && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
            <Check className="h-4 w-4" />
          </span>
        )}
      </span>
    </button>
  );
}
