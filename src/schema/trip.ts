import { z } from "zod";
import { BlockSchema } from "./blocks";
import { EntitySchema } from "./entity";

export const DaySchema = z.object({
  id: z.string(),
  number: z.string(),
  navLabel: z.string().optional(),
  title: z.string(),
  tagline: z.string().optional(),
  blocks: z.array(BlockSchema).default([])
});

export const SectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  navLabel: z.string().optional(),
  blocks: z.array(BlockSchema).default([]),
  days: z.array(DaySchema).optional()
});

export const TripSchema = z.object({
  schemaVersion: z.literal(2),
  template: z.literal("travelGuide"),
  theme: z.string().default("guidebookWarm"),
  meta: z.object({
    id: z.string(),
    title: z.string(),
    language: z.string().default("zh-Hant"),
    printLabel: z.string().optional(),
    dateRange: z.string().optional(),
    departure: z.string().optional(),
    recommendedBase: z.string().optional(),
    pace: z.string().optional(),
    mustEat: z.array(z.string()).default([])
  }),
  content: z
    .object({
      entities: z.array(EntitySchema).default([])
    })
    .default({ entities: [] }),
  sections: z.array(SectionSchema)
});

export const CatalogSchema = z.object({
  schemaVersion: z.number().optional(),
  meta: z.object({
    title: z.string(),
    language: z.string().default("zh-Hant")
  }),
  hero: z
    .object({
      eyebrow: z.string().optional(),
      title: z.union([z.string(), z.array(z.string())]),
      lead: z.string().optional(),
      image: z.string().optional(),
      meta: z.array(z.string()).default([])
    })
    .optional(),
  catalog: z
    .object({
      kicker: z.string().optional(),
      title: z.string(),
      note: z.string().optional()
    })
    .optional(),
  trips: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        data: z.string(),
        image: z.string().optional(),
        imageAlt: z.string().optional(),
        days: z.number().optional(),
        nights: z.number().optional(),
        base: z.string().optional(),
        dateRange: z.string().optional(),
        updated: z.string().optional(),
        tags: z.array(z.string()).default([]),
        actionLabel: z.string().optional()
      })
    )
    .default([]),
  footer: z.string().optional()
});

export type Day = z.infer<typeof DaySchema>;
export type Section = z.infer<typeof SectionSchema>;
export type Trip = z.infer<typeof TripSchema>;
export type Catalog = z.infer<typeof CatalogSchema>;
