"use client"

import { View, Image, Dimensions } from "react-native"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/contexts/theme-context"
import { usePlayer } from "@/contexts/player-context"
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Heart, Share2, ChevronDown } from "lucide-react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { useEffect } from "react"
import Slider from "@react-native-community/slider"
import { HapticPressable } from "@/components/ui/pressable"

const { width } = Dimensions.get("window")

interface FullPlayerProps {
  onClose: () => void
}

export function FullPlayer({ onClose }: FullPlayerProps) {
  const { theme } = useTheme()
  const { currentEpisode, isPlaying, pauseEpisode, resumeEpisode, position, duration, seekTo } = usePlayer()
  const scale = useSharedValue(1)

  useEffect(() => {
    scale.value = withSpring(isPlaying ? 1.05 : 1)
  }, [isPlaying, scale])

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (!currentEpisode) return null

  return (
    <View className={`flex-1 ${theme === "dark" ? "bg-background" : "bg-background"} px-6 `}>
      {/* Header */}
      <View className="flex-row items-center justify-between mb-8">
        <HapticPressable onPress={onClose} haptic="selection">
          <ChevronDown size={28} color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"} />
        </HapticPressable>
        <Text className="text-sm font-medium">Now Playing</Text>
        <HapticPressable haptic="light">
          <Share2 size={24} color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"} />
        </HapticPressable>
      </View>

      {/* Album Art */}
      <View className="items-center mb-8">
        <Animated.View style={imageStyle}>
          <Image
            source={{ uri: currentEpisode.images[0]?.url }}
            style={{ width: width - 80, height: width - 80 }}
            className="rounded-2xl"
          />
        </Animated.View>
      </View>

      {/* Episode Info */}
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2" numberOfLines={2}>
          {currentEpisode.name}
        </Text>
        <Text className="text-base text-muted-foreground" numberOfLines={1}>
          {currentEpisode.show?.name}
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="mb-2">
        <Slider
          value={position}
          minimumValue={0}
          maximumValue={duration}
          onSlidingComplete={seekTo}
          minimumTrackTintColor="rgb(34, 197, 94)"
          maximumTrackTintColor={theme === "dark" ? "rgb(38, 38, 38)" : "rgb(229, 229, 229)"}
          thumbTintColor="rgb(34, 197, 94)"
        />
      </View>

      {/* Time Labels */}
      <View className="flex-row justify-between mb-8">
        <Text className="text-xs text-muted-foreground">{formatTime(position)}</Text>
        <Text className="text-xs text-muted-foreground">{formatTime(duration)}</Text>
      </View>

      {/* Controls */}
      <View className="flex-row items-center justify-between mb-8">
        <HapticPressable haptic="selection">
          <Shuffle size={24} color={theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"} />
        </HapticPressable>

        <HapticPressable haptic="light">
          <SkipBack size={32} color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"} />
        </HapticPressable>

        <HapticPressable
          onPress={isPlaying ? pauseEpisode : resumeEpisode}
          className="w-20 h-20 bg-primary rounded-full items-center justify-center"
          haptic="heavy"
        >
          {isPlaying ? (
            <Pause size={36} color="rgb(10, 10, 10)" fill="rgb(10, 10, 10)" />
          ) : (
            <Play size={36} color="rgb(10, 10, 10)" fill="rgb(10, 10, 10)" />
          )}
        </HapticPressable>

        <HapticPressable haptic="light">
          <SkipForward size={32} color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"} />
        </HapticPressable>

        <HapticPressable haptic="selection">
          <Repeat size={24} color={theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"} />
        </HapticPressable>
      </View>

      {/* Bottom Actions */}
      <View className="flex-row items-center justify-center">
        <HapticPressable className="w-12 h-12 items-center justify-center" haptic="light">
          <Heart size={24} color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"} />
        </HapticPressable>
      </View>
    </View>
  )
}
