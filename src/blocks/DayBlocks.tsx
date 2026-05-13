import { Building2, CircleHelp, ExternalLink, Hotel, Landmark, MapPin, Trees, Train, Utensils } from "lucide-react";
import { AddressLink } from "../components/primitives/AddressLink";
import { RouteSegmentConnector, RouteTrail } from "../components/primitives/RouteTrail";
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

const entityCardTypeClass = {
  station: "border-[color:var(--type-station-card-border)] bg-[var(--type-station-card-bg)] group-hover:border-[color:var(--type-station-border)]",
  place: "border-[color:var(--type-place-card-border)] bg-[var(--type-place-card-bg)] group-hover:border-[color:var(--type-place-border)]",
  restaurant:
    "border-[color:var(--type-restaurant-card-border)] bg-[var(--type-restaurant-card-bg)] group-hover:border-[color:var(--type-restaurant-border)]",
  food: "border-[color:var(--type-restaurant-card-border)] bg-[var(--type-restaurant-card-bg)] group-hover:border-[color:var(--type-restaurant-border)]",
  hotel: "border-[color:var(--type-hotel-card-border)] bg-[var(--type-hotel-card-bg)] group-hover:border-[color:var(--type-hotel-border)]",
  lodging: "border-[color:var(--type-hotel-card-border)] bg-[var(--type-hotel-card-bg)] group-hover:border-[color:var(--type-hotel-border)]",
  nature: "border-[color:var(--type-nature-card-border)] bg-[var(--type-nature-card-bg)] group-hover:border-[color:var(--type-nature-border)]",
  commercial: "border-[color:var(--type-commercial-card-border)] bg-[var(--type-commercial-card-bg)] group-hover:border-[color:var(--type-commercial-border)]"
} as const;

const entitySecondaryBadgeClass = {
  station: "border-[color:var(--type-station-badge-border)] bg-[var(--type-station-badge-bg)] text-[var(--type-station-fg)]",
  place: "border-[color:var(--type-place-badge-border)] bg-[var(--type-place-badge-bg)] text-[var(--type-place-fg)]",
  restaurant: "border-[color:var(--type-restaurant-badge-border)] bg-[var(--type-restaurant-badge-bg)] text-[var(--type-restaurant-fg)]",
  food: "border-[color:var(--type-restaurant-badge-border)] bg-[var(--type-restaurant-badge-bg)] text-[var(--type-restaurant-fg)]",
  hotel: "border-[color:var(--type-hotel-badge-border)] bg-[var(--type-hotel-badge-bg)] text-[var(--type-hotel-fg)]",
  lodging: "border-[color:var(--type-hotel-badge-border)] bg-[var(--type-hotel-badge-bg)] text-[var(--type-hotel-fg)]",
  nature: "border-[color:var(--type-nature-badge-border)] bg-[var(--type-nature-badge-bg)] text-[var(--type-nature-fg)]",
  commercial: "border-[color:var(--type-commercial-badge-border)] bg-[var(--type-commercial-badge-bg)] text-[var(--type-commercial-fg)]"
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

function getEntityCardTypeClass(type?: string) {
  return entityCardTypeClass[type as keyof typeof entityCardTypeClass] ?? "border-[var(--border)] bg-[var(--card)]";
}

function getEntitySecondaryBadgeClass(type?: string) {
  return entitySecondaryBadgeClass[type as keyof typeof entitySecondaryBadgeClass] ?? "border-[var(--border)] bg-[var(--soft)] text-[var(--muted)]";
}

export function DailyRouteBlock({ block }: BlockProps<DailyRouteBlockType>) {
  return <RouteTrail stops={block.data.stops} stopTypes={block.data.stopTypes} segments={block.data.segments} />;
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

export function RecommendedStopsBlock({ block, entities, scope, onOpenEntity }: BlockProps<RecommendedStopsBlockType>) {
  return (
    <div className="route-flow">
      {block.data.items.map((item, index) => {
        const entity = entities.get(item.entityId);
        const title = item.title ?? entity?.title ?? item.entityId;
        const image = item.image ?? entity?.image;
        const summary = item.description ?? entity?.summary?.[0] ?? "";
        const typeMeta = getEntityTypeMeta(entity?.type);
        const TypeIcon = typeMeta.Icon;
        const isInteractive = block.data.interaction === "dialog" && entity && scope && onOpenEntity;
        const cardTypeClass = getEntityCardTypeClass(entity?.type);
        const secondaryBadgeClass = getEntitySecondaryBadgeClass(entity?.type);
        const marker = (
          <span aria-hidden className={`route-flow-marker ${typeMeta.className}`}>
            <TypeIcon className="h-4 w-4" />
          </span>
        );
        const content = (
          <Card className={`h-full transition group-hover:shadow-[var(--shadow-soft)] ${cardTypeClass}`}>
            <CardContent className={image ? "grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]" : "grid gap-4"}>
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge className={typeMeta.className}>
                    <TypeIcon className="mr-1.5 h-3.5 w-3.5" />
                    {typeMeta.label}
                  </Badge>
                  {entity?.tags.slice(0, 2).map((tag) => (
                    <Badge className={secondaryBadgeClass} key={tag}>{tag}</Badge>
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
                    <Badge className={secondaryBadgeClass} key={meta}>{meta}</Badge>
                  ))}
                </div>
                {!entity ? <p className="mt-2 text-sm text-[var(--accent)]">Unknown entity: {item.entityId}</p> : null}
              </div>
              {image ? <img className="order-first h-[210px] w-full rounded-2xl object-cover md:order-none md:h-full md:min-h-[160px]" src={image.src} alt={image.alt} /> : null}
            </CardContent>
          </Card>
        );

        if (isInteractive) {
          return (
            <div className="route-flow-step" key={`${item.entityId}-${index}`}>
              {marker}
              <button
                className="group block w-full cursor-pointer rounded-[var(--radius-card)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                data-entity-id={item.entityId}
                data-scope={scope}
                type="button"
                onClick={() => onOpenEntity(scope, item.entityId)}
              >
                {content}
              </button>
              {index < block.data.items.length - 1 ? <RouteSegmentConnector segment={block.data.segments[index]} /> : null}
            </div>
          );
        }

        return (
          <div className="route-flow-step" key={`${item.entityId}-${index}`}>
            {marker}
            <div data-entity-id={item.entityId} data-scope={scope}>
              {content}
            </div>
            {index < block.data.items.length - 1 ? <RouteSegmentConnector segment={block.data.segments[index]} /> : null}
          </div>
        );
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
