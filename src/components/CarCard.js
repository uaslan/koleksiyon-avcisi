import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import { rarityMeta } from "../data/cars";
import ToyCarVisual from "./ToyCarVisual";

export default function CarCard({ car, compact = false, animated = false }) {
  const meta = rarityMeta[car.rarity] || rarityMeta.regular;
  const date = car.foundAt ? new Date(car.foundAt).toLocaleDateString("tr-TR") : "Bugun";
  const intro = useRef(new Animated.Value(animated ? 0 : 1)).current;

  useEffect(() => {
    if (!animated) {
      intro.setValue(1);
      return;
    }

    intro.setValue(0);
    Animated.timing(intro, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.back(1.25)),
      useNativeDriver: true
    }).start();
  }, [animated, car.garageId, car.name, intro]);

  return (
    <Animated.View
      style={[
        styles.card,
        compact && styles.compactCard,
        animated && {
          opacity: intro,
          transform: [
            {
              scale: intro.interpolate({
                inputRange: [0, 1],
                outputRange: [0.94, 1]
              })
            }
          ]
        }
      ]}
    >
      <View style={styles.artBoard}>
        <View style={styles.pegHole} />
        <View style={styles.sunArc} />
        <View style={styles.redFlash} />
        <View style={styles.orangeFlash} />
        <View style={styles.brandBlock}>
          <Text style={styles.brandSmall}>DIE-CAST</Text>
          <Text style={styles.brandTitle}>AVCI</Text>
          <Text style={styles.brandSmall}>STREET SERIES</Text>
        </View>
        <View style={[styles.rarityBadge, { backgroundColor: meta.color }]}>
          <Text style={styles.rarityBadgeText}>{meta.icon} / {meta.shortLabel}</Text>
        </View>
      </View>

      <View style={styles.blisterZone}>
        <View style={styles.blisterCard}>
          <View style={styles.blisterHighlight} />
          <ToyCarVisual car={car} animated={animated} />
        </View>
      </View>

      <View style={styles.namePlate}>
        <View style={styles.nameTextWrap}>
          <Text style={styles.name}>{car.name}</Text>
          <Text style={styles.series}>{car.series}</Text>
          <Text style={styles.meta}>Kondisyon %{car.condition}</Text>
          <Text style={styles.meta}>Sahip olma: {date}</Text>
        </View>
        <View style={styles.priceTag}>
          <Text style={styles.priceLabel}>Deger</Text>
          <Text style={styles.price}>{car.marketPrice || car.sellPrice} TL</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 370,
    alignSelf: "center",
    borderRadius: 8,
    borderColor: "#c8b98f",
    borderWidth: 2,
    backgroundColor: "#fdf7e8",
    overflow: "hidden",
    shadowColor: "#17252f",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 3
  },
  compactCard: {
    marginBottom: 10
  },
  artBoard: {
    height: 168,
    backgroundColor: "#1177c8",
    overflow: "hidden"
  },
  pegHole: {
    position: "absolute",
    top: 14,
    alignSelf: "center",
    width: 42,
    height: 18,
    borderRadius: 10,
    backgroundColor: "#fdf7e8",
    borderColor: "rgba(38,50,56,0.18)",
    borderWidth: 1
  },
  sunArc: {
    position: "absolute",
    left: -78,
    top: -52,
    width: 238,
    height: 178,
    borderRadius: 90,
    backgroundColor: "#ffd449",
    transform: [{ rotate: "-18deg" }]
  },
  redFlash: {
    position: "absolute",
    right: -50,
    top: 24,
    width: 206,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e54b2b",
    transform: [{ rotate: "-13deg" }]
  },
  orangeFlash: {
    position: "absolute",
    right: -30,
    top: 72,
    width: 154,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#ff9f1c",
    transform: [{ rotate: "-13deg" }]
  },
  brandBlock: {
    position: "absolute",
    left: 18,
    bottom: 22,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.88)"
  },
  brandSmall: {
    color: "#263238",
    fontSize: 10,
    fontWeight: "900"
  },
  brandTitle: {
    color: "#e54b2b",
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 34
  },
  rarityBadge: {
    position: "absolute",
    right: 14,
    bottom: 16,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  rarityBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900"
  },
  blisterZone: {
    minHeight: 190,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#fdf7e8"
  },
  blisterCard: {
    width: "100%",
    minHeight: 172,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 34,
    borderColor: "rgba(114,173,202,0.72)",
    borderWidth: 2,
    backgroundColor: "rgba(216,236,247,0.78)",
    overflow: "hidden"
  },
  blisterHighlight: {
    position: "absolute",
    top: 15,
    left: 24,
    right: 24,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.48)"
  },
  namePlate: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 10,
    padding: 16,
    backgroundColor: "#fdf7e8"
  },
  nameTextWrap: {
    flex: 1
  },
  name: {
    color: "#263238",
    fontSize: 20,
    fontWeight: "900"
  },
  series: {
    paddingTop: 2,
    color: "#667",
    fontSize: 13,
    fontWeight: "800"
  },
  meta: {
    color: "#52616b",
    fontSize: 13,
    fontWeight: "700"
  },
  priceTag: {
    alignItems: "flex-end",
    borderRadius: 8,
    backgroundColor: "#fff4cf",
    borderColor: "#f0b429",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  priceLabel: {
    color: "#52616b",
    fontSize: 10,
    fontWeight: "900"
  },
  price: {
    color: "#0f7b45",
    fontSize: 14,
    fontWeight: "900"
  }
});
