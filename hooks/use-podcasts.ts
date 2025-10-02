import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  searchPodcasts,
  getPodcast,
  getPodcastEpisodes,
  getEpisode,
  getSavedShows,
  saveShow,
  removeShow,
  checkSavedShows,
} from "@/lib/spotify"

export function useSearchPodcasts(query: string) {
  return useQuery({
    queryKey: ["podcasts", "search", query],
    queryFn: () => searchPodcasts(query),
    enabled: query.length > 0,
  })
}

export function usePodcast(id: string) {
  return useQuery({
    queryKey: ["podcast", id],
    queryFn: () => getPodcast(id),
    enabled: !!id,
  })
}

export function usePodcastEpisodes(id: string, offset = 0) {
  return useQuery({
    queryKey: ["podcast", id, "episodes", offset],
    queryFn: () => getPodcastEpisodes(id, offset),
    enabled: !!id,
  })
}

export function useEpisode(id: string) {
  return useQuery({
    queryKey: ["episode", id],
    queryFn: () => getEpisode(id),
    enabled: !!id,
  })
}

export function useSavedShows() {
  return useQuery({
    queryKey: ["saved-shows"],
    queryFn: getSavedShows,
  })
}

export function useSaveShow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveShow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-shows"] })
    },
  })
}

export function useRemoveShow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: removeShow,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-shows"] })
    },
  })
}

export function useCheckSavedShows(ids: string[]) {
  return useQuery({
    queryKey: ["saved-shows", "check", ids],
    queryFn: () => checkSavedShows(ids),
    enabled: ids.length > 0,
  })
}
