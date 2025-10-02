"use client"

import { View, ScrollView, Image, ActivityIndicator, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { Container } from "@/components/ui/container"
import { Text } from "@/components/ui/text"
import { useQuery } from "@tanstack/react-query"
import { spotifyApi } from "@/lib/spotify"
import { TrendingUp, Clock, Sparkles } from "lucide-react-native"
import { HapticPressable } from "@/components/ui/pressable"
import Animated, { FadeInUp } from "react-native-reanimated"

export default function HomeScreen() {
  const router = useRouter()

  const { data: featured, isLoading: featuredLoading } = useQuery({
    queryKey: ["featured-podcasts"],
    queryFn: async () => {
      const response = await spotifyApi.get("/shows", {
        params: {
          ids: "5CnDmMUG0S5bSSw612fs8C,4rOoJ6Egrf8K2IrywzwOMk,2MAi0BvDc6GTFvKFPXnkCL",
        },
      })
      return response.data.shows
    },
  })

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending-podcasts"],
    queryFn: async () => {
      const response = await spotifyApi.get("/search", {
        params: {
          q: "podcast",
          type: "show",
          limit: 10,
        },
      })
      return response.data.shows.items
    },
  })

  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: ["recent-podcasts"],
    queryFn: async () => {
      const response = await spotifyApi.get("/search", {
        params: {
          q: "technology",
          type: "show",
          limit: 10,
        },
      })
      return response.data.shows.items
    },
  })

  const renderPodcastCard = (podcast: any, size: "large" | "small" = "small", index?: number) => (
    <Animated.View
      key={podcast.id}
      entering={FadeInUp.delay((index ?? 0) * 50)}
      style={size === "large" ? styles.cardLarge : styles.cardSmall}
    >
      <HapticPressable
        onPress={() => router.push(`/podcast/${podcast.id}`)}
        haptic="selection"
      >
        <Image
          source={{ uri: podcast.images[0]?.url }}
          style={size === "large" ? styles.imageLarge : styles.imageSmall}
        />
        <Text weight="semibold" size="sm" numberOfLines={2}>
          {podcast.name}
        </Text>
        <Text size="xs" variant="muted" style={styles.publisher} numberOfLines={1}>
          {podcast.publisher}
        </Text>
      </HapticPressable>
    </Animated.View>
  )

  return (
    <Container style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text size="3xl" weight="bold">Discover</Text>
          <Text variant="muted" style={styles.subtitle}>Explore podcasts you&apos;ll love</Text>
        </View>

        {/* Featured Section */}
        <Animated.View entering={FadeInUp} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Sparkles size={20} color="rgb(34, 197, 94)" />
            <Text size="xl" weight="bold" style={styles.sectionTitle}>Featured</Text>
          </View>
          {featuredLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="rgb(34, 197, 94)" />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {featured?.map((podcast: any, i: number) => renderPodcastCard(podcast, "large", i))}
            </ScrollView>
          )}
        </Animated.View>

        {/* Trending Section */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color="rgb(34, 197, 94)" />
            <Text size="xl" weight="bold" style={styles.sectionTitle}>Trending Now</Text>
          </View>
          {trendingLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="rgb(34, 197, 94)" />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {trending?.map((podcast: any, i: number) => renderPodcastCard(podcast, "small", i))}
            </ScrollView>
          )}
        </Animated.View>

        {/* Recent Section */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="rgb(34, 197, 94)" />
            <Text size="xl" weight="bold" style={styles.sectionTitle}>Recently Added</Text>
          </View>
          {recentLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="rgb(34, 197, 94)" />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {recent?.map((podcast: any, i: number) => renderPodcastCard(podcast, "small", i))}
            </ScrollView>
          )}
        </Animated.View>
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  subtitle: {
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    marginLeft: 8,
  },
  loadingContainer: {
    paddingHorizontal: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  cardLarge: {
    marginRight: 16,
    width: 192,
  },
  cardSmall: {
    marginRight: 16,
    width: 144,
  },
  imageLarge: {
    width: 192,
    height: 192,
    borderRadius: 8,
    marginBottom: 8,
  },
  imageSmall: {
    width: 144,
    height: 144,
    borderRadius: 8,
    marginBottom: 8,
  },
  publisher: {
    marginTop: 4,
  },
})
