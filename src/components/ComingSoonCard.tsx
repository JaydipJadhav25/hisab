import { Sparkles, Lock } from "lucide-react";

export function ComingSoonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-food-green/20 bg-gradient-to-br from-food-green/5 to-cream p-6">
      <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-food-green/10 px-3 py-1 text-xs font-medium text-food-green">
        <Sparkles className="h-3.5 w-3.5" />
        Coming Soon
      </div>
      <div className="mt-2 flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-card">
          💸
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-ink">Split Expenses</p>
          <p className="mt-1 max-w-md text-sm text-ink-muted">
            Restaurant bills, shopping, travel and other shared expenses — with automatic
            settlements between group members.
          </p>
        </div>
      </div>
      <button
        disabled
        className="mt-4 flex items-center gap-2 rounded-xl bg-white/70 px-4 py-2.5 text-sm font-medium text-ink-muted cursor-not-allowed"
      >
        <Lock className="h-4 w-4" />
        Not available yet
      </button>
    </div>
  );
}
