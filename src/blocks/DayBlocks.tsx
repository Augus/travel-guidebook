import { Building2, CircleHelp, ExternalLink, Hotel, Landmark, MapPin, Trees, Train, Utensils } from "lucide-react";
import { AddressLink } from "../components/primitives/AddressLink";
import { EntityDialog } from "../components/primitives/EntityDialog";
import { RouteTrail } from "../components/primitives/RouteTrail";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { TableView } from "../components/ui/table";
import { getGoogleMapsUrl } from "../lib/utils";
import type { BlockProps } from "./types";

type DailyRouteBlockType = Extract<BlockProps["block"], { type: "dailyRoute" }>;
type DayMediaBlockType = Extract<BlockProps["block"], { type: "dayMedia" }>;
type CalloutBlockType = Extract<BlockProps["block"], { type: "callout" }>;
type DailyScheduleBlockType = Extract<BlockProps["block"], { type: "dailySchedule" }>;
type RecommendedStopsBlockType = Extract<BlockProps["block"], { type: "recommendedStops" }>;
type DetailsNoteBlockType = Extract<BlockProps["block"], { type: "detailsNote" }>;

const entityTypeMeta = {
  station: {
    label: "車站",
    Icon: Train,
    className: "border-[color:var(--type-station-border)] bg-[var(--type-station-bg)] text-[var(--type-station-fg)]"
  },
  place: {
    label: "景點",
    Icon: Landmark,
    className: "border-[color:var(--type-place-border)] bg-[var(--type-place-bg)] text-[var(--type-place-fg)]"
  },
  restaurant: {
    label: "餐廳",
    Icon: Utensils,
    className: "border-[color:var(--type-restaurant-border)] bg-[var(--type-restaurant-bg)] text-[var(--type-restaurant-fg)]"
  },
  food: {
    label: "餐飲",
    Icon: Utensils,
    className: "border-[color:var(--type-restaurant-border)] bg-[var(--type-restaurant-bg)] text-[var(--type-restaurant-fg)]"
  },
  hotel: {
    label: "飯店",
    Icon: Hotel,
    className: "border-[color:var(--type-hotel-border)] bg-[var(--type-hotel-bg)] text-[var(--type-hotel-fg)]"
  },
  lodging: {
    label: "住宿",
    Icon: Hotel,
    className: "border-[color:var(--type-hotel-border)] bg-[var(--type-hotel-bg)] text-[var(--type-hotel-fg)]"
  },
  nature: {
    label: "自然",
    Icon: Trees,
    className: "border-[color:var(--type-nature-border)] bg-[var(--type-nature-bg)] text-[var(--type-nature-fg)]"
  },
  commercial: {
    label: "商業",
    Icon: Building2,
    className: "border-[color:var(--type-commercial-border)] bg-[var(--type-commercial-bg)] text-[var(--type-commercial-fg)]"
  }
} as const;

function getEntityTypeMeta(type?: string) {
  if (!type) {
    return {
      label: "未分類",
      Icon: CircleHelp,
      className: "border-[var(--border)] bg-[var(--soft)] text-[var(--muted)]"
    };
  }

  return (
    entityTypeMeta[type as keyof typeof entityTypeMeta] ?? {
      label: type,
      Icon: MapPin,
      className: "border-[var(--border)] bg-[var(--soft)] text-[var(--muted)]"
    }
  );
}

export function DailyRouteBlock({ block }: BlockProps<DailyRouteBlockType>) {
  return <RouteTrail stops={block.data.stops} />;
}

export function DayMediaBlock({ block }: BlockProps<DayMediaBlockType>) {
  const mapUrl = getGoogleMapsUrl(block.data.mapEmbed);

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {block.data.image ? (
        <img
          className="h-[300px] w-full rounded-[var(--radius-card)] border border-[var(--border)] object-cover md:h-[420px]"
          src={block.data.image.src}
          alt={block.data.image.alt}
        />
      ) : null}
      {block.data.mapEmbed ? (
        <div className="relative min-h-[300px] overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--soft)] md:min-h-[420px]">
          <iframe
            className="h-full min-h-[300px] w-full md:min-h-[420px]"
            title={block.data.mapLabel ?? "行程地圖"}
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            src={block.data.mapEmbed}
          />
          <Button asChild size="sm" variant="secondary" className="absolute bottom-3 right-3">
            <a href={mapUrl} target="_blank" rel="noopener">
              <ExternalLink className="h-3.5 w-3.5" />
              在 Google Maps 開啟
            </a>
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function CalloutBlock({ block }: BlockProps<CalloutBlockType>) {
  return (
    <div className="rounded-2xl border-l-4 border-[var(--accent-2)] bg-[var(--callout)] p-5 text-[var(--callout-foreground)]">
      {block.data.label ? <b>{block.data.label}</b> : null}
      {block.data.text}
    </div>
  );
}

export function DailyScheduleBlock({ block }: BlockProps<DailyScheduleBlockType>) {
  return <TableView table={block.data.table} />;
}

export function RecommendedStopsBlock({ block, entities }: BlockProps<RecommendedStopsBlockType>) {
  return (
    <div className="grid gap-4">
      {block.data.items.map((item) => {
        const entity = entities.get(item.entityId);
        const title = item.title ?? entity?.title ?? item.entityId;
        const image = item.image ?? entity?.image;
        const summary = item.description ?? entity?.summary?.[0] ?? "";
        const typeMeta = getEntityTypeMeta(entity?.type);
        const TypeIcon = typeMeta.Icon;
        const card = (
          <Card className="cursor-pointer transition hover:border-[var(--accent-2)]" key={item.entityId}>
            <CardContent className="grid gap-4 md:grid-cols-[180px_1fr]">
              {image ? <img className="h-[210px] w-full rounded-2xl object-cover md:h-[140px]" src={image.src} alt={image.alt} /> : null}
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge className={typeMeta.className}>
                    <TypeIcon className="mr-1.5 h-3.5 w-3.5" />
                    {typeMeta.label}
                  </Badge>
                  {entity?.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
                <h3 className="mb-3 text-2xl font-bold leading-tight">{title}</h3>
                {summary ? <p>{summary}</p> : null}
                {entity?.address ? (
                  <div className="mt-3">
                    <AddressLink address={entity.address} compact />
                  </div>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.meta.map((meta) => (
                    <Badge key={meta}>{meta}</Badge>
                  ))}
                </div>
                {!entity ? <p className="mt-2 text-sm text-[var(--accent)]">Unknown entity: {item.entityId}</p> : null}
              </div>
            </CardContent>
          </Card>
        );

        if (block.data.interaction === "dialog" && entity) {
          return <EntityDialog entity={entity} trigger={card} key={item.entityId} />;
        }

        return card;
      })}
    </div>
  );
}

export function DetailsNoteBlock({ block }: BlockProps<DetailsNoteBlockType>) {
  return (
    <details className="rounded-2xl border border-[var(--border)] bg-[var(--paper-muted)] p-5">
      <summary className="cursor-pointer font-bold">{block.data.summary}</summary>
      <p className="mt-3">{block.data.body}</p>
    </details>
  );
}
