import { MapPin } from "lucide-react";
import type { Address } from "../../schema/common";
import { cn } from "../../lib/utils";

function buildAddressQuery(address: Address) {
  if (address.lat !== undefined && address.lng !== undefined) {
    return `${address.lat},${address.lng}`;
  }

  return address.query || address.text;
}

export function getMapUrl(address: Address) {
  const query = buildAddressQuery(address);
  const encoded = encodeURIComponent(query);

  if (typeof navigator !== "undefined") {
    const ua = navigator.userAgent;

    if (/iPhone|iPad|iPod/i.test(ua)) {
      return `https://maps.apple.com/?q=${encoded}`;
    }

    if (/Android/i.test(ua)) {
      return `geo:0,0?q=${encoded}`;
    }
  }

  return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
}

export function AddressLink({
  address,
  compact = false,
  className
}: {
  address: Address;
  compact?: boolean;
  className?: string;
}) {
  return (
    <a
      className={cn(
        "inline-flex max-w-full items-start gap-2 rounded-2xl border border-[var(--border)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--accent-2)] underline-offset-4 hover:underline",
        compact && "border-0 bg-transparent px-0 py-0",
        className
      )}
      href={getMapUrl(address)}
      target="_blank"
      rel="noopener"
    >
      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="min-w-0">
        {address.label ? <span className="font-bold">{address.label}：</span> : null}
        {address.text}
      </span>
    </a>
  );
}
