import type { Block } from "../schema/blocks";
import { CoverHeroBlock } from "./CoverHeroBlock";
import { GuideFooterBlock } from "./GuideFooterBlock";
import { GuideIntroBlock } from "./GuideIntroBlock";
import { TripOverviewBlock } from "./TripOverviewBlock";
import { TravelPreparationBlock } from "./TravelPreparationBlock";
import { SourceListBlock } from "./SourceListBlock";
import { VideoFeatureBlock } from "./VideoFeatureBlock";
import {
  CalloutBlock,
  DailyRouteBlock,
  DailyScheduleBlock,
  DayMediaBlock,
  DetailsNoteBlock,
  RecommendedStopsBlock
} from "./DayBlocks";
import type { BlockComponent, BlockProps } from "./types";

const blockRegistry = {
  coverHero: CoverHeroBlock,
  guideIntro: GuideIntroBlock,
  tripOverview: TripOverviewBlock,
  travelPreparation: TravelPreparationBlock,
  videoFeature: VideoFeatureBlock,
  dailyRoute: DailyRouteBlock,
  dayMedia: DayMediaBlock,
  callout: CalloutBlock,
  dailySchedule: DailyScheduleBlock,
  recommendedStops: RecommendedStopsBlock,
  detailsNote: DetailsNoteBlock,
  sourceList: SourceListBlock,
  guideFooter: GuideFooterBlock
} satisfies Record<Block["type"], BlockComponent<any>>;

export function BlockRenderer({ block, entities, tripMeta, scope, onOpenEntity }: BlockProps) {
  const Component = blockRegistry[block.type] as BlockComponent<any> | undefined;

  if (!Component) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--paper)] p-4 text-sm text-[var(--accent)]">
        Unknown block: {block.type}
      </div>
    );
  }

  return <Component block={block as never} entities={entities} tripMeta={tripMeta} scope={scope} onOpenEntity={onOpenEntity} />;
}
