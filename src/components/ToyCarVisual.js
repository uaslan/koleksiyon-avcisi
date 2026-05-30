import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

const palette = ["#e54b2b", "#1c7ed6", "#0f9d58", "#f0b429", "#7c4dff", "#00a6a6", "#c2185b"];

function colorFromName(name = "") {
  const total = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return palette[total % palette.length];
}

function modelFromName(name = "") {
  const lower = name.toLowerCase();

  if (lower.includes("van")) {
    return "van";
  }

  if (lower.includes("911") || lower.includes("miura") || lower.includes("supra") || lower.includes("silvia")) {
    return "sport";
  }

  if (lower.includes("tofas") || lower.includes("dogan") || lower.includes("sahin")) {
    return "street";
  }

  return "coupe";
}

export default function ToyCarVisual({ car, animated = false }) {
  const pulse = useRef(new Animated.Value(0)).current;
  const bodyColor = useMemo(() => colorFromName(car.name), [car.name]);
  const model = useMemo(() => modelFromName(car.name), [car.name]);
  const isRare = car.rarity === "treasure" || car.rarity === "superTreasure";
  const isSuper = car.rarity === "superTreasure";

  useEffect(() => {
    if (!animated) {
      pulse.setValue(0);
      return undefined;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: isSuper ? 820 : 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: isSuper ? 820 : 1100,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        })
      ])
    );

    loop.start();
    return () => loop.stop();
  }, [animated, isSuper, pulse]);

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.18, isSuper ? 0.76 : 0.42]
  });
  const floatY = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5]
  });
  const shimmerX = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [-42, 54]
  });

  return (
    <View style={styles.stage}>
      <View style={styles.floorShadow} />
      {isRare ? (
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: animated ? glowOpacity : isSuper ? 0.45 : 0.28,
              backgroundColor: isSuper ? "#ffe066" : "#b8f7ca"
            }
          ]}
        />
      ) : null}

      <Animated.View style={[styles.carWrap, animated && { transform: [{ translateY: floatY }] }]}>
        <View style={[styles.body, styles[model], { backgroundColor: bodyColor }]}>
          <View style={styles.speedStripe} />
          {isSuper ? (
            <Animated.View
              style={[
                styles.shimmer,
                {
                  transform: [{ translateX: shimmerX }, { rotate: "18deg" }]
                }
              ]}
            />
          ) : null}
          <View style={[styles.window, model === "van" && styles.vanWindow]} />
          <Text style={styles.sideMark}>{car.rarity === "regular" ? "DIE" : car.rarity === "treasure" ? "TH" : "STH"}</Text>
        </View>

        <View style={styles.wheelRow}>
          <View style={styles.wheel}>
            <View style={styles.rim} />
          </View>
          <View style={styles.wheel}>
            <View style={styles.rim} />
          </View>
        </View>
      </Animated.View>

      <View style={styles.blisterLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: 280,
    height: 150,
    alignItems: "center",
    justifyContent: "center"
  },
  floorShadow: {
    position: "absolute",
    bottom: 19,
    width: 220,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(23,37,47,0.1)"
  },
  glow: {
    position: "absolute",
    width: 214,
    height: 96,
    borderRadius: 48
  },
  carWrap: {
    width: 226,
    height: 92,
    justifyContent: "flex-end"
  },
  body: {
    height: 58,
    borderRadius: 22,
    borderColor: "#263238",
    borderWidth: 2,
    overflow: "hidden"
  },
  sport: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 14
  },
  street: {
    borderRadius: 10
  },
  van: {
    height: 64,
    borderRadius: 12
  },
  coupe: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22
  },
  speedStripe: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 13,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.8)"
  },
  shimmer: {
    position: "absolute",
    top: -6,
    width: 30,
    height: 86,
    backgroundColor: "rgba(255,255,255,0.45)"
  },
  window: {
    position: "absolute",
    top: 9,
    left: 78,
    width: 59,
    height: 23,
    borderRadius: 6,
    backgroundColor: "#20323d",
    borderColor: "rgba(255,255,255,0.55)",
    borderWidth: 1
  },
  vanWindow: {
    left: 95,
    width: 72
  },
  sideMark: {
    position: "absolute",
    right: 20,
    bottom: 10,
    color: "#fff",
    fontSize: 11,
    fontWeight: "900"
  },
  wheelRow: {
    position: "absolute",
    left: 25,
    right: 25,
    bottom: -3,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  wheel: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#17252f",
    borderColor: "#f8f3e8",
    borderWidth: 3
  },
  rim: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#b9c6d3"
  },
  blisterLine: {
    position: "absolute",
    bottom: 3,
    width: 240,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.35)"
  }
});
