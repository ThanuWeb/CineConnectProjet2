import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";

const fetchUserById = async (id) => {
  return apiFetch(`/users/${id}`);
};

export const useUser = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};
