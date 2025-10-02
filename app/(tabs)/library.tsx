"use client"

import { View, ScrollView, Image, ActivityIndicator, StyleSheet } from "react-native"
import { useRouter } from "expo-router"
import { Container } from "@/components/ui/container"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/contexts/theme-context"
import { useSavedShows } from "@/hooks/use-podcasts"
import { BookMarked, Download, Clock } from "lucide-react-native"
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated"
import { HapticPressable } from "@/components/ui/pressable"

export default function LibraryScreen() {
  const router = useRouter()
  const { theme } = useTheme()
  const { data: savedShows, isLoading } = useSavedShows()

  const cardBg = theme === "dark" ? '#1c1c1c' : '#ffffff'
  const borderColor = theme === "dark" ? '#262626' : '#e5e5e5'
  const emptyIconColor = theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"

  return (
    <Container style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text size="3xl" weight="bold" style={styles.title}>Your Library</Text>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Animated.View entering={FadeInUp} style={styles.actionCard}>
              <HapticPressable
                style={[styles.actionButton, { backgroundColor: cardBg, borderColor }]}
                haptic="selection"
              >
                <BookMarked size={24} color="rgb(34, 197, 94)" />
                <Text weight="semibold" style={styles.actionTitle}>Saved</Text>
                <Text size="xs" variant="muted" style={styles.actionSubtitle}>{savedShows?.length || 0} shows</Text>
              </HapticPressable>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(50)} style={styles.actionCard}>
              <HapticPressable
                style={[styles.actionButton, { backgroundColor: cardBg, borderColor }]}
                haptic="selection"
              >
                <Download size={24} color="rgb(34, 197, 94)" />
                <Text weight="semibold" style={styles.actionTitle}>Downloads</Text>
                <Text size="xs" variant="muted" style={styles.actionSubtitle}>0 episodes</Text>
              </HapticPressable>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(100)} style={styles.actionCard}>
              <HapticPressable
                style={[styles.actionButton, { backgroundColor: cardBg, borderColor }]}
                haptic="selection"
              >
                <Clock size={24} color="rgb(34, 197, 94)" />
                <Text weight="semibold" style={styles.actionTitle}>History</Text>
                <Text size="xs" variant="muted" style={styles.actionSubtitle}>Recent</Text>
              </HapticPressable>
            </Animated.View>
          </View>
        </View>

        {/* Saved Shows */}
        <View style={styles.savedShows}>
          <Text size="xl" weight="bold" style={styles.sectionTitle}>Saved Shows</Text>

          {isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="rgb(34, 197, 94)" />
            </View>
          ) : savedShows && savedShows.length > 0 ? (
            <Animated.View entering={FadeIn}>
              {savedShows.map((item: any, i: number) => (
                <Animated.View key={item.show.id} entering={FadeInUp.delay(i * 40)}>
                  <HapticPressable
                    onPress={() => router.push(`/podcast/${item.show.id}`)}
                    style={[styles.showCard, { backgroundColor: cardBg, borderColor }]}
                    haptic="light"
                  >
                    <Image source={{ uri: item.show.images[0]?.url }} style={styles.showImage} />
                    <View style={styles.showInfo}>
                      <Text weight="semibold" size="base" numberOfLines={2}>
                        {item.show.name}
                      </Text>
                      <Text size="sm" variant="muted" style={styles.publisher} numberOfLines={1}>
                        {item.show.publisher}
                      </Text>
                      <Text size="xs" variant="muted" style={styles.episodes}>{item.show.total_episodes} episodes</Text>
                    </View>
                  </HapticPressable>
                </Animated.View>
              ))}
            </Animated.View>
          ) : (
            <View style={styles.emptyState}>
              <BookMarked size={48} color={emptyIconColor} />
              <Text variant="muted" style={styles.emptyText}>No saved shows yet</Text>
              <Text size="sm" variant="muted" style={styles.emptySubtext}>
                Start exploring and save your favorite podcasts
              </Text>
            </View>
          )}
        </View>
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
  title: {
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
  },
  actionButton: {
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
  },
  actionTitle: {
    marginTop: 8,
  },
  actionSubtitle: {
    marginTop: 4,
  },
  savedShows: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  showCard: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  showImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  showInfo: {
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    marginTop: 8,
    textAlign: 'center',
  },
})
