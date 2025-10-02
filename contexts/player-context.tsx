"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from "expo-audio"

interface Episode {
  id: string
  name: string
  description: string
  duration_ms: number
  audio_preview_url: string | null
  images: { url: string }[]
  show: {
    id: string
    name: string
    images: { url: string }[]
  }
}

interface PlayerContextType {
  currentEpisode: Episode | null
  isPlaying: boolean
  position: number
  duration: number
  playEpisode: (episode: Episode) => Promise<void>
  pauseEpisode: () => void
  resumeEpisode: () => void
  seekTo: (position: number) => void
  stopEpisode: () => void
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const [audioSource, setAudioSource] = useState<string | null>(null)
  const [shouldPlay, setShouldPlay] = useState(false)
  
  // Create player with current audio source
  const player = useAudioPlayer(audioSource ? { uri: audioSource } : null)
  const status = useAudioPlayerStatus(player)

  // Set audio mode on mount
  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
    })
  }, [])

  // Auto-play when source changes and shouldPlay is true
  useEffect(() => {
    if (audioSource && shouldPlay && status.isLoaded && !status.playing) {
      player.play()
    }
  }, [audioSource, shouldPlay, status.isLoaded, status.playing, player])

  // Handle playback completion
  useEffect(() => {
    if (status.didJustFinish) {
      player.pause()
      player.seekTo(0)
      setShouldPlay(false)
    }
  }, [status.didJustFinish, player])

  const playEpisode = async (episode: Episode) => {
    try {
      if (!episode.audio_preview_url) {
        console.error("No audio URL available")
        return
      }

      // If playing same episode, just resume
      if (currentEpisode?.id === episode.id && audioSource) {
        player.play()
        setShouldPlay(true)
      } else {
        // Load new episode
        setCurrentEpisode(episode)
        setAudioSource(episode.audio_preview_url)
        setShouldPlay(true)
      }
    } catch (error) {
      console.error("Error playing episode:", error)
    }
  }

  const pauseEpisode = () => {
    player.pause()
    setShouldPlay(false)
  }

  const resumeEpisode = () => {
    player.play()
    setShouldPlay(true)
  }

  const seekTo = (newPosition: number) => {
    // Convert milliseconds to seconds
    player.seekTo(newPosition / 1000)
  }

  const stopEpisode = () => {
    player.pause()
    player.seekTo(0)
    setCurrentEpisode(null)
    setAudioSource(null)
    setShouldPlay(false)
  }

  return (
    <PlayerContext.Provider
      value={{
        currentEpisode,
        isPlaying: status.playing,
        position: status.currentTime * 1000, // Convert seconds to milliseconds
        duration: status.duration * 1000, // Convert seconds to milliseconds
        playEpisode,
        pauseEpisode,
        resumeEpisode,
        seekTo,
        stopEpisode,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider")
  }
  return context
}