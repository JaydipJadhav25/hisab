interface LogoProps {
  className?: string;
  withWordmark?: boolean;
}

/**
 * Hisab's signature mark: a stacked tiffin carrier (three tiers, the way
 * dabbas actually stack) with the top tier's clasp rendered as a check —
 * the moment a tiffin gets confirmed. Doubles as the app favicon at 1:1.
 */
export function Logo({ className = "h-8 w-8", withWordmark = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="24" width="20" height="8" rx="2.5" fill="#EA580C" />
        <rect x="10" y="15" width="20" height="8" rx="2.5" fill="#F97316" />
        <rect x="10" y="6" width="20" height="8" rx="2.5" fill="#FDBA74" />
        <path d="M17 6V4a3 3 0 0 1 6 0v2" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M15.5 9.5L18 12l4.5-5"
          stroke="#292524"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {withWordmark && (
        <span className="font-display text-xl font-semibold tracking-tight text-ink">
          Hisab
        </span>
      )}
    </div>
  );
}
