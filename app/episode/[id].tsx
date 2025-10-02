"use client"

import { View, ScrollView, Image, ActivityIndicator } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Container } from "@/components/ui/container"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/contexts/theme-context"
import { useEpisode } from "@/hooks/use-podcasts"
import { ArrowLeft, Play, Pause, Heart, Share2, Clock } from "lucide-react-native"
import Animated, { FadeInUp } from "react-native-reanimated"
import { usePlayer } from "@/contexts/player-context"
import { HapticPressable } from "@/components/ui/pressable"

export default function EpisodeScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { theme } = useTheme()
  const { playEpisode, pauseEpisode, resumeEpisode, isPlaying, currentEpisode } = usePlayer()

  const { data: episode, isLoading } = useEpisode(id as string)

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
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  const handlePlayPause = () => {
    if (currentEpisode?.id === episode?.id && isPlaying) {
      pauseEpisode()
    } else if (currentEpisode?.id === episode?.id && !isPlaying) {
      resumeEpisode()
    } else {
      playEpisode(episode)
    }
  }

  if (isLoading) {
    return (
      <Container className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="rgb(34, 197, 94)" />
      </Container>
    )
  }

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-6">
          <HapticPressable onPress={() => router.back()} className="mb-6" haptic="selection">
            <ArrowLeft size={24} color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"} />
          </HapticPressable>

          <Animated.View entering={FadeInUp} className="items-center">
            <Image source={{ uri: episode?.images[0]?.url }} className="w-64 h-64 rounded-2xl mb-6" />

            <Text className="text-2xl font-bold text-center mb-2">{episode?.name}</Text>
            <Text className="text-muted-foreground text-center mb-1">{episode?.show?.name}</Text>

            <View className="flex-row items-center gap-2 mb-6">
              <Text className="text-sm text-muted-foreground">{formatDate(episode?.release_date)}</Text>
              <View className="w-1 h-1 rounded-full bg-muted-foreground" />
              <View className="flex-row items-center">
                <Clock size={14} color={theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"} />
                <Text className="text-sm text-muted-foreground ml-1">{formatDuration(episode?.duration_ms)}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <Animated.View entering={FadeInUp.delay(60)} className="flex-row gap-4 mb-6">
              <HapticPressable onPress={handlePlayPause} className="bg-primary px-8 py-3 rounded-full flex-row items-center" haptic="heavy">
                {currentEpisode?.id === episode?.id && isPlaying ? (
                  <Pause size={20} color="rgb(10, 10, 10)" fill="rgb(10, 10, 10)" />
                ) : (
                  <Play size={20} color="rgb(10, 10, 10)" fill="rgb(10, 10, 10)" />
                )}
                <Text className="text-primary-foreground font-semibold ml-2">
                  {currentEpisode?.id === episode?.id && isPlaying ? "Pause" : "Play"}
                </Text>
              </HapticPressable>

              <HapticPressable className={`${theme === "dark" ? "bg-card" : "bg-card"} w-12 h-12 rounded-full items-center justify-center border ${theme === "dark" ? "border-border" : "border-border"}`} haptic="light">
                <Heart size={20} color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"} />
              </HapticPressable>

              <HapticPressable className={`${theme === "dark" ? "bg-card" : "bg-card"} w-12 h-12 rounded-full items-center justify-center border ${theme === "dark" ? "border-border" : "border-border"}`} haptic="light">
                <Share2 size={20} color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"} />
              </HapticPressable>
            </Animated.View>

            {/* Description */}
            <View className="w-full">
              <Text className="text-lg font-semibold mb-3">About this episode</Text>
              <Text className="text-sm text-muted-foreground leading-relaxed">{episode?.description}</Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </Container>
  )
}
