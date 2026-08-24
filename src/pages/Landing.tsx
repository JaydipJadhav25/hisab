import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckCircle2, PhoneOff, NotebookPen, PhoneCall, Calculator, Frown } from "lucide-react";
import { ComingSoonCard } from "@/components/ComingSoonCard";

const OLD_STEPS = [
  { icon: PhoneCall, label: "Call everyone" },
  { icon: NotebookPen, label: "Write it down" },
  { icon: PhoneCall, label: "Call the provider" },
  { icon: Calculator, label: "Calculate by hand" },
  { icon: Frown, label: "Confusion" },
];

const NEW_STEPS = [
  { icon: CheckCircle2, label: "Choose Full / Half / None" },
  { icon: CheckCircle2, label: "Order builds itself" },
  { icon: CheckCircle2, label: "Hisab calculates automatically" },
  { icon: CheckCircle2, label: "Clear monthly hisab" },
];

const FEATURES = [
  { title: "Daily Tiffin Selection", desc: "Full, half or none — confirmed in a few taps." },
  { title: "Automatic Order Summary", desc: "The exact count to call your provider with." },
  { title: "Group Management", desc: "Providers, pricing, cutoff time and members, in one place." },
  { title: "Monthly Hisab", desc: "Every member's bill, calculated correctly, every time." },
  { title: "Payment Tracking", desc: "Know who's paid and who's pending, at a glance." },
  { title: "Personal History", desc: "Every day's choice, on record, forever." },
];

export function Landing() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center md:pt-24">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
          🍱
        </div>
        <h1 className="font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
          {t("app.tagline")}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink-muted">
          Stop calling everyone every morning. Stop maintaining tiffin records by hand.
          Hisab automatically manages your group's daily tiffin, orders and monthly calculation.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/register" className="btn-primary px-6 py-3">
            {t("common.getStarted")}
          </Link>
          <a href="#how-it-works" className="btn-secondary px-6 py-3">
            {t("common.seeHowItWorks")}
          </a>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="border-y border-border bg-white py-16" id="how-it-works">
        <div className="mx-auto grid max-w-5xl gap-10 px-6 md:grid-cols-2">
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-wide text-danger">
              The old way
            </p>
            <div className="flex flex-col gap-3">
              {OLD_STEPS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
                  <Icon className="h-5 w-5 text-danger" />
                  <span className="text-ink">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-wide text-food-green">
              With Hisab
            </p>
            <div className="flex flex-col gap-3">
              {NEW_STEPS.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl border border-food-green/30 bg-food-green/5 px-4 py-3">
                  <Icon className="h-5 w-5 text-food-green" />
                  <span className="text-ink">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-display text-2xl font-semibold text-ink text-center">
          Everything a tiffin group actually needs
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="card">
              <p className="font-medium text-ink">{f.title}</p>
              <p className="mt-1 text-sm text-ink-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Coming soon */}
      <section className="mx-auto max-w-3xl px-6 pb-16">
        <ComingSoonCard />
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-white py-16 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Start Managing Your Tiffin
        </h2>
        <div className="mt-6">
          <Link to="/register" className="btn-primary px-6 py-3">
            {t("common.getStarted")}
          </Link>
        </div>
        <p className="mt-3 text-xs text-ink-muted flex items-center justify-center gap-1">
          <PhoneOff className="h-3.5 w-3.5" /> No more morning phone calls
        </p>
      </section>
    </div>
  );
}
