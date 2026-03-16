import {
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";

import Films from "./pages/Films";
import FilmDetail from "./pages/FilmDetail";

const rootRoute = createRootRoute();

const filmsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Films,
});

const filmDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/film/$id",
  component: FilmDetail,
});

const routeTree = rootRoute.addChildren([
  filmsRoute,
  filmDetailRoute,
]);

export const router = createRouter({
  routeTree,
});