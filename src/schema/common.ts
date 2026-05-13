import { z } from "zod";

export const ImageSchema = z.object({
  src: z.string(),
  alt: z.string().default("")
});

export const TableSchema = z.object({
  headers: z.array(z.string()).default([]),
  rows: z.array(z.array(z.string())).default([])
});

export const RichSideSchema = z.object({
  title: z.string().default(""),
  body: z.string().default(""),
  pointsTitle: z.string().default(""),
  points: z.array(z.string()).default([])
});

export const VideoSchema = z.object({
  provider: z.literal("youtube").default("youtube"),
  url: z.string(),
  title: z.string(),
  caption: z.string().optional()
});

export const AddressSchema = z.object({
  label: z.string().optional(),
  text: z.string(),
  query: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional()
});

export type Image = z.infer<typeof ImageSchema>;
export type DataTable = z.infer<typeof TableSchema>;
export type Video = z.infer<typeof VideoSchema>;
export type Address = z.infer<typeof AddressSchema>;
