"use client";

import { StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Home, Search, Library, User } from "lucide-react-native";
import { useTheme } from "@/contexts/theme-context";
import { MiniPlayer } from "@/components/mini-player";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

export default function TabsLayout() {
  const { theme } = useTheme();
  const iconColor = theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)";
  const activeColor = "rgb(34, 197, 94)";
  const backgroundColor = theme === "dark" ? "rgb(20, 20, 20)" : "rgb(250, 250, 250)";
  const borderTopColor = theme === "dark" ? "rgb(38, 38, 38)" : "rgb(229, 229, 229)";

  return (
    <SafeAreaView style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor,
            borderTopColor,
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: activeColor,
          tabBarInactiveTintColor: iconColor,
        }}
        screenListeners={{
          tabPress: () => {
            // fire-and-forget; ignore failures
            Haptics.selectionAsync().catch(() => {})
          },
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
            tabBarIcon: ({ color, size }) => (
              <Search size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: "Library",
            tabBarIcon: ({ color, size }) => (
              <Library size={size} color={color} />
            ),
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
