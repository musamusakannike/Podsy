"use client"

import { Text as RNText, type TextProps, StyleSheet } from "react-native"
import { useTheme } from "@/contexts/theme-context"

interface CustomTextProps extends TextProps {
  variant?: 'default' | 'muted' | 'primary'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'
  weight?: 'regular' | 'semibold' | 'bold'
}

export function Text({ variant = 'default', size = 'base', weight = 'regular', style, ...props }: CustomTextProps) {
  const { theme } = useTheme()

  const pickFontFamily = (w: string) => {
    if (w === "bold") return "Inter_700Bold"
    if (w === "semibold") return "Inter_600SemiBold"
    return "Inter_400Regular"
  }

  const textColor = theme === "dark" 
    ? (variant === 'muted' ? '#a3a3a3' : variant === 'primary' ? '#0a0a0a' : '#fafafa')
    : (variant === 'muted' ? '#737373' : variant === 'primary' ? '#0a0a0a' : '#0a0a0a')

  return (
    <RNText
      style={[
        { fontFamily: pickFontFamily(weight), color: textColor },
        styles[size],
        style
      ]}
      {...props}
    />
  )
}

const styles = StyleSheet.create({
  xs: { fontSize: 12 },
  sm: { fontSize: 14 },
  base: { fontSize: 16 },
  lg: { fontSize: 18 },
  xl: { fontSize: 20 },
  '2xl': { fontSize: 24 },
  '3xl': { fontSize: 30 },
})
