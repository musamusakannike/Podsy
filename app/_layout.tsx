import { Stack } from "expo-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/contexts/theme-context"
import { PlayerProvider } from "@/contexts/player-context"
import { StatusBar } from "expo-status-bar"
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useState } from "react"
import { StyleSheet, View } from "react-native"
import { MiniPlayer } from "@/components/mini-player"
import { FullPlayer } from "@/components/full-player"

const queryClient = new QueryClient()

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  })
  const [showFull, setShowFull] = useState(false)

  if (!fontsLoaded) {
    return null
  }
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SafeAreaProvider>
          <PlayerProvider>
            <StatusBar style="light" backgroundColor="#111" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="auth" />
              <Stack.Screen name="podcast/[id]" />
              <Stack.Screen name="episode/[id]" />
            </Stack>
            <MiniPlayer onOpenFull={() => setShowFull(true)} />
            {showFull && (
              <View style={styles.overlay}>
                <FullPlayer onClose={() => setShowFull(false)} />
              </View>
            )}
          </PlayerProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
})

