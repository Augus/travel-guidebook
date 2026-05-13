import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getGoogleMapsUrl(embedUrl?: string) {
  if (!embedUrl) {
    return "https://www.google.com/maps";
  }

  try {
    const url = new URL(embedUrl);
    url.searchParams.delete("output");
    return url.toString();
  } catch {
    return embedUrl.replace(/([?&])output=embed&?/, "$1").replace(/[?&]$/, "");
  }
}
