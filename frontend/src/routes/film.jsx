import { createFileRoute } from "@tanstack/react-router";
import Films from "../pages/Films";
export const Route = createFileRoute("/film")({
  validateSearch: (search) => ({
    q: search.q ?? "",
  }),
  component: Films,
});
