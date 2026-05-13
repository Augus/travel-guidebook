import { CatalogSchema, TripSchema, type Catalog, type Trip } from "../schema/trip";

const DEFAULT_CATALOG_PATH = "data/catalog.generated.json";

async function fetchJson(path: string) {
  const response = await fetch(path, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }

  return response.json();
}

export async function loadCatalog(path = DEFAULT_CATALOG_PATH): Promise<Catalog> {
  return CatalogSchema.parse(await fetchJson(path));
}

export async function loadTrip(catalog: Catalog, tripId: string): Promise<{ trip: Trip; selectedTrip: Catalog["trips"][number] }> {
  const selectedTrip = catalog.trips.find((trip) => trip.id === tripId);

  if (!selectedTrip) {
    throw new Error(`Trip id "${tripId}" is not defined in ${DEFAULT_CATALOG_PATH}.`);
  }

  return {
    trip: TripSchema.parse(await fetchJson(selectedTrip.data)),
    selectedTrip
  };
}
