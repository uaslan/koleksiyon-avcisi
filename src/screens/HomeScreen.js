import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import PrimaryButton from "../components/PrimaryButton";
import ToyCarVisual from "../components/ToyCarVisual";
import { shelfCost, stores } from "../data/cars";

export default function HomeScreen({ game, actions }) {
  function buyShelf() {
    if (game.money < shelfCost) {
      return;
    }

    actions.updateGame((current) => ({
      ...current,
      money: current.money - shelfCost,
      garageShelves: current.garageShelves + 1,
      transactionHistory: [
        {
          id: `tx-${Date.now()}`,
          type: "shelf",
          text: "Garaja yeni raf alindi.",
          amount: -shelfCost,
          date: new Date().toISOString()
        },
        ...current.transactionHistory
      ]
    }));
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}>Koleksiyon Avcisi</Text>
        <Text style={styles.subtitle}>Istanbul Sokaklari</Text>
        <Text style={styles.money}>{game.money} TL</Text>
      </View>

      <View style={styles.hero}>
        {game.currentCar ? (
          <View style={styles.heroVisual}>
            <ToyCarVisual car={game.currentCar} animated={game.settings.animations} />
          </View>
        ) : null}
        <Text style={styles.heroLabel}>Aktif Arac</Text>
        <Text style={styles.heroTitle}>{game.currentCar?.name || "Tofas Sahin"}</Text>
        <Text style={styles.heroText}>
          Koleksiyon: {game.garage.length} arac / Raf: {game.garageShelves} / Dukkan:{" "}
          {game.hasShop ? game.shopName : "Yok"}
        </Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{game.stats.totalFound}</Text>
          <Text style={styles.statLabel}>Bulunan</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{game.stats.casesOpened}</Text>
          <Text style={styles.statLabel}>Koli</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{game.stats.sold}</Text>
          <Text style={styles.statLabel}>Satis</Text>
        </View>
      </View>

      <View style={styles.menu}>
        {stores.map((store) => (
          <PrimaryButton
            key={store.id}
            title={`${store.name} Magazasina Git`}
            onPress={() => actions.navigate("store", { storeId: store.id })}
            icon="store-search"
          />
        ))}
        <PrimaryButton
          title="Toptancidan 10'lu Koli Al"
          onPress={() => actions.navigate("caseOpening")}
          icon="package-variant-closed"
        />
        <PrimaryButton title="Kendi Dukkanin" onPress={() => actions.navigate("shop")} tone="light" icon="storefront" />
        <PrimaryButton
          title={`Garaja Raf Al (${shelfCost} TL)`}
          onPress={buyShelf}
          disabled={game.money < shelfCost}
          tone="light"
          icon="archive-plus"
        />
        <PrimaryButton title="Koleksiyon / Garaj" onPress={() => actions.navigate("garage")} tone="light" icon="garage-variant" />
        <PrimaryButton title="Ayarlar" onPress={() => actions.navigate("settings")} tone="light" icon="cog" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 16
  },
  top: {
    gap: 4
  },
  title: {
    color: "#263238",
    fontSize: 34,
    fontWeight: "900"
  },
  subtitle: {
    color: "#e54b2b",
    fontSize: 15,
    fontWeight: "900"
  },
  money: {
    color: "#0f7b45",
    fontSize: 25,
    fontWeight: "900"
  },
  hero: {
    gap: 6,
    borderRadius: 8,
    backgroundColor: "#fff4cf",
    borderColor: "#f0b429",
    borderWidth: 1,
    padding: 14
  },
  heroVisual: {
    alignItems: "center",
    marginBottom: 2
  },
  heroLabel: {
    color: "#52616b",
    fontSize: 12,
    fontWeight: "900"
  },
  heroTitle: {
    color: "#263238",
    fontSize: 22,
    fontWeight: "900"
  },
  heroText: {
    color: "#52616b",
    fontSize: 14,
    fontWeight: "700"
  },
  stats: {
    flexDirection: "row",
    gap: 10
  },
  stat: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#fffaf0",
    borderColor: "#d2c5a5",
    borderWidth: 1,
    padding: 14
  },
  statValue: {
    color: "#263238",
    fontSize: 24,
    fontWeight: "900"
  },
  statLabel: {
    color: "#667",
    fontSize: 13,
    fontWeight: "700"
  },
  menu: {
    gap: 12
  }
});
