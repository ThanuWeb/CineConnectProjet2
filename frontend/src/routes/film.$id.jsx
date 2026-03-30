import { createFileRoute, redirect } from "@tanstack/react-router";
import FilmDetail from "../pages/FilmDetail";
import { getToken } from "../api";

export const Route = createFileRoute("/film/$id")({
  beforeLoad: () => {
    if (!getToken()) {
      throw redirect({ to: "/login" });
    }
  },
  component: FilmDetail,
});
