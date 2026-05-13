import { SectionHeader } from "../components/primitives/SectionHeader";
import { YouTubeEmbed } from "../components/primitives/YouTubeEmbed";
import type { BlockProps } from "./types";

type VideoFeatureBlockType = Extract<BlockProps["block"], { type: "videoFeature" }>;

export function VideoFeatureBlock({ block }: BlockProps<VideoFeatureBlockType>) {
  return (
    <section>
      <SectionHeader kicker={block.data.kicker} title={block.data.title} note={block.data.note} />
      <YouTubeEmbed video={block.data.video} />
    </section>
  );
}
