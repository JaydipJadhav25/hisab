import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", isLoading, children, disabled, ...props }, ref) => {
    const base =
      variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "";
    return (
      <button
        ref={ref}
        className={clsx(
          base,
          variant === "ghost" &&
            "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-ink-muted hover:text-ink hover:bg-cream transition-colors",
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
