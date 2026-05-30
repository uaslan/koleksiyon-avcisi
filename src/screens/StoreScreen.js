import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import CarCard from "../components/CarCard";
import PrimaryButton from "../components/PrimaryButton";
import { rarityMeta, stores } from "../data/cars";
import { rollCar } from "../utils/random";

export default function StoreScreen({ game, actions, route }) {
  const store = useMemo(
    () => stores.find((item) => item.id === route.params?.storeId) || stores[0],
    [route.params?.storeId]
  );
  const [shelfCar, setShelfCar] = useState(() => rollCar("store"));
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState("Raflarda yeni bir blister paket duruyor.");

  const price = shelfCar.buyPrice;
  const canBuy = game.money >= price;
  const meta = rarityMeta[shelfCar.rarity];

  function refreshShelf() {
    setShelfCar(rollCar("store"));
    setChecked(false);
    setMessage("Yeni raf tarandi. Paketlerden biri dikkat cekiyor.");
  }

  function inspectCar() {
    setChecked(true);
    setMessage(`${meta.shortLabel} kontrolu: ${meta.label} cikti.`);
  }

  function buyCar() {
    if (!canBuy) {
      setMessage("Cuzdanda yeterli para yok.");
      return;
    }

    actions.updateGame((current) => ({
      ...current,
      money: current.money - price,
      garage: [...current.garage, shelfCar],
      currentCar: shelfCar,
      stats: {
        ...current.stats,
        hunts: current.stats.hunts + 1,
        totalFound: current.stats.totalFound + 1
      },
      transactionHistory: [
        {
          id: `tx-${Date.now()}`,
          type: "buy",
          text: `${store.name}: ${shelfCar.name} satin alindi.`,
          amount: -price,
          date: new Date().toISOString()
        },
        ...current.transactionHistory
      ]
    }));
    setChecked(true);
    setMessage(`${shelfCar.name} koleksiyona eklendi. Tur: ${meta.label}.`);
    setShelfCar(rollCar("store"));
    setChecked(false);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.header, { borderColor: store.accent }]}>
        <Text style={styles.title}>{store.name}</Text>
        <Text style={styles.subtitle}>{store.district} raf turu / Bakiye {game.money} TL</Text>
      </View>

      <View style={styles.shelf}>
        <Text style={styles.shelfText}>Raflarda tek blister paket one cikti.</Text>
        <CarCard
          key={`${shelfCar.garageId}-${checked ? "checked" : "mystery"}`}
          car={checked ? shelfCar : { ...shelfCar, rarity: "regular", name: "Gizemli Blister" }}
          animated={game.settings.animations}
        />
        <Text style={styles.price}>Alis fiyati: {price} TL</Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="TH/STH Kontrol" onPress={inspectCar} tone="light" icon="magnify-scan" />
        <PrimaryButton title="Satin Al" onPress={buyCar} disabled={!canBuy} icon="cart-arrow-down" />
        <PrimaryButton title="Baska Rafa Bak" onPress={refreshShelf} tone="light" icon="refresh" />
        <PrimaryButton title="Magazadan Cik" onPress={() => actions.navigate("home")} tone="light" icon="exit-to-app" />
      </View>

      <Text style={styles.message}>{message}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 14
  },
  header: {
    gap: 4,
    borderLeftWidth: 5,
    paddingLeft: 12
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
  shelf: {
    gap: 10,
    borderRadius: 8,
    backgroundColor: "#f5efe1",
    borderColor: "#d2c5a5",
    borderWidth: 1,
    padding: 12
  },
  shelfText: {
    color: "#52616b",
    fontSize: 14,
    fontWeight: "800"
  },
  price: {
    color: "#0f7b45",
    fontSize: 18,
    fontWeight: "900"
  },
  actions: {
    gap: 10
  },
  message: {
    color: "#263238",
    fontSize: 15,
    fontWeight: "900"
  }
});
