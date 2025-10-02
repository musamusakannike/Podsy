"use client"

import { View, Image, Dimensions, StyleSheet } from "react-native"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/contexts/theme-context"
import { usePlayer } from "@/contexts/player-context"
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Heart, Share2, ChevronDown } from "lucide-react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import { useEffect } from "react"
import Slider from "@react-native-community/slider"
import { HapticPressable } from "@/components/ui/pressable"
import { SafeAreaView } from "react-native-safe-area-context"

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

  const backgroundColor = theme === "dark" ? '#141414' : '#fafafa'
  const iconColor = theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"
  const mutedIconColor = theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <HapticPressable onPress={onClose} haptic="selection">
          <ChevronDown size={28} color={iconColor} />
        </HapticPressable>
        <Text size="sm" weight="semibold">Now Playing</Text>
        <HapticPressable haptic="light">
          <Share2 size={24} color={iconColor} />
        </HapticPressable>
      </View>

      {/* Album Art */}
      <View style={styles.albumArtContainer}>
        <Animated.View style={imageStyle}>
          <Image
            source={{ uri: currentEpisode.images[0]?.url }}
            style={[styles.albumArt, { width: width - 80, height: width - 80 }]}
          />
        </Animated.View>
      </View>

      {/* Episode Info */}
      <View style={styles.episodeInfo}>
        <Text size="2xl" weight="bold" style={styles.episodeTitle} numberOfLines={2}>
          {currentEpisode.name}
        </Text>
        <Text size="base" variant="muted" numberOfLines={1}>
          {currentEpisode.show?.name}
        </Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.sliderContainer}>
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
      <View style={styles.timeLabels}>
        <Text size="xs" variant="muted">{formatTime(position)}</Text>
        <Text size="xs" variant="muted">{formatTime(duration)}</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <HapticPressable haptic="selection">
          <Shuffle size={24} color={mutedIconColor} />
        </HapticPressable>

        <HapticPressable haptic="light">
          <SkipBack size={32} color={iconColor} />
        </HapticPressable>

        <HapticPressable
          onPress={isPlaying ? pauseEpisode : resumeEpisode}
          style={styles.playButton}
          haptic="heavy"
        >
          {isPlaying ? (
            <Pause size={36} color="rgb(10, 10, 10)" fill="rgb(10, 10, 10)" />
          ) : (
            <Play size={36} color="rgb(10, 10, 10)" fill="rgb(10, 10, 10)" />
          )}
        </HapticPressable>

        <HapticPressable haptic="light">
          <SkipForward size={32} color={iconColor} />
        </HapticPressable>

        <HapticPressable haptic="selection">
          <Repeat size={24} color={mutedIconColor} />
        </HapticPressable>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <HapticPressable style={styles.heartButton} haptic="light">
          <Heart size={24} color={iconColor} />
        </HapticPressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  albumArtContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  albumArt: {
    borderRadius: 16,
  },
  episodeInfo: {
    marginBottom: 24,
  },
  episodeTitle: {
    marginBottom: 8,
  },
  sliderContainer: {
    marginBottom: 8,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  playButton: {
    width: 80,
    height: 80,
    backgroundColor: '#22c55e',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
