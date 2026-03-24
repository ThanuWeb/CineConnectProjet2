import { createFileRoute } from "@tanstack/react-router";
import Films from "../pages/Films";
export const Route = createFileRoute("/film")({
  component: Films,
});
