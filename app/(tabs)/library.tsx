"use client"

import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { useRouter } from "expo-router"
import { Container } from "@/components/ui/container"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/contexts/theme-context"
import { useSavedShows } from "@/hooks/use-podcasts"
import { BookMarked, Download, Clock } from "lucide-react-native"
import Animated, { FadeIn } from "react-native-reanimated"

export default function LibraryScreen() {
  const router = useRouter()
  const { theme } = useTheme()
  const { data: savedShows, isLoading } = useSavedShows()

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-12 pb-6">
          <Text className="text-3xl font-bold mb-4">Your Library</Text>

          {/* Quick Actions */}
          <View className="flex-row gap-3 mb-6">
            <TouchableOpacity
              className={`flex-1 ${theme === "dark" ? "bg-card" : "bg-card"} rounded-lg p-4 border ${theme === "dark" ? "border-border" : "border-border"}`}
            >
              <BookMarked size={24} color="rgb(34, 197, 94)" />
              <Text className="font-semibold mt-2">Saved</Text>
              <Text className="text-xs text-muted-foreground mt-1">{savedShows?.length || 0} shows</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 ${theme === "dark" ? "bg-card" : "bg-card"} rounded-lg p-4 border ${theme === "dark" ? "border-border" : "border-border"}`}
            >
              <Download size={24} color="rgb(34, 197, 94)" />
              <Text className="font-semibold mt-2">Downloads</Text>
              <Text className="text-xs text-muted-foreground mt-1">0 episodes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 ${theme === "dark" ? "bg-card" : "bg-card"} rounded-lg p-4 border ${theme === "dark" ? "border-border" : "border-border"}`}
            >
              <Clock size={24} color="rgb(34, 197, 94)" />
              <Text className="font-semibold mt-2">History</Text>
              <Text className="text-xs text-muted-foreground mt-1">Recent</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Saved Shows */}
        <View className="px-6 pb-6">
          <Text className="text-xl font-bold mb-4">Saved Shows</Text>

          {isLoading ? (
            <View className="items-center justify-center py-12">
              <ActivityIndicator size="large" color="rgb(34, 197, 94)" />
            </View>
          ) : savedShows && savedShows.length > 0 ? (
            <Animated.View entering={FadeIn}>
              {savedShows.map((item: any) => (
                <TouchableOpacity
                  key={item.show.id}
                  onPress={() => router.push(`/podcast/${item.show.id}`)}
                  className={`flex-row mb-4 ${theme === "dark" ? "bg-card" : "bg-card"} rounded-lg p-3 border ${theme === "dark" ? "border-border" : "border-border"}`}
                >
                  <Image source={{ uri: item.show.images[0]?.url }} className="w-20 h-20 rounded-lg" />
                  <View className="flex-1 ml-3 justify-center">
                    <Text className="font-semibold text-base" numberOfLines={2}>
                      {item.show.name}
                    </Text>
                    <Text className="text-sm text-muted-foreground mt-1" numberOfLines={1}>
                      {item.show.publisher}
                    </Text>
                    <Text className="text-xs text-muted-foreground mt-1">{item.show.total_episodes} episodes</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </Animated.View>
          ) : (
            <View className="items-center justify-center py-12">
              <BookMarked size={48} color={theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"} />
              <Text className="text-muted-foreground mt-4 text-center">No saved shows yet</Text>
              <Text className="text-sm text-muted-foreground mt-2 text-center">
                Start exploring and save your favorite podcasts
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </Container>
  )
}
