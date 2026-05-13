import { z } from "zod";
import { ImageSchema, TableSchema, VideoSchema } from "./common";

const RouteSegmentSchema = z.object({
  mode: z.string(),
  duration: z.string(),
  note: z.string().optional()
});

const CoverHeroBlockSchema = z.object({
  type: z.literal("coverHero"),
  data: z.object({
    eyebrow: z.string().optional(),
    title: z.union([z.string(), z.array(z.string())]),
    lead: z.string().optional(),
    image: z.string().optional(),
    meta: z.array(z.string()).default([])
  })
});

const GuideIntroBlockSchema = z.object({
  type: z.literal("guideIntro"),
  data: z.object({
    kicker: z.string().optional(),
    title: z.string(),
    body: z.string().optional(),
    mapLabel: z.string().optional(),
    video: VideoSchema.optional(),
    maps: z.array(ImageSchema).default([])
  })
});

const TripOverviewBlockSchema = z.object({
  type: z.literal("tripOverview"),
  data: z.object({
    kicker: z.string().optional(),
    title: z.string(),
    note: z.string().optional(),
    tableTitle: z.string().optional(),
    table: TableSchema.optional(),
    cards: z
      .array(
        z.object({
          number: z.string().optional(),
          title: z.string(),
          paragraphs: z.array(z.string()).default([]),
          route: z.array(z.string()).default([]),
          stopTypes: z.array(z.string()).default([]),
          segments: z.array(RouteSegmentSchema).default([])
        })
      )
      .default([])
  })
});

const TravelPreparationBlockSchema = z.object({
  type: z.literal("travelPreparation"),
  data: z.object({
    kicker: z.string().optional(),
    title: z.string(),
    note: z.string().optional(),
    cards: z
      .array(
        z.object({
          number: z.string().optional(),
          title: z.string(),
          paragraphs: z.array(z.string()).default([]),
          route: z.array(z.string()).default([]),
          stopTypes: z.array(z.string()).default([]),
          segments: z.array(RouteSegmentSchema).default([])
        })
      )
      .default([]),
    checklistTitle: z.string().optional(),
    checklist: TableSchema.optional()
  })
});

const VideoFeatureBlockSchema = z.object({
  type: z.literal("videoFeature"),
  data: z.object({
    kicker: z.string().optional(),
    title: z.string(),
    note: z.string().optional(),
    video: VideoSchema
  })
});

const DailyRouteBlockSchema = z.object({
  type: z.literal("dailyRoute"),
  data: z.object({
    stops: z.array(z.string()).default([]),
    stopTypes: z.array(z.string()).default([]),
    segments: z.array(RouteSegmentSchema).default([])
  })
});

const DayMediaBlockSchema = z.object({
  type: z.literal("dayMedia"),
  data: z.object({
    image: ImageSchema.optional(),
    mapEmbed: z.string().optional(),
    mapLabel: z.string().optional()
  })
});

const CalloutBlockSchema = z.object({
  type: z.literal("callout"),
  data: z.object({
    label: z.string().optional(),
    text: z.string()
  })
});

const DailyScheduleBlockSchema = z.object({
  type: z.literal("dailySchedule"),
  data: z.object({
    title: z.string().optional(),
    table: TableSchema
  })
});

const RecommendedStopsBlockSchema = z.object({
  type: z.literal("recommendedStops"),
  data: z.object({
    interaction: z.enum(["dialog", "none"]).default("dialog"),
    segments: z.array(RouteSegmentSchema).default([]),
    items: z
      .array(
        z.object({
          entityId: z.string(),
          title: z.string().optional(),
          description: z.string().optional(),
          image: ImageSchema.optional(),
          meta: z.array(z.string()).default([])
        })
      )
      .default([])
  })
});

const DetailsNoteBlockSchema = z.object({
  type: z.literal("detailsNote"),
  data: z.object({
    summary: z.string(),
    body: z.string()
  })
});

const SourceListBlockSchema = z.object({
  type: z.literal("sourceList"),
  data: z.object({
    kicker: z.string().optional(),
    title: z.string(),
    note: z.string().optional(),
    links: z
      .array(
        z.object({
          text: z.string(),
          url: z.string()
        })
      )
      .default([])
  })
});

const GuideFooterBlockSchema = z.object({
  type: z.literal("guideFooter"),
  data: z.object({
    text: z.string()
  })
});

export const BlockSchema = z.discriminatedUnion("type", [
  CoverHeroBlockSchema,
  GuideIntroBlockSchema,
  TripOverviewBlockSchema,
  TravelPreparationBlockSchema,
  VideoFeatureBlockSchema,
  DailyRouteBlockSchema,
  DayMediaBlockSchema,
  CalloutBlockSchema,
  DailyScheduleBlockSchema,
  RecommendedStopsBlockSchema,
  DetailsNoteBlockSchema,
  SourceListBlockSchema,
  GuideFooterBlockSchema
]);

export type Block = z.infer<typeof BlockSchema>;
