"use client"

import { View, Image, StyleSheet } from "react-native"
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

  const cardBg = theme === "dark" ? '#1c1c1c' : '#ffffff'
  const borderColor = theme === "dark" ? '#262626' : '#e5e5e5'
  const mutedBg = theme === "dark" ? '#262626' : '#e5e5e5'

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={[styles.container, { backgroundColor: cardBg, borderTopColor: borderColor }]}
    >
      {/* Progress Bar */}
      <View style={[styles.progressBar, { backgroundColor: mutedBg }]}>
        <Animated.View style={[progressStyle, styles.progressFill]} />
      </View>

      <HapticPressable
        onPress={() => router.push(`/episode/${currentEpisode.id}`)}
        style={styles.content}
        haptic="selection"
      >
        <Image source={{ uri: currentEpisode.images[0]?.url }} style={styles.image} />

        <View style={styles.textContainer}>
          <Text weight="semibold" size="sm" numberOfLines={1}>
            {currentEpisode.name}
          </Text>
          <Text size="xs" variant="muted" numberOfLines={1}>
            {currentEpisode.show?.name}
          </Text>
        </View>

        <View style={styles.controls}>
          <HapticPressable
            onPress={isPlaying ? pauseEpisode : resumeEpisode}
            style={styles.controlButton}
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

          <HapticPressable onPress={stopEpisode} style={styles.controlButton} haptic="light">
            <X size={20} color={theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"} />
          </HapticPressable>
        </View>
      </HapticPressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 64,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
  progressBar: {
    height: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
