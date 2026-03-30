import { createFileRoute, redirect } from "@tanstack/react-router";
import Users from "../pages/Users";
import { getToken } from "../api";

export const Route = createFileRoute("/users")({
  beforeLoad: () => {
    if (!getToken()) {
      throw redirect({ to: "/login" });
    }
  },
  component: Users,
});
