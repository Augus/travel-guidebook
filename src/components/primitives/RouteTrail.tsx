import { Building2, Bus, Car, Clock3, Footprints, Hotel, Landmark, Luggage, Plane, Ship, Train, Trees, Utensils, Waves } from "lucide-react";

export type RouteSegment = {
  mode: string;
  duration: string;
  note?: string;
};

const routePillTypeClass = {
  station: "border-[color:var(--type-station-border)] bg-[var(--type-station-route-bg)] text-[var(--type-station-fg)]",
  transport: "border-[color:var(--type-station-border)] bg-[var(--type-station-route-bg)] text-[var(--type-station-fg)]",
  place: "border-[color:var(--type-place-border)] bg-[var(--type-place-route-bg)] text-[var(--type-place-fg)]",
  restaurant: "border-[color:var(--type-restaurant-border)] bg-[var(--type-restaurant-route-bg)] text-[var(--type-restaurant-fg)]",
  food: "border-[color:var(--type-restaurant-border)] bg-[var(--type-restaurant-route-bg)] text-[var(--type-restaurant-fg)]",
  hotel: "border-[color:var(--type-hotel-border)] bg-[var(--type-hotel-route-bg)] text-[var(--type-hotel-fg)]",
  lodging: "border-[color:var(--type-hotel-border)] bg-[var(--type-hotel-route-bg)] text-[var(--type-hotel-fg)]",
  nature: "border-[color:var(--type-nature-border)] bg-[var(--type-nature-route-bg)] text-[var(--type-nature-fg)]",
  commercial: "border-[color:var(--type-commercial-border)] bg-[var(--type-commercial-route-bg)] text-[var(--type-commercial-fg)]"
} as const;

function getRoutePillTypeClass(type?: string) {
  return routePillTypeClass[type as keyof typeof routePillTypeClass] ?? "border-[var(--route-pill-border)] bg-[var(--route-pill-bg)] text-[var(--route-pill-fg)]";
}

function getRoutePillIcon(type?: string) {
  if (type === "hotel" || type === "lodging") return Hotel;
  if (type === "restaurant" || type === "food") return Utensils;
  if (type === "place") return Landmark;
  if (type === "nature") return Trees;
  if (type === "commercial") return Building2;
  if (type === "transport" || type === "station") return Train;
  return Landmark;
}

function getSegmentIcon(mode: string) {
  if (mode.includes("餐") || mode.includes("用餐")) return Utensils;
  if (mode.includes("飛機") || mode.includes("機場")) return Plane;
  if (mode.includes("鐵") || mode.includes("JR") || mode.includes("地鐵") || mode.includes("西鐵")) return Train;
  if (mode.includes("巴士")) return Bus;
  if (mode.includes("計程車") || mode.includes("車")) return Car;
  if (mode.includes("步行") || mode.includes("散步")) return Footprints;
  if (mode.includes("船") || mode.includes("川下")) return Ship;
  if (mode.includes("水族館") || mode.includes("園區")) return Waves;
  if (mode.includes("行李") || mode.includes("寄放")) return Luggage;
  return Clock3;
}

export function RouteTrail({ stops, stopTypes = [] }: { stops: string[]; stopTypes?: string[]; segments?: RouteSegment[] }) {
  if (!stops.length) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-1.5 rounded-[var(--radius-soft)] border border-[var(--route-overview-border)] bg-[var(--route-overview-bg)] px-3 py-2.5">
      {stops.map((stop, index) => (
        <span className="contents" key={`${stop}-${index}`}>
          {index > 0 ? <b className="text-base font-semibold leading-none text-[var(--route-overview-arrow)]">→</b> : null}
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold ${getRoutePillTypeClass(stopTypes[index])}`}>
            {(() => {
              const Icon = getRoutePillIcon(stopTypes[index]);
              return <Icon className="h-3.5 w-3.5 shrink-0" />;
            })()}
            {stop}
          </span>
        </span>
      ))}
    </div>
  );
}

export function RouteSegmentConnector({ segment, fallbackLabel = "移動" }: { segment?: RouteSegment; fallbackLabel?: string }) {
  const Icon = segment ? getSegmentIcon(segment.mode) : Clock3;
  const label = segment ? `${segment.mode}｜${segment.duration}` : fallbackLabel;

  return (
    <div className="route-flow-connector" title={segment?.note}>
      <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--paper)] px-3 py-1.5 text-sm font-semibold leading-tight text-[var(--accent)] shadow-[var(--shadow-soft)]">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span className="text-center">{label}</span>
      </span>
    </div>
  );
}
