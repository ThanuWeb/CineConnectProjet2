import {
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";

import Films from "./pages/Films";
import FilmDetail from "./pages/FilmDetail";
import Discussion from "./pages/Discussion";
import Users from "./pages/Users";

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

const discussionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/discussion",
  component: Discussion,
});

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/users",
  component: Users,
});

const routeTree = rootRoute.addChildren([
  filmsRoute,
  filmDetailRoute,
  discussionRoute,
  usersRoute,
]);

export const router = createRouter({
  routeTree,
});