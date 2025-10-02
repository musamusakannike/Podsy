"use client"

import { View, ScrollView, Image, ActivityIndicator, StyleSheet } from "react-native"
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

  const cardBg = theme === "dark" ? '#1c1c1c' : '#ffffff'
  const borderColor = theme === "dark" ? '#262626' : '#e5e5e5'
  const iconColor = theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"
  const mutedIconColor = theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"

  if (isLoading) {
    return (
      <Container style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="rgb(34, 197, 94)" />
      </Container>
    )
  }

  return (
    <Container style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <HapticPressable onPress={() => router.back()} style={styles.backButton} haptic="selection">
            <ArrowLeft size={24} color={iconColor} />
          </HapticPressable>

          <Animated.View entering={FadeInUp} style={styles.episodeInfo}>
            <Image source={{ uri: episode?.images[0]?.url }} style={styles.episodeImage} />

            <Text size="2xl" weight="bold" style={styles.episodeTitle}>{episode?.name}</Text>
            <Text variant="muted" style={styles.showName}>{episode?.show?.name}</Text>

            <View style={styles.metadata}>
              <Text size="sm" variant="muted">{formatDate(episode?.release_date)}</Text>
              <View style={styles.dot} />
              <View style={styles.duration}>
                <Clock size={14} color={mutedIconColor} />
                <Text size="sm" variant="muted" style={styles.durationText}>{formatDuration(episode?.duration_ms)}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <Animated.View entering={FadeInUp.delay(60)} style={styles.actionButtons}>
              <HapticPressable onPress={handlePlayPause} style={styles.playButton} haptic="heavy">
                {currentEpisode?.id === episode?.id && isPlaying ? (
                  <Pause size={20} color="rgb(10, 10, 10)" fill="rgb(10, 10, 10)" />
                ) : (
                  <Play size={20} color="rgb(10, 10, 10)" fill="rgb(10, 10, 10)" />
                )}
                <Text variant="primary" weight="semibold" style={styles.playText}>
                  {currentEpisode?.id === episode?.id && isPlaying ? "Pause" : "Play"}
                </Text>
              </HapticPressable>

              <HapticPressable style={[styles.iconButton, { backgroundColor: cardBg, borderColor }]} haptic="light">
                <Heart size={20} color={iconColor} />
              </HapticPressable>

              <HapticPressable style={[styles.iconButton, { backgroundColor: cardBg, borderColor }]} haptic="light">
                <Share2 size={20} color={iconColor} />
              </HapticPressable>
            </Animated.View>

            {/* Description */}
            <View style={styles.descriptionSection}>
              <Text size="lg" weight="semibold" style={styles.descriptionTitle}>About this episode</Text>
              <Text size="sm" variant="muted" style={styles.description}>{episode?.description}</Text>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  episodeInfo: {
    alignItems: 'center',
  },
  episodeImage: {
    width: 256,
    height: 256,
    borderRadius: 16,
    marginBottom: 24,
  },
  episodeTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  showName: {
    textAlign: 'center',
    marginBottom: 4,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#a3a3a3',
  },
  duration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationText: {
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  playButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playText: {
    marginLeft: 8,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  descriptionSection: {
    width: '100%',
  },
  descriptionTitle: {
    marginBottom: 12,
  },
  description: {
    lineHeight: 20,
  },
})
