import {
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";

import Films from "./pages/Films";
import FilmDetail from "./pages/FilmDetail";
import Discussion from "./pages/Discussion";

// IMPORTANT : root en premier
const rootRoute = createRootRoute();

// Routes
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

const discussionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/discussion",
  component: Discussion,
});

// Tree
const routeTree = rootRoute.addChildren([
  filmsRoute,
  filmDetailRoute,
  discussionRoute, // 👈 AJOUT ICI
]);

export const router = createRouter({
  routeTree,
});