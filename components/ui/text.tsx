"use client"

import { Text as RNText, type TextProps } from "react-native"
import { useTheme } from "@/contexts/theme-context"

export function Text({ className = "", style, ...props }: TextProps) {
  const { theme } = useTheme()

  return (
    <RNText
      className={`${theme === "dark" ? "text-foreground" : "text-foreground"} ${className}`}
      style={style}
      {...props}
    />
  )
}
