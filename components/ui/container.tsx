"use client"

import { type ViewProps } from "react-native"
import { useTheme } from "@/contexts/theme-context"
import { SafeAreaView } from "react-native-safe-area-context"

export function Container({ className = "", style, ...props }: ViewProps) {
  const { theme } = useTheme()

  return (
    <SafeAreaView className={`${theme === "dark" ? "bg-background" : "bg-background"} ${className}`} style={style} {...props} />
  )
}
