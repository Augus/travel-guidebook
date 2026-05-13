import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import type { Entity } from "../../schema/entity";
import { AddressLink } from "./AddressLink";
import { YouTubeEmbed } from "./YouTubeEmbed";

export function EntityDialog({
  entity,
  trigger
}: {
  entity: Entity;
  trigger: React.ReactNode;
}) {
  const detail = entity.detail;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        {entity.image ? (
          <div className="h-[260px] overflow-hidden rounded-t-[var(--radius-modal)] bg-[var(--soft)] md:h-[340px]">
            <img className="h-full w-full object-cover" src={entity.image.src} alt={entity.image.alt} />
          </div>
        ) : null}
        <div className="p-6 md:p-8">
          {detail?.kicker ? (
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{detail.kicker}</div>
          ) : null}
          <DialogTitle className="mt-2 text-[clamp(30px,4vw,52px)] font-bold leading-[1.08] tracking-normal">
            {entity.title}
          </DialogTitle>
          {entity.subtitle ? (
            <DialogDescription className="mt-2 text-lg text-[var(--muted)]">{entity.subtitle}</DialogDescription>
          ) : null}
          {entity.tags.length ? (
            <div className="my-5 flex flex-wrap gap-2">
              {entity.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          ) : null}
          {entity.address ? (
            <div className="mb-5">
              <AddressLink address={entity.address} />
            </div>
          ) : null}
          <div className="grid gap-6 md:grid-cols-[1fr_280px] md:items-start">
            <article>
              {detail?.videos?.length ? (
                <div className="mb-5 grid gap-4">
                  {detail.videos.map((video) => (
                    <YouTubeEmbed video={video} key={video.url} />
                  ))}
                </div>
              ) : null}
              {detail?.gallery?.length ? (
                <div className="mb-5 grid gap-3 md:grid-cols-2">
                  {detail.gallery.map((image, index) => (
                    <img
                      key={`${image.src}-${index}`}
                      className="h-[170px] w-full rounded-2xl border border-[var(--border)] object-cover"
                      src={image.src}
                      alt={image.alt}
                    />
                  ))}
                </div>
              ) : null}
              {(detail?.paragraphs?.length ? detail.paragraphs : entity.summary).map((paragraph, index) => (
                <p className="mb-4" key={index}>
                  {paragraph}
                </p>
              ))}
            </article>
            {detail?.side ? (
              <aside className="rounded-[var(--radius-soft)] border border-[var(--border)] bg-[var(--soft)] p-5 text-sm md:sticky md:top-16">
                <h4 className="mb-2 mt-0 text-base font-bold">{detail.side.title}</h4>
                <p>{detail.side.body}</p>
                {detail.side.points.length ? (
                  <>
                    <h4 className="mb-2 mt-5 text-base font-bold">{detail.side.pointsTitle}</h4>
                    <ul className="list-disc space-y-2 pl-5">
                      {detail.side.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </aside>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
