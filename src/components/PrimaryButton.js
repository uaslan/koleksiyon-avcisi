import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PrimaryButton({ title, onPress, disabled, tone = "dark", icon }) {
  const isLight = tone === "light";
  const color = isLight ? "#263238" : "#fff";

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[tone],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed
      ]}
    >
      <View style={styles.content}>
        {icon ? <MaterialCommunityIcons name={icon} size={21} color={color} /> : null}
        <Text style={[styles.text, isLight && styles.lightText]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  dark: {
    backgroundColor: "#263238"
  },
  green: {
    backgroundColor: "#0f7b45"
  },
  red: {
    backgroundColor: "#a33024"
  },
  light: {
    backgroundColor: "#fff7e6",
    borderColor: "#d2c5a5",
    borderWidth: 1
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800"
  },
  lightText: {
    color: "#263238"
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.88
  },
  disabled: {
    opacity: 0.45
  }
});
