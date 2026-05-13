import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo } from "react";
import { BlockRenderer } from "../blocks/registry";
import { EntityDialog } from "../components/primitives/EntityDialog";
import { Button } from "../components/ui/button";
import type { Entity } from "../schema/entity";
import type { Block } from "../schema/blocks";
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

  const top = target.getBoundingClientRect().top + window.scrollY - 12;
  window.scrollTo({ top: Math.max(0, top), behavior: "auto" });
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

function scrollToEntityCard(scope?: string, entityId?: string, behavior: ScrollBehavior = "auto") {
  if (!scope || !entityId) {
    return;
  }

  const target = Array.from(document.querySelectorAll<HTMLElement>("[data-scope][data-entity-id]")).find(
    (element) => element.dataset.scope === scope && element.dataset.entityId === entityId
  );

  if (!target) {
    document.getElementById(scope)?.scrollIntoView({ block: "start", behavior });
    return;
  }

  const top = target.getBoundingClientRect().top + window.scrollY - 96;
  window.scrollTo({ top: Math.max(0, top), behavior });
}

function getEntityIdsFromBlocks(blocks: Block[]) {
  return blocks.flatMap((block) => {
    if (block.type !== "recommendedStops" || block.data.interaction !== "dialog") {
      return [];
    }

    return block.data.items.map((item) => item.entityId);
  });
}

function buildEntityScopes(trip: Trip) {
  const scopes = new Map<string, string[]>();

  trip.sections.forEach((section) => {
    section.blocks.forEach((block, index) => {
      const ids = getEntityIdsFromBlocks([block]);

      if (ids.length) {
        scopes.set(getBlockSessionId(section.id, block.type, index), ids);
      }
    });

    section.days?.forEach((day) => {
      const ids = getEntityIdsFromBlocks(day.blocks);

      if (ids.length) {
        scopes.set(day.id, ids);
      }
    });
  });

  return scopes;
}

type ModalState = {
  scope?: string;
  entity?: string;
};

type SetModalStateInput = ModalState & {
  replace?: boolean;
};

export function TravelGuidePage({
  trip,
  modalState,
  setModalState
}: {
  trip: Trip;
  modalState: ModalState;
  setModalState: (next: SetModalStateInput) => void;
}) {
  const entities = useMemo(() => new Map(trip.content.entities.map((entity) => [entity.id, entity])), [trip.content.entities]);
  const navigation = useMemo(() => buildNavigation(trip), [trip]);
  const entityScopes = useMemo(() => buildEntityScopes(trip), [trip]);
  const currentEntity = modalState.entity ? entities.get(modalState.entity) : undefined;
  const currentScopeIds = modalState.scope ? (entityScopes.get(modalState.scope) ?? []) : [];
  const currentIndex = modalState.entity ? currentScopeIds.indexOf(modalState.entity) : -1;
  const previousEntity = currentIndex > 0 ? entities.get(currentScopeIds[currentIndex - 1]) : undefined;
  const nextEntity = currentIndex >= 0 && currentIndex < currentScopeIds.length - 1 ? entities.get(currentScopeIds[currentIndex + 1]) : undefined;

  function openEntity(scope: string, entity: string) {
    setModalState({ scope, entity });
  }

  function closeEntityDialog() {
    setModalState({ scope: undefined, entity: undefined });
  }

  function moveEntity(direction: -1 | 1) {
    const nextId = currentScopeIds[currentIndex + direction];

    if (!nextId || !modalState.scope) {
      return;
    }

    setModalState({ scope: modalState.scope, entity: nextId, replace: true });
  }

  useEffect(() => {
    document.documentElement.lang = trip.meta.language;
    document.title = trip.meta.title;
    document.body.dataset.theme = trip.theme;

    return () => {
      delete document.body.dataset.theme;
    };
  }, [trip.meta.language, trip.meta.title, trip.theme]);

  useEffect(() => {
    if (!currentEntity) {
      return;
    }

    window.requestAnimationFrame(() => {
      scrollToEntityCard(modalState.scope, modalState.entity, "auto");
    });
  }, [currentEntity, modalState.entity, modalState.scope]);

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
          ?.blocks.map((block, index) => <BlockRenderer block={block} entities={entities} onOpenEntity={openEntity} key={`${block.type}-${index}`} />)}
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
                <BlockRenderer block={block} entities={entities} scope={getBlockSessionId(section.id, block.type, index)} onOpenEntity={openEntity} />
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
                    <BlockRenderer block={block} entities={entities} scope={day.id} onOpenEntity={openEntity} key={`${day.id}-${block.type}-${index}`} />
                  ))}
                </div>
              </article>
            )) ?? [])
          ])}
      </main>
      <EntityDialog
        entity={currentEntity}
        open={Boolean(currentEntity)}
        onOpenChange={(open) => {
          if (!open) {
            closeEntityDialog();
          }
        }}
        previousEntity={previousEntity}
        nextEntity={nextEntity}
        onPrevious={previousEntity ? () => moveEntity(-1) : undefined}
        onNext={nextEntity ? () => moveEntity(1) : undefined}
      />
    </div>
  );
}
