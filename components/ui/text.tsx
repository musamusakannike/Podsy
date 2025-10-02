"use client"

import { Text as RNText, type TextProps } from "react-native"
import { useTheme } from "@/contexts/theme-context"

export function Text({ className = "", style, ...props }: TextProps) {
  const { theme } = useTheme()

  const pickFontFamily = (cls: string) => {
    if (cls.includes("font-bold")) return "Inter_700Bold"
    if (cls.includes("font-semibold")) return "Inter_600SemiBold"
    return "Inter_400Regular"
  }

  return (
    <RNText
      className={`${theme === "dark" ? "text-foreground" : "text-foreground"} ${className}`}
      style={[{ fontFamily: pickFontFamily(className) }, style]}
      {...props}
    />
  )
}
