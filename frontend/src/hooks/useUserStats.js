import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";

export const useUserStats = (userId) => {
  return useQuery({
    queryKey: ["userStats", userId],
    queryFn: async () => {
      return apiFetch(`/users/${userId}/stats`);
    },
    enabled: !!userId,
  });
};
