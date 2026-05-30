import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

import PrimaryButton from "../components/PrimaryButton";
import { clearGame } from "../storage/saveLoad";

export default function SettingsScreen({ game, actions }) {
  async function reset() {
    await clearGame();
    actions.resetGame();
  }

  function toggleSetting(key) {
    actions.updateGame((current) => ({
      ...current,
      settings: {
        ...current.settings,
        [key]: !current.settings[key]
      }
    }));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ayarlar</Text>
        <Text style={styles.subtitle}>Kayit, ses ve animasyon tercihleri.</Text>
      </View>

      <View style={styles.panel}>
        <View style={styles.row}>
          <View>
            <Text style={styles.panelTitle}>Animasyon</Text>
            <Text style={styles.panelText}>Koli ve nadir arac efektleri</Text>
          </View>
          <Switch value={game.settings.animations} onValueChange={() => toggleSetting("animations")} />
        </View>
        <View style={styles.row}>
          <View>
            <Text style={styles.panelTitle}>Ses</Text>
            <Text style={styles.panelText}>Yerel efekt ayari</Text>
          </View>
          <Switch value={game.settings.sound} onValueChange={() => toggleSetting("sound")} />
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Veri Sifirlama</Text>
        <Text style={styles.panelText}>Tum cuzdan, koleksiyon, raf, dukkan ve gecmis yeni oyuna doner.</Text>
        <PrimaryButton title="Local Storage Temizle ve Sifirla" onPress={reset} tone="red" icon="delete-alert" />
      </View>

      <PrimaryButton title="Ana Menu" onPress={() => actions.navigate("home")} tone="light" icon="home-variant" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16
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
    gap: 12,
    borderRadius: 8,
    borderColor: "#d2c5a5",
    borderWidth: 1,
    backgroundColor: "#fffaf0",
    padding: 14
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  panelTitle: {
    color: "#263238",
    fontSize: 17,
    fontWeight: "900"
  },
  panelText: {
    color: "#52616b",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20
  }
});
