"use client"

import { View, ScrollView, TextInput, Image, ActivityIndicator, StyleSheet } from "react-native"
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

  const cardBg = theme === "dark" ? '#1c1c1c' : '#ffffff'
  const borderColor = theme === "dark" ? '#262626' : '#e5e5e5'
  const iconColor = theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"
  const placeholderColor = theme === "dark" ? "rgb(115, 115, 115)" : "rgb(163, 163, 163)"
  const textColor = theme === "dark" ? '#fafafa' : '#0a0a0a'

  return (
    <Container style={styles.container}>
      <View style={styles.headerContainer}>
        <Text size="3xl" weight="bold" style={styles.title}>Search</Text>

        {/* Search Input */}
        <View style={[styles.searchInput, { backgroundColor: cardBg, borderColor }]}>
          <SearchIcon size={20} color={iconColor} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search podcasts..."
            placeholderTextColor={placeholderColor}
            style={[styles.textInput, { color: textColor }]}
          />
          {query.length > 0 && (
            <HapticPressable onPress={() => setQuery("")} haptic="light">
              <X size={20} color={iconColor} />
            </HapticPressable>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {query.length === 0 ? (
          <View style={styles.contentContainer}>
            <Text size="lg" weight="semibold" style={styles.sectionTitle}>Popular Searches</Text>
            <View style={styles.tagsContainer}>
              {popularSearches.map((search) => (
                <HapticPressable
                  key={search}
                  onPress={() => setQuery(search)}
                  style={[styles.tag, { backgroundColor: cardBg, borderColor }]}
                  haptic="selection"
                >
                  <Text size="sm">{search}</Text>
                </HapticPressable>
              ))}
            </View>
          </View>
        ) : isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="rgb(34, 197, 94)" />
          </View>
        ) : results && results.length > 0 ? (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.contentContainer}>
            {results.map((podcast: any) => (
              <HapticPressable
                key={podcast.id}
                onPress={() => router.push(`/podcast/${podcast.id}`)}
                style={[styles.resultCard, { backgroundColor: cardBg, borderColor }]}
                haptic="light"
              >
                <Image source={{ uri: podcast.images[0]?.url }} style={styles.resultImage} />
                <View style={styles.resultInfo}>
                  <Text weight="semibold" size="base" numberOfLines={2}>
                    {podcast.name}
                  </Text>
                  <Text size="sm" variant="muted" style={styles.publisher} numberOfLines={1}>
                    {podcast.publisher}
                  </Text>
                  <Text size="xs" variant="muted" style={styles.episodes}>{podcast.total_episodes} episodes</Text>
                </View>
              </HapticPressable>
            ))}
          </Animated.View>
        ) : (
          <View style={styles.centerContainer}>
            <Text variant="muted">No results found</Text>
          </View>
        )}
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  title: {
    marginBottom: 16,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  resultCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  publisher: {
    marginTop: 4,
  },
  episodes: {
    marginTop: 4,
  },
})
