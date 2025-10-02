"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: "light" | "dark"
  themeMode: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeMode] = useState<Theme>("dark")

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme")
      if (savedTheme) {
        setThemeMode(savedTheme as Theme)
      }
    } catch (error) {
      console.error("Failed to load theme:", error)
    }
  }

  const setTheme = async (theme: Theme) => {
    try {
      await AsyncStorage.setItem("theme", theme)
      setThemeMode(theme)
    } catch (error) {
      console.error("Failed to save theme:", error)
    }
  }

  // Enforce dark theme across the app regardless of preference
  const actualTheme: "dark" = "dark"

  return <ThemeContext.Provider value={{ theme: actualTheme, themeMode, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}

