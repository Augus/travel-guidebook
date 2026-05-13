import {
  Outlet,
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  useLoaderData
} from "@tanstack/react-router";
import { CatalogPage } from "./templates/CatalogPage";
import { TravelGuidePage } from "./templates/TravelGuidePage";
import { loadCatalog, loadTrip } from "./data/loaders";

const rootRoute = createRootRoute({
  component: () => <Outlet />
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  loader: () => loadCatalog(),
  component: function CatalogRoute() {
    const catalog = useLoaderData({ from: "/" });
    return <CatalogPage catalog={catalog} />;
  }
});

const tripRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/trip/$tripId",
  loader: async ({ params }) => {
    const catalog = await loadCatalog();
    return loadTrip(catalog, params.tripId);
  },
  component: function TripRoute() {
    const { trip } = useLoaderData({ from: "/trip/$tripId" });
    return <TravelGuidePage trip={trip} />;
  }
});

const routeTree = rootRoute.addChildren([indexRoute, tripRoute]);

export const router = createRouter({
  routeTree,
  history: createHashHistory()
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}
