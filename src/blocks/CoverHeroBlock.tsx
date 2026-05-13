import type { BlockProps } from "./types";

type CoverHeroBlock = Extract<BlockProps["block"], { type: "coverHero" }>;

export function CoverHeroBlock({ block }: BlockProps<CoverHeroBlock>) {
  const title = Array.isArray(block.data.title) ? block.data.title : [block.data.title];

  return (
    <section
      className="relative flex min-h-[78vh] items-end overflow-hidden rounded-[var(--radius-hero)] bg-cover bg-center p-8 text-white shadow-[var(--shadow)] md:p-14"
      style={{
        backgroundImage: [
          "linear-gradient(90deg,rgba(18,22,20,.78),rgba(18,22,20,.35),rgba(18,22,20,.08))",
          block.data.image ? `url(${block.data.image})` : undefined
        ]
          .filter(Boolean)
          .join(",")
      }}
    >
      <div className="relative z-10 max-w-[820px]">
        {block.data.eyebrow ? (
          <div className="inline-flex rounded-full border border-white/35 bg-white/10 px-4 py-2 text-xs backdrop-blur">
            {block.data.eyebrow}
          </div>
        ) : null}
        <h1 className="my-5 text-[clamp(38px,6vw,82px)] font-bold leading-[1.02] tracking-normal">
          {title.map((line, index) => (
            <span key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </h1>
        {block.data.lead ? <p className="max-w-[760px] text-[clamp(17px,2vw,23px)] text-white/90">{block.data.lead}</p> : null}
        {block.data.meta.length ? (
          <div className="mt-7 flex flex-wrap gap-3">
            {block.data.meta.map((item) => (
              <span className="rounded-full border border-white/20 bg-white/15 px-3 py-2 text-sm" key={item}>
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
