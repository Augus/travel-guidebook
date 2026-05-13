import type { BlockProps } from "./types";

type GuideFooterBlockType = Extract<BlockProps["block"], { type: "guideFooter" }>;

export function GuideFooterBlock({ block }: BlockProps<GuideFooterBlockType>) {
  return <footer className="py-12 text-sm text-[var(--muted)]">{block.data.text}</footer>;
}
