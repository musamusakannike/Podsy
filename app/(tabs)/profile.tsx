"use client"

import { View, ScrollView, TouchableOpacity } from "react-native"
import { Container } from "@/components/ui/container"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/contexts/theme-context"
import { User, Moon, Sun, Bell, Download, Info, HelpCircle, LogOut, ChevronRight } from "lucide-react-native"
export default function ProfileScreen() {
  const { theme, themeMode, setTheme } = useTheme()

  const settingsItems = [
    {
      icon: Bell,
      title: "Notifications",
      subtitle: "Manage notification preferences",
      onPress: () => {},
    },
    {
      icon: Download,
      title: "Download Settings",
      subtitle: "Manage download quality and storage",
      onPress: () => {},
    },
    {
      icon: Info,
      title: "About",
      subtitle: "App version and information",
      onPress: () => {},
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      subtitle: "Get help and contact support",
      onPress: () => {},
    },
  ]

  return (
    <Container className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pb-6">
          <Text className="text-3xl font-bold">Profile</Text>
        </View>

        {/* User Info */}
        <View className="px-6 mb-6">
          <View
            className={`${theme === "dark" ? "bg-card" : "bg-card"} rounded-lg p-6 border ${theme === "dark" ? "border-border" : "border-border"} items-center`}
          >
            <View className="w-24 h-24 bg-primary rounded-full items-center justify-center mb-4">
              <User size={48} color="rgb(10, 10, 10)" />
            </View>
            <Text className="text-xl font-bold">Guest User</Text>
            <Text className="text-sm text-muted-foreground mt-1">guest@podcastapp.com</Text>
          </View>
        </View>

        {/* Theme Settings */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold mb-3">Appearance</Text>
          <View
            className={`${theme === "dark" ? "bg-card" : "bg-card"} rounded-lg border ${theme === "dark" ? "border-border" : "border-border"}`}
          >
            <TouchableOpacity
              onPress={() => setTheme("light")}
              className="flex-row items-center justify-between p-4 border-b border-border"
            >
              <View className="flex-row items-center flex-1">
                <Sun size={20} color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"} />
                <Text className="ml-3 font-medium">Light Mode</Text>
              </View>
              <View
                className={`w-5 h-5 rounded-full border-2 ${themeMode === "light" ? "border-primary bg-primary" : "border-muted-foreground"}`}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setTheme("dark")}
              className="flex-row items-center justify-between p-4 border-b border-border"
            >
              <View className="flex-row items-center flex-1">
                <Moon size={20} color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"} />
                <Text className="ml-3 font-medium">Dark Mode</Text>
              </View>
              <View
                className={`w-5 h-5 rounded-full border-2 ${themeMode === "dark" ? "border-primary bg-primary" : "border-muted-foreground"}`}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setTheme("system")} className="flex-row items-center justify-between p-4">
              <View className="flex-row items-center flex-1">
                <View className="w-5 h-5 rounded-full bg-gradient-to-r from-yellow-400 to-blue-900" />
                <Text className="ml-3 font-medium">System Default</Text>
              </View>
              <View
                className={`w-5 h-5 rounded-full border-2 ${themeMode === "system" ? "border-primary bg-primary" : "border-muted-foreground"}`}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-semibold mb-3">Settings</Text>
          <View
            className={`${theme === "dark" ? "bg-card" : "bg-card"} rounded-lg border ${theme === "dark" ? "border-border" : "border-border"}`}
          >
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={item.title}
                onPress={item.onPress}
                className={`flex-row items-center justify-between p-4 ${index < settingsItems.length - 1 ? "border-b border-border" : ""}`}
              >
                <View className="flex-row items-center flex-1">
                  <item.icon size={20} color={theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"} />
                  <View className="ml-3 flex-1">
                    <Text className="font-medium">{item.title}</Text>
                    <Text className="text-xs text-muted-foreground mt-1">{item.subtitle}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color={theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View className="px-6 pb-6">
          <TouchableOpacity
            className={`${theme === "dark" ? "bg-card" : "bg-card"} rounded-lg p-4 border ${theme === "dark" ? "border-border" : "border-border"} flex-row items-center justify-center`}
          >
            <LogOut size={20} color="rgb(239, 68, 68)" />
            <Text className="ml-2 font-semibold text-red-500">Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Container>
  )
}
