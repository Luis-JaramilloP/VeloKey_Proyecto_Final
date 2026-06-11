export interface Seller {
  id: string;
  name: string;
  rating: number;
  positiveReviews: number;
  price: number;
  stock: number;
  deliveryType: "INSTANT" | "MANUAL";
}

export interface Game {
  id: string;
  title: string;
  genre: string[];
  platform: string;
  region: string;
  regionWarning?: string;
  isActivatedInLocalRegion: boolean;
  rating: number;
  basePrice: number;
  discount: number;
  coverUrl: string;
  screenshots: string[];
  developer: string;
  publisher: string;
  description: string;
  releaseYear: number;
  sellers: Seller[];
}

export const GAMES_DATABASE: Game[] = [
  {
    id: "elden-ring",
    title: "Elden Ring: Shadow of the Erdtree Edition",
    genre: ["RPG", "Fantasy", "Action"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.9,
    basePrice: 299900,
    discount: 37,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/header.jpg"
    ],
    developer: "FromSoftware Inc.",
    publisher: "Bandai Namco Entertainment",
    description: "Levántate, Sinluz, y déjate guiar por la gracia para esgrimir el poder del Círculo de Elden y convertirte en el Señor de Elden en las Tierras Intermedias. Disfruta de la colosal expansión 'Shadow of the Erdtree', con nuevos jefes, armas y misteriosas ruinas.",
    releaseYear: 2024,
    sellers: [
      { id: "s-elden-1", name: "PremiumKeys_ES", rating: 99.2, positiveReviews: 48512, price: 189900, stock: 45, deliveryType: "INSTANT" },
      { id: "s-elden-2", name: "SuperGamingKeys", rating: 98.4, positiveReviews: 12401, price: 194500, stock: 12, deliveryType: "INSTANT" },
      { id: "s-elden-3", name: "Alpha_Codes", rating: 96.1, positiveReviews: 4322, price: 185000, stock: 3, deliveryType: "MANUAL" }
    ]
  },
  {
    id: "gta-v",
    title: "Grand Theft Auto V: Premium Edition",
    genre: ["Action", "Open World", "Shooter"],
    platform: "Epic Games",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.8,
    basePrice: 119900,
    discount: 60,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/header.jpg"
    ],
    developer: "Rockstar North",
    publisher: "Rockstar Games",
    description: "Cuando un joven estafador callejero, un ladrón de bancos retirado y un psicópata aterrador se ven involucrados con lo peor del mundo criminal, deben realizar una serie de peligrosos golpes para sobrevivir en una ciudad implacable.",
    releaseYear: 2013,
    sellers: [
      { id: "s-gta-1", name: "Giga_Store", rating: 97.8, positiveReviews: 98319, price: 47900, stock: 120, deliveryType: "INSTANT" },
      { id: "s-gta-2", name: "FlashKeys Store", rating: 99.5, positiveReviews: 3220, price: 49900, stock: 44, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "cyberpunk-2077",
    title: "Cyberpunk 2077: Phantom Liberty Bundle",
    genre: ["RPG", "Cyberpunk", "Sci-Fi"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.7,
    basePrice: 359900,
    discount: 45,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1091500/header.jpg"
    ],
    developer: "CD PROJEKT RED",
    publisher: "CD PROJEKT RED",
    description: "Cyberpunk 2077 es un RPG de acción y aventura de mundo abierto ambientado en la megalópolis de Night City, donde juegas como un mercenario cyberpunk en una lucha a vida o muerte por la supervivencia. Incluye la expansión de suspenso y espionaje Phantom Liberty.",
    releaseYear: 2023,
    sellers: [
      { id: "s-cyber-1", name: "Nexus_Codes", rating: 98.9, positiveReviews: 34102, price: 197900, stock: 80, deliveryType: "INSTANT" },
      { id: "s-cyber-2", name: "NightCitySellers", rating: 94.2, positiveReviews: 8110, price: 189900, stock: 15, deliveryType: "INSTANT" },
      { id: "s-cyber-3", name: "CheapOffers", rating: 95.8, positiveReviews: 2450, price: 185000, stock: 4, deliveryType: "MANUAL" }
    ]
  },
  {
    id: "fc-26",
    title: "EA Sports FC 26 (FIFA 26)",
    genre: ["Sports", "Soccer", "Multiplayer"],
    platform: "EA App",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.2,
    basePrice: 279900,
    discount: 30,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2669320/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2669320/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2669320/header.jpg"
    ],
    developer: "EA Vancouver",
    publisher: "EA Sports",
    description: "EA SPORTS FC 26 te da la bienvenida al juego del mundo: la experiencia futbolística más realista con tecnología HyperMotion, ligas completamente actualizadas, estilos de juego optimizados por Opta y una atmósfera de partido inigualable.",
    releaseYear: 2025,
    sellers: [
      { id: "s-fc-1", name: "FifaClub_Keys", rating: 99.4, positiveReviews: 14092, price: 195900, stock: 55, deliveryType: "INSTANT" },
      { id: "s-fc-2", name: "InstantActivations", rating: 98.2, positiveReviews: 24719, price: 197500, stock: 30, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "minecraft",
    title: "Minecraft: Java & Bedrock Edition",
    genre: ["Sandbox", "Adventure", "Indie"],
    platform: "Xbox",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.9,
    basePrice: 119900,
    discount: 15,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1928870/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1928870/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1928870/header.jpg"
    ],
    developer: "Mojang Studios",
    publisher: "Xbox Game Studios",
    description: "Crea, explora, sobrevive y repite. Minecraft: Java y Bedrock Edition ahora vienen juntos en un solo paquete para PC, ofreciéndote acceso unificado y juego multiplataforma para disfrutar con amigos de cualquier edición moderna.",
    releaseYear: 2011,
    sellers: [
      { id: "s-mine-1", name: "BlockManiacs", rating: 99.7, positiveReviews: 45110, price: 99900, stock: 99, deliveryType: "INSTANT" },
      { id: "s-mine-2", name: "PixelPerfectKeys", rating: 96.8, positiveReviews: 890, price: 95000, stock: 8, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "rdr2",
    title: "Red Dead Redemption 2",
    genre: ["Action", "Open World", "Adventure"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.9,
    basePrice: 239900,
    discount: 67,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1174180/header.jpg"
    ],
    developer: "Rockstar Games",
    publisher: "Rockstar Games",
    description: "Ganador de más de 175 premios al Juego del Año, Red Dead Redemption 2 es la epopeya de Arthur Morgan y la infame banda de Van der Linde, fugitivos que intentan sobrevivir en el corazón de una América en el ocaso de la era del Salvaje Oeste.",
    releaseYear: 2018,
    sellers: [
      { id: "s-rdr-1", name: "WildWest_Keys", rating: 98.6, positiveReviews: 12519, price: 79000, stock: 67, deliveryType: "INSTANT" },
      { id: "s-rdr-2", name: "OutlawGamer", rating: 93.4, positiveReviews: 1040, price: 75900, stock: 5, deliveryType: "MANUAL" }
    ]
  },
  {
    id: "hogwarts-legacy",
    title: "Hogwarts Legacy",
    genre: ["RPG", "Fantasy", "Adventure"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.6,
    basePrice: 239900,
    discount: 50,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/990080/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/990080/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/990080/header.jpg"
    ],
    developer: "Avalanche Software",
    publisher: "Warner Bros. Games",
    description: "Hogwarts Legacy es un inmersivo RPG de acción en mundo abierto ambientado en el mágico universo de los libros de Harry Potter. Toma el control y escribe tu propia historia en el colegio de magia más famoso del mundo.",
    releaseYear: 2023,
    sellers: [
      { id: "s-hog-1", name: "Wizards_Store", rating: 99.1, positiveReviews: 32018, price: 119900, stock: 40, deliveryType: "INSTANT" },
      { id: "s-hog-2", name: "MundaneKeys", rating: 97.5, positiveReviews: 1540, price: 117500, stock: 11, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "spiderman-2",
    title: "Marvel's Spider-Man 2",
    genre: ["Action", "Adventure", "Superhero"],
    platform: "PlayStation",
    region: "USA",
    regionWarning: "Este código solo se puede canjear en cuentas PSN de Estados Unidos (USA).",
    isActivatedInLocalRegion: false,
    rating: 4.8,
    basePrice: 279900,
    discount: 20,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2109330/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2109330/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2109330/header.jpg"
    ],
    developer: "Insomniac Games",
    publisher: "Sony Interactive Entertainment",
    description: "Los Spider-Men Peter Parker y Miles Morales regresan en una espectacular aventura dentro de la aclamada franquicia de Marvel. Colúmpiate, salta y usa las nuevas alarañas para explorar Nueva York, alternando entre ambos héroes.",
    releaseYear: 2023,
    sellers: [
      { id: "s-spy-1", name: "US_SpecialistKeys", rating: 99.8, positiveReviews: 54101, price: 219900, stock: 40, deliveryType: "INSTANT" },
      { id: "s-spy-2", name: "HeroicFlares", rating: 95.2, positiveReviews: 1202, price: 215900, stock: 2, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "mario-odyssey",
    title: "Super Mario Odyssey",
    genre: ["Platformer", "Family", "Adventure"],
    platform: "Nintendo",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.9,
    basePrice: 239900,
    discount: 18,
    coverUrl: "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?q=80&w=600&auto=format&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=800&auto=format&fit=crop"
    ],
    developer: "Nintendo EPD",
    publisher: "Nintendo",
    description: "¡Acompaña a Mario en una aventura masiva en 3D por todo el mundo y usa sus nuevas habilidades para conseguir energilunas, reparar la aeronave Odyssey y rescatar a la princesa Peach de los malvados planes de boda de Bowser!",
    releaseYear: 2017,
    sellers: [
      { id: "s-mar-1", name: "MushroomKingdom_Gifts", rating: 99.6, positiveReviews: 8940, price: 195900, stock: 22, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "forza-5",
    title: "Forza Horizon 5: Premium Edition",
    genre: ["Racing", "Simulation", "Open World"],
    platform: "Xbox",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.8,
    basePrice: 399900,
    discount: 55,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/header.jpg"
    ],
    developer: "Playground Games",
    publisher: "Xbox Game Studios",
    description: "¡Tu aventura Horizon definitiva te espera! Explora los vibrantes y cambiantes paisajes de mundo abierto de México mientras disfrutas de una conducción divertida e ilimitada a bordo de cientos de los mejores autos del planeta.",
    releaseYear: 2021,
    sellers: [
      { id: "s-for-1", name: "ApexRacer_Shop", rating: 98.9, positiveReviews: 31201, price: 179900, stock: 35, deliveryType: "INSTANT" },
      { id: "s-for-2", name: "SpeedyCodes", rating: 97.4, positiveReviews: 4325, price: 182000, stock: 15, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "black-myth-wukong",
    title: "Black Myth: Wukong",
    genre: ["RPG", "Action", "Fantasy"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.9,
    basePrice: 239900,
    discount: 15,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2358720/header.jpg"
    ],
    developer: "Game Science",
    publisher: "Game Science",
    description: "Black Myth: Wukong es un RPG de acción inspirado en la mitología china y la novela clásica 'Viaje al Oeste'. Te convertirás en el Predestinado y te adentrarás en un viaje repleto de maravillas y temibles desafíos para descubrir la verdad de la leyenda.",
    releaseYear: 2024,
    sellers: [
      { id: "s-wukong-1", name: "Wukong_Keys", rating: 99.1, positiveReviews: 8312, price: 203900, stock: 40, deliveryType: "INSTANT" },
      { id: "s-wukong-2", name: "EasternGamer", rating: 96.5, positiveReviews: 1204, price: 205000, stock: 10, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "the-witcher-3",
    title: "The Witcher 3: Wild Hunt - Complete Edition",
    genre: ["RPG", "Open World", "Fantasy"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.9,
    basePrice: 149900,
    discount: 75,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/292030/header.jpg"
    ],
    developer: "CD PROJEKT RED",
    publisher: "CD PROJEKT RED",
    description: "Eres Geralt de Rivia, un cazador de monstruos a sueldo en un continente devastado por la guerra e infestado de criaturas mágicas. Tu misión actual: encontrar a Ciri, la niña de la profecía, un arma viviente capaz de alterar el mundo.",
    releaseYear: 2015,
    sellers: [
      { id: "s-witcher-1", name: "NorthernKeys", rating: 99.5, positiveReviews: 95402, price: 37400, stock: 150, deliveryType: "INSTANT" },
      { id: "s-witcher-2", name: "Red_Witcher Store", rating: 98.2, positiveReviews: 5410, price: 38500, stock: 50, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "re4-remake",
    title: "Resident Evil 4 Remake",
    genre: ["Action", "Horror", "Survival"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.8,
    basePrice: 159900,
    discount: 50,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg"
    ],
    developer: "CAPCOM Co., Ltd.",
    publisher: "CAPCOM Co., Ltd.",
    description: "La supervivencia es solo el comienzo. Seis años después del desastre biológico de Raccoon City, el agente Leon S. Kennedy es enviado a rescatar a la hija del presidente de los Estados Unidos a un aislado pueblo europeo sumido en la locura.",
    releaseYear: 2023,
    sellers: [
      { id: "s-re4-1", name: "Capcom_Specialist", rating: 99.3, positiveReviews: 14201, price: 79900, stock: 30, deliveryType: "INSTANT" },
      { id: "s-re4-2", name: "BiohazardKeys", rating: 94.8, positiveReviews: 3220, price: 81500, stock: 8, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "helldivers-2",
    title: "Helldivers 2",
    genre: ["Action", "Shooter", "Multiplayer"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.7,
    basePrice: 159900,
    discount: 20,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/553850/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/553850/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/553850/header.jpg"
    ],
    developer: "Arrowhead Game Studios",
    publisher: "PlayStation Publishing",
    description: "La última línea de defensa de la galaxia. Únete a los Helldivers y lucha por la libertad junto a tus amigos en una galaxia hostil, en este trepidante y caótico shooter en tercera persona cooperativo de gran acción.",
    releaseYear: 2024,
    sellers: [
      { id: "s-hd-1", name: "SuperEarth_Supply", rating: 99.7, positiveReviews: 31890, price: 127900, stock: 65, deliveryType: "INSTANT" },
      { id: "s-hd-2", name: "LibertyRetailers", rating: 98.4, positiveReviews: 5410, price: 129500, stock: 20, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "zelda-totk",
    title: "The Legend of Zelda: Tears of the Kingdom",
    genre: ["RPG", "Open World", "Adventure"],
    platform: "Nintendo",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.9,
    basePrice: 299900,
    discount: 10,
    coverUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=800&auto=format&fit=crop"
    ],
    developer: "Nintendo EPD",
    publisher: "Nintendo",
    description: "Una aventura épica a través de la tierra y los cielos de Hyrule te espera en Tears of the Kingdom. La aventura es tuya para crearla en un vasto mundo donde tu imaginación es el único límite.",
    releaseYear: 2023,
    sellers: [
      { id: "s-zelda-1", name: "HyruleKeys_ES", rating: 99.8, positiveReviews: 8430, price: 269900, stock: 15, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "baldurs-gate-3",
    title: "Baldur's Gate 3",
    genre: ["RPG", "Fantasy", "Multiplayer"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.9,
    basePrice: 219900,
    discount: 20,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1086940/header.jpg"
    ],
    developer: "Larian Studios",
    publisher: "Larian Studios",
    description: "Reúne a tu grupo y regresa a los Reinos Olvidados en una historia de compañerismo, traición, sacrificio y la tentación del poder absoluto. Extrañas habilidades están despertando dentro de ti debido a un parásito de azotamentes.",
    releaseYear: 2023,
    sellers: [
      { id: "s-bg3-1", name: "Larian_Resellers", rating: 99.6, positiveReviews: 42109, price: 175900, stock: 45, deliveryType: "INSTANT" },
      { id: "s-bg3-2", name: "SwordCoastCodes", rating: 97.2, positiveReviews: 2310, price: 179000, stock: 11, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "ghost-of-tsushima",
    title: "Ghost of Tsushima DIRECTOR'S CUT",
    genre: ["Action", "Open World", "Adventure"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.8,
    basePrice: 239900,
    discount: 30,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215430/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215430/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2215430/header.jpg"
    ],
    developer: "Sucker Punch Productions",
    publisher: "PlayStation Publishing",
    description: "A finales del siglo XIII, el imperio mongol ha devastado naciones enteras en su campaña por conquistar Oriente. Jin Sakai, un guerrero samurái, debe decidir si seguir el estricto código de honor o convertirse en el Fantasma para salvar Tsushima.",
    releaseYear: 2024,
    sellers: [
      { id: "s-tsushima-1", name: "SamuraiKeys", rating: 98.9, positiveReviews: 12401, price: 167900, stock: 25, deliveryType: "INSTANT" },
      { id: "s-tsushima-2", name: "TsushimaSales", rating: 96.4, positiveReviews: 890, price: 169900, stock: 5, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "god-of-war-ragnarok",
    title: "God of War Ragnarök",
    genre: ["Action", "Adventure", "Fantasy"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.8,
    basePrice: 239900,
    discount: 40,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/library_hero.jpg",
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2322010/header.jpg"
    ],
    developer: "Santa Monica Studio",
    publisher: "PlayStation Publishing",
    description: "Kratos y Atreus deben viajar a cada uno de los Nueve Reinos en busca de respuestas mientras las fuerzas de Asgard se preparan para la profetizada batalla del fin del mundo. Explora hermosos paisajes míticos y enfrenta poderosos enemigos.",
    releaseYear: 2024,
    sellers: [
      { id: "s-ragnarok-1", name: "Norse_Sellers", rating: 99.2, positiveReviews: 15120, price: 143900, stock: 35, deliveryType: "INSTANT" },
      { id: "s-ragnarok-2", name: "KratosMerchant", rating: 95.7, positiveReviews: 1120, price: 145900, stock: 4, deliveryType: "MANUAL" }
    ]
  },
  {
    id: "sekiro",
    title: "Sekiro: Shadows Die Twice - GOTY Edition",
    genre: ["Action", "RPG", "Fantasy"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.9,
    basePrice: 229900,
    discount: 50,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/814380/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/814380/header.jpg"
    ],
    developer: "FromSoftware",
    publisher: "Activision",
    description: "En Sekiro: Shadows Die Twice eres el 'lobo de un solo brazo', un guerrero deshonrado y desfigurado rescatado de los brazos de la muerte. Estás obligado a proteger a un joven señor descendiente de un antiguo linaje, convirtiéndote en el objetivo de temibles enemigos.",
    releaseYear: 2019,
    sellers: [
      { id: "s-sekiro-1", name: "AshinaKeys", rating: 99.0, positiveReviews: 8740, price: 114900, stock: 15, deliveryType: "INSTANT" },
      { id: "s-sekiro-2", name: "ShinobiStore", rating: 97.4, positiveReviews: 1120, price: 119900, stock: 6, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "horizon-forbidden-west",
    title: "Horizon Forbidden West Complete Edition",
    genre: ["Action", "Open World", "RPG"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.8,
    basePrice: 239900,
    discount: 33,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2420110/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2420110/header.jpg"
    ],
    developer: "Guerrilla Games",
    publisher: "PlayStation Publishing",
    description: "Acompaña a Aloy en su viaje por las peligrosas y majestuosas tierras del Oeste Prohibido, una frontera mortal que alberga nuevas y misteriosas amenazas de máquinas gigantescas en un futuro postapocalíptico fascinante.",
    releaseYear: 2024,
    sellers: [
      { id: "s-forbidden-1", name: "AloySells_COL", rating: 98.7, positiveReviews: 3200, price: 160700, stock: 10, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "jedi-survivor",
    title: "Star Wars Jedi: Survivor",
    genre: ["Action", "Adventure", "Sci-Fi"],
    platform: "EA App",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.5,
    basePrice: 279900,
    discount: 55,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1774580/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1774580/header.jpg"
    ],
    developer: "Respawn Entertainment",
    publisher: "Electronic Arts",
    description: "La historia de Cal Kestis continúa en Star Wars Jedi: Survivor, un juego de acción y aventuras en tercera persona desarrollado por Respawn Entertainment en colaboración con Lucasfilm Games, que se sitúa cinco años después de Jedi: Fallen Order.",
    releaseYear: 2023,
    sellers: [
      { id: "s-jedi-1", name: "ForceCodes", rating: 99.4, positiveReviews: 12450, price: 125950, stock: 24, deliveryType: "INSTANT" },
      { id: "s-jedi-2", name: "GalacticOffers", rating: 95.8, positiveReviews: 920, price: 128900, stock: 5, deliveryType: "MANUAL" }
    ]
  },
  {
    id: "doom-eternal",
    title: "DOOM Eternal",
    genre: ["Shooter", "Action"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.9,
    basePrice: 159900,
    discount: 75,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/782330/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/782330/header.jpg"
    ],
    developer: "id Software",
    publisher: "Bethesda Softworks",
    description: "Los ejércitos del infierno han invadido la Tierra. Conviértete en el Slayer en una épica campaña para un jugador donde deberás derrotar a los demonios a través de dimensiones para detener la destrucción de la humanidad. Siente el combate en primera persona más visceral.",
    releaseYear: 2020,
    sellers: [
      { id: "s-doom-1", name: "SlayerDeals", rating: 99.9, positiveReviews: 34910, price: 39975, stock: 80, deliveryType: "INSTANT" },
      { id: "s-doom-2", name: "HellraiserKeys", rating: 96.5, positiveReviews: 430, price: 38900, stock: 12, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "detroit-become-human",
    title: "Detroit: Become Human",
    genre: ["Sci-Fi", "Adventure"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.8,
    basePrice: 119900,
    discount: 60,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1222140/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1222140/header.jpg"
    ],
    developer: "Quantic Dream",
    publisher: "Quantic Dream",
    description: "Detroit: Become Human pone el destino de la humanidad y de los androides en tus manos, llevándote a un futuro cercano donde las máquinas se vuelven más inteligentes que los humanos. Cada decisión tomada cambia el rumbo de la profunda guía narrativa.",
    releaseYear: 2020,
    sellers: [
      { id: "s-det-1", name: "AndroidAlliance", rating: 99.2, positiveReviews: 5410, price: 47960, stock: 30, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "hollow-knight",
    title: "Hollow Knight",
    genre: ["RPG", "Indie", "Action"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.9,
    basePrice: 47900,
    discount: 50,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/367520/header.jpg"
    ],
    developer: "Team Cherry",
    publisher: "Team Cherry",
    description: "Forja tu propio camino en Hollow Knight, una aventura de acción clásica en 2D a través de un vasto reino en ruinas de insectos y héroes. Explora cavernas serpenteantes, lucha contra criaturas corrompidas y entabla amistad con extraños escarabajos.",
    releaseYear: 2017,
    sellers: [
      { id: "s-hollow-1", name: "HallownestKeys", rating: 99.9, positiveReviews: 43212, price: 23950, stock: 150, deliveryType: "INSTANT" },
      { id: "s-hollow-2", name: "CherryPicks", rating: 98.4, positiveReviews: 2400, price: 23000, stock: 10, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "stardew-valley",
    title: "Stardew Valley",
    genre: ["Sandbox", "Casual", "RPG"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.9,
    basePrice: 39900,
    discount: 20,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/header.jpg"
    ],
    developer: "ConcernedApe",
    publisher: "ConcernedApe",
    description: "Has heredado la vieja parcela de tu abuelo en Stardew Valley. Equipado con herramientas de segunda mano y unas pocas monedas, te dispones a comenzar tu nueva vida cultivando la tierra, criando animales, pescando y formando parte de una cálida comunidad rural.",
    releaseYear: 2016,
    sellers: [
      { id: "s-stardew-1", name: "FarmKeys", rating: 99.8, positiveReviews: 65900, price: 31920, stock: 110, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "it-takes-two",
    title: "It Takes Two",
    genre: ["Family", "Platformer", "Adventure"],
    platform: "EA App",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.9,
    basePrice: 159900,
    discount: 65,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1426210/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1426210/header.jpg"
    ],
    developer: "Hazelight Studios",
    publisher: "Electronic Arts",
    description: "Embárcate en el viaje más alocado de tu vida en It Takes Two, una aventura de plataformas que redefine el género, creada exclusivamente para jugar en modo cooperativo. Invita a un amigo a jugar gratis gracias al Pase de Amigo y superen divertidos retos de pareja.",
    releaseYear: 2021,
    sellers: [
      { id: "s-itt-1", name: "CoopKingdom", rating: 99.3, positiveReviews: 12430, price: 55965, stock: 48, deliveryType: "INSTANT" },
      { id: "s-itt-2", name: "DuetStore", rating: 96.1, positiveReviews: 830, price: 54900, stock: 5, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "cuphead",
    title: "Cuphead",
    genre: ["Platformer", "Action", "Indie"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.8,
    basePrice: 59900,
    discount: 30,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/268910/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/268910/header.jpg"
    ],
    developer: "Studio MDHR Entertainment",
    publisher: "Studio MDHR Entertainment",
    description: "Cuphead es un juego de acción clásico de 'correr y disparar' centrado en combates contra jefes sumamente complejos. Inspirado en los dibujos animados de los años 30, el apartado visual y sonoro se ha diseñado meticulosamente con las técnicas de la época, como animaciones tradicionales a mano.",
    releaseYear: 2017,
    sellers: [
      { id: "s-cup-1", name: "InkwellMerchant", rating: 98.9, positiveReviews: 4501, price: 41930, stock: 32, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "fallout-4",
    title: "Fallout 4: GOTY Edition",
    genre: ["RPG", "Shooter", "Open World"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.7,
    basePrice: 119900,
    discount: 75,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/377160/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/377160/header.jpg"
    ],
    developer: "Bethesda Game Studios",
    publisher: "Bethesda Softworks",
    description: "Como único superviviente del Refugio 111, te adentras en un mundo destruido por la guerra nuclear. Cada segundo es una lucha por la supervivencia, y cada decisión es tuya. Solo tú puedes reconstruir y decidir el futuro de la postapocalíptica Commonwealth.",
    releaseYear: 2015,
    sellers: [
      { id: "s-f4-1", name: "VaultTec_Sales", rating: 98.5, positiveReviews: 8900, price: 29975, stock: 55, deliveryType: "INSTANT" },
      { id: "s-f4-2", name: "WastelandCodes", rating: 95.2, positiveReviews: 1204, price: 28500, stock: 4, deliveryType: "MANUAL" }
    ]
  },
  {
    id: "monster-hunter-world",
    title: "Monster Hunter: World",
    genre: ["RPG", "Action", "Fantasy"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.8,
    basePrice: 119900,
    discount: 67,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/582010/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/582010/header.jpg"
    ],
    developer: "CAPCOM Co., Ltd.",
    publisher: "CAPCOM Co., Ltd.",
    description: "¡Te damos la bienvenida a un nuevo mundo! En la piel de un cazador, tu deber es rastrear y dar caza a monstruos feroces en una gran variedad de biomas vivos y orgánicos. Usa los materiales que obtengas para fabricar armas y armaduras formidables.",
    releaseYear: 2018,
    sellers: [
      { id: "s-mhw-1", name: "Astera_Merchant", rating: 99.2, positiveReviews: 14210, price: 39567, stock: 40, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "diablo-iv",
    title: "Diablo IV",
    genre: ["RPG", "Action", "Fantasy"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.3,
    basePrice: 279900,
    discount: 40,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2344530/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2344530/header.jpg"
    ],
    developer: "Blizzard Entertainment",
    publisher: "Blizzard Entertainment",
    description: "Únete a la lucha por Santuario en Diablo IV, la aventura definitiva de rol y acción. Experimenta la aclamada campaña y el nuevo contenido de temporada mientras viajas por un sombrío mundo abierto, derrotas hordas de demonios y consigues botín legendario.",
    releaseYear: 2023,
    sellers: [
      { id: "s-diablo-1", name: "Sanctuary_Merchant", rating: 98.4, positiveReviews: 8900, price: 167940, stock: 35, deliveryType: "INSTANT" },
      { id: "s-diablo-2", name: "HighHeavens_Keys", rating: 97.2, positiveReviews: 2410, price: 169900, stock: 12, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "mortal-kombat-1",
    title: "Mortal Kombat 1",
    genre: ["Action", "Sports"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.5,
    basePrice: 239900,
    discount: 60,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1971870/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1971870/header.jpg"
    ],
    developer: "NetherRealm Studios",
    publisher: "Warner Bros. Games",
    description: "Descubre un nuevo universo de Mortal Kombat creado por el Dios del Fuego Liu Kang. ¡Mortal Kombat 1 marca el comienzo de una nueva era para la icónica franquicia, con un sistema de combate renovado, modos de juego inéditos y espectaculares Fatalities!",
    releaseYear: 2023,
    sellers: [
      { id: "s-mk1-1", name: "FatalityStore", rating: 99.0, positiveReviews: 4310, price: 95960, stock: 18, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "assassins-creed-valhalla",
    title: "Assassin's Creed Valhalla",
    genre: ["Action", "RPG", "Open World"],
    platform: "Xbox",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.6,
    basePrice: 239900,
    discount: 75,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2208920/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2208920/header.jpg"
    ],
    developer: "Ubisoft Montreal",
    publisher: "Ubisoft",
    description: "Conviértete en Eivor, una leyenda vikinga de la guerra y el saqueo. Explora un bellísimo mundo abierto ambientado en la Inglaterra medieval de la Edad Oscura mientras asaltas a tus enemigos, prosperas tu asentamiento y consolidas tu poder político.",
    releaseYear: 2020,
    sellers: [
      { id: "s-val-1", name: "VikingHub", rating: 98.7, positiveReviews: 12510, price: 59975, stock: 80, deliveryType: "INSTANT" },
      { id: "s-val-2", name: "AnimusCodes", rating: 96.4, positiveReviews: 980, price: 58900, stock: 12, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "street-fighter-6",
    title: "Street Fighter 6",
    genre: ["Action", "Sports"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.7,
    basePrice: 239900,
    discount: 50,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1364780/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1364780/header.jpg"
    ],
    developer: "CAPCOM Co., Ltd.",
    publisher: "CAPCOM Co., Ltd.",
    description: "¡Llega la última entrega de la mítica saga de lucha de Capcom! Impulsado por el motor RE Engine de Capcom, Street Fighter 6 ofrece tres modos de juego diferenciados (World Tour, Fighting Ground y Battle Hub) para revolucionar los juegos de combate.",
    releaseYear: 2023,
    sellers: [
      { id: "s-sf6-1", name: "Hadouken_Keys", rating: 99.5, positiveReviews: 9812, price: 119950, stock: 20, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "resident-evil-village",
    title: "Resident Evil Village",
    genre: ["Horror", "Survival", "Shooter"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.8,
    basePrice: 159900,
    discount: 60,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1196590/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1196590/header.jpg"
    ],
    developer: "CAPCOM Co., Ltd.",
    publisher: "CAPCOM Co., Ltd.",
    description: "Vive el terror de supervivencia como nunca antes en Resident Evil Village, la octava entrega principal de la saga. Unos años después de los trágicos acontecimientos de RE7, Ethan Winters intenta rehacer su vida, hasta que el caos golpea de nuevo a su puerta.",
    releaseYear: 2021,
    sellers: [
      { id: "s-rev-1", name: "DimitrescuStore", rating: 99.1, positiveReviews: 12400, price: 63960, stock: 45, deliveryType: "INSTANT" },
      { id: "s-rev-2", name: "VillageSupplies", rating: 95.8, positiveReviews: 1100, price: 62500, stock: 8, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "dying-light-2",
    title: "Dying Light 2: Stay Human",
    genre: ["Action", "Open World", "Horror"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.4,
    basePrice: 239900,
    discount: 60,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/534380/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/534380/header.jpg"
    ],
    developer: "Techland",
    publisher: "Techland",
    description: "Ha pasado más de una década desde que el virus asoló el mundo. Ciudad, uno de los últimos refugios humanos, está dividida por el conflicto. Usa tus ágiles habilidades de parkour y combate cuerpo a cuerpo para sobrevivir al día y a los infectados.",
    releaseYear: 2022,
    sellers: [
      { id: "s-dl2-1", name: "RunnerKeys", rating: 97.9, positiveReviews: 4321, price: 95960, stock: 15, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "spider-man-miles-morales",
    title: "Marvel's Spider-Man: Miles Morales",
    genre: ["Action", "Adventure", "Superhero"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.8,
    basePrice: 199900,
    discount: 40,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817190/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1817190/header.jpg"
    ],
    developer: "Insomniac Games",
    publisher: "PlayStation Publishing",
    description: "Tras los acontecimientos de Marvel's Spider-Man Remastered, el adolescente Miles Morales se adapta a su nuevo hogar mientras sigue los pasos de su mentor, Peter Parker, como un nuevo Spider-Man dispuesto a defender la ciudad de Nueva York.",
    releaseYear: 2022,
    sellers: [
      { id: "s-miles-1", name: "WebswingCodes", rating: 99.4, positiveReviews: 8320, price: 119940, stock: 28, deliveryType: "INSTANT" },
      { id: "s-miles-2", name: "BrooklynSellers", rating: 95.3, positiveReviews: 450, price: 118900, stock: 5, deliveryType: "MANUAL" }
    ]
  },
  {
    id: "hades-ii",
    title: "Hades II",
    genre: ["RPG", "Action", "Indie"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.9,
    basePrice: 119900,
    discount: 10,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145350/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1145350/header.jpg"
    ],
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    description: "Lucha más allá del Inframundo utilizando hechizos de magia oscura para enfrentarte al mismísimo Titán del Tiempo en esta secuela del aclamado juego de mazmorras rogue-like desarrollado por el galardonado estudio Supergiant Games.",
    releaseYear: 2024,
    sellers: [
      { id: "s-hades-1", name: "Chthonic_Treasures", rating: 99.8, positiveReviews: 12050, price: 107910, stock: 68, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "civilization-vi",
    title: "Sid Meier's Civilization VI",
    genre: ["Strategy", "Simulation", "Sandbox"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.7,
    basePrice: 239900,
    discount: 85,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/289070/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/289070/header.jpg"
    ],
    developer: "Firaxis Games",
    publisher: "2K",
    description: "Civilization VI ofrece nuevas formas de interactuar con tu mundo: las ciudades ahora se expanden físicamente por el mapa, la investigación activa en tecnología y cultura desbloquea nuevos potenciales, y los líderes compiten en base a sus rasgos históricos.",
    releaseYear: 2016,
    sellers: [
      { id: "s-civ-1", name: "EmpireBuilders", rating: 99.4, positiveReviews: 24510, price: 35985, stock: 120, deliveryType: "INSTANT" },
      { id: "s-civ-2", name: "TurnBasedKeys", rating: 96.1, positiveReviews: 1102, price: 34900, stock: 15, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "sea-of-thieves",
    title: "Sea of Thieves",
    genre: ["Adventure", "Multiplayer", "Fantasy"],
    platform: "Xbox",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.5,
    basePrice: 159900,
    discount: 50,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172620/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172620/header.jpg"
    ],
    developer: "Rare",
    publisher: "Xbox Game Studios",
    description: "Sea of Thieves te ofrece la experiencia de piratas definitiva, desde la navegación y el combate hasta la exploración y el saqueo: todo lo necesario para vivir la vida pirata y convertirte en una leyenda por tu cuenta o con amigos.",
    releaseYear: 2020,
    sellers: [
      { id: "s-sea-1", name: "PirateBayKeys", rating: 98.6, positiveReviews: 15410, price: 79950, stock: 60, deliveryType: "INSTANT" }
    ]
  },
  {
    id: "stellaris",
    title: "Stellaris",
    genre: ["Strategy", "Sci-Fi", "Simulation"],
    platform: "Steam",
    region: "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 4.7,
    basePrice: 159900,
    discount: 75,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/281990/library_600x900_2x.jpg",
    screenshots: [
      "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/281990/header.jpg"
    ],
    developer: "Paradox Development Studio",
    publisher: "Paradox Interactive",
    description: "Explora una galaxia repleta de maravillas en este juego de estrategia de ciencia ficción de Paradox Development Studio. Interactúa con diversas razas alienígenas, descubre extraños mundos y expande el alcance de tu imperio interestelar.",
    releaseYear: 2016,
    sellers: [
      { id: "s-stel-1", name: "GalaxyEmpireStore", rating: 99.1, positiveReviews: 9540, price: 39975, stock: 70, deliveryType: "INSTANT" },
      { id: "s-stel-2", name: "NovaKeys", rating: 94.8, positiveReviews: 1204, price: 38900, stock: 11, deliveryType: "INSTANT" }
    ]
  }
];
