"use client"

import { type ViewProps } from "react-native"
import { useTheme } from "@/contexts/theme-context"
import { SafeAreaView } from "react-native-safe-area-context"

export function Container({ style, ...props }: ViewProps) {
  const { theme } = useTheme()

  const backgroundColor = theme === "dark" ? '#141414' : '#fafafa'

  return (
    <SafeAreaView
      style={[{ backgroundColor }, style]}
      {...props}
    />
  )
}
