import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import CarCard from "../components/CarCard";
import PrimaryButton from "../components/PrimaryButton";
import { rarityMeta } from "../data/cars";
import { appraiseCar, wholesaleValue } from "../utils/random";

const filters = [
  { id: "all", label: "Tumu" },
  { id: "regular", label: "Normal" },
  { id: "treasure", label: "TH" },
  { id: "superTreasure", label: "STH" }
];

export default function GarageScreen({ game, actions }) {
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const cars = useMemo(
    () => (filter === "all" ? game.garage : game.garage.filter((car) => car.rarity === filter)),
    [filter, game.garage]
  );
  const totalValue = useMemo(
    () => game.garage.reduce((sum, car) => sum + appraiseCar(car), 0),
    [game.garage]
  );

  function sellCar(car) {
    const salePrice = wholesaleValue(car);

    actions.updateGame((current) => {
      const remainingCars = current.garage.filter((item) => item.garageId !== car.garageId);

      return {
        ...current,
        money: current.money + salePrice,
        garage: remainingCars,
        currentCar:
          current.currentCar?.garageId === car.garageId
            ? remainingCars[0] || null
            : current.currentCar,
        stats: {
          ...current.stats,
          sold: current.stats.sold + 1
        },
        transactionHistory: [
          {
            id: `tx-${Date.now()}`,
            type: "quick-sale",
            text: `${car.name} koleksiyondan satildi.`,
            amount: salePrice,
            date: new Date().toISOString()
          },
          ...current.transactionHistory
        ]
      };
    });
    setMessage(`${car.name} satildi. +${salePrice} TL`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Garaj ve Koleksiyon</Text>
        <Text style={styles.subtitle}>
          {game.garageShelves} raf / Tahmini deger {totalValue} TL
        </Text>
      </View>

      <View style={styles.shelves}>
        {Array.from({ length: Math.max(1, game.garageShelves) }).map((_, index) => (
          <View key={index} style={styles.shelfRail} />
        ))}
      </View>

      <View style={styles.filters}>
        {filters.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => setFilter(item.id)}
            style={[styles.filter, filter === item.id && styles.activeFilter]}
          >
            <MaterialCommunityIcons
              name={item.id === "all" ? "view-grid" : item.id === "regular" ? "car-sports" : item.id === "treasure" ? "fire" : "star-four-points"}
              size={17}
              color={filter === item.id ? "#fff" : "#263238"}
            />
            <Text style={[styles.filterText, filter === item.id && styles.activeFilterText]}>
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.counts}>
        <Text style={styles.countText}>Normal: {game.garage.filter((car) => car.rarity === "regular").length}</Text>
        <Text style={[styles.countText, { color: rarityMeta.treasure.color }]}>
          TH: {game.garage.filter((car) => car.rarity === "treasure").length}
        </Text>
        <Text style={[styles.countText, { color: rarityMeta.superTreasure.color }]}>
          STH: {game.garage.filter((car) => car.rarity === "superTreasure").length}
        </Text>
      </View>

      <FlatList
        data={cars}
        keyExtractor={(item) => item.garageId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const salePrice = wholesaleValue(item);

          return (
            <View style={styles.sellCard}>
              <CarCard car={item} compact />
              <View style={styles.sellRow}>
                <View style={styles.sellInfo}>
                  <Text style={styles.sellLabel}>Hizli satis</Text>
                  <Text style={styles.sellPrice}>{salePrice} TL</Text>
                </View>
                <PrimaryButton
                  title="Sat"
                  onPress={() => sellCar(item)}
                  tone="green"
                  icon="cash-fast"
                />
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Bu filtrede arac yok.</Text>
          </View>
        }
      />

      {message ? <Text style={styles.message}>{message}</Text> : null}
      <PrimaryButton title="Ana Menu" onPress={() => actions.navigate("home")} tone="light" icon="home-variant" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12
  },
  header: {
    gap: 4
  },
  title: {
    color: "#263238",
    fontSize: 29,
    fontWeight: "900"
  },
  subtitle: {
    color: "#52616b",
    fontSize: 15,
    fontWeight: "800"
  },
  shelves: {
    gap: 5
  },
  shelfRail: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#8d6e63"
  },
  filters: {
    flexDirection: "row",
    gap: 8
  },
  filter: {
    flex: 1,
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
    borderRadius: 8,
    borderColor: "#d2c5a5",
    borderWidth: 1,
    backgroundColor: "#fffaf0"
  },
  activeFilter: {
    backgroundColor: "#263238",
    borderColor: "#263238"
  },
  filterText: {
    color: "#263238",
    fontSize: 13,
    fontWeight: "900"
  },
  activeFilterText: {
    color: "#fff"
  },
  counts: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8
  },
  countText: {
    color: "#52616b",
    fontSize: 13,
    fontWeight: "900"
  },
  list: {
    gap: 12,
    paddingBottom: 8
  },
  sellCard: {
    width: "100%",
    maxWidth: 370,
    alignSelf: "center",
    gap: 8
  },
  sellRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    borderRadius: 8,
    borderColor: "#d2c5a5",
    borderWidth: 1,
    backgroundColor: "#fffaf0",
    padding: 10
  },
  sellInfo: {
    flex: 1
  },
  sellLabel: {
    color: "#52616b",
    fontSize: 12,
    fontWeight: "900"
  },
  sellPrice: {
    color: "#0f7b45",
    fontSize: 18,
    fontWeight: "900"
  },
  message: {
    color: "#263238",
    fontSize: 14,
    fontWeight: "900"
  },
  empty: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderColor: "#d2c5a5",
    borderWidth: 1,
    backgroundColor: "#fffaf0",
    padding: 18
  },
  emptyText: {
    color: "#667",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "800"
  }
});
