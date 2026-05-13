import { cn } from "../../lib/utils";

export function SectionHeader({
  kicker,
  title,
  note,
  className
}: {
  kicker?: string;
  title: string;
  note?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-5 grid gap-4", className)}>
      <div>
        {kicker ? <div className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{kicker}</div> : null}
        <h2 className="m-0 text-2xl font-bold leading-tight tracking-normal text-[var(--foreground)] md:text-3xl">
          {title}
        </h2>
      </div>
      {note ? <p className="max-w-[760px] text-sm text-[var(--muted)]">{note}</p> : null}
    </div>
  );
}
