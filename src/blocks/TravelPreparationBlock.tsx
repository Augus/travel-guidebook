import { RouteTrail } from "../components/primitives/RouteTrail";
import { SectionHeader } from "../components/primitives/SectionHeader";
import { Card, CardContent } from "../components/ui/card";
import { TableView } from "../components/ui/table";
import type { BlockProps } from "./types";

type TravelPreparationBlockType = Extract<BlockProps["block"], { type: "travelPreparation" }>;

export function TravelPreparationBlock({ block }: BlockProps<TravelPreparationBlockType>) {
  return (
    <section>
      <SectionHeader kicker={block.data.kicker} title={block.data.title} note={block.data.note} />
      <div className="grid gap-5 md:grid-cols-3">
        {block.data.cards.map((card) => (
          <Card key={card.title}>
            <CardContent>
              {card.number ? <div className="text-5xl font-extrabold leading-none text-[var(--accent)]">{card.number}</div> : null}
              <h3 className="my-3 text-2xl font-bold leading-tight">{card.title}</h3>
              {card.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <RouteTrail stops={card.route} />
            </CardContent>
          </Card>
        ))}
      </div>
      {block.data.checklist ? (
        <Card className="mt-5">
          <CardContent>
            {block.data.checklistTitle ? <h3 className="mb-4 text-2xl font-bold">{block.data.checklistTitle}</h3> : null}
            <TableView table={block.data.checklist} />
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
