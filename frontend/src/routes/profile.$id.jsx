import { createFileRoute, redirect } from "@tanstack/react-router";
import Profile from "../pages/Profile";
import { getToken } from "../api";

export const Route = createFileRoute("/profile/$id")({
  beforeLoad: () => {
    if (!getToken()) {
      throw redirect({ to: "/login" });
    }
  },
  component: Profile,
});
