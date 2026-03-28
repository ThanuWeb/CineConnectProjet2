import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api";

const fetchUsers = async () => {
  return apiFetch("/users");
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 10,
  });
};
