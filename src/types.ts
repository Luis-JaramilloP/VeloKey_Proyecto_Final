/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Seller {
  id: string;
  name: string;
  rating: number; // percentage e.g. 98.4
  positiveReviews: number;
  price: number;
  stock: number;
  deliveryType: "INSTANT" | "MANUAL";
}

export interface Game {
  id: string;
  title: string;
  genre: string[];
  platform: "Steam" | "Xbox" | "PlayStation" | "Nintendo" | "EA App" | "Epic Games";
  region: "GLOBAL" | "LATAM" | "USA" | "EUROPE";
  regionWarning?: string;
  isActivatedInLocalRegion: boolean;
  rating: number; // e.g. 4.7
  basePrice: number;
  discount: number; // e.g. 75 for 75% off
  coverUrl: string;
  screenshots: string[];
  developer: string;
  publisher: string;
  description: string;
  sellers: Seller[];
  releaseYear: number;
}

export interface CartItem {
  game: Game;
  seller: Seller;
  quantity: number;
}

export interface OrderItem {
  gameId: string;
  gameTitle: string;
  coverUrl: string;
  platform: string;
  sellerName: string;
  price: number;
  key: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  status: "COMPLETED" | "PENDING";
}
