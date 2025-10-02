"use client"

import { View, TextInput, Alert, StyleSheet } from "react-native"
import { useState } from "react"
import { useRouter } from "expo-router"
import { Container } from "@/components/ui/container"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/contexts/theme-context"
import { Music } from "lucide-react-native"
import { HapticPressable } from "@/components/ui/pressable"
import Animated, { FadeInUp } from "react-native-reanimated"

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

  const cardBg = theme === "dark" ? '#1c1c1c' : '#ffffff'
  const borderColor = theme === "dark" ? '#262626' : '#e5e5e5'
  const placeholderColor = theme === "dark" ? "rgb(115, 115, 115)" : "rgb(163, 163, 163)"
  const textColor = theme === "dark" ? '#fafafa' : '#0a0a0a'
  const musicIconColor = theme === "dark" ? "rgb(10, 10, 10)" : "rgb(255, 255, 255)"

  return (
    <Container style={styles.container}>
      <Animated.View entering={FadeInUp} style={styles.header}>
        <View style={styles.logo}>
          <Music size={40} color={musicIconColor} />
        </View>
        <Text size="3xl" weight="bold" style={styles.title}>Podcast App</Text>
        <Text variant="muted" style={styles.subtitle}>Powered by Spotify API</Text>
      </Animated.View>

      <View style={styles.form}>
        <View>
          <Text size="sm" weight="semibold" style={styles.label}>Spotify Client ID</Text>
          <TextInput
            value={clientId}
            onChangeText={setClientId}
            placeholder="Enter your Client ID"
            placeholderTextColor={placeholderColor}
            style={[styles.input, { backgroundColor: cardBg, borderColor, color: textColor }]}
          />
        </View>

        <View>
          <Text size="sm" weight="semibold" style={styles.label}>Spotify Client Secret</Text>
          <TextInput
            value={clientSecret}
            onChangeText={setClientSecret}
            placeholder="Enter your Client Secret"
            placeholderTextColor={placeholderColor}
            secureTextEntry
            style={[styles.input, { backgroundColor: cardBg, borderColor, color: textColor }]}
          />
        </View>

        <HapticPressable onPress={handleAuth} style={styles.continueButton} haptic="medium">
          <Text variant="primary" weight="semibold" size="base">Continue</Text>
        </HapticPressable>

        <HapticPressable onPress={() => router.replace("/(tabs)")} style={styles.skipButton} haptic="selection">
          <Text variant="muted" size="sm">Skip for now</Text>
        </HapticPressable>
      </View>

      <View style={styles.footer}>
        <Text size="xs" variant="muted" style={styles.footerText}>
          Get your Spotify API credentials from the Spotify Developer Dashboard. This app uses the Spotify Web API to
          fetch podcast data.
        </Text>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: '#22c55e',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  continueButton: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  footer: {
    marginTop: 32,
  },
  footerText: {
    textAlign: 'center',
    lineHeight: 18,
  },
})
