import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
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

  const top = target.getBoundingClientRect().top + window.scrollY - 86;
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

function getEntityCard(scope?: string, entityId?: string) {
  if (!scope || !entityId) {
    return null;
  }

  return Array.from(document.querySelectorAll<HTMLElement>("[data-scope][data-entity-id]")).find(
    (element) => element.dataset.scope === scope && element.dataset.entityId === entityId
  );
}

function isElementInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const topGuard = 88;
  const bottomGuard = 32;

  return rect.bottom > topGuard && rect.top < window.innerHeight - bottomGuard;
}

function scrollToEntityCard(scope?: string, entityId?: string, behavior: ScrollBehavior = "auto") {
  const target = getEntityCard(scope, entityId);

  if (!target) {
    const section = scope ? document.getElementById(scope) : null;

    if (section && !isElementInViewport(section)) {
      section.scrollIntoView({ block: "start", behavior });
    }

    return;
  }

  if (isElementInViewport(target)) {
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

function getCollapsedDaysStorageKey(tripId: string) {
  return `travelGuide:${tripId}:collapsedSessions`;
}

function readCollapsedDays(tripId: string) {
  if (typeof window === "undefined") {
    return new Set<string>();
  }

  try {
    const raw = window.localStorage.getItem(getCollapsedDaysStorageKey(tripId));
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : []);
  } catch {
    return new Set<string>();
  }
}

function getBlockTitle(block: Block, fallback: string) {
  if ("data" in block && typeof block.data === "object" && block.data && "title" in block.data && typeof block.data.title === "string") {
    return block.data.title;
  }

  return fallback;
}

function shouldToggleFromBackgroundClick(event: MouseEvent<HTMLElement>) {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.closest("button, a, input, textarea, select, iframe, details, summary, [data-entity-id]")) {
    return false;
  }

  const currentTarget = event.currentTarget;
  const directBackgroundClick = target === currentTarget;
  const headerClick = Boolean(target.closest("[data-session-toggle-zone]"));

  return directBackgroundClick || headerClick;
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
  const headerRef = useRef<HTMLElement>(null);
  const [showNavigation, setShowNavigation] = useState(false);
  const [collapsedSessions, setCollapsedSessions] = useState<Set<string>>(() => readCollapsedDays(trip.meta.id));
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

  function toggleSession(sessionId: string) {
    setCollapsedSessions((current) => {
      const next = new Set(current);

      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }

      window.localStorage.setItem(getCollapsedDaysStorageKey(trip.meta.id), JSON.stringify([...next]));
      return next;
    });
  }

  useEffect(() => {
    setCollapsedSessions(readCollapsedDays(trip.meta.id));
  }, [trip.meta.id]);

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

  useEffect(() => {
    function updateNavigationVisibility() {
      const headerHeight = headerRef.current?.offsetHeight ?? window.innerHeight * 0.72;
      setShowNavigation(window.scrollY > Math.max(120, headerHeight - 96));
    }

    updateNavigationVisibility();
    window.addEventListener("scroll", updateNavigationVisibility, { passive: true });
    window.addEventListener("resize", updateNavigationVisibility);

    return () => {
      window.removeEventListener("scroll", updateNavigationVisibility);
      window.removeEventListener("resize", updateNavigationVisibility);
    };
  }, []);

  return (
    <div data-theme={trip.theme} className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header ref={headerRef} className="mx-auto max-w-[1180px] p-5 md:p-7">
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
        <nav
          className={`fixed left-0 right-0 top-0 z-20 bg-[var(--nav-bg)] shadow-[0_10px_30px_rgba(55,43,26,0.08)] backdrop-blur transition duration-200 print:hidden ${
            showNavigation ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"
          }`}
        >
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
            ...section.blocks.map((block, index) => {
              const sessionId = getBlockSessionId(section.id, block.type, index);
              const isCollapsed = collapsedSessions.has(sessionId);
              const title = getBlockTitle(block, section.navLabel ?? section.type ?? "Section");

              return (
                <section
                  className="relative my-11 scroll-mt-20 rounded-[var(--radius-section)] border border-[var(--border)] bg-[var(--paper-muted)] p-5 shadow-[var(--shadow-soft)] md:p-8"
                  id={sessionId}
                  key={`${section.id}-${block.type}-${index}`}
                  onClick={(event) => {
                    if (shouldToggleFromBackgroundClick(event)) {
                      toggleSession(sessionId);
                    }
                  }}
                >
                  <Button
                    aria-expanded={!isCollapsed}
                    aria-controls={`${sessionId}-content`}
                    className="absolute right-5 top-5 z-10 md:right-8 md:top-8"
                    size="icon"
                    type="button"
                    variant="secondary"
                    onClick={() => toggleSession(sessionId)}
                  >
                    <ChevronDown className={`h-5 w-5 transition-transform ${isCollapsed ? "-rotate-90" : "rotate-0"}`} />
                    <span className="sr-only">{isCollapsed ? "展開" : "收起"} {title}</span>
                  </Button>
                  {isCollapsed ? (
                    <div className="pr-14" data-session-toggle-zone>
                        {section.navLabel ? <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{section.navLabel}</span> : null}
                        <h2 className="mt-1 text-2xl font-bold leading-tight md:text-3xl">{title}</h2>
                    </div>
                  ) : null}
                  {!isCollapsed ? (
                    <div id={`${sessionId}-content`}>
                      <BlockRenderer block={block} entities={entities} scope={sessionId} onOpenEntity={openEntity} />
                    </div>
                  ) : null}
                </section>
              );
            }),
            ...(section.days?.map((day) => {
              const isCollapsed = collapsedSessions.has(day.id);

              return (
              <article
                id={day.id}
                className="relative my-11 scroll-mt-20 rounded-[var(--radius-section)] border border-[var(--border)] bg-[var(--day-bg)] p-5 shadow-[var(--shadow)] md:p-8 print:break-inside-avoid"
                key={day.id}
                onClick={(event) => {
                  if (shouldToggleFromBackgroundClick(event)) {
                    toggleSession(day.id);
                  }
                }}
              >
                <Button
                  aria-expanded={!isCollapsed}
                  aria-controls={`${day.id}-content`}
                  className="absolute right-5 top-5 z-10 md:right-8 md:top-8"
                  size="icon"
                  type="button"
                  variant="secondary"
                  onClick={() => toggleSession(day.id)}
                >
                  <ChevronDown className={`h-5 w-5 transition-transform ${isCollapsed ? "-rotate-90" : "rotate-0"}`} />
                  <span className="sr-only">{isCollapsed ? "展開" : "收起"} {day.number}</span>
                </Button>
                <div className="mb-6 pr-14" data-session-toggle-zone>
                  <div className="grid gap-2">
                    <span className="inline-flex w-max rounded-full bg-[var(--accent-2)] px-3 py-1.5 text-xs font-bold text-white">
                      {day.number}
                    </span>
                    <h2 className="text-2xl font-bold leading-tight md:text-3xl">{day.title}</h2>
                    {day.tagline ? <p className="text-lg text-[var(--muted)]">{day.tagline}</p> : null}
                  </div>
                </div>
                {!isCollapsed ? (
                  <div className="grid gap-5" id={`${day.id}-content`}>
                    {day.blocks.map((block, index) => (
                      <BlockRenderer block={block} entities={entities} scope={day.id} onOpenEntity={openEntity} key={`${day.id}-${block.type}-${index}`} />
                    ))}
                  </div>
                ) : null}
              </article>
              );
            }) ?? [])
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
