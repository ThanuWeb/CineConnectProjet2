import { createFileRoute } from "@tanstack/react-router";
import Discussion from "../pages/Discussion";

export const Route = createFileRoute("/discussion")({
  validateSearch: (search) => ({
    userId: search.userId ?? "",
  }),
  component: Discussion,
});
