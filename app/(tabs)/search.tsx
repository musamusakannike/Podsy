"use client"

import { View, ScrollView, TextInput, Image, ActivityIndicator } from "react-native"
import { useState } from "react"
import { useRouter } from "expo-router"
import { Container } from "@/components/ui/container"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/contexts/theme-context"
import { useSearchPodcasts } from "@/hooks/use-podcasts"
import { Search as SearchIcon, X } from "lucide-react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
import { HapticPressable } from "@/components/ui/pressable"

export default function SearchScreen() {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { theme } = useTheme()

  const { data: results, isLoading } = useSearchPodcasts(query)

  const popularSearches = ["Technology", "Comedy", "News", "True Crime", "Business", "Sports", "Health", "Education"]

  return (
    <Container className="flex-1">
      <View className="px-6 pb-4">
        <Text className="text-3xl font-bold mb-4">Search</Text>

        {/* Search Input */}
        <View
          className={`flex-row items-center ${theme === "dark" ? "bg-card" : "bg-card"} rounded-lg px-4 py-3 border ${theme === "dark" ? "border-border" : "border-border"}`}
        >
          <SearchIcon size={20} color={theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search podcasts..."
            placeholderTextColor={theme === "dark" ? "rgb(115, 115, 115)" : "rgb(163, 163, 163)"}
            className={`flex-1 ml-3 ${theme === "dark" ? "text-foreground" : "text-foreground"}`}
          />
          {query.length > 0 && (
            <HapticPressable onPress={() => setQuery("")} haptic="light">
              <X size={20} color={theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"} />
            </HapticPressable>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {query.length === 0 ? (
          <View className="px-6">
            <Text className="text-lg font-semibold mb-4">Popular Searches</Text>
            <View className="flex-row flex-wrap gap-2">
              {popularSearches.map((search) => (
                <HapticPressable
                  key={search}
                  onPress={() => setQuery(search)}
                  className={`${theme === "dark" ? "bg-card" : "bg-card"} px-4 py-2 rounded-full border ${theme === "dark" ? "border-border" : "border-border"}`}
                  haptic="selection"
                >
                  <Text className="text-sm">{search}</Text>
                </HapticPressable>
              ))}
            </View>
          </View>
        ) : isLoading ? (
          <View className="items-center justify-center py-12">
            <ActivityIndicator size="large" color="rgb(34, 197, 94)" />
          </View>
        ) : results && results.length > 0 ? (
          <Animated.View entering={FadeIn} exiting={FadeOut} className="px-6">
            {results.map((podcast: any) => (
              <HapticPressable
                key={podcast.id}
                onPress={() => router.push(`/podcast/${podcast.id}`)}
                className={`flex-row mb-4 ${theme === "dark" ? "bg-card" : "bg-card"} rounded-lg p-3 border ${theme === "dark" ? "border-border" : "border-border"}`}
                haptic="light"
              >
                <Image source={{ uri: podcast.images[0]?.url }} className="w-20 h-20 rounded-lg" />
                <View className="flex-1 ml-3 justify-center">
                  <Text className="font-semibold text-base" numberOfLines={2}>
                    {podcast.name}
                  </Text>
                  <Text className="text-sm text-muted-foreground mt-1" numberOfLines={1}>
                    {podcast.publisher}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1">{podcast.total_episodes} episodes</Text>
                </View>
              </HapticPressable>
            ))}
          </Animated.View>
        ) : (
          <View className="items-center justify-center py-12">
            <Text className="text-muted-foreground">No results found</Text>
          </View>
        )}
      </ScrollView>
    </Container>
  )
}
