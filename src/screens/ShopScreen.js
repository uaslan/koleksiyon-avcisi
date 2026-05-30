import React, { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import CarCard from "../components/CarCard";
import PrimaryButton from "../components/PrimaryButton";
import { rarityMeta, shopRentCost } from "../data/cars";
import { rollCustomer } from "../utils/random";

export default function ShopScreen({ game, actions }) {
  const [shopName, setShopName] = useState(game.shopName || "Kadikoy Diecast");
  const [selectedId, setSelectedId] = useState(null);
  const [askingPrice, setAskingPrice] = useState("");
  const [message, setMessage] = useState("");

  const selectedCar = useMemo(
    () => game.garage.find((car) => car.garageId === selectedId),
    [game.garage, selectedId]
  );

  function rentShop() {
    if (game.money < shopRentCost) {
      setMessage("Dukkan kirasi icin 10000 TL gerekiyor.");
      return;
    }

    actions.updateGame((current) => ({
      ...current,
      money: current.money - shopRentCost,
      hasShop: true,
      shopName: shopName.trim() || "Koleksiyon Dukkani",
      transactionHistory: [
        {
          id: `tx-${Date.now()}`,
          type: "rent",
          text: `${shopName.trim() || "Koleksiyon Dukkani"} kiralandi.`,
          amount: -shopRentCost,
          date: new Date().toISOString()
        },
        ...current.transactionHistory
      ]
    }));
    setMessage("Tabela asildi. Artik kendi dukkanin var.");
  }

  function listSelectedCar() {
    const price = Number(askingPrice);

    if (!selectedCar || !price || price <= 0) {
      setMessage("Once arac sec ve gecerli fiyat gir.");
      return;
    }

    actions.updateGame((current) => ({
      ...current,
      garage: current.garage.filter((car) => car.garageId !== selectedCar.garageId),
      shopListings: [
        ...current.shopListings,
        {
          id: `listing-${selectedCar.garageId}`,
          car: selectedCar,
          askingPrice: Math.round(price)
        }
      ],
      transactionHistory: [
        {
          id: `tx-${Date.now()}`,
          type: "list",
          text: `${selectedCar.name} ${Math.round(price)} TL etiketiyle vitrine koyuldu.`,
          amount: 0,
          date: new Date().toISOString()
        },
        ...current.transactionHistory
      ]
    }));
    setSelectedId(null);
    setAskingPrice("");
    setMessage("Arac vitrine koyuldu.");
  }

  function welcomeCustomer(listing) {
    const result = rollCustomer(listing);
    setMessage(result.message);

    if (!result.sold) {
      return;
    }

    actions.updateGame((current) => ({
      ...current,
      money: current.money + listing.askingPrice,
      shopListings: current.shopListings.filter((item) => item.id !== listing.id),
      stats: {
        ...current.stats,
        sold: current.stats.sold + 1
      },
      transactionHistory: [
        {
          id: `tx-${Date.now()}`,
          type: "sale",
          text: `${listing.car.name} satildi.`,
          amount: listing.askingPrice,
          date: new Date().toISOString()
        },
        ...current.transactionHistory
      ]
    }));
  }

  function returnListing(listing) {
    actions.updateGame((current) => ({
      ...current,
      garage: [...current.garage, listing.car],
      shopListings: current.shopListings.filter((item) => item.id !== listing.id),
      transactionHistory: [
        {
          id: `tx-${Date.now()}`,
          type: "return",
          text: `${listing.car.name} vitrinden koleksiyona geri alindi.`,
          amount: 0,
          date: new Date().toISOString()
        },
        ...current.transactionHistory
      ]
    }));
    setMessage(`${listing.car.name} koleksiyona geri alindi.`);
  }

  if (!game.hasShop) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Dukkan Kirala</Text>
          <Text style={styles.subtitle}>Maliyet {shopRentCost} TL / Bakiye {game.money} TL</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Tabela Adi</Text>
          <TextInput value={shopName} onChangeText={setShopName} style={styles.input} />
          <PrimaryButton
            title="Dukkani Kirala"
            onPress={rentShop}
            disabled={game.money < shopRentCost}
            icon="key-variant"
          />
        </View>

        {message ? <Text style={styles.message}>{message}</Text> : null}
        <PrimaryButton title="Ana Menu" onPress={() => actions.navigate("home")} tone="light" icon="home-variant" />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{game.shopName}</Text>
        <Text style={styles.subtitle}>Vitrin: {game.shopListings.length} arac / Bakiye {game.money} TL</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Koleksiyondan Sec</Text>
        <FlatList
          horizontal
          data={game.garage}
          keyExtractor={(item) => item.garageId}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => {
            const meta = rarityMeta[item.rarity] || rarityMeta.regular;

            return (
              <Pressable
                onPress={() => {
                  setSelectedId(item.garageId);
                  setAskingPrice(String(meta.baseShopPrice));
                }}
                style={[styles.miniCard, selectedId === item.garageId && styles.selected]}
              >
                <Text style={styles.miniTitle}>{item.name}</Text>
                <Text style={[styles.miniPrice, { color: meta.color }]}>{meta.baseShopPrice} TL taban</Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={<Text style={styles.muted}>Koleksiyonda satilacak arac yok.</Text>}
        />

        {selectedCar ? <CarCard car={selectedCar} compact /> : null}

        <TextInput
          keyboardType="numeric"
          onChangeText={setAskingPrice}
          placeholder="Satis fiyati"
          style={styles.input}
          value={askingPrice}
        />
        <PrimaryButton title="Vitrine Koy" onPress={listSelectedCar} tone="green" icon="store-plus" />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Vitrin</Text>
        {game.shopListings.length === 0 ? <Text style={styles.muted}>Vitrin bos.</Text> : null}
        {game.shopListings.map((item) => (
          <View key={item.id} style={styles.listing}>
            <View style={styles.listingText}>
              <Text style={styles.listingTitle}>{item.car.name}</Text>
              <Text style={styles.listingMeta}>Etiket: {item.askingPrice} TL</Text>
            </View>
            <View style={styles.listingActions}>
              <PrimaryButton title="Musteri" onPress={() => welcomeCustomer(item)} tone="light" icon="account-cash" />
              <PrimaryButton title="Geri Al" onPress={() => returnListing(item)} tone="light" icon="archive-arrow-up" />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Son Islemler</Text>
        {game.transactionHistory.slice(0, 6).map((item) => (
          <Text key={item.id} style={styles.history}>
            {item.text} {item.amount ? `(${item.amount} TL)` : ""}
          </Text>
        ))}
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}
      <PrimaryButton title="Ana Menu" onPress={() => actions.navigate("home")} tone="light" icon="home-variant" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    gap: 12
  },
  header: {
    gap: 4
  },
  title: {
    color: "#263238",
    fontSize: 30,
    fontWeight: "900"
  },
  subtitle: {
    color: "#52616b",
    fontSize: 15,
    fontWeight: "800"
  },
  panel: {
    gap: 10,
    borderRadius: 8,
    borderColor: "#d2c5a5",
    borderWidth: 1,
    backgroundColor: "#fffaf0",
    padding: 12
  },
  panelTitle: {
    color: "#263238",
    fontSize: 17,
    fontWeight: "900"
  },
  horizontalList: {
    gap: 10,
    minHeight: 78
  },
  miniCard: {
    width: 144,
    borderRadius: 8,
    borderColor: "#d2c5a5",
    borderWidth: 1,
    backgroundColor: "#fff",
    padding: 10,
    justifyContent: "space-between"
  },
  selected: {
    borderColor: "#0f7b45",
    borderWidth: 2
  },
  miniTitle: {
    color: "#263238",
    fontSize: 13,
    fontWeight: "900"
  },
  miniPrice: {
    fontSize: 13,
    fontWeight: "900"
  },
  input: {
    minHeight: 46,
    borderRadius: 8,
    borderColor: "#d2c5a5",
    borderWidth: 1,
    backgroundColor: "#fff",
    color: "#263238",
    paddingHorizontal: 12,
    fontSize: 16,
    fontWeight: "700"
  },
  listing: {
    gap: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10
  },
  listingText: {
    flex: 1
  },
  listingTitle: {
    color: "#263238",
    fontSize: 15,
    fontWeight: "900"
  },
  listingMeta: {
    color: "#52616b",
    fontSize: 13,
    fontWeight: "800"
  },
  listingActions: {
    flexDirection: "row",
    gap: 8
  },
  muted: {
    color: "#667",
    fontSize: 14,
    fontWeight: "700"
  },
  history: {
    color: "#52616b",
    fontSize: 13,
    fontWeight: "700"
  },
  message: {
    color: "#263238",
    fontSize: 14,
    fontWeight: "900"
  }
});
