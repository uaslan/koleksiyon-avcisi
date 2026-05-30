import AsyncStorage from "@react-native-async-storage/async-storage";

import { starterCars } from "../data/cars";
import { createGarageItem } from "../utils/random";

const saveKey = "koleksiyon-avcisi-save";

function starterCollection() {
  return starterCars.map((car) => createGarageItem(car, car.rarity));
}

export function createNewSave() {
  const collection = starterCollection();

  return {
    money: 1000,
    currentCar: collection[0],
    garage: collection,
    garageShelves: 0,
    hasShop: false,
    shopName: "",
    shopListings: [],
    transactionHistory: [
      {
        id: `tx-${Date.now()}`,
        type: "start",
        text: "Oyun basladi: Tofas Sahin ve TH Jet Z koleksiyona eklendi.",
        amount: 0,
        date: new Date().toISOString()
      }
    ],
    lastOpenedDate: new Date().toISOString(),
    settings: {
      animations: true,
      sound: true
    },
    stats: {
      totalFound: collection.length,
      hunts: 0,
      casesOpened: 0,
      sold: 0
    }
  };
}

function normalizeSave(save) {
  const fresh = createNewSave();

  return {
    ...fresh,
    ...save,
    garage: save.garage || save.collection || fresh.garage,
    currentCar: save.currentCar || (save.garage || fresh.garage)[0],
    garageShelves: save.garageShelves || 0,
    hasShop: Boolean(save.hasShop),
    shopName: save.shopName || "",
    shopListings: save.shopListings || [],
    transactionHistory: save.transactionHistory || [],
    settings: {
      ...fresh.settings,
      ...(save.settings || {})
    },
    stats: {
      ...fresh.stats,
      ...(save.stats || {})
    },
    lastOpenedDate: new Date().toISOString()
  };
}

export async function loadGame() {
  try {
    const raw = await AsyncStorage.getItem(saveKey);
    return raw ? normalizeSave(JSON.parse(raw)) : null;
  } catch (error) {
    console.warn("Kayit okunamadi", error);
    return null;
  }
}

export async function saveGame(game) {
  try {
    await AsyncStorage.setItem(saveKey, JSON.stringify(game));
  } catch (error) {
    console.warn("Kayit yazilamadi", error);
  }
}

export async function clearGame() {
  try {
    await AsyncStorage.removeItem(saveKey);
  } catch (error) {
    console.warn("Kayit silinemedi", error);
  }
}
