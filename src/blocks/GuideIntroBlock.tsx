import { SectionHeader } from "../components/primitives/SectionHeader";
import { YouTubeEmbed } from "../components/primitives/YouTubeEmbed";
import type { BlockProps } from "./types";

type GuideIntroBlockType = Extract<BlockProps["block"], { type: "guideIntro" }>;

export function GuideIntroBlock({ block }: BlockProps<GuideIntroBlockType>) {
  return (
    <section>
      <div className="grid gap-7">
        <div className="max-w-[860px]">
          <SectionHeader kicker={block.data.kicker} title={block.data.title} />
          {block.data.body ? <p className="max-w-[780px] text-[var(--accent-2)]">{block.data.body}</p> : null}
        </div>
        {block.data.video ? <YouTubeEmbed video={block.data.video} /> : null}
        {block.data.maps.length ? (
          <div aria-label={block.data.mapLabel} className="grid gap-5 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--map-bg)] p-5 md:grid-cols-[1.1fr_.9fr]">
            {block.data.maps.map((map) => (
              <img className="w-full object-contain" src={map.src} alt={map.alt} key={map.src} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
