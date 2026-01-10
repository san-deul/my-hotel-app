// src/hooks/useFavorite.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchIsFavorite,
  toggleFavorite,
} from "../api/favorites";

export function useFavorite(roomNo) {
  const queryClient = useQueryClient();

  const favoriteQuery = useQuery({
    queryKey: ["favorite", roomNo],
    queryFn: () => fetchIsFavorite(roomNo),
  });

  const toggleMutation = useMutation({
    mutationFn: () =>
      toggleFavorite(roomNo, favoriteQuery.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["favorite", roomNo]);
      queryClient.invalidateQueries(["favoriteList"]);
    },
  });

  return {
    isFavorite: favoriteQuery.data,
    isLoading: favoriteQuery.isLoading,
    toggleFavorite: toggleMutation.mutate,
    isToggling: toggleMutation.isPending,
  };
}
