"use client"

import { View, TextInput, TouchableOpacity, Alert } from "react-native"
import { useState } from "react"
import { useRouter } from "expo-router"
import { Container } from "@/components/ui/container"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/contexts/theme-context"
import { Music } from "lucide-react-native"

export default function AuthScreen() {
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const router = useRouter()
  const { theme } = useTheme()

  const handleAuth = async () => {
    if (!clientId || !clientSecret) {
      Alert.alert("Error", "Please enter both Client ID and Client Secret")
      return
    }

    // Store credentials (in production, use secure storage)
    try {
      // Navigate to main app
      router.replace("/(tabs)")
    } catch (error) {
      console.log(error)
      Alert.alert("Error", "Failed to authenticate")
    }
  }

  return (
    <Container className="flex-1 justify-center px-6">
      <View className="items-center mb-12">
        <View className="w-20 h-20 bg-primary rounded-full items-center justify-center mb-4">
          <Music size={40} color={theme === "dark" ? "rgb(10, 10, 10)" : "rgb(255, 255, 255)"} />
        </View>
        <Text className="text-3xl font-bold text-center mb-2">Podcast App</Text>
        <Text className="text-muted-foreground text-center">Powered by Spotify API</Text>
      </View>

      <View className="gap-4">
        <View>
          <Text className="text-sm font-medium mb-2">Spotify Client ID</Text>
          <TextInput
            value={clientId}
            onChangeText={setClientId}
            placeholder="Enter your Client ID"
            placeholderTextColor={theme === "dark" ? "rgb(115, 115, 115)" : "rgb(163, 163, 163)"}
            className={`${theme === "dark" ? "bg-card text-foreground" : "bg-card text-foreground"} px-4 py-3 rounded-lg border ${theme === "dark" ? "border-border" : "border-border"}`}
          />
        </View>

        <View>
          <Text className="text-sm font-medium mb-2">Spotify Client Secret</Text>
          <TextInput
            value={clientSecret}
            onChangeText={setClientSecret}
            placeholder="Enter your Client Secret"
            placeholderTextColor={theme === "dark" ? "rgb(115, 115, 115)" : "rgb(163, 163, 163)"}
            secureTextEntry
            className={`${theme === "dark" ? "bg-card text-foreground" : "bg-card text-foreground"} px-4 py-3 rounded-lg border ${theme === "dark" ? "border-border" : "border-border"}`}
          />
        </View>

        <TouchableOpacity onPress={handleAuth} className="bg-primary py-4 rounded-lg mt-4">
          <Text className="text-primary-foreground text-center font-semibold text-base">Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/(tabs)")} className="py-3">
          <Text className="text-muted-foreground text-center text-sm">Skip for now</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-8">
        <Text className="text-xs text-muted-foreground text-center leading-relaxed">
          Get your Spotify API credentials from the Spotify Developer Dashboard. This app uses the Spotify Web API to
          fetch podcast data.
        </Text>
      </View>
    </Container>
  )
}
