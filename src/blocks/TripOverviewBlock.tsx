import { RouteTrail } from "../components/primitives/RouteTrail";
import { SectionHeader } from "../components/primitives/SectionHeader";
import { Card, CardContent } from "../components/ui/card";
import { TableView } from "../components/ui/table";
import type { BlockProps } from "./types";

type TripOverviewBlockType = Extract<BlockProps["block"], { type: "tripOverview" }>;

export function TripOverviewBlock({ block }: BlockProps<TripOverviewBlockType>) {
  return (
    <section>
      <SectionHeader kicker={block.data.kicker} title={block.data.title} note={block.data.note} />
      {block.data.table ? (
        <Card>
          <CardContent>
            {block.data.tableTitle ? <h3 className="mb-4 text-2xl font-bold">{block.data.tableTitle}</h3> : null}
            <TableView table={block.data.table} />
          </CardContent>
        </Card>
      ) : null}
      {block.data.cards.length ? (
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {block.data.cards.map((card) => (
            <Card key={card.title}>
              <CardContent className="p-5">
                {card.number ? <div className="text-5xl font-extrabold leading-none text-[var(--accent)]">{card.number}</div> : null}
                <h3 className="my-3 text-2xl font-bold leading-tight">{card.title}</h3>
                {card.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                <RouteTrail stops={card.route} stopTypes={card.stopTypes} segments={card.segments} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </section>
  );
}
