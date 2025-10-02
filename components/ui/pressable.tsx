"use client"

import * as React from "react"
import { Pressable, type PressableProps, type GestureResponderEvent } from "react-native"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import * as Haptics from "expo-haptics"

export type HapticStrength = "none" | "selection" | "light" | "medium" | "heavy"

interface HapticPressableProps extends PressableProps {
  className?: string
  haptic?: HapticStrength
  scaleTo?: number
  children?: React.ReactNode
}

export function HapticPressable({
  className,
  haptic = "selection",
  scaleTo = 0.96,
  onPressIn,
  onPressOut,
  onPress,
  children,
  ...rest
}: HapticPressableProps) {
  const scale = useSharedValue(1)

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const triggerHaptic = React.useCallback(async () => {
    try {
      if (haptic === "none") return
      if (haptic === "selection") {
        await Haptics.selectionAsync()
      } else if (haptic === "light") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      } else if (haptic === "medium") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      } else if (haptic === "heavy") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
      }
    } catch {}
  }, [haptic])

  return (
    <Animated.View style={containerStyle}>
      <Pressable
        className={className}
        onPressIn={(e: GestureResponderEvent) => {
          scale.value = withSpring(scaleTo, { mass: 0.2, stiffness: 500, damping: 25 })
          onPressIn?.(e)
        }}
        onPressOut={(e: GestureResponderEvent) => {
          scale.value = withSpring(1, { mass: 0.2, stiffness: 500, damping: 25 })
          onPressOut?.(e)
        }}
        onPress={async (e: GestureResponderEvent) => {
          await triggerHaptic()
          onPress?.(e)
        }}
        {...rest}
      >
        {children}
      </Pressable>
    </Animated.View>
  )
}
