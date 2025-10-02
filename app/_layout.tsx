import { Stack } from "expo-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/contexts/theme-context"
import { PlayerProvider } from "@/contexts/player-context"
import { StatusBar } from "expo-status-bar"
import "./global.css"

const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <PlayerProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="podcast/[id]" />
            <Stack.Screen name="episode/[id]" />
          </Stack>
        </PlayerProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
