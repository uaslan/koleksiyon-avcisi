import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import HomeScreen from "./src/screens/HomeScreen";
import StoreScreen from "./src/screens/StoreScreen";
import CaseOpeningScreen from "./src/screens/CaseOpeningScreen";
import GarageScreen from "./src/screens/GarageScreen";
import ShopScreen from "./src/screens/ShopScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { createNewSave, loadGame, saveGame } from "./src/storage/saveLoad";

const screens = {
  home: HomeScreen,
  store: StoreScreen,
  caseOpening: CaseOpeningScreen,
  garage: GarageScreen,
  shop: ShopScreen,
  settings: SettingsScreen
};

const screenTitles = {
  home: "Ana Menu",
  store: "Magaza Avi",
  caseOpening: "Koli Acma",
  garage: "Garaj",
  shop: "Dukkan",
  settings: "Ayarlar"
};

const bottomNav = [
  { name: "home", label: "Ana", icon: "home-variant" },
  { name: "garage", label: "Garaj", icon: "garage-variant" },
  { name: "shop", label: "Dukkan", icon: "storefront" },
  { name: "settings", label: "Ayar", icon: "cog" }
];

export default function App() {
  const [route, setRoute] = useState({ name: "home", params: {} });
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const transition = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let mounted = true;

    loadGame().then((save) => {
      if (mounted) {
        setGame(save || createNewSave());
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!loading && game) {
      saveGame(game);
    }
  }, [game, loading]);

  const Screen = screens[route.name] || HomeScreen;

  useEffect(() => {
    transition.setValue(0);
    Animated.timing(transition, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }, [route.name, transition]);

  const actions = useMemo(
    () => ({
      navigate: (name, params = {}) => setRoute({ name, params }),
      updateGame: setGame,
      addTransaction: (entry) => {
        setGame((current) => ({
          ...current,
          transactionHistory: [
            {
              id: `tx-${Date.now()}-${Math.random().toString(16).slice(2)}`,
              date: new Date().toISOString(),
              ...entry
            },
            ...current.transactionHistory
          ].slice(0, 40)
        }));
      },
      addCars: (cars) => {
        setGame((current) => ({
          ...current,
          garage: [...current.garage, ...cars],
          stats: {
            ...current.stats,
            totalFound: current.stats.totalFound + cars.length
          }
        }));
      },
      spendMoney: (amount) => {
        setGame((current) => ({
          ...current,
          money: Math.max(0, current.money - amount)
        }));
      },
      earnMoney: (amount) => {
        setGame((current) => ({
          ...current,
          money: current.money + amount
        }));
      },
      resetGame: () => {
        setGame(createNewSave());
        setRoute({ name: "home", params: {} });
      }
    }),
    []
  );

  if (loading || !game) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Koleksiyon hazirlaniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.appBar}>
        <Pressable
          accessibilityRole="button"
          onPress={() => actions.navigate("home")}
          style={styles.appBarButton}
        >
          <MaterialCommunityIcons
            name={route.name === "home" ? "toy-brick" : "arrow-left"}
            size={24}
            color="#263238"
          />
        </Pressable>
        <View style={styles.appBarTitleWrap}>
          <Text style={styles.appBarTitle}>{screenTitles[route.name]}</Text>
          <Text style={styles.appBarMeta}>{game.money} TL</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => actions.navigate("caseOpening")}
          style={styles.appBarButton}
        >
          <MaterialCommunityIcons name="package-variant-closed" size={24} color="#263238" />
        </Pressable>
      </View>

      <Animated.View
        style={[
          styles.screen,
          {
            opacity: transition,
            transform: [
              {
                translateY: transition.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0]
                })
              }
            ]
          }
        ]}
      >
        <Screen game={game} actions={actions} route={route} />
      </Animated.View>

      <View style={styles.bottomNav}>
        {bottomNav.map((item) => {
          const active = route.name === item.name;

          return (
            <Pressable
              accessibilityRole="button"
              key={item.name}
              onPress={() => actions.navigate(item.name)}
              style={[styles.navItem, active && styles.activeNavItem]}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={22}
                color={active ? "#fff" : "#52616b"}
              />
              <Text style={[styles.navLabel, active && styles.activeNavLabel]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f3e8"
  },
  appBar: {
    minHeight: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    borderBottomColor: "#eadfc8",
    borderBottomWidth: 1,
    backgroundColor: "#fffaf0"
  },
  appBarButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#f5efe1",
    borderColor: "#d2c5a5",
    borderWidth: 1
  },
  appBarTitleWrap: {
    flex: 1
  },
  appBarTitle: {
    color: "#263238",
    fontSize: 18,
    fontWeight: "900"
  },
  appBarMeta: {
    color: "#0f7b45",
    fontSize: 13,
    fontWeight: "900"
  },
  screen: {
    flex: 1
  },
  bottomNav: {
    minHeight: 70,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopColor: "#eadfc8",
    borderTopWidth: 1,
    backgroundColor: "#fffaf0"
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    borderRadius: 8
  },
  activeNavItem: {
    backgroundColor: "#263238"
  },
  navLabel: {
    color: "#52616b",
    fontSize: 11,
    fontWeight: "900"
  },
  activeNavLabel: {
    color: "#fff"
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  loadingText: {
    color: "#263238",
    fontSize: 18,
    fontWeight: "700"
  }
});
