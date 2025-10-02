"use client"

import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { Container } from "@/components/ui/container"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/contexts/theme-context"
import { useQuery } from "@tanstack/react-query"
import { spotifyApi } from "@/lib/spotify"
import { TrendingUp, Clock, Sparkles } from "lucide-react-native"

export default function HomeScreen() {
  const router = useRouter()
  const { theme } = useTheme()

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

  const renderPodcastCard = (podcast: any, size: "large" | "small" = "small") => (
    <TouchableOpacity
      key={podcast.id}
      onPress={() => router.push(`/podcast/${podcast.id}`)}
      className={size === "large" ? "mr-4 w-48" : "mr-4 w-36"}
    >
      <Image
        source={{ uri: podcast.images[0]?.url }}
        className={`${size === "large" ? "w-48 h-48" : "w-36 h-36"} rounded-lg mb-2`}
      />
      <Text className="font-semibold text-sm" numberOfLines={2}>
        {podcast.name}
      </Text>
      <Text className="text-xs text-muted-foreground mt-1" numberOfLines={1}>
        {podcast.publisher}
      </Text>
    </TouchableOpacity>
  )

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-12 pb-6">
          <Text className="text-3xl font-bold">Discover</Text>
          <Text className="text-muted-foreground mt-1">Explore podcasts you'll love</Text>
        </View>

        {/* Featured Section */}
        <View className="mb-8">
          <View className="flex-row items-center px-6 mb-4">
            <Sparkles size={20} color="rgb(34, 197, 94)" />
            <Text className="text-xl font-bold ml-2">Featured</Text>
          </View>
          {featuredLoading ? (
            <View className="px-6">
              <ActivityIndicator size="large" color="rgb(34, 197, 94)" />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
              {featured?.map((podcast: any) => renderPodcastCard(podcast, "large"))}
            </ScrollView>
          )}
        </View>

        {/* Trending Section */}
        <View className="mb-8">
          <View className="flex-row items-center px-6 mb-4">
            <TrendingUp size={20} color="rgb(34, 197, 94)" />
            <Text className="text-xl font-bold ml-2">Trending Now</Text>
          </View>
          {trendingLoading ? (
            <View className="px-6">
              <ActivityIndicator size="large" color="rgb(34, 197, 94)" />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
              {trending?.map((podcast: any) => renderPodcastCard(podcast))}
            </ScrollView>
          )}
        </View>

        {/* Recent Section */}
        <View className="mb-8">
          <View className="flex-row items-center px-6 mb-4">
            <Clock size={20} color="rgb(34, 197, 94)" />
            <Text className="text-xl font-bold ml-2">Recently Added</Text>
          </View>
          {recentLoading ? (
            <View className="px-6">
              <ActivityIndicator size="large" color="rgb(34, 197, 94)" />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
              {recent?.map((podcast: any) => renderPodcastCard(podcast))}
            </ScrollView>
          )}
        </View>
      </ScrollView>
    </Container>
  )
}
