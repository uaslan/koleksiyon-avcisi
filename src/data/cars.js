export const caseCost = 7000;
export const shelfCost = 500;
export const shopRentCost = 10000;

export const stores = [
  {
    id: "hodbiez-world",
    name: "Hodbiez World Bagcilar",
    district: "Bagcilar",
    accent: "#e54b2b"
  },
  {
    id: "toyz-r-as",
    name: "Toyz 'R' As Kadikoy",
    district: "Kadikoy",
    accent: "#1c7ed6"
  }
];

export const odds = {
  store: {
    regular: 0.75,
    treasure: 0.15,
    superTreasure: 0.1
  },
  case: {
    regular: 0.7,
    treasure: 0.2,
    superTreasure: 0.1
  }
};

export const rarityMeta = {
  regular: {
    label: "Normal",
    shortLabel: "N",
    color: "#536dfe",
    baseShopPrice: 500,
    wholesalePrice: 200,
    icon: "CAR"
  },
  treasure: {
    label: "Treasure Hunt",
    shortLabel: "TH",
    color: "#0f9d58",
    baseShopPrice: 2000,
    wholesalePrice: 1500,
    icon: "FIRE"
  },
  superTreasure: {
    label: "Super Treasure",
    shortLabel: "STH",
    color: "#c2185b",
    baseShopPrice: 5000,
    wholesalePrice: 3500,
    icon: "SHINE"
  }
};

export const starterCars = [
  {
    id: "starter-001",
    name: "Tofas Sahin",
    series: "Istanbul Sokaklari",
    buyPrice: 0,
    sellPrice: 150,
    rarity: "regular",
    condition: 82,
    marketPrice: 150
  },
  {
    id: "starter-002",
    name: "TH Jet Z",
    series: "Baslangic Hazinesi",
    buyPrice: 0,
    sellPrice: 1500,
    rarity: "treasure",
    condition: 94,
    marketPrice: 1500
  }
];

export const carPools = {
  regular: [
    { id: "r-001", name: "Nissan Skyline GTR R34", series: "JDM Legends", buyPrice: 150, sellPrice: 250 },
    { id: "r-002", name: "Toyota Supra MK4", series: "JDM Legends", buyPrice: 150, sellPrice: 250 },
    { id: "r-003", name: "Mazda RX-7", series: "Night Racers", buyPrice: 130, sellPrice: 220 },
    { id: "r-004", name: "Porsche 911 GT3 RS", series: "Track Stars", buyPrice: 140, sellPrice: 240 },
    { id: "r-005", name: "Audi RS6 Avant", series: "Euro Speed", buyPrice: 120, sellPrice: 200 },
    { id: "r-006", name: "Honda Civic Type R", series: "Street Tuner", buyPrice: 110, sellPrice: 180 },
    { id: "r-007", name: "BMW M3 E30", series: "Euro Icons", buyPrice: 130, sellPrice: 230 },
    { id: "r-008", name: "Ford Mustang GT", series: "Muscle Heat", buyPrice: 125, sellPrice: 210 },
    { id: "r-009", name: "Dodge Charger R/T", series: "Muscle Heat", buyPrice: 135, sellPrice: 225 },
    { id: "r-010", name: "Chevrolet Camaro ZL1", series: "Muscle Heat", buyPrice: 125, sellPrice: 215 },
    { id: "r-011", name: "Mercedes 190E Evo II", series: "Euro Icons", buyPrice: 145, sellPrice: 245 },
    { id: "r-012", name: "Volkswagen Golf MK1", series: "Retro Street", buyPrice: 95, sellPrice: 170 },
    { id: "r-013", name: "Renault 5 Turbo", series: "Rally Shelf", buyPrice: 105, sellPrice: 185 },
    { id: "r-014", name: "Subaru Impreza WRX", series: "Rally Shelf", buyPrice: 140, sellPrice: 235 },
    { id: "r-015", name: "Mitsubishi Lancer Evo IX", series: "Rally Shelf", buyPrice: 140, sellPrice: 235 },
    { id: "r-016", name: "Mini Cooper S", series: "City Classics", buyPrice: 90, sellPrice: 160 },
    { id: "r-017", name: "Tofas Dogan SLX", series: "Istanbul Sokaklari", buyPrice: 85, sellPrice: 155 },
    { id: "r-018", name: "Anadol A1", series: "Istanbul Sokaklari", buyPrice: 90, sellPrice: 165 },
    { id: "r-019", name: "Fiat 131 Mirafiori", series: "Retro Street", buyPrice: 100, sellPrice: 175 },
    { id: "r-020", name: "Peugeot 205 GTI", series: "Euro Icons", buyPrice: 110, sellPrice: 190 }
  ],
  treasure: [
    { id: "th-001", name: "Mazda 323 GT-R", series: "Treasure Hunt", buyPrice: 220, sellPrice: 1500 },
    { id: "th-002", name: "Ford Escort RS", series: "Treasure Hunt", buyPrice: 210, sellPrice: 1500 },
    { id: "th-003", name: "Dodge Van", series: "Treasure Hunt", buyPrice: 200, sellPrice: 1500 },
    { id: "th-004", name: "Custom Beetle TH", series: "Treasure Hunt", buyPrice: 190, sellPrice: 1450 },
    { id: "th-005", name: "Surf Crate TH", series: "Treasure Hunt", buyPrice: 210, sellPrice: 1550 },
    { id: "th-006", name: "Twin Mill TH", series: "Treasure Hunt", buyPrice: 230, sellPrice: 1600 },
    { id: "th-007", name: "Toyota AE86 TH", series: "Treasure Hunt", buyPrice: 240, sellPrice: 1700 },
    { id: "th-008", name: "Kadikoy Taxi TH", series: "Istanbul Sokaklari", buyPrice: 180, sellPrice: 1400 }
  ],
  superTreasure: [
    { id: "sth-001", name: "1971 Datsun 510", series: "Super Treasure", buyPrice: 350, sellPrice: 3500 },
    { id: "sth-002", name: "Nissan Silvia S15", series: "Super Treasure", buyPrice: 360, sellPrice: 3600 },
    { id: "sth-003", name: "Lamborghini Miura", series: "Super Treasure", buyPrice: 390, sellPrice: 3800 },
    { id: "sth-004", name: "Porsche 934.5 STH", series: "Super Treasure", buyPrice: 420, sellPrice: 4100 },
    { id: "sth-005", name: "Skyline R34 STH", series: "Super Treasure", buyPrice: 450, sellPrice: 4300 },
    { id: "sth-006", name: "Lamborghini Countach STH", series: "Super Treasure", buyPrice: 440, sellPrice: 4200 }
  ]
};
