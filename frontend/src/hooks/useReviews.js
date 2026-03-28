import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch, getToken } from "../api";
import { getRouterContext } from "@tanstack/react-router";

const fetchReviews = async (movieId) => {
  return apiFetch(`/movies/${movieId}/reviews`);
};

export const useReviews = (movieId) => {
  return useQuery({
    queryKey: ["reviews", movieId],
    queryFn: () => fetchReviews(movieId),
    enabled: !!movieId,
    staleTime: 1000 * 60 * 10,
  });
};

const postReview = async ({ movieId, review }) => {
  return apiFetch(`/movies/${movieId}/reviews`, {
    method: "POST",
    body: JSON.stringify(review),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    auth: true,
  });
};

export const useAddReview = (movieId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (review) => postReview({ movieId, review }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
    },
  });
};

const updateReview = async ({ reviewId, review }) => {
  return apiFetch(`/reviews/${reviewId}`, {
    method: "PATCH",
    body: JSON.stringify(review),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    auth: true,
  });
};

export const useUpdateReview = (movieId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, review }) => updateReview({ reviewId, review }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", movieId] });
    },
  });
};
