"use client";

import {
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/contexts/theme-context";
import { usePodcast, usePodcastEpisodes } from "@/hooks/use-podcasts";
import { ArrowLeft, Play, Heart, Share2, Clock } from "lucide-react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { usePlayer } from "@/contexts/player-context";
import { HapticPressable } from "@/components/ui/pressable";

export default function PodcastScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { playEpisode } = usePlayer();

  const { data: podcast, isLoading: podcastLoading } = usePodcast(id as string);
  const { data: episodesData, isLoading: episodesLoading } = usePodcastEpisodes(
    id as string
  );

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const cardBg = theme === "dark" ? '#1c1c1c' : '#ffffff'
  const borderColor = theme === "dark" ? '#262626' : '#e5e5e5'
  const iconColor = theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"
  const mutedIconColor = theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"

  if (podcastLoading || episodesLoading) {
    return (
      <Container style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="rgb(34, 197, 94)" />
      </Container>
    );
  }

  return (
    <Container style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <HapticPressable onPress={() => router.back()} style={styles.backButton} haptic="selection">
            <ArrowLeft size={24} color={iconColor} />
          </HapticPressable>

          <Animated.View entering={FadeInUp} style={styles.podcastInfo}>
            <Image
              source={{
                uri:
                  podcast?.images[0]?.url ||
                  "https://via.placeholder.com/300x300/1f2937/ffffff?text=No+Image",
              }}
              style={styles.podcastImage}
              defaultSource={{
                uri: "https://via.placeholder.com/300x300/1f2937/ffffff?text=Loading...",
              }}
              onError={({ nativeEvent: { error } }) =>
                console.log("Error loading image:", error)
              }
            />

            <Text size="2xl" weight="bold" style={styles.podcastTitle} numberOfLines={3}>
              {podcast?.name}
            </Text>
            <Text variant="muted" style={styles.publisher}>
              {podcast?.publisher}
            </Text>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <HapticPressable
                onPress={() => {
                  const first = episodesData?.items?.[0]
                  if (first) playEpisode(first)
                }}
                style={styles.playButton}
                haptic="heavy"
              >
                <Play size={20} color="rgb(10, 10, 10)" fill="rgb(10, 10, 10)" />
                <Text variant="primary" weight="semibold" style={styles.playText}>Play</Text>
              </HapticPressable>

              <HapticPressable
                style={[styles.iconButton, { backgroundColor: cardBg, borderColor }]}
                haptic="light"
              >
                <Heart size={20} color={iconColor} />
              </HapticPressable>

              <HapticPressable
                style={[styles.iconButton, { backgroundColor: cardBg, borderColor }]}
                haptic="light"
              >
                <Share2 size={20} color={iconColor} />
              </HapticPressable>
            </View>

            {/* Description */}
            <Text size="sm" variant="muted" style={styles.description}>
              {podcast?.description}
            </Text>

            {/* Stats */}
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text size="2xl" weight="bold">
                  {podcast?.total_episodes}
                </Text>
                <Text size="xs" variant="muted">Episodes</Text>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Episodes List */}
        <View style={styles.episodesList}>
          <Text size="xl" weight="bold" style={styles.episodesTitle}>Episodes</Text>

          {episodesData?.items.map((episode: any, i: number) => (
            <Animated.View key={episode.id} entering={FadeInUp.delay(i * 40)}>
              <HapticPressable
                onPress={() => playEpisode(episode)}
                style={[styles.episodeCard, { backgroundColor: cardBg, borderColor }]}
                haptic="light"
              >
                <View style={styles.episodeContent}>
                  <Image
                    source={{
                      uri:
                        episode.images[0]?.url ||
                        "https://via.placeholder.com/300x300/1f2937/ffffff?text=No+Image",
                    }}
                    style={styles.episodeImage}
                    defaultSource={{
                      uri: "https://via.placeholder.com/300x300/1f2937/ffffff?text=Loading...",
                    }}
                  />
                  <View style={styles.episodeInfo}>
                    <Text weight="semibold" size="base" style={styles.episodeName} numberOfLines={2}>
                      {episode.name}
                    </Text>
                    <View style={styles.episodeMeta}>
                      <Text size="xs" variant="muted">
                        {formatDate(episode.release_date)}
                      </Text>
                      <View style={styles.dot} />
                      <View style={styles.duration}>
                        <Clock size={12} color={mutedIconColor} />
                        <Text size="xs" variant="muted" style={styles.durationText}>
                          {formatDuration(episode.duration_ms)}
                        </Text>
                      </View>
                    </View>
                    <Text size="xs" variant="muted" style={styles.episodeDescription} numberOfLines={2}>
                      {episode.description}
                    </Text>
                  </View>
                </View>
              </HapticPressable>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </Container>
  );
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
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    marginBottom: 24,
  },
  podcastInfo: {
    alignItems: 'center',
  },
  podcastImage: {
    width: 224,
    height: 224,
    borderRadius: 16,
    marginBottom: 24,
  },
  podcastTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  publisher: {
    textAlign: 'center',
    marginBottom: 16,
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
  description: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  stats: {
    flexDirection: 'row',
    gap: 24,
  },
  stat: {
    alignItems: 'center',
  },
  episodesList: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  episodesTitle: {
    marginBottom: 16,
  },
  episodeCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  episodeContent: {
    flexDirection: 'row',
  },
  episodeImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  episodeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  episodeName: {
    marginBottom: 4,
  },
  episodeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  episodeDescription: {
    marginTop: 8,
  },
})
