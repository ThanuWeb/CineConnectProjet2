import { createFileRoute } from "@tanstack/react-router";
import Film from "../pages/Film";
export const Route = createFileRoute("/film")({
  validateSearch: (search) => ({
    q: search.q ?? "",
  }),
  component: Film,
});
