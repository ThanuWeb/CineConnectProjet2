import { createFileRoute } from "@tanstack/react-router";
import Singup from "../pages/Signup";

export const Route = createFileRoute("/signup")({
  component: Singup,
});
