import { createFileRoute, redirect } from "@tanstack/react-router";
import Discussion from "../pages/Discussion";
import { getToken } from "../api";

export const Route = createFileRoute("/discussion")({
  beforeLoad: () => {
    if (!getToken()) {
      throw redirect({ to: "/login" });
    }
  },
  validateSearch: (search) => ({
    userId: search.userId ?? "",
  }),
  component: Discussion,
});
