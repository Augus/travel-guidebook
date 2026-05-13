import { z } from "zod";
import { AddressSchema, ImageSchema, RichSideSchema, VideoSchema } from "./common";

export const EntitySchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  image: ImageSchema.optional(),
  address: AddressSchema.optional(),
  tags: z.array(z.string()).default([]),
  summary: z.array(z.string()).default([]),
  detail: z
    .object({
      kicker: z.string().optional(),
      videos: z.array(VideoSchema).default([]),
      gallery: z.array(ImageSchema).default([]),
      paragraphs: z.array(z.string()).default([]),
      side: RichSideSchema.optional()
    })
    .optional(),
  data: z.record(z.string(), z.unknown()).optional()
});

export type Entity = z.infer<typeof EntitySchema>;
