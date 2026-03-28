import { createFileRoute, redirect } from "@tanstack/react-router";
import Films from "../pages/Films";
import { getToken } from "../api";

export const Route = createFileRoute("/films")({
  beforeLoad: () => {
    if (!getToken()) {
      throw redirect({ to: "/login" });
    }
  },
  validateSearch: (search) => ({
    q: search.q ?? "",
  }),
  component: Films,
});
