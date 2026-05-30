import { carPools, odds, rarityMeta } from "../data/cars";

function pickOne(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function rollRarity(table) {
  const roll = Math.random();

  if (roll < table.superTreasure) {
    return "superTreasure";
  }

  if (roll < table.superTreasure + table.treasure) {
    return "treasure";
  }

  return "regular";
}

export function createGarageItem(car, rarity = car.rarity || "regular") {
  const condition = car.condition || Math.floor(78 + Math.random() * 23);
  const garageId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const variance = 0.92 + Math.random() * 0.18;
  const marketPrice = car.marketPrice || Math.round((car.sellPrice || rarityMeta[rarity].wholesalePrice) * variance);

  return {
    ...car,
    garageId,
    rarity,
    condition,
    marketPrice,
    foundAt: new Date().toISOString()
  };
}

export function rollCar(source = "store") {
  const rarity = rollRarity(odds[source] || odds.store);
  return createGarageItem(pickOne(carPools[rarity]), rarity);
}

export function rollCase(count = 10) {
  return Array.from({ length: count }, () => rollCar("case"));
}

export function appraiseCar(car) {
  const meta = rarityMeta[car.rarity] || rarityMeta.regular;
  return Math.max(car.marketPrice || 0, car.sellPrice || 0, meta.wholesalePrice);
}

export function wholesaleValue(car) {
  const meta = rarityMeta[car.rarity] || rarityMeta.regular;
  return car.rarity === "regular" ? meta.wholesalePrice : meta.wholesalePrice;
}

export function rollCustomer(listing) {
  const meta = rarityMeta[listing.car.rarity] || rarityMeta.regular;
  const basePrice = meta.baseShopPrice;
  const priceRatio = listing.askingPrice / basePrice;
  const interest = Math.random();

  let chance = 0.82;

  if (priceRatio > 2) {
    chance = 0.12;
  } else if (priceRatio > 1.55) {
    chance = 0.34;
  } else if (priceRatio < 0.9) {
    chance = 0.94;
  }

  const sold = interest < chance;
  const offer = Math.round(basePrice * (0.85 + Math.random() * 0.35));

  return {
    sold,
    offer,
    message: sold
      ? `${listing.car.name} satildi. Musteri etiketi kabul etti.`
      : `Musteri ${offer} TL teklif etti, satis olmadi.`
  };
}
