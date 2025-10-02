import axios from "axios"
import * as SecureStore from "expo-secure-store"

const SPOTIFY_CLIENT_ID = "27ac23c0a16d4260adbde54741f00acc"
const SPOTIFY_CLIENT_SECRET = "136a11f9cb294a4a8ce70a71bdcadfe2"
// const REDIRECT_URI = "exp://localhost:8081"

export const spotifyApi = axios.create({
  baseURL: "https://api.spotify.com/v1",
})

// Add token to requests
spotifyApi.interceptors.request.use(async (config) => {
  const token = await getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export async function getAccessToken(): Promise<string | null> {
  try {
    let token = await SecureStore.getItemAsync("spotify_access_token")
    const expiresAt = await SecureStore.getItemAsync("spotify_token_expires_at")

    if (token && expiresAt && Date.now() < Number.parseInt(expiresAt)) {
      return token
    }

    // Get new token using client credentials
    const response = await axios.post("https://accounts.spotify.com/api/token", "grant_type=client_credentials", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`,
      },
    })

    token = response.data.access_token
    const expiresIn = response.data.expires_in

    await SecureStore.setItemAsync("spotify_access_token", token || "")
    await SecureStore.setItemAsync("spotify_token_expires_at", (Date.now() + expiresIn * 1000).toString())

    return token
  } catch (error) {
    console.error("Error getting access token:", error)
    return null
  }
}

export async function searchPodcasts(query: string) {
  const response = await spotifyApi.get("/search", {
    params: {
      q: query,
      type: "show",
      limit: 20,
    },
  })
  return response.data.shows.items
}

export async function getPodcast(id: string) {
  const response = await spotifyApi.get(`/shows/${id}`)
  return response.data
}

export async function getPodcastEpisodes(id: string, offset = 0) {
  const response = await spotifyApi.get(`/shows/${id}/episodes`, {
    params: {
      limit: 50,
      offset,
    },
  })
  return response.data
}

export async function getEpisode(id: string) {
  const response = await spotifyApi.get(`/episodes/${id}`)
  return response.data
}

export async function getFeaturedPodcasts() {
  const response = await spotifyApi.get("/browse/categories/podcasts/playlists", {
    params: {
      limit: 20,
    },
  })
  return response.data
}

export async function getSavedShows() {
  const response = await spotifyApi.get("/me/shows")
  return response.data.items
}

export async function saveShow(id: string) {
  await spotifyApi.put("/me/shows", {
    ids: [id],
  })
}

export async function removeShow(id: string) {
  await spotifyApi.delete("/me/shows", {
    data: {
      ids: [id],
    },
  })
}

export async function checkSavedShows(ids: string[]) {
  const response = await spotifyApi.get("/me/shows/contains", {
    params: {
      ids: ids.join(","),
    },
  })
  return response.data
}
