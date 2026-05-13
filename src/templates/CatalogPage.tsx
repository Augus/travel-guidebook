import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import type { Catalog } from "../schema/trip";

function formatTripMeta(trip: Catalog["trips"][number]) {
  return [
    trip.days ? `${trip.days} 天` : "",
    trip.nights ? `${trip.nights} 夜` : "",
    trip.base ? `基地：${trip.base}` : "",
    trip.updated ? `更新：${trip.updated}` : ""
  ].filter(Boolean);
}

export function CatalogPage({ catalog }: { catalog: Catalog }) {
  useEffect(() => {
    document.body.dataset.theme = "guidebookWarm";

    return () => {
      delete document.body.dataset.theme;
    };
  }, []);

  return (
    <div data-theme="guidebookWarm" className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <main className="mx-auto max-w-[1180px] px-5 py-8 md:px-7 md:py-12">
        <section id="trips">
          <div className="mb-5">
            <div className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">
              {catalog.catalog?.kicker ?? "Trips"}
            </div>
            <h2 className="text-[clamp(27px,3vw,46px)] font-bold leading-tight">{catalog.catalog?.title ?? "行程清單"}</h2>
          </div>
          <div className="grid gap-5">
            {catalog.trips.map((trip) => (
              <Link
                aria-label={trip.actionLabel ?? `打開${trip.title}`}
                className="group block rounded-[var(--radius-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                key={trip.id}
                to="/trip/$tripId"
                params={{ tripId: trip.id }}
                search={{ scope: undefined, entity: undefined }}
              >
                <Card className="overflow-hidden transition group-hover:border-[var(--accent-2)] group-hover:shadow-[var(--shadow)]">
                  <div className="grid lg:grid-cols-[minmax(320px,0.95fr)_1fr]">
                    {trip.image ? (
                      <img
                        className="h-[260px] w-full object-cover object-[center_62%] transition duration-300 group-hover:scale-[1.015] sm:h-[340px] lg:h-full lg:min-h-[360px]"
                        src={trip.image}
                        alt={trip.imageAlt ?? trip.title}
                      />
                    ) : null}
                    <CardContent className="grid content-start gap-3 p-6 sm:p-8">
                      {trip.dateRange ? <Badge className="bg-[var(--accent-2)] text-white">日期：{trip.dateRange}</Badge> : null}
                      <h3 className="text-2xl font-bold leading-tight">{trip.title}</h3>
                      {trip.subtitle ? <p className="font-bold text-[var(--accent-2)]">{trip.subtitle}</p> : null}
                      {trip.description ? <p>{trip.description}</p> : null}
                      <div className="flex flex-wrap gap-2">
                        {formatTripMeta(trip).map((item) => (
                          <Badge key={item}>{item}</Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {trip.tags.map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
