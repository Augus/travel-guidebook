import { ChevronDown } from "lucide-react";
import type { BlockProps } from "./types";

type SourceListBlockType = Extract<BlockProps["block"], { type: "sourceList" }>;

export function SourceListBlock({ block }: BlockProps<SourceListBlockType>) {
  return (
    <details>
      <summary className="group flex cursor-pointer list-none items-start justify-between gap-5 marker:hidden">
        <div>
          {block.data.kicker ? (
            <div className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{block.data.kicker}</div>
          ) : null}
          <h2 className="m-0 text-2xl font-bold leading-tight tracking-normal text-[var(--foreground)] md:text-3xl">
            {block.data.title}
          </h2>
          {block.data.note ? <p className="mt-3 max-w-[760px] text-sm text-[var(--muted)]">{block.data.note}</p> : null}
        </div>
        <span className="mt-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--paper)] text-[var(--foreground)] transition group-open:rotate-180">
          <ChevronDown className="h-5 w-5" />
        </span>
      </summary>
      <div className="mt-6 border-t border-[var(--border)] pt-6">
        <ul className="space-y-2">
          {block.data.links.map((link) => (
            <li key={link.url}>
              <a
                className="text-[var(--accent-2)] underline decoration-[var(--accent-2)]/30 underline-offset-4 hover:decoration-[var(--accent-2)]"
                href={link.url}
                target="_blank"
                rel="noopener"
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
