import React, { useMemo, useRef, useState } from "react";
import { Animated, Easing, FlatList, StyleSheet, Text, View } from "react-native";

import CarCard from "../components/CarCard";
import PrimaryButton from "../components/PrimaryButton";
import { caseCost } from "../data/cars";
import { rollCase, wholesaleValue } from "../utils/random";

export default function CaseOpeningScreen({ game, actions }) {
  const [caseCars, setCaseCars] = useState([]);
  const [resolved, setResolved] = useState(true);
  const [opening, setOpening] = useState(false);
  const [message, setMessage] = useState("Toptanci kolisi bekliyor.");
  const boxAnim = useRef(new Animated.Value(0)).current;
  const canOpen = game.money >= caseCost;

  const rareCars = useMemo(() => caseCars.filter((car) => car.rarity !== "regular"), [caseCars]);
  const normalCars = useMemo(() => caseCars.filter((car) => car.rarity === "regular"), [caseCars]);
  const normalTotal = useMemo(
    () => normalCars.reduce((sum, car) => sum + wholesaleValue(car), 0),
    [normalCars]
  );

  function openCase() {
    if (opening) {
      return;
    }

    if (!canOpen) {
      setMessage("Koli icin yeterli bakiye yok. Once magaza avlariyla para biriktir.");
      return;
    }

    const cars = rollCase(10);
    actions.updateGame((current) => ({
      ...current,
      money: current.money - caseCost,
      stats: {
        ...current.stats,
        casesOpened: current.stats.casesOpened + 1
      },
      transactionHistory: [
        {
          id: `tx-${Date.now()}`,
          type: "case",
          text: "Toptancidan 10'lu koli satin alindi.",
          amount: -caseCost,
          date: new Date().toISOString()
        },
        ...current.transactionHistory
      ]
    }));

    function finishOpen() {
      setCaseCars(cars);
      setResolved(false);
      setOpening(false);
      setMessage("Koli acildi. Nadirleri ayir, normalleri istersen toptan sat.");
    }

    if (!game.settings.animations) {
      finishOpen();
      return;
    }

    setCaseCars([]);
    setOpening(true);
    setMessage("Koli kapaklari aciliyor...");
    boxAnim.setValue(0);
    Animated.timing(boxAnim, {
      toValue: 1,
      duration: 720,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start(finishOpen);
  }

  function keepAll() {
    if (resolved || caseCars.length === 0) {
      return;
    }

    actions.addCars(caseCars);
    actions.addTransaction({
      type: "case-keep",
      text: `Koliden cikan ${caseCars.length} arac koleksiyona eklendi.`,
      amount: 0
    });
    setResolved(true);
    boxAnim.setValue(0);
    setMessage("Tum koli koleksiyona eklendi.");
  }

  function keepRaresSellNormals() {
    if (resolved || caseCars.length === 0) {
      return;
    }

    actions.updateGame((current) => ({
      ...current,
      money: current.money + normalTotal,
      garage: [...current.garage, ...rareCars],
      stats: {
        ...current.stats,
        totalFound: current.stats.totalFound + rareCars.length,
        sold: current.stats.sold + normalCars.length
      },
      transactionHistory: [
        {
          id: `tx-${Date.now()}`,
          type: "case-resolve",
          text: `${rareCars.length} nadir arac koleksiyona alindi, ${normalCars.length} normal arac toptan satildi.`,
          amount: normalTotal,
          date: new Date().toISOString()
        },
        ...current.transactionHistory
      ]
    }));
    setResolved(true);
    boxAnim.setValue(0);
    setMessage(`${normalTotal} TL toptan satis geliri geldi.`);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Toptanci Kolisi</Text>
        <Text style={styles.subtitle}>10 arac / Maliyet {caseCost} TL / Bakiye {game.money} TL</Text>
      </View>

      <View style={styles.box}>
        <Animated.View
          style={[
            styles.boxFlap,
            {
              transform: [
                {
                  rotateX: boxAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "-64deg"]
                  })
                },
                {
                  translateY: boxAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -14]
                  })
                }
              ]
            }
          ]}
        />
        <Animated.Text
          style={[
            styles.boxTop,
            {
              opacity: boxAnim.interpolate({
                inputRange: [0, 0.6, 1],
                outputRange: [1, 0.75, 0.35]
              })
            }
          ]}
        >
          SEALED CASE
        </Animated.Text>
        <Text style={styles.boxText}>Karton kapaklar acilir, blisterlar tek tek ortaya cikar.</Text>
        <Animated.View
          style={[
            styles.boxSpark,
            {
              opacity: boxAnim,
              transform: [
                {
                  scale: boxAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.75, 1.12]
                  })
                }
              ]
            }
          ]}
        >
          <Text style={styles.boxSparkText}>TH?</Text>
        </Animated.View>
      </View>

      <PrimaryButton
        title="Koliyi Satin Al ve Ac"
        onPress={openCase}
        disabled={!canOpen || !resolved || opening}
        icon="package-variant-closed"
      />

      <FlatList
        data={caseCars}
        keyExtractor={(item) => item.garageId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <CarCard car={item} compact animated={game.settings.animations} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Koli acilinca 10 arac burada listelenir.</Text>
          </View>
        }
      />

      {caseCars.length > 0 && !resolved ? (
        <View style={styles.actions}>
          <PrimaryButton title="Tumunu Koleksiyona Al" onPress={keepAll} tone="light" icon="archive-arrow-down" />
          <PrimaryButton
            title={`Nadirleri Al, Normalleri Sat (+${normalTotal} TL)`}
            onPress={keepRaresSellNormals}
            tone="green"
            icon="cash-multiple"
          />
        </View>
      ) : null}

      <Text style={styles.message}>{message}</Text>
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
    fontSize: 30,
    fontWeight: "900"
  },
  subtitle: {
    color: "#52616b",
    fontSize: 15,
    fontWeight: "800"
  },
  box: {
    minHeight: 98,
    borderRadius: 8,
    borderColor: "#8d6e63",
    borderWidth: 2,
    backgroundColor: "#d8a45f",
    padding: 14,
    gap: 6,
    overflow: "hidden"
  },
  boxFlap: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 34,
    backgroundColor: "#bf7d36",
    borderBottomColor: "#8d6e63",
    borderBottomWidth: 2
  },
  boxTop: {
    color: "#263238",
    fontSize: 20,
    fontWeight: "900"
  },
  boxText: {
    color: "#3e2b20",
    fontSize: 14,
    fontWeight: "800"
  },
  boxSpark: {
    position: "absolute",
    right: 16,
    bottom: 14,
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 27,
    backgroundColor: "#fff4cf",
    borderColor: "#f0b429",
    borderWidth: 2
  },
  boxSparkText: {
    color: "#c2185b",
    fontSize: 15,
    fontWeight: "900"
  },
  list: {
    gap: 12,
    paddingBottom: 8
  },
  actions: {
    gap: 10
  },
  empty: {
    minHeight: 180,
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
  },
  message: {
    color: "#263238",
    fontSize: 14,
    fontWeight: "900"
  }
});
