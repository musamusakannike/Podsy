"use client"

import { View, ScrollView, StyleSheet } from "react-native"
import { Container } from "@/components/ui/container"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/contexts/theme-context"
import { User, Moon, Sun, Bell, Download, Info, HelpCircle, LogOut, ChevronRight } from "lucide-react-native"
import { HapticPressable } from "@/components/ui/pressable"
import Animated, { FadeInUp } from "react-native-reanimated"

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

  const cardBg = theme === "dark" ? '#1c1c1c' : '#ffffff'
  const borderColor = theme === "dark" ? '#262626' : '#e5e5e5'
  const iconColor = theme === "dark" ? "rgb(250, 250, 250)" : "rgb(10, 10, 10)"
  const mutedIconColor = theme === "dark" ? "rgb(163, 163, 163)" : "rgb(115, 115, 115)"
  const mutedBorderColor = theme === "dark" ? '#a3a3a3' : '#737373'

  return (
    <Container style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text size="3xl" weight="bold">Profile</Text>
        </View>

        {/* User Info */}
        <View style={styles.section}>
          <View style={[styles.userCard, { backgroundColor: cardBg, borderColor }]}>
            <View style={styles.avatar}>
              <User size={48} color="rgb(10, 10, 10)" />
            </View>
            <Text size="xl" weight="bold">Guest User</Text>
            <Text size="sm" variant="muted" style={styles.email}>guest@podcastapp.com</Text>
          </View>
        </View>

        {/* Theme Settings */}
        <View style={styles.section}>
          <Text size="lg" weight="semibold" style={styles.sectionTitle}>Appearance</Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <HapticPressable
              onPress={() => setTheme("light")}
              style={[styles.option, { borderBottomColor: borderColor }]}
              haptic="selection"
            >
              <View style={styles.optionContent}>
                <Sun size={20} color={iconColor} />
                <Text weight="semibold" style={styles.optionText}>Light Mode</Text>
              </View>
              <View style={[
                styles.radio,
                themeMode === "light" 
                  ? { borderColor: '#22c55e', backgroundColor: '#22c55e' }
                  : { borderColor: mutedBorderColor }
              ]} />
            </HapticPressable>

            <HapticPressable
              onPress={() => setTheme("dark")}
              style={[styles.option, { borderBottomColor: borderColor }]}
              haptic="selection"
            >
              <View style={styles.optionContent}>
                <Moon size={20} color={iconColor} />
                <Text weight="semibold" style={styles.optionText}>Dark Mode</Text>
              </View>
              <View style={[
                styles.radio,
                themeMode === "dark" 
                  ? { borderColor: '#22c55e', backgroundColor: '#22c55e' }
                  : { borderColor: mutedBorderColor }
              ]} />
            </HapticPressable>

            <HapticPressable 
              onPress={() => setTheme("system")} 
              style={styles.optionLast} 
              haptic="selection"
            >
              <View style={styles.optionContent}>
                <View style={styles.systemIcon} />
                <Text weight="semibold" style={styles.optionText}>System Default</Text>
              </View>
              <View style={[
                styles.radio,
                themeMode === "system" 
                  ? { borderColor: '#22c55e', backgroundColor: '#22c55e' }
                  : { borderColor: mutedBorderColor }
              ]} />
            </HapticPressable>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text size="lg" weight="semibold" style={styles.sectionTitle}>Settings</Text>
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            {settingsItems.map((item, index) => (
              <Animated.View key={item.title} entering={FadeInUp.delay(index * 40)}>
                <HapticPressable
                  onPress={item.onPress}
                  style={[
                    styles.settingsOption,
                    index < settingsItems.length - 1 && { borderBottomColor: borderColor, borderBottomWidth: 1 }
                  ]}
                  haptic="selection"
                >
                  <View style={styles.settingsContent}>
                    <item.icon size={20} color={iconColor} />
                    <View style={styles.settingsText}>
                      <Text weight="semibold">{item.title}</Text>
                      <Text size="xs" variant="muted" style={styles.settingsSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={mutedIconColor} />
                </HapticPressable>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <HapticPressable
            style={[styles.logoutButton, { backgroundColor: cardBg, borderColor }]}
            haptic="medium"
          >
            <LogOut size={20} color="rgb(239, 68, 68)" />
            <Text weight="semibold" style={styles.logoutText}>Log Out</Text>
          </HapticPressable>
        </View>
      </ScrollView>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  userCard: {
    borderRadius: 8,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    backgroundColor: '#22c55e',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  email: {
    marginTop: 4,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  optionLast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    marginLeft: 12,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  systemIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#a3a3a3',
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsText: {
    marginLeft: 12,
    flex: 1,
  },
  settingsSubtitle: {
    marginTop: 4,
  },
  logoutButton: {
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    marginLeft: 8,
    color: 'rgb(239, 68, 68)',
  },
})
