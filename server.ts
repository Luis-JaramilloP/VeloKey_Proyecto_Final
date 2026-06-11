import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

import fs from "fs";
import { GAMES_DATABASE } from "./gamesDatabase.js";

const DB_FILE = path.join(process.cwd(), "persistent_games.json");
const ORDERS_FILE = path.join(process.cwd(), "persistent_orders.json");

let CURRENT_GAMES: any[];
if (fs.existsSync(DB_FILE)) {
  try {
    CURRENT_GAMES = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    console.log(`Cargados ${CURRENT_GAMES.length} videojuegos de forma persistente desde el disco.`);
  } catch (error) {
    console.error("Error al cargar juegos persistentes, restaurando base por defecto:", error);
    CURRENT_GAMES = JSON.parse(JSON.stringify(GAMES_DATABASE));
  }
} else {
  CURRENT_GAMES = JSON.parse(JSON.stringify(GAMES_DATABASE));
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(CURRENT_GAMES, null, 2), "utf-8");
  } catch (err) {
    console.error("Error al crear archivo de persistencia de juegos:", err);
  }
}

let PURCHASED_ORDERS: any[] = [];
if (fs.existsSync(ORDERS_FILE)) {
  try {
    PURCHASED_ORDERS = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf-8"));
    console.log(`Cargadas ${PURCHASED_ORDERS.length} órdenes persistentes desde el disco.`);
  } catch (error) {
    console.error("Error al cargar órdenes de compra de forma persistente:", error);
  }
} else {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(PURCHASED_ORDERS, null, 2), "utf-8");
  } catch (err) {
    console.error("Error al crear archivo de persistencia de órdenes:", err);
  }
}

// Helpers to write changes back to disk
function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(CURRENT_GAMES, null, 2), "utf-8");
  } catch (err) {
    console.error("Error al intentar guardar juegos en disco:", err);
  }
}

function saveOrders() {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(PURCHASED_ORDERS, null, 2), "utf-8");
  } catch (err) {
    console.error("Error al intentar guardar órdenes en disco:", err);
  }
}

// Static promo coupon discount codes database
const PROMO_CODES: Record<string, number> = {
  "GAMER20": 20, // 20% off total
  "ENEBA5": 5,   // 5% off total
  "G2AKEYS": 10 // 10% off total
};

// Helper to generate randomly formatted game keys
function generateSerialKey(platform: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segment = () => {
    let s = "";
    for (let i = 0; i < 5; i++) {
      s += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return s;
  };
  
  if (platform === "Steam" || platform === "Epic Games" || platform === "EA App") {
    // AAAAA-BBBBB-CCCCC
    return `${segment()}-${segment()}-${segment()}`;
  } else if (platform === "Xbox") {
    // 5 segments of 5 characters for standard Microsoft Xbox keys: AAAAA-BBBBB-CCCCC-DDDDD-EEEEE
    return `${segment()}-${segment()}-${segment()}-${segment()}-${segment()}`;
  } else if (platform === "PlayStation" || platform === "Nintendo") {
    // 12 digit format: AAAA-BBBB-CCCC 
    const seg4 = () => {
      let s = "";
      for (let i = 0; i < 4; i++) {
        s += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return s;
    };
    return `${seg4()}-${seg4()}-${seg4()}`;
  }
  return `${segment()}-${segment()}-${segment()}`;
}

// 1. GET ALL GAMES
app.get("/api/games", (req, res) => {
  const { s, platform, genre } = req.query;
  let filtered = [...CURRENT_GAMES];

  if (s && typeof s === "string" && s.trim()) {
    const q = s.toLowerCase();
    filtered = filtered.filter(
      (g) => g.title.toLowerCase().includes(q) || g.developer.toLowerCase().includes(q)
    );
  }

  if (platform && typeof platform === "string" && platform !== "all") {
    filtered = filtered.filter((g) => g.platform.toLowerCase() === platform.toLowerCase());
  }

  if (genre && typeof genre === "string" && genre !== "all") {
    filtered = filtered.filter((g) => g.genre.some((gType) => gType.toLowerCase() === genre.toLowerCase()));
  }

  res.json({ success: true, games: filtered });
});

// 2. APPLY PROMO CODE
app.post("/api/promo", (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "No code supplied." });
  }
  const cleanCode = code.toUpperCase().trim();
  if (PROMO_CODES[cleanCode] !== undefined) {
    return res.json({ success: true, discountPercentage: PROMO_CODES[cleanCode] });
  } else {
    return res.status(400).json({ error: "Este código de descuento no existe o ha expirado." });
  }
});

// 3. CHECKOUT & SECURE SERIAL DELIVERY
app.post("/api/checkout", (req, res) => {
  const { items, paymentMethod, promoCode } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "El carrito está vacío o el formato no es válido." });
  }

  // Calculate prices based on DB to secure integrity
  let subtotal = 0;
  const orderItems: any[] = [];

  for (const item of items) {
    const dbGame = CURRENT_GAMES.find((g) => g.id === item.gameId);
    if (!dbGame) {
      return res.status(404).json({ error: `Videojuego con ID '${item.gameId}' no encontrado.` });
    }
    const dbSeller = dbGame.sellers.find((s) => s.id === item.sellerId);
    if (!dbSeller) {
      return res.status(404).json({ error: `El vendedor escogido para ${dbGame.title} ya no tiene stock.` });
    }

    if (dbSeller.stock < item.quantity) {
      return res.status(400).json({ error: `No hay suficiente stock del vendedor '${dbSeller.name}' para el juego '${dbGame.title}'.` });
    }

    // Decrement stock in our "database"
    dbSeller.stock -= item.quantity;
    const itemCost = dbSeller.price * item.quantity;
    subtotal += itemCost;

    // Generate keys for each bought copy
    for (let k = 0; k < item.quantity; k++) {
      orderItems.push({
        gameId: dbGame.id,
        gameTitle: dbGame.title,
        coverUrl: dbGame.coverUrl,
        platform: dbGame.platform,
        sellerName: dbSeller.name,
        price: dbSeller.price,
        key: generateSerialKey(dbGame.platform)
      });
    }
  }

  // Calculate promotional deduction if supplied
  let discountAmount = 0;
  if (promoCode) {
    const cleanP = promoCode.toUpperCase().trim();
    if (PROMO_CODES[cleanP] !== undefined) {
      discountAmount = parseFloat(((subtotal * PROMO_CODES[cleanP]) / 100).toFixed(2));
    }
  }

  const finalTotal = parseFloat((subtotal - discountAmount).toFixed(2));

  const newOrder = {
    id: `VK-${Math.floor(Math.random() * 900000 + 100000)}`,
    date: new Date().toISOString(),
    items: orderItems,
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount: discountAmount,
    total: finalTotal,
    paymentMethod: paymentMethod || "Tarjeta de Crédito / Débito",
    status: "COMPLETED"
  };

  PURCHASED_ORDERS.unshift(newOrder);
  saveDatabase();
  saveOrders();

  res.json({
    success: true,
    order: newOrder
  });
});

// 3.1. ADMIN: ADD A NEW VIDEO GAME TO THE CATALOG
app.post("/api/games", (req, res) => {
  const { title, genre, platform, region, basePrice, discount, developer, publisher, description, coverUrl, releaseYear, sellers } = req.body;
  
  if (!title || !platform || !basePrice) {
    return res.status(400).json({ error: "El título, plataforma y precio base son obligatorios para crear un juego." });
  }

  const cleanId = title.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
  const suffix = Math.floor(Math.random() * 899 + 100);
  const id = `${cleanId}-${suffix}`;

  const defaultSellers = sellers || [
    {
      id: `s-${id}-default`,
      name: "VeloKey_Premium",
      rating: 99.9,
      positiveReviews: 120,
      price: Math.round(Number(basePrice) * (1 - (Number(discount || 0) / 100))),
      stock: 35,
      deliveryType: "INSTANT"
    }
  ];

  const newGame = {
    id,
    title,
    genre: Array.isArray(genre) ? genre : [genre || "Acción"],
    platform,
    region: region || "GLOBAL",
    isActivatedInLocalRegion: true,
    rating: 5.0,
    basePrice: Number(basePrice),
    discount: Number(discount || 0),
    coverUrl: coverUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop",
    screenshots: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop"
    ],
    developer: developer || "Desarrollador General",
    publisher: publisher || "Compañía Distribuidora",
    description: description || "No se ha agregado descripción oficial todavía.",
    sellers: defaultSellers,
    releaseYear: Number(releaseYear || new Date().getFullYear())
  };

  CURRENT_GAMES.unshift(newGame);
  saveDatabase();
  res.json({ success: true, game: newGame });
});

// 3.2. ADMIN/SELLER: UPDATE A VIDEO GAME OR ITS SELLERS CONFIG
app.put("/api/games/:id", (req, res) => {
  const { id } = req.params;
  const game = CURRENT_GAMES.find((g) => g.id === id);
  if (!game) {
    return res.status(404).json({ error: "Videojuego no encontrado en el sistema." });
  }

  const { title, basePrice, discount, developer, publisher, description, sellers, platform, genre, region, coverUrl } = req.body;

  if (title !== undefined) game.title = title;
  if (platform !== undefined) game.platform = platform;
  if (genre !== undefined) game.genre = Array.isArray(genre) ? genre : [genre];
  if (region !== undefined) game.region = region;
  if (basePrice !== undefined) game.basePrice = Number(basePrice);
  if (discount !== undefined) game.discount = Number(discount);
  if (developer !== undefined) game.developer = developer;
  if (publisher !== undefined) game.publisher = publisher;
  if (description !== undefined) game.description = description;
  if (coverUrl !== undefined) game.coverUrl = coverUrl;
  if (sellers !== undefined) game.sellers = sellers;

  saveDatabase();
  res.json({ success: true, game });
});

// 3.3. ADMIN: REMOVE A GAME FROM CATALOG
app.delete("/api/games/:id", (req, res) => {
  const { id } = req.params;
  const idx = CURRENT_GAMES.findIndex((g) => g.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Videojuego no encontrado." });
  }

  const deletedGame = CURRENT_GAMES.splice(idx, 1);
  saveDatabase();
  res.json({ success: true, message: "¡Videojuego eliminado exitosamente del catálogo!", game: deletedGame[0] });
});

// 3.4. ADMIN: GET DETAILED GLOBAL STATS FOR DASHBOARD PANEL
app.get("/api/admin/stats", (req, res) => {
  // Compute metrics from state
  const totalRevenue = PURCHASED_ORDERS.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = PURCHASED_ORDERS.length;
  
  let keyCount = 0;
  const sellerSales: Record<string, number> = {};
  const genreSales: Record<string, number> = {};

  PURCHASED_ORDERS.forEach(order => {
    order.items.forEach((item: any) => {
      keyCount++;
      // Track vendor performance
      const sName = item.sellerName || "VeloKey_Premium";
      sellerSales[sName] = (sellerSales[sName] || 0) + item.price;
      
      // Match genre from current games database if possible
      const g = CURRENT_GAMES.find(cg => cg.id === item.gameId);
      if (g && g.genre) {
        g.genre.forEach((genreName: string) => {
          genreSales[genreName] = (genreSales[genreName] || 0) + item.price;
        });
      } else {
        genreSales["Otros"] = (genreSales["Otros"] || 0) + item.price;
      }
    });
  });

  res.json({
    success: true,
    stats: {
      totalRevenue,
      totalOrders,
      totalKeysSold: keyCount,
      uniqueGamesCount: CURRENT_GAMES.length,
      sellerSales,
      genreSales,
      inventoryStockAlerts: CURRENT_GAMES.filter((g: any) => g.sellers.some((s: any) => s.stock < 5)).map((g: any) => ({
        id: g.id,
        title: g.title,
        platform: g.platform,
        lowStockSellers: g.sellers.filter((s: any) => s.stock < 5).map((s: any) => ({ name: s.name, stock: s.stock }))
      }))
    }
  });
});

// 4. GET ORDERS HISTORY (Simulated session purchases)
app.get("/api/orders", (req, res) => {
  res.json({ success: true, orders: PURCHASED_ORDERS });
});

// Setup Vite dev server or host static assets built for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tienda de Videojuegos VeloKey ejecutándose en http://localhost:${PORT}`);
  });
}

startServer();
