"use client"

import { View, type ViewProps } from "react-native"
import { useTheme } from "@/contexts/theme-context"

export function Container({ className = "", style, ...props }: ViewProps) {
  const { theme } = useTheme()

  return (
    <View className={`${theme === "dark" ? "bg-background" : "bg-background"} ${className}`} style={style} {...props} />
  )
}
