import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo } from "react";
import { BlockRenderer } from "../blocks/registry";
import { Button } from "../components/ui/button";
import type { Trip } from "../schema/trip";

function buildNavigation(trip: Trip) {
  return trip.sections.flatMap((section) => {
    const hasSectionSession = section.id !== "days" || section.blocks.length > 0;
    const items = section.navLabel && hasSectionSession ? [{ href: `#${section.id}`, label: section.navLabel }] : [];

    if (section.days?.length) {
      items.push(
        ...section.days.map((day) => ({
          href: `#${day.id}`,
          label: day.navLabel ?? day.number
        }))
      );
    }

    return items;
  });
}

function scrollToSection(id: string) {
  const target = document.getElementById(id);

  if (!target) {
    return;
  }

  const start = window.scrollY;
  const end = target.getBoundingClientRect().top + window.scrollY - 12;
  const distance = end - start;
  const duration = 260;
  const startedAt = performance.now();

  function easeOutCubic(value: number) {
    return 1 - Math.pow(1 - value, 3);
  }

  function step(now: number) {
    const progress = Math.min((now - startedAt) / duration, 1);
    window.scrollTo(0, start + distance * easeOutCubic(progress));

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

function getBlockSessionId(sectionId: string, blockType: string, index: number) {
  if (sectionId === "overview" && blockType === "guideIntro") {
    return "welcome";
  }

  if (sectionId === "overview" && blockType === "tripOverview") {
    return "overview";
  }

  return index === 0 ? sectionId : `${sectionId}-${blockType}-${index + 1}`;
}

export function TravelGuidePage({ trip }: { trip: Trip }) {
  const entities = useMemo(() => new Map(trip.content.entities.map((entity) => [entity.id, entity])), [trip.content.entities]);
  const navigation = useMemo(() => buildNavigation(trip), [trip]);

  useEffect(() => {
    document.documentElement.lang = trip.meta.language;
    document.title = trip.meta.title;
    document.body.dataset.theme = trip.theme;

    return () => {
      delete document.body.dataset.theme;
    };
  }, [trip.meta.language, trip.meta.title, trip.theme]);

  return (
    <div data-theme={trip.theme} className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="mx-auto max-w-[1180px] p-5 md:p-7">
        <Button asChild variant="secondary" size="sm" className="mb-4 print:hidden">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            返回目錄
          </Link>
        </Button>
        {trip.sections
          .find((section) => section.id === "cover")
          ?.blocks.map((block, index) => <BlockRenderer block={block} entities={entities} key={`${block.type}-${index}`} />)}
      </header>

      {navigation.length ? (
        <nav className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--nav-bg)] backdrop-blur print:hidden">
          <div className="mx-auto flex max-w-[1180px] gap-2 overflow-auto px-5 py-3 md:px-7">
            {navigation.map((item) => (
              <a
                className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--foreground)]"
                href={item.href}
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection(item.href.slice(1));
                }}
                key={`${item.href}-${item.label}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      ) : null}

      <main className="mx-auto max-w-[1180px] px-5 pb-16 md:px-7">
        {trip.sections
          .filter((section) => section.id !== "cover")
          .flatMap((section) => [
            ...section.blocks.map((block, index) => (
              <section
                className="my-11 scroll-mt-20 rounded-[var(--radius-section)] border border-[var(--border)] bg-[var(--paper-muted)] p-5 shadow-[var(--shadow-soft)] md:p-8"
                id={getBlockSessionId(section.id, block.type, index)}
                key={`${section.id}-${block.type}-${index}`}
              >
                <BlockRenderer block={block} entities={entities} />
              </section>
            )),
            ...(section.days?.map((day) => (
              <article
                id={day.id}
                className="my-11 scroll-mt-20 rounded-[var(--radius-section)] border border-[var(--border)] bg-[var(--day-bg)] p-5 shadow-[var(--shadow)] md:p-8 print:break-inside-avoid"
                key={day.id}
              >
                <div className="mb-6 grid gap-2">
                  <span className="inline-flex w-max rounded-full bg-[var(--accent-2)] px-3 py-1.5 text-xs font-bold text-white">
                    {day.number}
                  </span>
                  <h2 className="text-[clamp(27px,3vw,46px)] font-bold leading-tight">{day.title}</h2>
                  {day.tagline ? <p className="text-lg text-[var(--muted)]">{day.tagline}</p> : null}
                </div>
                <div className="grid gap-5">
                  {day.blocks.map((block, index) => (
                    <BlockRenderer block={block} entities={entities} key={`${day.id}-${block.type}-${index}`} />
                  ))}
                </div>
              </article>
            )) ?? [])
          ])}
      </main>
    </div>
  );
}
