"use client"

import { View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Container } from "@/components/ui/container"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/contexts/theme-context"
import { usePodcast, usePodcastEpisodes } from "@/hooks/use-podcasts"
import { ArrowLeft, Play, Heart, Share2, Clock } from "lucide-react-native"
import Animated, { FadeIn } from "react-native-reanimated"
import { usePlayer } from "@/contexts/player-context"

export default function PodcastScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { theme } = useTheme()
  const { playEpisode } = usePlayer()

  const { data: podcast, isLoading: podcastLoading } = usePodcast(id as string)
  const { data: episodesData, isLoading: episodesLoading } = usePodcastEpisodes(id as string)

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  if (podcastLoading || episodesLoading) {
    return (
      <Container className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="rgb(34, 197, 94)" />
      </Container>
    )
  }

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-12 pb-6">
          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <ArrowLeft size={24} color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"} />
          </TouchableOpacity>

          <Animated.View entering={FadeIn} className="items-center">
            <Image source={{ uri: podcast?.images[0]?.url }} className="w-56 h-56 rounded-2xl mb-6" />

            <Text className="text-2xl font-bold text-center mb-2">{podcast?.name}</Text>
            <Text className="text-muted-foreground text-center mb-4">{podcast?.publisher}</Text>

            {/* Action Buttons */}
            <View className="flex-row gap-4 mb-6">
              <TouchableOpacity className="bg-primary px-8 py-3 rounded-full flex-row items-center">
                <Play size={20} color="rgb(10, 10, 10)" fill="rgb(10, 10, 10)" />
                <Text className="text-primary-foreground font-semibold ml-2">Play</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`${theme === "dark" ? "bg-card" : "bg-card"} w-12 h-12 rounded-full items-center justify-center border ${theme === "dark" ? "border-border" : "border-border"}`}
              >
                <Heart size={20} color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"} />
              </TouchableOpacity>

              <TouchableOpacity
                className={`${theme === "dark" ? "bg-card" : "bg-card"} w-12 h-12 rounded-full items-center justify-center border ${theme === "dark" ? "border-border" : "border-border"}`}
              >
                <Share2 size={20} color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"} />
              </TouchableOpacity>
            </View>

            {/* Description */}
            <Text className="text-sm text-muted-foreground text-center leading-relaxed mb-6">
              {podcast?.description}
            </Text>

            {/* Stats */}
            <View className="flex-row gap-6">
              <View className="items-center">
                <Text className="text-2xl font-bold">{podcast?.total_episodes}</Text>
                <Text className="text-xs text-muted-foreground">Episodes</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Episodes List */}
        <View className="px-6 pb-6">
          <Text className="text-xl font-bold mb-4">Episodes</Text>

          {episodesData?.items.map((episode: any) => (
            <TouchableOpacity
              key={episode.id}
              onPress={() => playEpisode(episode)}
              className={`${theme === "dark" ? "bg-card" : "bg-card"} rounded-lg p-4 mb-3 border ${theme === "dark" ? "border-border" : "border-border"}`}
            >
              <View className="flex-row">
                <Image source={{ uri: episode.images[0]?.url }} className="w-16 h-16 rounded-lg" />
                <View className="flex-1 ml-3">
                  <Text className="font-semibold text-base mb-1" numberOfLines={2}>
                    {episode.name}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <Text className="text-xs text-muted-foreground">{formatDate(episode.release_date)}</Text>
                    <View className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <View className="flex-row items-center">
                      <Clock size={12} color={theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"} />
                      <Text className="text-xs text-muted-foreground ml-1">{formatDuration(episode.duration_ms)}</Text>
                    </View>
                  </View>
                  <Text className="text-xs text-muted-foreground mt-2" numberOfLines={2}>
                    {episode.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Container>
  )
}
