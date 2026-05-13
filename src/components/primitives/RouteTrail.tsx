export function RouteTrail({ stops }: { stops: string[] }) {
  if (!stops.length) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-[var(--radius-soft)] border border-[var(--border)] bg-[var(--soft)] p-4">
      {stops.map((stop, index) => (
        <span className="contents" key={`${stop}-${index}`}>
          {index > 0 ? <b className="text-lg text-[var(--accent)]">→</b> : null}
          <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--paper)] px-3 py-2 text-sm">
            {stop}
          </span>
        </span>
      ))}
    </div>
  );
}
