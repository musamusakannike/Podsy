"use client"

import { View, Image } from "react-native"
import { useRouter } from "expo-router"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/contexts/theme-context"
import { usePlayer } from "@/contexts/player-context"
import { Play, Pause, X } from "lucide-react-native"
import Animated, {
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { useEffect } from "react"
import { HapticPressable } from "@/components/ui/pressable"

export function MiniPlayer() {
  const { theme } = useTheme()
  const { currentEpisode, isPlaying, pauseEpisode, resumeEpisode, stopEpisode, position, duration } = usePlayer()
  const router = useRouter()
  const progress = useSharedValue(0)

  useEffect(() => {
    if (duration > 0) {
      progress.value = withSpring(position / duration)
    }
  }, [position, duration, progress])

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }))

  if (!currentEpisode) return null

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      className={`absolute bottom-16 left-0 right-0 ${theme === "dark" ? "bg-card" : "bg-card"} border-t ${theme === "dark" ? "border-border" : "border-border"}`}
    >
      {/* Progress Bar */}
      <View className="h-1 bg-muted">
        <Animated.View style={progressStyle} className="h-full bg-primary" />
      </View>

      <HapticPressable
        onPress={() => router.push(`/episode/${currentEpisode.id}`)}
        className="flex-row items-center px-4 py-3"
        haptic="selection"
      >
        <Image source={{ uri: currentEpisode.images[0]?.url }} className="w-12 h-12 rounded-lg" />

        <View className="flex-1 ml-3">
          <Text className="font-semibold text-sm" numberOfLines={1}>
            {currentEpisode.name}
          </Text>
          <Text className="text-xs text-muted-foreground" numberOfLines={1}>
            {currentEpisode.show?.name}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          <HapticPressable
            onPress={isPlaying ? pauseEpisode : resumeEpisode}
            className="w-10 h-10 items-center justify-center"
            haptic="light"
          >
            {isPlaying ? (
              <Pause
                size={24}
                color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"}
                fill={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"}
              />
            ) : (
              <Play
                size={24}
                color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"}
                fill={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"}
              />
            )}
          </HapticPressable>

          <HapticPressable onPress={stopEpisode} className="w-10 h-10 items-center justify-center" haptic="light">
            <X size={20} color={theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"} />
          </HapticPressable>
        </View>
      </HapticPressable>
    </Animated.View>
  )
}
