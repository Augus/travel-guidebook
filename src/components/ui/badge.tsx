import * as React from "react";
import { cn } from "../../lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex w-max items-center rounded-full border border-[var(--border)] bg-[var(--soft)] px-3 py-1 text-xs font-semibold text-[var(--muted)]",
        className
      )}
      {...props}
    />
  );
}
