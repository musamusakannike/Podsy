"use client"

import { Tabs } from "expo-router"
import { Home, Search, Library, User } from "lucide-react-native"
import { useTheme } from "@/contexts/theme-context"
import { MiniPlayer } from "@/components/mini-player"
import { View } from "react-native"

export default function TabsLayout() {
  const { theme } = useTheme()
  const iconColor = theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"
  const activeColor = "rgb(34, 197, 94)"

  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme === "dark" ? "rgb(20, 20, 20)" : "rgb(250, 250, 250)",
            borderTopColor: theme === "dark" ? "rgb(38, 38, 38)" : "rgb(229, 229, 229)",
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: iconColor,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Search",
            tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: "Library",
            tabBarIcon: ({ color, size }) => <Library size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
      <MiniPlayer />
    </View>
  )
}
