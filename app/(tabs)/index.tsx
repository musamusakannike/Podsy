"use client"

import { View, ScrollView, Image, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { Container } from "@/components/ui/container"
import { Text } from "@/components/ui/text"
import { useQuery } from "@tanstack/react-query"
import { spotifyApi } from "@/lib/spotify"
import { TrendingUp, Clock, Headphones, Star, Zap } from "lucide-react-native"
import { HapticPressable } from "@/components/ui/pressable"
import Animated, { FadeInUp, FadeInDown, FadeIn } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"

// Skeleton Components
const SkeletonCard = ({ size }: { size: "large" | "small" }) => (
  <Animated.View 
    entering={FadeIn}
    style={size === "large" ? styles.cardLarge : styles.cardSmall}
  >
    <View style={[
      size === "large" ? styles.imageLarge : styles.imageSmall,
      styles.skeleton
    ]} />
    <View style={[styles.skeletonText, { width: '80%', marginTop: 8 }]} />
    <View style={[styles.skeletonText, { width: '60%', marginTop: 4, height: 12 }]} />
  </Animated.View>
)

const SkeletonHero = () => (
  <Animated.View entering={FadeIn} style={styles.heroCard}>
    <View style={styles.skeleton} />
  </Animated.View>
)

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

  const { data: popular, isLoading: popularLoading } = useQuery({
    queryKey: ["popular-podcasts"],
    queryFn: async () => {
      const response = await spotifyApi.get("/search", {
        params: {
          q: "comedy",
          type: "show",
          limit: 10,
        },
      })
      return response.data.shows.items
    },
  })

  const { data: topPicks, isLoading: topPicksLoading } = useQuery({
    queryKey: ["top-picks"],
    queryFn: async () => {
      const response = await spotifyApi.get("/search", {
        params: {
          q: "interview",
          type: "show",
          limit: 10,
        },
      })
      return response.data.shows.items
    },
  })

  const renderHeroCard = (podcast: any) => (
    <Animated.View
      key={podcast.id}
      entering={FadeInDown.delay(100).springify()}
      style={styles.heroCard}
    >
      <HapticPressable
        onPress={() => router.push(`/podcast/${podcast.id}`)}
        haptic="selection"
      >
        <Image
          source={{ uri: podcast.images[0]?.url }}
          style={styles.heroImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.9)']}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Star size={14} color="#fff" fill="#fff" />
              <Text size="xs" weight="semibold" style={styles.heroBadgeText}>
                Editor&apos;s Pick
              </Text>
            </View>
            <Text weight="bold" size="2xl" numberOfLines={2} style={styles.heroTitle}>
              {podcast.name}
            </Text>
            <Text size="sm" variant="muted" numberOfLines={2} style={styles.heroPublisher}>
              {podcast.publisher}
            </Text>
          </View>
        </LinearGradient>
      </HapticPressable>
    </Animated.View>
  )

  const renderPodcastCard = (podcast: any, size: "large" | "small" = "small", index?: number) => (
    <Animated.View
      key={podcast.id}
      entering={FadeInUp.delay((index ?? 0) * 30).springify()}
      style={size === "large" ? styles.cardLarge : styles.cardSmall}
    >
      <HapticPressable
        onPress={() => router.push(`/podcast/${podcast.id}`)}
        haptic="selection"
      >
        <View style={styles.cardImageContainer}>
          <Image
            source={{ uri: podcast.images[0]?.url }}
            style={size === "large" ? styles.imageLarge : styles.imageSmall}
          />
        </View>
        <Text weight="semibold" size="sm" numberOfLines={2} style={styles.cardTitle}>
          {podcast.name}
        </Text>
        <Text size="xs" variant="muted" style={styles.publisher} numberOfLines={1}>
          {podcast.publisher}
        </Text>
      </HapticPressable>
    </Animated.View>
  )

  const renderCompactCard = (podcast: any, index: number) => (
    <Animated.View
      key={podcast.id}
      entering={FadeInUp.delay(index * 40).springify()}
    >
      <HapticPressable
        onPress={() => router.push(`/podcast/${podcast.id}`)}
        haptic="selection"
        style={styles.compactCard}
      >
        <Image
          source={{ uri: podcast.images[0]?.url }}
          style={styles.compactImage}
        />
        <View style={styles.compactContent}>
          <Text weight="semibold" size="sm" numberOfLines={2}>
            {podcast.name}
          </Text>
          <Text size="xs" variant="muted" numberOfLines={1} style={styles.compactPublisher}>
            {podcast.publisher}
          </Text>
        </View>
      </HapticPressable>
    </Animated.View>
  )

  return (
    <Container style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.springify()} style={styles.header}>
          <Text size="3xl" weight="bold">Discover</Text>
          <Text variant="muted" style={styles.subtitle}>
            Explore podcasts you&apos;ll love
          </Text>
        </Animated.View>

        {/* Hero Featured Section */}
        <View style={styles.heroSection}>
          {featuredLoading ? (
            <SkeletonHero />
          ) : (
            featured?.[0] && renderHeroCard(featured[0])
          )}
        </View>

        {/* Trending Section */}
        <Animated.View entering={FadeInUp.delay(150)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.iconBadge}>
              <TrendingUp size={18} color="rgb(34, 197, 94)" />
            </View>
            <Text size="xl" weight="bold" style={styles.sectionTitle}>
              Trending Now
            </Text>
          </View>
          {trendingLoading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {[...Array(5)].map((_, i) => (
                <SkeletonCard key={i} size="small" />
              ))}
            </ScrollView>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {trending?.map((podcast: any, i: number) => renderPodcastCard(podcast, "small", i))}
            </ScrollView>
          )}
        </Animated.View>

        {/* Top Picks Section */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBadge, styles.iconBadgeZap]}>
              <Zap size={18} color="rgb(251, 191, 36)" />
            </View>
            <Text size="xl" weight="bold" style={styles.sectionTitle}>
              Top Picks For You
            </Text>
          </View>
          {topPicksLoading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {[...Array(5)].map((_, i) => (
                <SkeletonCard key={i} size="large" />
              ))}
            </ScrollView>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {topPicks?.map((podcast: any, i: number) => renderPodcastCard(podcast, "large", i))}
            </ScrollView>
          )}
        </Animated.View>

        {/* Popular Section - Grid Layout */}
        <Animated.View entering={FadeInUp.delay(250)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBadge, styles.iconBadgeHeadphones]}>
              <Headphones size={18} color="rgb(168, 85, 247)" />
            </View>
            <Text size="xl" weight="bold" style={styles.sectionTitle}>
              Popular Right Now
            </Text>
          </View>
          {popularLoading ? (
            <View style={styles.compactList}>
              {[...Array(4)].map((_, i) => (
                <View key={i} style={styles.compactCard}>
                  <View style={[styles.compactImage, styles.skeleton]} />
                  <View style={styles.compactContent}>
                    <View style={[styles.skeletonText, { width: '80%' }]} />
                    <View style={[styles.skeletonText, { width: '60%', marginTop: 4, height: 12 }]} />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.compactList}>
              {popular?.slice(0, 6).map((podcast: any, i: number) => renderCompactCard(podcast, i))}
            </View>
          )}
        </Animated.View>

        {/* Recently Added Section */}
        <Animated.View entering={FadeInUp.delay(300)} style={[styles.section, styles.lastSection]}>
          <View style={styles.sectionHeader}>
            <View style={[styles.iconBadge, styles.iconBadgeClock]}>
              <Clock size={18} color="rgb(59, 130, 246)" />
            </View>
            <Text size="xl" weight="bold" style={styles.sectionTitle}>
              Recently Added
            </Text>
          </View>
          {recentLoading ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {[...Array(5)].map((_, i) => (
                <SkeletonCard key={i} size="small" />
              ))}
            </ScrollView>
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
    paddingBottom: 20,
    paddingTop: 8,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 16,
  },
  heroSection: {
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  heroCard: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroContent: {
    gap: 8,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  heroBadgeText: {
    color: '#fff',
  },
  heroTitle: {
    color: '#fff',
  },
  heroPublisher: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  section: {
    marginBottom: 32,
  },
  lastSection: {
    marginBottom: 48,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 10,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeZap: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
  },
  iconBadgeHeadphones: {
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
  },
  iconBadgeClock: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  sectionTitle: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  cardLarge: {
    marginRight: 16,
    width: 192,
  },
  cardSmall: {
    marginRight: 14,
    width: 144,
  },
  cardImageContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  imageLarge: {
    width: 192,
    height: 192,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#1a1a1a',
  },
  imageSmall: {
    width: 144,
    height: 144,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#1a1a1a',
  },
  cardTitle: {
    lineHeight: 18,
  },
  publisher: {
    marginTop: 4,
  },
  compactList: {
    paddingHorizontal: 24,
    gap: 12,
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    padding: 8,
  },
  compactImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
  },
  compactContent: {
    flex: 1,
    gap: 4,
  },
  compactPublisher: {
    marginTop: 2,
  },
  // Skeleton Styles
  skeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 8,
  },
  skeletonText: {
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 4,
  },
})