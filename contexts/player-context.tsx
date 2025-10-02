"use client"

import type React from "react"
import { createContext, useContext, useState, useRef } from "react"
import { Audio } from "expo-av"

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
  pauseEpisode: () => Promise<void>
  resumeEpisode: () => Promise<void>
  seekTo: (position: number) => Promise<void>
  stopEpisode: () => Promise<void>
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const soundRef = useRef<Audio.Sound | null>(null)

  const playEpisode = async (episode: Episode) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync()
      }

      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      })

      const { sound } = await Audio.Sound.createAsync(
        { uri: episode.audio_preview_url || "" },
        { shouldPlay: true },
        onPlaybackStatusUpdate,
      )

      soundRef.current = sound
      setCurrentEpisode(episode)
      setIsPlaying(true)
    } catch (error) {
      console.error("Error playing episode:", error)
    }
  }

  const pauseEpisode = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync()
      setIsPlaying(false)
    }
  }

  const resumeEpisode = async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync()
      setIsPlaying(true)
    }
  }

  const seekTo = async (newPosition: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(newPosition)
    }
  }

  const stopEpisode = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync()
      await soundRef.current.unloadAsync()
      soundRef.current = null
    }
    setCurrentEpisode(null)
    setIsPlaying(false)
    setPosition(0)
    setDuration(0)
  }

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis)
      setDuration(status.durationMillis || 0)
      setIsPlaying(status.isPlaying)

      if (status.didJustFinish) {
        setIsPlaying(false)
        setPosition(0)
      }
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        position,
        duration,
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
