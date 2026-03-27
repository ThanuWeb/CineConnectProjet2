import { createFileRoute } from "@tanstack/react-router";
import Films from "../pages/Films";
export const Route = createFileRoute("/films")({
  validateSearch: (search) => ({
    q: search.q ?? "",
  }),
  component: Films,
});
