import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => apiFetch("/categories"),
    staleTime: 1000 * 60 * 60,
  });
};
