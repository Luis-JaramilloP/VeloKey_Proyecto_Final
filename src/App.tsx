/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Search, 
  ShoppingCart, 
  Tag, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  CreditCard, 
  Wallet, 
  Key, 
  Copy, 
  Plus, 
  Minus, 
  Gamepad2, 
  History, 
  User, 
  Star, 
  Home, 
  Flame, 
  ShieldCheck, 
  Eye, 
  Share2, 
  Sparkles,
  Info,
  Gift,
  Server,
  Package,
  Check,
  TrendingUp,
  SlidersHorizontal,
  ThumbsUp,
  Trash2,
  HelpCircle,
  RefreshCw,
  MessageSquare,
  Send,
  Edit2,
  BookOpen,
  Headphones
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Game, CartItem, Seller, Order, OrderItem } from "./types";

export default function App() {
  // Format utility for Colombian Pesos (COP)
  const formatCOP = (val: number) => {
    return "$" + Math.round(val).toLocaleString("de-DE");
  };

  // Navigation tabs
  // "store" | "my-purchases" | "profile"
  const [activeTab, setActiveTab] = useState<"store" | "my-purchases" | "profile">("store");
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  // User session state
  const [userProfile, setUserProfile] = useState<{
    isLoggedIn: boolean;
    name: string;
    email: string;
    avatar: string;
    buyerTier: string;
    loyaltyPoints: number;
    region: string;
    regionalIP: string;
    joinedDate: string;
  } | null>(() => {
    const saved = localStorage.getItem("velokey_user_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [showGoogleLoginModal, setShowGoogleLoginModal] = useState(false);
  const [customLoginEmail, setCustomLoginEmail] = useState("");
  const [customLoginName, setCustomLoginName] = useState("");
  const [customLoginRole, setCustomLoginRole] = useState<"admin" | "seller" | "client">("client");
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Core games states
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState("popular"); // popular, price-asc, price-desc, rating

  // Selected game detail modal target
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Cart Management
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Coupons, Promo & Payment
  const [couponInput, setCouponInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; percent: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccessMsg, setPromoSuccessMsg] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("cc"); // cc, paypal, crypto, wallet
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<Order | null>(null);

  // User details
  const [walletBalance, setWalletBalance] = useState(600000); // Starter free wallet balance in COP
  const [showWalletAdjuster, setShowWalletAdjuster] = useState(false);
  const [customWalletVal, setCustomWalletVal] = useState<string>("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [localOrders, setLocalOrders] = useState<Order[]>([]);

  // Admin & Seller states for dynamic control
  const [adminStats, setAdminStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [adminSearchQuery, setAdminSearchQuery] = useState("");

  const [newGameForm, setNewGameForm] = useState({
    title: "",
    platform: "Steam",
    genre: "Acción",
    region: "GLOBAL",
    basePrice: "",
    discount: "0",
    developer: "",
    publisher: "",
    description: "",
    coverUrl: "",
    releaseYear: new Date().getFullYear().toString()
  });

  // Seller specific offer publishing states
  const [selectedGameForOffer, setSelectedGameForOffer] = useState("");
  const [sellerOfferPrice, setSellerOfferPrice] = useState("");
  const [sellerOfferStock, setSellerOfferStock] = useState("");
  const [sellerOfferDelivery, setSellerOfferDelivery] = useState<"INSTANT" | "MANUAL">("INSTANT");

  // Inline games editing state inside Panel Admin list
  const [editingGameId, setEditingGameId] = useState<string | null>(null);
  const [editingGameData, setEditingGameData] = useState({
    title: "",
    platform: "",
    region: "",
    basePrice: "",
    discount: "",
    coverUrl: "",
    developer: "",
    description: "",
    publisher: "",
    stock: ""
  });

  // Seller Reviews States
  const [expandedSellerId, setExpandedSellerId] = useState<string | null>(null);
  const [customReviews, setCustomReviews] = useState<Record<string, { author: string; rating: number; comment: string; date: string }[]>>({});
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");

  // System Notification AlertToast
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "info" | "error"; text: string } | null>(null);

  // Footer Modal State
  const [activeFooterTab, setActiveFooterTab] = useState<"manual" | "terms" | "support" | null>(null);

  // Get combined reviews for a seller name and a game title
  const getSellerReviews = (sellerName: string, gameTitle: string, gameId: string, sellerId: string) => {
    const key = `${gameId}-${sellerId}`;
    const custom = customReviews[key] || [];
    
    // Core seeded reviews
    const seeded: { author: string; rating: number; comment: string; date: string }[] = [];
    if (sellerName.includes("PremiumKeys")) {
      seeded.push(
        { author: "Juan Carlos M.", rating: 5, comment: `Excelente servicio. La clave para ${gameTitle} llegó al instante y se activó sin problemas.`, date: "Hace 2 días" },
        { author: "Seba_Gamer99", rating: 5, comment: "El vendedor más veloz de la plataforma VeloKey. Súper recomendado.", date: "Hace 5 días" },
        { author: "LunaEstrella", rating: 4, comment: "Excelente precio. Tuve un pequeño retraso de correo de 2 minutos pero todo bien.", date: "Hace 1 semana" }
      );
    } else if (sellerName.includes("SuperGaming") || sellerName.includes("Premium")) {
      seeded.push(
        { author: "Andrés Felipe", rating: 5, comment: "Activación inmediata. Ahorré un montón con este vendedor.", date: "Hace 1 día" },
        { author: "Catalina_Glz", rating: 5, comment: `Buen soporte. El código de ${gameTitle} funcionó a la primera en mi cuenta global.`, date: "Hace 3 días" }
      );
    } else if (sellerName.includes("Alpha")) {
      seeded.push(
        { author: "Mateo_Ríos", rating: 4, comment: "La entrega fue manual pero muy rápida (unos 3 minutos). Recomendado si buscas el mejor precio.", date: "Hace 4 días" },
        { author: "GamerCol_Pro", rating: 5, comment: "Todo correcto, código original. Activado en Steam/Consola de inmediato.", date: "Hace 1 semana" }
      );
    } else {
      seeded.push(
        { author: "Comprador Anónimo", rating: 5, comment: `Código enviado automáticamente. Soporte excelente y activación de ${gameTitle} exitosa.`, date: "Hace 1 día" },
        { author: "Gaming_Colombia", rating: 5, comment: "Excelente vendedor. Rápido, seguro y con la mejor tarifa.", date: "Hace 3 días" }
      );
    }

    return [...custom, ...seeded];
  };

  const handleAddSellerReview = (gameId: string, sellerId: string, sellerName: string) => {
    if (!newReviewComment.trim()) {
      showToast("error", "Por favor ingresa un comentario para tu reseña.");
      return;
    }
    const author = newReviewAuthor.trim() || userProfile?.name || "Cliente Satisfecho";
    const key = `${gameId}-${sellerId}`;
    const newRevObj = {
      author,
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: "Hace unos instantes"
    };

    setCustomReviews(prev => ({
      ...prev,
      [key]: [newRevObj, ...(prev[key] || [])]
    }));

    showToast("success", `¡Reseña agregada con éxito para el vendedor ${sellerName}!`);
    setNewReviewComment("");
    setNewReviewAuthor("");
    setNewReviewRating(5);
  };

  // Hero carousel index
  const [promoHeroIndex, setPromoHeroIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Load and bootstrap initial inventory from server API
  const fetchGames = async () => {
    setIsLoading(true);
    try {
      const url = `/api/games?s=${encodeURIComponent(searchQuery)}&platform=${encodeURIComponent(selectedPlatform)}&genre=${encodeURIComponent(selectedGenre)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setGames(data.games);
      }
    } catch (err) {
      console.error("Error fetching games list:", err);
      showToast("error", "No se pudo conectar con el catálogo del servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger loading on filter adjustment
  useEffect(() => {
    fetchGames();
  }, [searchQuery, selectedPlatform, selectedGenre]);

  // Sync simulated purchased library from LocalStorage & express orders list
  const fetchMyOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.success) {
        // Merge with any local orders stored earlier
        const combined = [...data.orders];
        const savedLocal = localStorage.getItem("velokey_orders");
        if (savedLocal) {
          const parsed = JSON.parse(savedLocal);
          // Filter duplicates
          parsed.forEach((o: Order) => {
            if (!combined.some(item => item.id === o.id)) {
              combined.push(o);
            }
          });
        }
        setLocalOrders(combined);
      }
    } catch (err) {
      console.error("Error listing order archives:", err);
    }
  };

  useEffect(() => {
    fetchMyOrders();
    // Load local balance if saved
    const savedBalance = localStorage.getItem("velokey_wallet");
    if (savedBalance) {
      setWalletBalance(parseFloat(savedBalance));
    }
  }, [checkoutResult]);

  // Fetch full metrics dashboard from express server state
  const fetchAdminStats = async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setAdminStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching admin metrics:", err);
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    if (activeTab === "admin" || activeTab === "seller") {
      fetchAdminStats();
    }
  }, [activeTab, localOrders]);

  // Display top notifications
  const showToast = (type: "success" | "info" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sorting controller logic
  const getSortedGames = () => {
    const list = [...games];
    if (sortBy === "popular") {
      return list.sort((a, b) => b.rating - a.rating); // Best ratings first
    }
    if (sortBy === "price-asc") {
      return list.sort((a, b) => {
        const minPriceA = Math.min(...a.sellers.map(s => s.price));
        const minPriceB = Math.min(...b.sellers.map(s => s.price));
        return minPriceA - minPriceB;
      });
    }
    if (sortBy === "price-desc") {
      return list.sort((a, b) => {
        const minPriceA = Math.min(...a.sellers.map(s => s.price));
        const minPriceB = Math.min(...b.sellers.map(s => s.price));
        return minPriceB - minPriceA;
      });
    }
    if (sortBy === "rating") {
      return list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  };

  const sortedGames = getSortedGames();

  // Hero carousel automation
  const featuredGames = games.filter(g => g.discount >= 35).slice(0, 3);
  const activeHeroGame = featuredGames[promoHeroIndex] || featuredGames[0] || null;

  useEffect(() => {
    setPromoHeroIndex(0);
    if (featuredGames.length === 0) return;
    const interval = setInterval(() => {
      setPromoHeroIndex((p) => (p + 1) % featuredGames.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredGames.length]);

  // Cart operations
  const addToCart = (game: Game, seller: Seller) => {
    // Check if copy from same seller is already inside cart
    const existingIndex = cart.findIndex(item => item.game.id === game.id && item.seller.id === seller.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      if (updated[existingIndex].quantity >= seller.stock) {
        showToast("error", `¡Lo sentimos! El vendedor "${seller.name}" solo tiene ${seller.stock} claves disponibles.`);
        return;
      }
      updated[existingIndex].quantity += 1;
      setCart(updated);
      showToast("success", `Se incrementó la cantidad de ${game.title} en tu carrito.`);
    } else {
      setCart([...cart, { game, seller, quantity: 1 }]);
      showToast("success", `¡${game.title} añadido al carrito!`);
    }
  };

  const removeFromCart = (gameId: string, sellerId: string) => {
    const updated = cart.filter(item => !(item.game.id === gameId && item.seller.id === sellerId));
    setCart(updated);
  };

  const updateQuantity = (gameId: string, sellerId: string, delta: number) => {
    const index = cart.findIndex(item => item.game.id === gameId && item.seller.id === sellerId);
    if (index === -1) return;
    const item = cart[index];
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      removeFromCart(gameId, sellerId);
      return;
    }

    if (newQty > item.seller.stock) {
      showToast("error", `Límite de stock alcanzado para este vendedor (${item.seller.stock} max).`);
      return;
    }

    const updated = [...cart];
    updated[index].quantity = newQty;
    setCart(updated);
  };

  // Promo code validation endpoint trigger
  const handleApplyCoupon = async () => {
    setPromoError(null);
    setPromoSuccessMsg(null);
    if (!couponInput.trim()) return;

    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedPromo({ code: couponInput.toUpperCase(), percent: data.discountPercentage });
        setPromoSuccessMsg(`¡Cupón '${couponInput.toUpperCase()}' aplicado! Obtienes ${data.discountPercentage}% de descuento.`);
        showToast("success", `Cupón del ${data.discountPercentage}% aplicado exitosamente.`);
      } else {
        setPromoError(data.error || "Cupón no válido.");
      }
    } catch (err) {
      setPromoError("Imposible validar cupón en este momento.");
    }
  };

  const handleClearCoupon = () => {
    setAppliedPromo(null);
    setPromoSuccessMsg(null);
    setPromoError(null);
    setCouponInput("");
  };

  // Subtotals
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.seller.price * item.quantity), 0);
  const cartDiscount = appliedPromo ? parseFloat(((cartSubtotal * appliedPromo.percent) / 100).toFixed(2)) : 0;
  const cartTotal = parseFloat((cartSubtotal - cartDiscount).toFixed(2));

  // Simulated full checkout flow with real code dispatching
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // Check if user is logged in
    if (!userProfile || !userProfile.isLoggedIn) {
      showToast("error", "⚠️ Debes iniciar sesión con tu cuenta de Google para poder comprar.");
      setActiveTab("profile");
      setIsCartOpen(false);
      return;
    }
    
    // Always check for sufficient funds in VeloWallet balance
    if (walletBalance < cartTotal) {
      alert(`⚠️ SALDO INSUFICIENTE EN TU CUENTA\n\nEl total de la compra es de ${formatCOP(cartTotal)} pero tu saldo actual es de ${formatCOP(walletBalance)}.\n\nPor favor recarga saldo antes de continuar.`);
      showToast("error", `⚠️ Saldo insuficiente. Necesitas ${formatCOP(cartTotal)} pero tienes ${formatCOP(walletBalance)}.`);
      return;
    }

    setIsCheckingOut(true);
    try {
      // Map to server payload expected schema
      const itemsPayload = cart.map(c => ({
        gameId: c.game.id,
        sellerId: c.seller.id,
        quantity: c.quantity
      }));

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: itemsPayload,
          paymentMethod: {
            cc: "Tarjeta Visa / MasterCard (Virtual Verified)",
            paypal: "PayPal Secure Checkout",
            crypto: "Cryptocurrency Gateway (USDT/BTC)",
            wallet: "Saldo de Monedero virtual (VeloWallet)"
          }[paymentMethod] || "Método Seguro",
          promoCode: appliedPromo?.code || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "La transacción fue denegada.");
      }

      if (data.success && data.order) {
        setCheckoutResult(data.order);
        
        // Save in LocalStorage persistent log so they aren't cleared on reload
        const savedOrders = localStorage.getItem("velokey_orders");
        const ordersArray = savedOrders ? JSON.parse(savedOrders) : [];
        ordersArray.unshift(data.order);
        localStorage.setItem("velokey_orders", JSON.stringify(ordersArray));

        // Always deduct balance from VeloWallet virtual account
        const remainder = Math.round(walletBalance - cartTotal);
        setWalletBalance(remainder);
        localStorage.setItem("velokey_wallet", remainder.toString());

        setCart([]); // Clear shopping cart
        setAppliedPromo(null);
        setCouponInput("");
        setIsCartOpen(false);
        showToast("success", "¡Pago procesado con éxito! Tus claves de activación están listas.");
      }
    } catch (err: any) {
      showToast("error", err.message || "La pasarela de pago sufrió un error temporal.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  // Perform a full refund for a specific purchased game key
  const handleRefundItem = (orderId: string, itemIndex: number) => {
    // Find matching order in active local orders list
    const updatedOrders = localOrders.map(ord => {
      if (ord.id === orderId) {
        const itemToRefund = ord.items[itemIndex];
        if (itemToRefund) {
          const refundAmount = itemToRefund.price;
          
          // Calculate new total after subtraction
          const newTotal = Math.max(0, ord.total - refundAmount);
          const updatedItems = ord.items.filter((_, idx) => idx !== itemIndex);
          
          // Refund money to VeloWallet balance
          const newBalance = Math.round(walletBalance + refundAmount);
          setWalletBalance(newBalance);
          localStorage.setItem("velokey_wallet", newBalance.toString());
          
          // Show successful refund message indicating return to bank account / virtual wallet
          const refundMsg = `❇️ ¡Devolución Exitosa de '${itemToRefund.gameTitle}'!\nSe han reembolsado ${formatCOP(refundAmount)} a tu saldo y devuelto a tu cuenta bancaria de forma segura.`;
          alert(refundMsg);
          showToast("success", `🏦 Reembolsado: ${formatCOP(refundAmount)} devuelto a tu cuenta bancaria.`);
          
          return {
            ...ord,
            items: updatedItems,
            total: newTotal
          };
        }
      }
      return ord;
    }).filter(ord => ord.items.length > 0); // If order is completely refunded, remove it

    setLocalOrders(updatedOrders);
    localStorage.setItem("velokey_orders", JSON.stringify(updatedOrders));
  };

  // Copy Activation Clave to Clipboard 
  const copyToClipboard = (keyStr: string, indexId: string) => {
    navigator.clipboard.writeText(keyStr);
    setCopiedKeyId(indexId);
    showToast("success", "Clave copiada al portapapeles. ¡Lista para canjear!");
    setTimeout(() => {
      setCopiedKeyId(null);
    }, 2000);
  };

  // Platform styling badges
  const getPlatformColors = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "steam": return "bg-slate-900 border-slate-700 text-slate-300";
      case "xbox": return "bg-emerald-950 border-emerald-800 text-emerald-300";
      case "playstation": return "bg-blue-950 border-blue-900 text-blue-300";
      case "nintendo": return "bg-red-950 border-red-900 text-red-300";
      case "ea app": return "bg-orange-950 border-orange-900 text-orange-400";
      default: return "bg-zinc-900 border-zinc-800 text-zinc-400";
    }
  };

  // Platform visual Icon
  const getPlatformIconMarkup = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "steam":
        return <span className="text-[10px] font-bold">STEAM</span>;
      case "xbox":
        return <span className="text-[10px] font-bold">XBOX</span>;
      case "playstation":
        return <span className="text-[10px] font-bold">PSN</span>;
      case "nintendo":
        return <span className="text-[10px] font-bold">NINTENDO</span>;
      default:
        return <span className="text-[10px] font-bold uppercase">{platform}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#07060a] bg-radial-[at_top_right,_var(--tw-gradient-stops)] from-[#170e28]/50 via-[#07060a] to-[#040307] text-[#f3f4f6] selection:bg-[#a78bfa] selection:text-[#0b0a0f] relative pb-20">
      
      {/* Dynamic Global System Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-3 px-5 rounded-xl border bg-black/90 backdrop-blur-md shadow-xl text-xs font-medium text-white shadow-[#9333ea]/10 min-w-[280px]"
            style={{
              borderColor: toastMessage.type === "success" ? "#22c55e" : toastMessage.type === "error" ? "#ef4444" : "#9333ea"
            }}
          >
            {toastMessage.type === "success" && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
            {toastMessage.type === "error" && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
            {toastMessage.type === "info" && <Info className="w-4 h-4 text-purple-500 shrink-0" />}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION WITH USER LOGO AND CART STATUS */}
      <header className="sticky top-0 z-40 bg-[#07060b]/90 border-b border-[#1b1928] backdrop-blur-md px-4 py-3 shadow-lg shadow-black/30">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center space-x-2 cursor-pointer group" onClick={() => { setActiveTab("store"); setCheckoutResult(null); }}>
            <div className="relative p-2.5 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/25 overflow-visible transition-transform duration-300 group-hover:scale-105">
              <Key className="w-5 h-5 -rotate-45 relative z-10 transition-transform duration-300 group-hover:rotate-0" />
              <div className="absolute -top-1 -right-1 text-yellow-300 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-100 to-[#d946ef] flex items-center gap-1">
                VELOKEY
              </h1>
              <p className="text-[9px] font-mono tracking-widest text-[#a78bfa] leading-none uppercase font-semibold">
                KEYS STORE
              </p>
            </div>
          </div>

          {/* Quick Search on Desktop / Tablet */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar claves baratas de Steam, Xbox, PlayStation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#110f1b] border border-[#201d2f]/90 rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#a78bfa]/65 focus:ring-1 focus:ring-[#a78bfa]/20 transition-all font-sans"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-neutral-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* User balance indicator, My purchased keys link, and Shopping Cart Button */}
          <div className="flex items-center space-x-3">
            
            {/* Simulation Account Wallet Balance indicator & quick refunder */}
            <div className="relative">
              <div 
                onClick={() => setShowWalletAdjuster(!showWalletAdjuster)}
                className="flex items-center space-x-1.5 py-1 px-2.5 rounded-lg bg-[#201d2d]/50 border border-emerald-500/30 text-xs cursor-pointer hover:bg-[#201d2d]/85 transition-all select-none"
                title="Personalizar o ajustar saldo virtual exactamente"
                id="wallet-info-pill"
              >
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <div className="text-left leading-none">
                  <span className="text-[8px] text-neutral-400 block font-sans">Mi Saldo (Pruebas)</span>
                  <span className="font-mono text-[11px] font-bold text-emerald-400">
                    {formatCOP(walletBalance)}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-extrabold ml-1 animate-pulse font-sans">✎</span>
              </div>

              {/* Wallet Adjuster Floating Popover */}
              {showWalletAdjuster && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#0d0a17] border border-purple-500/30 rounded-xl p-3 z-50 shadow-2xl animate-in fade-in slide-in-from-top-1" id="wallet-adjuster-popover">
                  <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-purple-900/40">
                    <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider font-mono">Ajustar Saldo Virtual</span>
                    <button 
                      onClick={() => setShowWalletAdjuster(false)}
                      className="text-neutral-500 hover:text-white text-xs font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <p className="text-[9px] text-neutral-400 mb-2 leading-tight">
                    Escribe el valor exacto en COP para recargar o retirar de tu monedero de pruebas:
                  </p>

                  <div className="space-y-2">
                    <div className="relative">
                      <span className="absolute left-2.5 top-1.5 text-xs text-neutral-500 font-mono font-bold">$</span>
                      <input
                        type="number"
                        placeholder="Ej. 100000"
                        value={customWalletVal}
                        onChange={(e) => setCustomWalletVal(e.target.value)}
                        className="w-full bg-[#161225] border border-purple-900/55 focus:border-[#d946ef] rounded-lg p-1.5 pl-6 text-xs text-white placeholder-neutral-600 font-mono outline-none"
                        id="wallet-adjust-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const parsed = parseInt(customWalletVal, 10);
                          if (isNaN(parsed) || parsed <= 0) {
                            showToast("error", "⚠️ Por favor ingresa un monto válido mayor a 0");
                            return;
                          }
                          const newB = Math.round(walletBalance + parsed);
                          setWalletBalance(newB);
                          localStorage.setItem("velokey_wallet", newB.toString());
                          setCustomWalletVal("");
                          showToast("success", `💸 Añadido con éxito: ${formatCOP(parsed)} a tu monedero.`);
                        }}
                        className="w-full py-1.5 bg-emerald-600/20 border border-emerald-500/40 hover:bg-emerald-600/40 text-[10px] rounded text-emerald-300 font-bold transition-all cursor-pointer text-center"
                        id="btn-wallet-add"
                      >
                        Recargar COP
                      </button>

                      <button
                        onClick={() => {
                          const parsed = parseInt(customWalletVal, 10);
                          if (isNaN(parsed) || parsed <= 0) {
                            showToast("error", "⚠️ Por favor ingresa un monto válido mayor a 0");
                            return;
                          }
                          if (parsed > walletBalance) {
                            showToast("error", "⚠️ Saldo insuficiente en el monedero para retirar este monto");
                            return;
                          }
                          const newB = Math.round(walletBalance - parsed);
                          setWalletBalance(newB);
                          localStorage.setItem("velokey_wallet", newB.toString());
                          setCustomWalletVal("");
                          showToast("success", `🏦 Retirado con éxito: ${formatCOP(parsed)} de tu saldo y se devolvió a tu cuenta bancaria de forma segura.`);
                        }}
                        className="w-full py-1.5 bg-rose-600/20 border border-rose-500/40 hover:bg-rose-600/40 text-[10px] rounded text-rose-300 font-bold transition-all cursor-pointer text-center"
                        id="btn-wallet-withdraw"
                      >
                        Retirar / Devolver
                      </button>
                    </div>

                    <div className="flex gap-1 justify-between pt-1.5 border-t border-purple-900/20 text-[8px] text-neutral-500">
                      <span>Valores rápidos (COP):</span>
                      <button 
                        onClick={() => setCustomWalletVal("50000")} 
                        className="hover:text-purple-300 cursor-pointer"
                      >
                        50k
                      </button>
                      <button 
                        onClick={() => setCustomWalletVal("100000")} 
                        className="hover:text-purple-300 cursor-pointer"
                      >
                        100k
                      </button>
                      <button 
                        onClick={() => setCustomWalletVal("200000")} 
                        className="hover:text-purple-300 cursor-pointer"
                      >
                        200k
                      </button>
                      <button 
                        onClick={() => setCustomWalletVal("500000")} 
                        className="hover:text-purple-300 cursor-pointer"
                      >
                        500k
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mi Cuenta tab button */}
            <button
              onClick={() => { setActiveTab("profile"); setCheckoutResult(null); }}
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#7c3aed] text-white border-transparent shadow-[#7c3aed]/10"
                  : "bg-[#110f1a] border-[#1e1c2c] text-neutral-400 hover:text-neutral-200"
              }`}
              title="Mi Cuenta Google VeloKey"
              id="btn-nav-profile"
            >
              {userProfile?.isLoggedIn ? (
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-4.5 h-4.5 rounded-full border border-purple-400 object-cover"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
              <span className="hidden sm:inline font-semibold">
                {userProfile?.isLoggedIn ? "Mi Cuenta" : "Iniciar Sesión"}
              </span>
            </button>

            {/* My keys library tab button */}
            <button
              onClick={() => { setActiveTab("my-purchases"); setCheckoutResult(null); }}
              className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
                activeTab === "my-purchases"
                  ? "bg-[#7c3aed] text-white border-transparent shadow-[#7c3aed]/10"
                  : "bg-[#110f1a] border-[#1e1c2c] text-neutral-400 hover:text-neutral-200"
              }`}
              title="Mis Claves Compradas"
            >
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Mis Claves</span>
              {localOrders.length > 0 && (
                <span className="h-4 px-1 min-w-[16px] rounded-full bg-yellow-500 text-[9px] text-black font-extrabold flex items-center justify-center">
                  {localOrders.reduce((sum, o) => sum + o.items.length, 0)}
                </span>
              )}
            </button>

            {/* Administrador Panel tab button */}
            {userProfile?.isLoggedIn && userProfile.role === "admin" && (
              <button
                onClick={() => { setActiveTab("admin"); setCheckoutResult(null); }}
                className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
                  activeTab === "admin"
                    ? "bg-gradient-to-r from-red-600 to-amber-600 text-white border-transparent shadow-md font-sans"
                    : "bg-[#250d18] border-red-950/45 text-red-300 hover:text-red-100 font-sans"
                }`}
                title="Panel Administrador VeloKey"
                id="btn-nav-admin"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline font-extrabold">Panel Admin</span>
              </button>
            )}

            {/* Socio Vendedor Panel tab button */}
            {userProfile?.isLoggedIn && userProfile.role === "seller" && (
              <button
                onClick={() => { setActiveTab("seller"); setCheckoutResult(null); }}
                className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
                  activeTab === "seller"
                    ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent shadow-md font-sans"
                    : "bg-[#1a0f26] border-[#2d1b40] text-pink-300 hover:text-pink-100 font-sans"
                }`}
                title="Panel Vendedor Asociado"
                id="btn-nav-seller"
              >
                <Package className="w-4 h-4 text-pink-400" />
                <span className="hidden sm:inline font-extrabold">Panel Vendedor</span>
              </button>
            )}

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2.5 rounded-xl bg-[#201d2d]/80 text-[#ebdbff] font-medium border border-[#3e3954]/55 hover:border-purple-500/50 hover:bg-[#1a1827] flex items-center gap-2 relative transition-all shadow-md cursor-pointer"
              id="shopping-cart-button"
            >
              <ShoppingCart className="w-4.5 h-4.5 text-[#d946ef]" />
              <span className="hidden sm:inline text-xs font-semibold">Carrito</span>
              
              {cart.length > 0 ? (
                <div className="absolute -top-1.5 -right-1.5 h-5 min-w-[20px] px-1 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border border-black flex items-center justify-center text-[10px] font-extrabold text-white animate-bounce">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </div>
              ) : null}
            </button>
          </div>

        </div>

        {/* Mobile Quick Search Bar */}
        <div className="mt-3 md:hidden relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar juegos (Minecraft, Elden Ring...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#110f1b] border border-[#201d2f]/90 rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#a78bfa]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-2.5 text-neutral-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* DETAILED ORDER STATE TRANSITION SCREEN ON SUCCESSFUL BILLOUT */}
      <AnimatePresence>
        {checkoutResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-xl mx-auto px-4 py-8 z-30"
          >
            <div className="bg-[#100e1a] border-2 border-emerald-500/60 rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-emerald-950/20">
              {/* Confetti atmospheric glow */}
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-emerald-500/10 blur-[60px]" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-500/10 blur-[60px]" />

              <div className="text-center space-y-3">
                <div className="h-14 w-14 rounded-full bg-emerald-500/15 border border-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                  ¡PAGO COMPLETO!
                </h2>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Tu orden <strong className="font-mono text-[#a78bfa]">{checkoutResult.id}</strong> ha sido verificada y tus licencias de activación ya están disponibles de forma instantánea.
                </p>
              </div>

              {/* SERIAL KEYS DISPATCHING CABINET */}
              <div className="mt-8 space-y-4">
                <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase block text-center">
                  🔐 TUS CLAVES SERIALES EXCLUSIVAS
                </span>

                {checkoutResult.items.map((item: OrderItem, itemIdx: number) => {
                  const uniqId = `${checkoutResult.id}-${itemIdx}`;
                  const isCopied = copiedKeyId === uniqId;
                  return (
                    <div 
                      key={itemIdx} 
                      className="p-3.5 rounded-2xl bg-[#141221] border border-[#2b253f] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-lg hover:border-purple-500/40 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.coverUrl} 
                          alt={item.gameTitle} 
                          className="h-14 w-10 object-cover rounded-lg border border-[#221d33]" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase bg-purple-950 text-[#d946ef] border border-purple-800">
                            {item.platform}
                          </span>
                          <h4 className="text-xs font-semibold text-neutral-200 mt-1 max-w-[240px] truncate">
                            {item.gameTitle}
                          </h4>
                          <span className="text-[10px] text-neutral-500">Vendedor: {item.sellerName}</span>
                        </div>
                      </div>

                      {/* Display Key code visually with custom copy button */}
                      <div className="flex items-center md:flex-col justify-between md:items-end gap-2 md:pl-4 border-t md:border-t-0 md:border-l border-[#231e34] pt-2 md:pt-0">
                        <span className="text-[9px] font-mono text-neutral-500">CANJEAR CLAVE:</span>
                        <div className="flex items-center space-x-1.5 w-full">
                          <code className="text-xs font-mono font-black py-1 px-2.5 rounded bg-black border border-purple-950 select-all serial-key-reveal text-[#d946ef] tracking-wider">
                            {item.key}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(item.key, uniqId)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                              isCopied
                                ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                                : "bg-[#211d33] text-neutral-300 border-[#302a4a] hover:bg-[#2c2644]"
                            }`}
                            title="Copiar Clave"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* HOW TO ACTIVATE TUTORIAL BLOCK */}
              <div className="mt-8 bg-[#18152c]/50 border border-[#292446] p-4 rounded-2xl">
                <h4 className="text-xs font-semibold text-[#a78bfa] flex items-center gap-1.5 mb-2 uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> ¿Cómo reclamar mi clave?
                </h4>
                <ul className="text-[11px] text-neutral-400 space-y-1.5 list-disc pl-4 leading-normal">
                  <li>Para claves de <strong className="text-neutral-200">Steam</strong>: Abre el cliente, ve a 'Añadir producto' (abajo izquierda) y selecciona 'Activar un producto de Steam...'.</li>
                  <li>Para claves de <strong className="text-neutral-200">Xbox</strong> / <strong className="text-neutral-200">Windows</strong>: Entra a <code className="bg-black/40 px-1 py-0.5 font-mono text-emerald-400 text-[10px]">redeem.microsoft.com</code> con tu cuenta e ingresa la clave de 25 dígitos.</li>
                  <li>Para <strong className="text-neutral-200">PlayStation Network</strong>: Ve al menú de PS Store en tu consola y presiona 'Canjear códigos'.</li>
                </ul>
              </div>

              {/* Back to catalog */}
              <button
                onClick={() => { setCheckoutResult(null); setActiveTab("store"); }}
                className="w-full mt-6 py-3 gamer-neon-btn rounded-xl font-display font-semibold text-xs active:scale-[0.98] cursor-pointer"
              >
                Volver a la Tienda de Juegos
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE VIEWPORT: MAIN TIENDA OR PREVIOUS ORDERS LIST */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        
        {/* BANNER PROMO DENTRO DE STORE TAB */}
        {activeTab === "store" && !checkoutResult && (
          <div className="mb-8 relative rounded-3xl overflow-hidden border border-[#232036] bg-[#0c0914] shadow-xl">
            {/* Slide showcase for big game price cuts */}
            {isLoading ? (
              <div className="h-[210px] md:h-[260px] animate-pulse bg-[#161226]/40 flex items-center justify-center">
                <span className="font-mono text-xs text-neutral-600">PREPARANDO OFERTAS EXCLUSIVAS...</span>
              </div>
            ) : (featuredGames.length > 0 && activeHeroGame) ? (
              <div className="relative h-[210px] md:h-[260px] flex items-center">
                
                {/* Background image blur reflection */}
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-10 blur-xl scale-110"
                  style={{ backgroundImage: `url(${activeHeroGame.coverUrl})` }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-r from-[#0d0a17] via-[#0d0a17]/95 to-[#0d0a17]/25 z-0" />

                {/* Cover graphic left */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 md:w-1/2 overflow-hidden hidden sm:block">
                  <img
                    src={activeHeroGame.coverUrl}
                    alt={activeHeroGame.title}
                    className="w-full h-full object-cover rounded-l-3xl object-top opacity-70"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0d0a17] via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Promo descriptions */}
                <div className="relative z-10 px-5 md:px-10 max-w-xl space-y-3">
                  <div className="inline-flex items-center space-x-2 bg-purple-950/70 border border-purple-800 p-1 px-3 rounded-full text-[10px] font-bold text-[#d946ef] uppercase tracking-widest">
                    <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" /> OFERTA ESTRELLA - MEJOR PRECIO MUNDIAL
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-display font-extrabold text-[#f3f4f6] tracking-tight leading-tight">
                    {activeHeroGame.title}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-2 max-w-md hidden md:block">
                    {activeHeroGame.description}
                  </p>

                  <div className="flex items-center space-x-4">
                    {/* Discount badge */}
                    <span className="text-xl font-display font-black p-1.5 px-3 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white">
                      -{activeHeroGame.discount}%
                    </span>
                    
                    <div>
                      <span className="text-neutral-500 text-xs line-through block">
                        Original: {formatCOP(activeHeroGame.basePrice)}
                      </span>
                      <span className="text-xl md:text-2xl font-mono font-extrabold text-amber-400">
                        {formatCOP(activeHeroGame.basePrice * (1 - activeHeroGame.discount / 100))}
                      </span>
                    </div>

                    <button 
                      onClick={() => setSelectedGame(activeHeroGame)}
                      className="px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-[#d946ef] hover:text-white transition-all cursor-pointer shadow-lg active:scale-95"
                    >
                      Ver Ofertas Disponibles
                    </button>
                  </div>
                </div>

                {/* Dot selectors indicator */}
                <div className="absolute bottom-4 left-6 md:left-10 flex space-x-1.5">
                  {featuredGames.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setPromoHeroIndex(dotIdx)}
                      className={`h-2 rounded-full transition-all ${
                        dotIdx === promoHeroIndex ? "w-6 bg-[#d946ef]" : "w-2 bg-neutral-700"
                      }`}
                    />
                  ))}
                </div>

              </div>
            ) : null}
          </div>
        )}

        {/* --- MAIN STOREFRONT VIEW --- */}
        {activeTab === "store" && !checkoutResult && (
          <div className="space-y-6">
            
            {/* WIDE SEARCH & FILTERS CONTROL BAR AT THE TOP */}
            <div id="store-search-and-filters-container" className="bg-[#0f0c1b]/80 border border-[#1e1a31]/90 rounded-2.5xl p-5 shadow-xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center gap-4">
                
                {/* Search glass / search input combo */}
                <div className="relative w-full flex-1">
                  <span className="absolute left-4 top-3.5 text-neutral-400 cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
                    <Search className="w-5 h-5 text-purple-400 hover:scale-110 active:scale-95 transition-all" id="search-lupa-icon" />
                  </span>
                  
                  <input
                    type="text"
                    placeholder="Escribe el nombre del juego (p. ej. Mario, Elden, GTA, Minecraft...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={() => setShowFilters(true)}
                    className="w-full bg-[#151224] border border-[#26213c] rounded-2xl pl-12 pr-10 py-3 text-sm text-[#f3f4f6] placeholder-neutral-500 focus:outline-none focus:border-purple-500/75 focus:ring-2 focus:ring-purple-900/35 transition-all font-sans"
                  />
                  
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")} 
                      className="absolute right-4 top-3.5 text-neutral-500 hover:text-white transition-colors"
                      title="Limpiar búsqueda"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* The "Lupa" / Filter Toggle Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`w-full md:w-auto px-5 py-3 rounded-2xl font-semibold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
                    showFilters 
                      ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/15" 
                      : "bg-[#110f1a] border-[#221e35] text-neutral-300 hover:bg-[#1a1829] hover:border-[#383353]"
                  }`}
                  title="Ver opciones avanzadas de búsqueda y filtros"
                  id="advanced-filters-trigger"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#d946ef]" />
                  <span>{showFilters ? "Ocultar Filtros" : "Filtros Avanzados"}</span>
                  {(selectedPlatform !== "all" || selectedGenre !== "all" || sortBy !== "popular") && (
                    <span className="h-4.5 px-1.5 bg-gradient-to-tr from-yellow-500 to-amber-500 text-[9px] text-black font-extrabold rounded-full flex items-center justify-center animate-bounce">
                      !
                    </span>
                  )}
                </button>
              </div>

              {/* Collapsible search options area, toggles open when showFilters is active OR on clicking the bar search magnifier */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden mt-4 border-t border-[#1e1a31]/50 pt-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 mt-2">
                      
                      {/* Plataforma: 5 columns */}
                      <div className="md:col-span-5 space-y-2.5">
                        <span className="text-xs font-bold tracking-wider text-[#a78bfa] uppercase block px-1">
                          🎮 Plataforma de Activación
                        </span>
                        
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { id: "all", name: "Todas las tiendas" },
                            { id: "steam", name: "Steam Keys" },
                            { id: "xbox", name: "Xbox Live / Store" },
                            { id: "playstation", name: "PlayStation Store" },
                            { id: "nintendo", name: "Nintendo eShop" },
                            { id: "ea app", name: "EA Original App" },
                            { id: "epic games", name: "Epic Games Launcher" }
                          ].map((plat) => {
                            const isActive = selectedPlatform === plat.id;
                            return (
                              <button
                                key={plat.id}
                                onClick={() => setSelectedPlatform(plat.id)}
                                className={`text-left py-2 px-3 rounded-xl text-xs font-medium border flex items-center justify-between transition-colors cursor-pointer ${
                                  isActive
                                    ? "bg-purple-950/50 border-purple-500/70 text-[#ebdbff] shadow-sm shadow-purple-600/5"
                                    : "bg-[#141223]/50 border-[#1f1a30] text-neutral-400 hover:text-neutral-200 hover:border-[#383252]"
                                }`}
                              >
                                <span>{plat.name}</span>
                                {isActive && <div className="h-1.5 w-1.5 rounded-full bg-[#d946ef]" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Género: 4 columns */}
                      <div className="md:col-span-4 space-y-2.5">
                        <span className="text-xs font-bold tracking-wider text-[#a78bfa] uppercase block px-1">
                          🏷️ Categoría de Videojuegos
                        </span>
                        
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { id: "all", name: "Todos" },
                            { id: "rpg", name: "RPG" },
                            { id: "action", name: "Acción" },
                            { id: "shooter", name: "Shooter" },
                            { id: "open world", name: "Mundo Abierto" },
                            { id: "sports", name: "Deportes" },
                            { id: "sandbox", name: "Mundocraft" },
                            { id: "fantasy", name: "Fantasía" }
                          ].map((gn) => {
                            const isSel = selectedGenre === gn.id;
                            return (
                              <button
                                key={gn.id}
                                onClick={() => setSelectedGenre(gn.id)}
                                className={`text-xs px-2.5 py-1.5 rounded-xl border font-medium transition-colors cursor-pointer ${
                                  isSel
                                    ? "bg-[#7c3aed] text-white border-transparent"
                                    : "bg-[#141223] border-[#1e1c2b] text-neutral-400 hover:text-white hover:border-[#352f52]"
                                }`}
                              >
                                {gn.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Ordenar y acciones: 3 columns */}
                      <div className="md:col-span-3 space-y-4">
                        <div className="space-y-2">
                          <span className="text-xs font-bold tracking-wider text-[#a78bfa] uppercase block px-1">
                            ↕️ Ordenar catálogo
                          </span>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full bg-[#110f1c] border border-[#201d32] rounded-xl py-2 px-3 text-xs text-neutral-300 focus:outline-none focus:border-[#a78bfa] focus:ring-1 focus:ring-purple-950"
                          >
                            <option value="popular">Más recomendados / Top</option>
                            <option value="price-asc">Precio: Más barato primero</option>
                            <option value="price-desc">Precio: Más caro primero</option>
                            <option value="rating">Calificaciones del público</option>
                          </select>
                        </div>

                        {/* Reset filters */}
                        {(selectedPlatform !== "all" || selectedGenre !== "all" || sortBy !== "popular" || searchQuery) && (
                          <button
                            onClick={() => {
                              setSelectedPlatform("all");
                              setSelectedGenre("all");
                              setSortBy("popular");
                              setSearchQuery("");
                            }}
                            className="w-full py-2 px-3 rounded-xl border border-rose-500/30 bg-rose-500/5 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold cursor-pointer transition-colors text-center block"
                          >
                            Restablecer todos los filtros
                          </button>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CATALOG LIST CONTAINER: VIDEOGAMES GRID */}
            <div className="space-y-5">
              
              {/* Header result list information */}
              <div className="flex items-center justify-between gap-4 bg-[#110f1c]/45 p-3 px-4 rounded-xl border border-[#201d32]/50">
                <h3 className="text-sm font-display font-medium text-white flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5 text-purple-400 animate-pulse" />
                  <span>Catálogo de Claves de Videojuegos</span>
                  <span className="text-xs text-neutral-500 font-mono">({sortedGames.length} juegos encontrados)</span>
                </h3>
                
                {searchQuery || selectedPlatform !== "all" || selectedGenre !== "all" ? (
                  <span className="text-xs p-1 px-2.5 rounded-lg bg-[#201d32]/50 text-purple-300 border border-purple-900/40 animate-pulse">
                    Filtros activos
                  </span>
                ) : (
                  <span className="text-xs text-neutral-400 hidden sm:inline flex items-center gap-1">
                    🛡️ Compra segura con entrega digital instantánea
                  </span>
                )}
              </div>

              {isLoading ? (
                // LOADING MULTIPACK SKELETON
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((it) => (
                    <div key={it} className="bg-[#100e1b]/45 rounded-2xl border border-[#1d1b2a] p-4 space-y-3 animate-pulse">
                      <div className="w-full aspect-[4/5] bg-neutral-800 rounded-xl" />
                      <div className="h-4 w-3/4 bg-neutral-800 rounded" />
                      <div className="h-3 w-1/2 bg-neutral-800 rounded" />
                      <div className="flex justify-between items-center pt-2">
                        <div className="h-4 w-12 bg-neutral-800 rounded" />
                        <div className="h-5 w-16 bg-neutral-800 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedGames.length > 0 ? (
                
                // POPULATED LIST
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {sortedGames.map((game: Game) => {
                    const cheapestSeller = game.sellers.sort((a,b) => a.price - b.price)[0];
                    const discountedCheapestPrice = cheapestSeller ? cheapestSeller.price : (game.basePrice * (1 - game.discount / 100));
                    
                    return (
                      <motion.div
                        key={game.id}
                        onClick={() => setSelectedGame(game)}
                        className="bg-[#100c19] border border-[#1b1928] rounded-2xl p-3 shadow-lg hover:shadow-purple-950/15 flex flex-col justify-between cursor-pointer group gamer-card-glow relative overflow-hidden"
                      >
                        {/* Regional compatibility banner: GREEN global banner or red warning target banner */}
                        {game.region === "GLOBAL" ? (
                          <div className="absolute top-4 left-4 z-10 px-2 py-0.5 rounded-md bg-emerald-950/90 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono tracking-wide font-extrabold shadow-sm flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-300" /> GLOBAL
                          </div>
                        ) : (
                          <div className="absolute top-4 left-4 z-10 px-2 py-0.5 rounded-md bg-amber-950/95 text-amber-500 border border-amber-500/30 text-[9px] font-mono tracking-wide font-extrabold shadow-sm flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> USA ONLY
                          </div>
                        )}

                        {/* Top banner game discount */}
                        <div className="absolute top-4 right-4 z-10 p-1 px-2 rounded-lg bg-gradient-to-tr from-[#7c3aed] to-[#d946ef] text-white font-display font-black text-xs shadow">
                          -{game.discount}%
                        </div>

                        {/* Game artwork cover */}
                        <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 border border-[#201d2d]/10 relative mb-3.5 flex items-center justify-center">
                          {!brokenImages[game.id] ? (
                            <img
                              src={game.coverUrl}
                              alt={game.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={() => {
                                setBrokenImages((p) => ({ ...p, [game.id]: true }));
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#1b122c] via-[#090612] to-[#120a21] flex flex-col items-center justify-center p-3 text-center">
                              <Gamepad2 className="w-8 h-8 text-purple-400/50 mb-2 shrink-0" />
                              <span className="text-[10px] font-black text-[#debaff] uppercase tracking-wider line-clamp-3 px-1">
                                {game.title}
                              </span>
                              <span className="text-[8px] text-neutral-500 mt-1 font-mono">{game.platform}</span>
                            </div>
                          )}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 h-20" />
                          
                          {/* Rating and developer absolute tags */}
                          <div className="absolute bottom-2 left-2 flex items-center space-x-1 backdrop-blur-md bg-black/55 p-1 px-1.5 rounded-md text-[10px] text-amber-400 border border-white/5">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span className="font-semibold text-neutral-200">{game.rating}</span>
                          </div>

                          <div className="absolute bottom-2 right-2 backdrop-blur-md bg-black/55 p-0.5 px-2 rounded-md text-[9px] text-[#ebdbff] border border-white/5 font-mono">
                            {game.releaseYear}
                          </div>
                        </div>

                        {/* Middle textual descriptors */}
                        <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1.5">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${getPlatformColors(game.platform)}`}>
                                {game.platform}
                              </span>
                              <span className="text-[10px] text-neutral-500 font-mono">
                                {game.genre[0]}
                              </span>
                            </div>

                            <h4 className="text-sm font-semibold text-neutral-200 group-hover:text-purple-300 transition-colors line-clamp-1">
                              {game.title}
                            </h4>
                          </div>

                          {/* Horizontal Divider */}
                          <div className="border-t border-[#1b192c]/50 my-1 pt-2.5 flex items-center justify-between">
                            <div className="text-left">
                              <span className="text-[10px] text-neutral-500 line-through block leading-none">
                                {formatCOP(game.basePrice)}
                              </span>
                              <span className="text-base font-mono font-black text-amber-400 block leading-tight">
                                {formatCOP(discountedCheapestPrice)}
                              </span>
                              <span className="text-[8px] text-neutral-400">Cheapest key</span>
                            </div>

                            {/* Cart CTA or Info access indicator */}
                            <div className="py-2 px-3 rounded-xl bg-purple-950/40 hover:bg-[#7c3aed] text-[#ebdbff] hover:text-white border border-purple-900/70 hover:border-transparent text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all">
                              <span>Ofertas</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                // EMPTY STATE ZONE
                <div className="py-12 text-center border-2 border-dashed border-[#201d32] rounded-3xl space-y-4">
                  <div className="h-12 w-12 rounded-full bg-[#1b1928] flex items-center justify-center mx-auto text-neutral-500">
                    <Search className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-md font-semibold text-neutral-300">No se encontraron videojuegos</h3>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                      No hay claves de videojuegos activos con estas especificaciones o etiquetas de plataformas. Prueba limpiando o cambiando tu frase de búsqueda.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPlatform("all");
                      setSelectedGenre("all");
                      setSearchQuery("");
                    }}
                    className="py-1.5 px-4 bg-[#7c3aed] hover:bg-purple-600 rounded-xl text-xs font-semibold"
                  >
                    Restablecer Catálogo
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

        {/* --- TUS COMPRAS Y CLAVES LIBRARY TABLE --- */}
        {activeTab === "my-purchases" && !checkoutResult && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#211d33] pb-3">
              <h2 className="text-lg font-display font-semibold text-neutral-100 flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" /> Mi Biblioteca de Licencias Digitales
              </h2>
              <span className="text-xs text-neutral-400 underline cursor-pointer" onClick={() => setActiveTab("store")}>
                Seguir comprando videojuegos
              </span>
            </div>

            {localOrders.length > 0 ? (
              <div className="space-y-4">
                {localOrders.map((ord: Order) => (
                  <div 
                    key={ord.id} 
                    className="bg-[#100d1b] border border-[#221e35] rounded-2xl overflow-hidden shadow-lg p-5 space-y-4"
                  >
                    {/* Header receipt info */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-[#1b192a] pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-400 uppercase">Número de Factura:</span>
                        <div className="text-sm font-mono font-bold text-neutral-200 flex items-center gap-2">
                          <span>{ord.id}</span>
                          <span className="text-[10px] font-mono bg-emerald-950 border border-emerald-900 text-emerald-400 px-1.5 py-0.2 rounded-md">
                            VALIDADO
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex sm:text-right space-x-4 sm:space-x-0 sm:flex-col text-xs text-neutral-400">
                        <div>
                          <span>Fecha: </span>
                          <strong className="text-neutral-300">{new Date(ord.date).toLocaleDateString()}</strong>
                        </div>
                        <div>
                          <span>Pago: </span>
                          <strong className="text-neutral-300 font-mono">{ord.paymentMethod}</strong>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-neutral-500 block">Total del Pedido</span>
                        <span className="text-sm font-mono font-bold text-amber-400">{formatCOP(ord.total)}</span>
                      </div>
                    </div>

                    {/* Bought keys list inside the order */}
                    <div className="space-y-3">
                      {ord.items.map((it: OrderItem, index: number) => {
                        const copyUniqueId = `${ord.id}-${index}-historic`;
                        const isCopied = copiedKeyId === copyUniqueId;
                        return (
                          <div key={index} className="p-3 rounded-xl bg-[#141221] border border-[#252136] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center space-x-3 min-w-0">
                              <img 
                                src={it.coverUrl} 
                                alt={it.gameTitle} 
                                className="h-10 w-8 object-cover rounded border border-neutral-900" 
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0">
                                <h4 className="text-xs font-semibold text-neutral-200 truncate max-w-[180px] sm:max-w-md">
                                  {it.gameTitle}
                                </h4>
                                <div className="flex items-center space-x-1.5 mt-0.5">
                                  <span className="text-[8px] font-mono font-bold text-purple-400 uppercase">{it.platform}</span>
                                  <span className="text-[8px] text-neutral-500">•</span>
                                  <span className="text-[8px] text-emerald-400 font-bold">Costo: {formatCOP(it.price)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Code Reveal, clipboard and refund actions */}
                            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                              <div className="flex items-center space-x-2">
                                <code className="text-[11px] font-mono font-bold select-all py-1 px-2.5 bg-black rounded border border-purple-950 text-[#d946ef] tracking-wider">
                                  {it.key}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(it.key, copyUniqueId)}
                                  className={`p-1 rounded-lg border transition-all cursor-pointer ${
                                    isCopied
                                      ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                                      : "bg-[#211d33] text-neutral-400 border-[#2e2946] hover:bg-[#2b2542]"
                                  }`}
                                  title="Copiar código"
                                >
                                  {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>

                              <button
                                onClick={() => handleRefundItem(ord.id, index)}
                                className="px-2.5 py-1 text-[10px] font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/35 hover:border-rose-500 rounded-lg transition-all cursor-pointer shadow active:scale-95 flex items-center gap-1 shrink-0"
                                title="Solicitar devolución de este juego y reembolsar el monto a tu saldo"
                              >
                                <span>↩</span> Devolver
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              // Empty catalog logic
              <div className="py-12 border-2 border-dashed border-[#201d32] rounded-3xl text-center space-y-4">
                <div className="h-12 w-12 bg-[#201d33]/50 border border-[#372f54] text-[#a78bfa] rounded-full flex items-center justify-center mx-auto">
                  <Key className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-md font-semibold text-neutral-300">Sin licencias compradas en esta sesión</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
                    Cualquier juego que Checkout/compres aparecerá de forma inmediata aquí con sus seriales correspondientes legibles para siempre.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("store")}
                  className="py-2 px-4 bg-[#7c3aed] hover:bg-purple-600 rounded-xl text-xs font-semibold text-white transition-colors"
                >
                  Explorar Catálogo de Nintendo, Steam o Xbox
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- APARTADO: MI CUENTA / PERFIL GAMER --- */}
        {activeTab === "profile" && !checkoutResult && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#211d33] pb-3">
              <h2 className="text-lg font-display font-semibold text-neutral-100 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-400" /> Mi Cuenta Google VeloKey
              </h2>
              <span className="text-xs text-neutral-400 underline cursor-pointer hover:text-purple-300" onClick={() => setActiveTab("store")}>
                Explorar catálogo de videojuegos
              </span>
            </div>

            {userProfile?.isLoggedIn ? (
              // USER PROFILE IS LOGGED IN
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left card: User Card with profile pic, range & quick actions */}
                <div className="md:col-span-5 bg-gradient-to-b from-[#151025] to-[#0d0919] border border-[#231a3d] rounded-3xl p-5 text-center space-y-4 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#d946ef] via-[#7c3aed] to-amber-500" />
                  
                  {/* Google Verified Badge top right */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-950/85 border border-emerald-500/30 rounded-full px-2 py-0.5 text-[8px] text-emerald-400 font-mono font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Google Conectado
                  </div>

                  <div className="relative w-24 h-24 mx-auto mt-4">
                    <img 
                      src={userProfile.avatar} 
                      alt={userProfile.name} 
                      className="w-24 h-24 rounded-full border-2 border-purple-500 object-cover shadow-lg shadow-purple-500/10"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#7c3aed] text-white p-1.5 rounded-full border border-black shadow">
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-display font-black text-white">{userProfile.name}</h3>
                    <p className="text-xs text-neutral-400 font-mono select-all leading-tight">{userProfile.email}</p>
                  </div>

                  <div className="bg-[#1c1433]/70 rounded-2xl p-3 border border-purple-900/20 text-left space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-400">Rango de Comprador:</span>
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        {localOrders.length === 0 ? "Bronce 🥉" : 
                         localOrders.length <= 2 ? "Plata 🥈" : 
                         localOrders.length <= 5 ? "Oro 🥇" : "Leyenda Gamer 👑"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-400">Puntos de Lealtad:</span>
                      <span className="font-mono font-bold text-purple-300">
                        {Math.floor((localOrders.reduce((sum, o) => sum + o.total, 0) / 1000) + 120)} PTS
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-400">Fecha de Registro:</span>
                      <span className="text-neutral-300 font-sans">{userProfile.joinedDate}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => {
                        // Log out
                        setUserProfile(null);
                        localStorage.removeItem("velokey_user_profile");
                        showToast("info", "Has cerrado tu sesión con Google de forma segura.");
                        setActiveTab("store");
                      }}
                      className="w-full py-2 bg-rose-950/20 hover:bg-rose-900/30 border border-rose-500/30 hover:border-rose-500/50 rounded-xl text-neutral-300 text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Cerrar Sesión Google
                    </button>
                  </div>
                </div>

                {/* Right Area: Account status panel, Security, orders quick metrics */}
                <div className="md:col-span-7 space-y-4">
                  {/* Main Perks display */}
                  <div className="bg-[#0f0c1d] border border-[#211a37] rounded-3xl p-5 space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">Información del Perfil de Seguridad</h3>
                    
                    <div className="grid grid-cols-2 gap-3.5 pt-1">
                      <div className="bg-[#120f24] border border-purple-950/20 p-3 rounded-xl">
                        <span className="text-[10px] text-neutral-500 font-mono block">MÉTODO DE AUTENTICACIÓN</span>
                        <span className="text-xs font-bold text-neutral-200">Google OAuth 2.0 Client</span>
                      </div>
                      <div className="bg-[#120f24] border border-purple-950/20 p-3 rounded-xl">
                        <span className="text-[10px] text-neutral-500 font-mono block">VERIFICACIÓN DOBLE FACTOR</span>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">✅ ACTIVADO</span>
                      </div>
                      <div className="bg-[#120f24] border border-purple-950/20 p-3 rounded-xl">
                        <span className="text-[10px] text-neutral-500 font-mono block">IP ASIGNADA DE COMPRA</span>
                        <span className="text-xs font-mono font-bold text-pink-400">{userProfile.regionalIP}</span>
                      </div>
                      <div className="bg-[#120f24] border border-purple-950/20 p-3 rounded-xl">
                        <span className="text-[10px] text-neutral-500 font-mono block">REGIÓN COMPATIBLE PRINCIPAL</span>
                        <span className="text-xs font-bold text-amber-400">{userProfile.region}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-purple-950/10 border border-purple-900/30 rounded-xl text-xs text-neutral-400 leading-relaxed space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-purple-300">
                        <Sparkles className="w-4 h-4 text-pink-400" /> Beneficio de Cuenta Activa
                      </div>
                      <p>
                        Al haber iniciado sesión con tu correo de Google verificado, se te ha asignado una IP virtual colombiana que habilita la compra, reembolso y despliegue de seriales globales y locales en Pesos Colombianos (COP).
                      </p>
                      <p className="text-[11px] text-neutral-500 font-sans">
                        Sección de seguridad administrada mediante Google Identity Platform.
                      </p>
                    </div>
                  </div>

                  {/* Orders dashboard indicators */}
                  <div className="bg-[#0f0c1d] border border-[#211a37] rounded-3xl p-5 space-y-4">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">Resumen de Actividad de Compras</h3>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-[#161225]/60 p-3 rounded-xl border border-purple-950/20 text-center">
                        <span className="text-[9px] text-neutral-500 block">COMPRAS</span>
                        <span className="text-lg font-mono font-black text-white">{localOrders.length}</span>
                      </div>
                      <div className="bg-[#161225]/60 p-3 rounded-xl border border-purple-950/20 text-center">
                        <span className="text-[9px] text-neutral-500 block">TOTAL INVERTIDO</span>
                        <span className="text-sm font-mono font-bold text-emerald-400 mt-1 block">
                          {formatCOP(localOrders.reduce((sum, o) => sum + o.total, 0))}
                        </span>
                      </div>
                      <div className="bg-[#161225]/60 p-3 rounded-xl border border-purple-950/20 text-center">
                        <span className="text-[9px] text-neutral-500 block">LICENCIAS</span>
                        <span className="text-lg font-mono font-bold text-amber-400">
                          {localOrders.reduce((sum, o) => sum + o.items.length, 0)}
                        </span>
                      </div>
                    </div>

                    {localOrders.length > 0 && (
                      <button
                        onClick={() => { setActiveTab("my-purchases"); }}
                        className="w-full py-2 bg-purple-600/10 hover:bg-purple-600/30 border border-purple-500/20 rounded-xl text-purple-300 text-xs font-semibold cursor-pointer transition-colors text-center block"
                      >
                        Ir a mi biblioteca para ver mis claves
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              // NOT LOGGED IN LANDING & GOOGLE BUTTON
              <div className="max-w-xl mx-auto bg-gradient-to-b from-[#141026] to-[#0c0916] border border-[#22173f] rounded-3xl p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden text-center">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-500 via-[#7c3aed] to-amber-500" />
                
                <div className="space-y-2 mt-4">
                  <div className="h-14 w-14 rounded-2xl bg-[#7c3aed]/10 border border-[#7c3aed]/30 flex items-center justify-center mx-auto text-[#7c3aed]">
                    <User className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-display font-black text-white">Prueba de Autenticación Unificada</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                    Inicia sesión con tu cuenta de Google. Podrás explorar libremente por la app si no lo haces, pero para realizar transacciones ficticias de claves debes estar verificado.
                  </p>
                </div>

                <div className="pt-2">
                  {/* STUNNING PREMIUM GOOGLE SIGN IN BUTTON */}
                  <button
                    onClick={() => setShowGoogleLoginModal(true)}
                    className="w-full py-3.5 px-4 bg-white hover:bg-neutral-100 text-neutral-800 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-3 cursor-pointer transition-all border border-neutral-300 active:scale-98"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.52 0-6.37-2.85-6.37-6.37s2.85-6.37 6.37-6.37c1.616 0 3.085.607 4.212 1.6l3.023-3.023C19.043 2.222 15.845 1 12.24 1 6.032 1 1 6.032 1 12.24s5.032 11.24 11.24 11.24c5.808 0 10.748-4.227 10.748-11.24 0-.766-.08-1.5-.24-2.215H12.24z"
                      />
                    </svg>
                    <span>INICIAR SESIÓN CON GOOGLE</span>
                  </button>
                </div>

                <div className="border-t border-purple-950/30 pt-4 text-left space-y-3.5">
                  <h4 className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest text-center">¿Qué beneficios obtengo?</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-neutral-400 font-sans">
                    <div className="flex items-start gap-2">
                      <span className="text-[#a78bfa] text-xs">✔</span>
                      <p>
                        <strong className="text-white text-xs block">Compras de Licencias</strong>
                        Explora precios y compra tus claves de activación ficticias de Steam u otras tiendas.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#a78bfa] text-xs">✔</span>
                      <p>
                        <strong className="text-white text-xs block">Biblioteca de Claves</strong>
                        Mantén organizadas todas tus claves canjeables y solicita devoluciones inmediatas.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#a78bfa] text-xs">✔</span>
                      <p>
                        <strong className="text-white text-xs block">Monedero Virtual Activo</strong>
                        Recarga saldo virtual o devuélvelo para realizar pruebas ilimitadas de compra.
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#a78bfa] text-xs">✔</span>
                      <p>
                        <strong className="text-white text-xs block">Soporte y Garantías</strong>
                        Garantiza compatibilidad de región asignada con tu IP automáticamente.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}

        {/* --- APARTADO: PANEL ADMINISTRADOR --- */}
        {activeTab === "admin" && userProfile?.role === "admin" && !checkoutResult && (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-red-950/40 pb-3 gap-2">
              <div>
                <h2 className="text-xl font-display font-black text-red-500 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-500 animate-pulse" /> Consola de Administración VeloKey Global
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">Control completo de catálogo, inventarios, promociones e historial general de transacciones.</p>
              </div>
              <button 
                onClick={() => { setActiveTab("store"); }}
                className="px-3 py-1.5 bg-[#120f1e] hover:bg-[#1f1a30] text-neutral-350 text-xs font-semibold rounded-lg border border-purple-950/20 self-start transition-colors cursor-pointer"
              >
                Volver al Catálogo Público
              </button>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-[#1a0f12] to-[#2b0d14]/70 border border-red-950/50 rounded-2xl p-4">
                <span className="text-[10px] text-red-300 font-mono font-bold block uppercase tracking-wide">Recaudación Total</span>
                <span className="text-xl font-mono font-black text-white block mt-1">
                  {formatCOP(adminStats?.totalRevenue || 0)}
                </span>
                <p className="text-[9px] text-neutral-400 mt-1">Simulado de compras por IP</p>
              </div>

              <div className="bg-gradient-to-br from-[#151329] to-[#0f111f] border border-purple-950/40 rounded-2xl p-4">
                <span className="text-[10px] text-purple-300 font-mono font-bold block uppercase tracking-wide">Licencias Vendidas</span>
                <span className="text-xl font-mono font-black text-amber-400 block mt-1">
                  {adminStats?.totalKeysSold || 0} Licencias
                </span>
                <p className="text-[9px] text-neutral-400 mt-1">Seriales digitales expedidos</p>
              </div>

              <div className="bg-gradient-to-br from-[#0d161a] to-[#081216] border border-sky-950/40 rounded-2xl p-4">
                <span className="text-[10px] text-sky-300 font-mono font-bold block uppercase tracking-wide">Juegos en Catálogo</span>
                <span className="text-xl font-mono font-black text-white block mt-1">
                  {adminStats?.uniqueGamesCount || games.length} Juegos
                </span>
                <p className="text-[9px] text-neutral-400 mt-1">Base de datos en-memoria</p>
              </div>

              <div className="bg-gradient-to-br from-[#1b1712] to-[#120f0d] border border-amber-950/40 rounded-2xl p-4">
                <span className="text-[10px] text-amber-300 font-mono font-bold block uppercase tracking-wide">Alertas de Stock Bajo</span>
                <span className="text-xl font-mono font-black text-rose-500 block mt-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-5 h-5 text-rose-500 inline shrink-0" />
                  {adminStats?.inventoryStockAlerts?.length || 0}
                </span>
                <p className="text-[9px] text-neutral-400 mt-1">Vendedores con stock menor a 5</p>
              </div>
            </div>

            {/* Layout Split: Add Game & Live Catalog Manage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN: ADD GAME FORM */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-[#120f1e] border border-red-950/20 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-mono font-black uppercase text-amber-500 tracking-wider flex items-center gap-1.5">
                    <Plus className="w-4 h-4 text-amber-500" /> Agregar Nuevo Videojuego
                  </h3>

                  <div className="space-y-3.5 text-xs text-left">
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold font-sans">Título del Videojuego:</label>
                      <input
                        type="text"
                        placeholder="Ej. God of War Ragnarök"
                        value={newGameForm.title}
                        onChange={(e) => setNewGameForm({...newGameForm, title: e.target.value})}
                        className="w-full font-sans bg-[#0c0915] border border-purple-950/30 rounded-xl p-2 text-white outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-neutral-400 font-semibold block font-sans">Plataforma:</label>
                        <select
                          value={newGameForm.platform}
                          onChange={(e) => setNewGameForm({...newGameForm, platform: e.target.value})}
                          className="w-full bg-[#0c0915] border border-purple-950/30 rounded-xl p-2 text-white outline-none cursor-pointer"
                        >
                          <option value="Steam">Steam 🎮</option>
                          <option value="Xbox">Xbox 🟢</option>
                          <option value="PlayStation">PlayStation 🔵</option>
                          <option value="Nintendo">Nintendo 🔴</option>
                          <option value="Epic Games">Epic Games ⚡</option>
                          <option value="EA App">EA App 🔶</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 font-semibold block font-sans">Región:</label>
                        <select
                          value={newGameForm.region}
                          onChange={(e) => setNewGameForm({...newGameForm, region: e.target.value})}
                          className="w-full bg-[#0c0915] border border-purple-950/30 rounded-xl p-2 text-white outline-none cursor-pointer"
                        >
                          <option value="GLOBAL">GLOBAL ✔</option>
                          <option value="LATAM">LATAM 🌎</option>
                          <option value="USA">USA 🇺🇸</option>
                          <option value="EUROPE">EUROPE 🇪🇺</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-neutral-400 font-semibold block font-sans">Precio Base (COP):</label>
                        <input
                          type="number"
                          placeholder="Ej. 180000"
                          value={newGameForm.basePrice}
                          onChange={(e) => setNewGameForm({...newGameForm, basePrice: e.target.value})}
                          className="w-full bg-[#0c0915] border border-purple-950/30 rounded-xl p-2 text-white outline-none focus:border-red-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 font-semibold block font-sans">Descuento (%):</label>
                        <input
                          type="number"
                          placeholder="Ej. 25"
                          value={newGameForm.discount}
                          onChange={(e) => setNewGameForm({...newGameForm, discount: e.target.value})}
                          className="w-full bg-[#0c0915] border border-purple-950/30 rounded-xl p-2 text-white outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-neutral-400 font-semibold block font-sans">Desarrollador:</label>
                        <input
                          type="text"
                          placeholder="Ej. Santa Monica Studio"
                          value={newGameForm.developer}
                          onChange={(e) => setNewGameForm({...newGameForm, developer: e.target.value})}
                          className="w-full bg-[#0c0915] border border-purple-950/30 rounded-xl p-2 text-white outline-none focus:border-red-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-400 font-semibold block font-sans">Género principal:</label>
                        <input
                          type="text"
                          placeholder="Ej. Acción"
                          value={newGameForm.genre}
                          onChange={(e) => setNewGameForm({...newGameForm, genre: e.target.value})}
                          className="w-full bg-[#0c0915] border border-purple-950/30 rounded-xl p-2 text-white outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block font-sans">URL de Portada (Imagen):</label>
                      <input
                        type="text"
                        placeholder="Inserta un enlace Unsplash o deja vacío por defecto..."
                        value={newGameForm.coverUrl}
                        onChange={(e) => setNewGameForm({...newGameForm, coverUrl: e.target.value})}
                        className="w-full bg-[#0c0915] border border-purple-950/30 rounded-xl p-2 text-white outline-none focus:border-red-500 font-mono text-[11px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block font-sans">Resumen / Descripción corta:</label>
                      <textarea
                        rows={2}
                        placeholder="Describe brevemente el juego para los usuarios..."
                        value={newGameForm.description}
                        onChange={(e) => setNewGameForm({...newGameForm, description: e.target.value})}
                        className="w-full bg-[#0c0915] border border-purple-950/30 rounded-xl p-2 text-white outline-none focus:border-red-500 resize-none"
                      />
                    </div>

                    <button
                      onClick={async () => {
                        if (!newGameForm.title.trim() || !newGameForm.basePrice) {
                          showToast("error", "Debes completar el título del juego y su precio base.");
                          return;
                        }
                        try {
                          const res = await fetch("/api/games", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              title: newGameForm.title,
                              platform: newGameForm.platform,
                              genre: [newGameForm.genre],
                              region: newGameForm.region,
                              basePrice: Number(newGameForm.basePrice),
                              discount: Number(newGameForm.discount || 0),
                              developer: newGameForm.developer,
                              description: newGameForm.description,
                              coverUrl: newGameForm.coverUrl,
                              releaseYear: Number(newGameForm.releaseYear || new Date().getFullYear())
                            })
                          });
                          const data = await res.json();
                          if (data.success) {
                            showToast("success", `🎮 ¡Exitoso! "${newGameForm.title}" registrado correctamente en el servidor.`);
                            // Reset state
                            setNewGameForm({
                              title: "",
                              platform: "Steam",
                              genre: "Acción",
                              region: "GLOBAL",
                              basePrice: "",
                              discount: "0",
                              developer: "",
                              publisher: "",
                              description: "",
                              coverUrl: "",
                              releaseYear: "2026"
                            });
                            // Re-fetch games index & stats
                            fetchGames();
                            fetchAdminStats();
                          } else {
                            showToast("error", data.error || "Ocurrió un error.");
                          }
                        } catch (err) {
                          console.error("Post game error:", err);
                          showToast("error", "Fallo al conectar con el servidor.");
                        }
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-center"
                    >
                      Agregar Videojuego al Servidor
                    </button>
                  </div>
                </div>

                {/* Sub-Card: Low Inventory Notifications details */}
                <div className="bg-[#120f1e] border border-[#231a31] rounded-2xl p-4 space-y-3 text-left">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">Canales de Alerta de Stock</h4>
                  <div className="space-y-2">
                    {!adminStats?.inventoryStockAlerts || adminStats.inventoryStockAlerts.length === 0 ? (
                      <p className="text-[11px] text-[#4ade80] flex items-center gap-1.5">
                        <Check className="w-4 h-4 shrink-0" /> Todo el stock ficticio está saludable. (más de 5 llaves por proveedor).
                      </p>
                    ) : (
                      adminStats.inventoryStockAlerts.slice(0, 3).map((item: any, i: number) => (
                        <div key={i} className="text-[11px] bg-[#1d1629] p-2 rounded-lg border border-red-950/20 space-y-0.5">
                          <span className="text-red-400 font-extrabold">{item.title}</span>
                          <span className="font-mono text-[9px] text-[#8e85a6] block leading-none">{item.platform}</span>
                          <p className="text-[9px] text-amber-500 font-mono leading-none pt-1">
                            ⚠️ Proveedor {item.lowStockSellers[0]?.name} tiene {item.lowStockSellers[0]?.stock} claves disponibles.
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: ACTIVE CATALOG EDITOR LIST */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-[#120f1e] border border-red-950/10 rounded-2xl p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <h3 className="text-xs font-mono font-black uppercase text-amber-500 tracking-wider text-left">
                      Catálogo Activo de Videojuegos
                    </h3>
                    {/* Catalog search bar inside admin inventory */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Filtrar catálogo..."
                        value={adminSearchQuery}
                        onChange={(e) => setAdminSearchQuery(e.target.value)}
                        className="bg-[#0c0915] border border-purple-950/30 rounded-lg pl-8 pr-2.5 py-1 text-xs text-white outline-none w-full sm:w-48 focus:border-red-500"
                      />
                    </div>
                  </div>

                  {/* Games admin grid scrollable panel */}
                  <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                    {games
                      .filter(g => g.title.toLowerCase().includes(adminSearchQuery.toLowerCase()))
                      .map((game) => {
                        const isEditing = editingGameId === game.id;
                        return (
                          <div 
                            key={game.id} 
                            className={`p-3 rounded-xl border transition-all text-xs text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                              isEditing ? "bg-[#1f1629] border-red-500/50" : "bg-[#0f0c1c]/90 border-purple-950/20 hover:border-purple-950/45"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={game.coverUrl}
                                alt={game.title}
                                className="w-10 h-13 object-cover rounded-lg shrink-0 border border-purple-950/20"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop";
                                }}
                              />
                              <div>
                                <h4 className="text-xs font-bold text-white block truncate max-w-[200px] leading-tight">
                                  {game.title}
                                </h4>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className="text-[9px] font-mono leading-none bg-[#1d1b2e] px-1.5 py-0.5 rounded text-purple-300 font-extrabold">
                                    {game.platform}
                                  </span>
                                  <span className="text-[9px] font-mono leading-none bg-[#24131b] px-1.5 py-0.5 rounded text-rose-300">
                                    {game.region}
                                  </span>
                                </div>
                                <p className="text-[10px] text-neutral-400 font-sans mt-1">
                                  Precio Base: <span className="font-mono text-neutral-300 font-bold">{formatCOP(game.basePrice)}</span> | Descuento: <span className="text-pink-400 font-mono">-{game.discount}%</span>
                                </p>
                              </div>
                            </div>

                            {/* Options Interface */}
                            {isEditing ? (
                              <div className="w-full bg-[#130d1d] p-4 rounded-xl border border-purple-500/40 space-y-3.5 text-[11px] self-stretch mt-2">
                                <p className="text-purple-400 font-bold uppercase tracking-wider text-[10px] border-b border-purple-950/40 pb-1">
                                  Editar Información del Videojuego
                                </p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="space-y-0.5">
                                    <label className="text-neutral-400 block font-bold text-[9px]">Título del Videojuego:</label>
                                    <input
                                      type="text"
                                      value={editingGameData.title}
                                      onChange={(e) => setEditingGameData({...editingGameData, title: e.target.value})}
                                      className="w-full bg-black text-white p-1.5 rounded font-sans text-xs outline-none border border-purple-950/40 focus:border-purple-500"
                                    />
                                  </div>
                                  <div className="space-y-0.5">
                                    <label className="text-neutral-400 block font-bold text-[9px]">URL de la Portada / Imagen (Evita enlaces caídos):</label>
                                    <input
                                      type="text"
                                      value={editingGameData.coverUrl}
                                      onChange={(e) => setEditingGameData({...editingGameData, coverUrl: e.target.value})}
                                      className="w-full bg-black text-white p-1.5 rounded font-mono text-[10px] outline-none border border-purple-950/40 focus:border-purple-500"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                  <div className="space-y-0.5">
                                    <label className="text-neutral-400 block font-bold text-[9px]">Plataforma:</label>
                                    <select
                                      value={editingGameData.platform}
                                      onChange={(e) => setEditingGameData({...editingGameData, platform: e.target.value})}
                                      className="w-full bg-black text-white p-1.5 rounded font-sans text-xs outline-none border border-purple-950/40 focus:border-purple-500 cursor-pointer"
                                    >
                                      <option value="Steam">Steam</option>
                                      <option value="Xbox">Xbox</option>
                                      <option value="PlayStation">PlayStation</option>
                                      <option value="Epic Games">Epic Games</option>
                                      <option value="Nintendo">Nintendo</option>
                                      <option value="EA App">EA App</option>
                                    </select>
                                  </div>
                                  <div className="space-y-0.5">
                                    <label className="text-neutral-400 block font-bold text-[9px]">Región:</label>
                                    <select
                                      value={editingGameData.region}
                                      onChange={(e) => setEditingGameData({...editingGameData, region: e.target.value})}
                                      className="w-full bg-black text-white p-1.5 rounded font-sans text-xs outline-none border border-purple-950/40 focus:border-purple-500 cursor-pointer"
                                    >
                                      <option value="GLOBAL">GLOBAL</option>
                                      <option value="USA">USA Only</option>
                                      <option value="COLOMBIA">Colombia Only</option>
                                    </select>
                                  </div>
                                  <div className="space-y-0.5">
                                    <label className="text-neutral-400 block font-bold text-[9px]">Precio Base (COP):</label>
                                    <input
                                      type="number"
                                      value={editingGameData.basePrice}
                                      onChange={(e) => setEditingGameData({...editingGameData, basePrice: e.target.value})}
                                      className="w-full bg-black text-white p-1.5 rounded font-mono text-xs outline-none border border-purple-950/40 focus:border-purple-500"
                                    />
                                  </div>
                                  <div className="space-y-0.5">
                                    <label className="text-neutral-400 block font-bold text-[9px]">Descuento %:</label>
                                    <input
                                      type="number"
                                      value={editingGameData.discount}
                                      onChange={(e) => setEditingGameData({...editingGameData, discount: e.target.value})}
                                      className="w-full bg-black text-white p-1.5 rounded font-mono text-xs outline-none border border-purple-950/40 focus:border-purple-500"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="space-y-0.5">
                                    <label className="text-neutral-400 block font-bold text-[9px]">Desarrollador:</label>
                                    <input
                                      type="text"
                                      value={editingGameData.developer}
                                      onChange={(e) => setEditingGameData({...editingGameData, developer: e.target.value})}
                                      className="w-full bg-black text-white p-1.5 rounded font-sans text-xs outline-none border border-purple-950/40 focus:border-purple-500"
                                    />
                                  </div>
                                  <div className="space-y-0.5">
                                    <label className="text-neutral-400 block font-bold text-[9px]">Stock Primer Proveedor:</label>
                                    <input
                                      type="number"
                                      value={editingGameData.stock}
                                      onChange={(e) => setEditingGameData({...editingGameData, stock: e.target.value})}
                                      className="w-full bg-black text-white p-1.5 rounded font-mono text-xs outline-none border border-purple-950/40 focus:border-purple-500"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-0.5">
                                  <label className="text-neutral-400 block font-bold text-[9px]">Descripción / Sinopsis:</label>
                                  <textarea
                                    value={editingGameData.description}
                                    onChange={(e) => setEditingGameData({...editingGameData, description: e.target.value})}
                                    rows={2}
                                    className="w-full bg-black text-white p-1.5 rounded font-sans text-xs outline-none border border-purple-950/40 focus:border-purple-500 resize-none h-14"
                                  />
                                </div>

                                <div className="flex gap-2 justify-end pt-1">
                                  <button
                                    onClick={() => setEditingGameId(null)}
                                    className="py-1 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-lg cursor-pointer"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    onClick={async () => {
                                      try {
                                        const updatedSellers = [...game.sellers];
                                        if (updatedSellers[0]) {
                                          updatedSellers[0].stock = Number(editingGameData.stock || 0);
                                          updatedSellers[0].price = Math.round(Number(editingGameData.basePrice) * (1 - (Number(editingGameData.discount || 0) / 100)));
                                        }

                                        const res = await fetch(`/api/games/${game.id}`, {
                                          method: "PUT",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({
                                            title: editingGameData.title,
                                            platform: editingGameData.platform,
                                            region: editingGameData.region,
                                            coverUrl: editingGameData.coverUrl,
                                            basePrice: Number(editingGameData.basePrice),
                                            discount: Number(editingGameData.discount),
                                            developer: editingGameData.developer,
                                            description: editingGameData.description,
                                            sellers: updatedSellers
                                          })
                                        });
                                        const rData = await res.json();
                                        if (rData.success) {
                                          showToast("success", `📋 ¡Videojuego "${editingGameData.title}" actualizado con éxito!`);
                                          setEditingGameId(null);
                                          fetchGames();
                                          fetchAdminStats();
                                        }
                                      } catch (err) {
                                        console.error("PUT error:", err);
                                        showToast("error", "Ocurrió un error al actualizar los datos en el servidor.");
                                      }
                                    }}
                                    className="py-1 px-3.5 bg-green-700 hover:bg-green-600 text-white rounded-lg font-bold cursor-pointer transition-colors"
                                  >
                                    Guardar Cambios
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 self-end md:self-auto">
                                <button
                                  onClick={() => {
                                    setEditingGameId(game.id);
                                    setEditingGameData({
                                      title: game.title,
                                      platform: game.platform,
                                      region: game.region || "GLOBAL",
                                      basePrice: game.basePrice.toString(),
                                      discount: game.discount.toString(),
                                      coverUrl: game.coverUrl,
                                      developer: game.developer,
                                      description: game.description,
                                      publisher: game.publisher || "",
                                      stock: (game.sellers[0]?.stock || 0).toString()
                                    });
                                  }}
                                  className="px-2.5 py-1 bg-yellow-900/25 hover:bg-yellow-900/60 text-yellow-300 border border-yellow-800/40 rounded-lg font-bold cursor-pointer"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm(`¿Estás seguro de eliminar "${game.title}" del catálogo global?`)) {
                                      try {
                                        const res = await fetch(`/api/games/${game.id}`, { method: "DELETE" });
                                        if (res.ok) {
                                          showToast("info", "Videojuego removido permanentemente.");
                                          fetchGames();
                                          fetchAdminStats();
                                        }
                                      } catch (err) {
                                        showToast("error", "Error al intentar borrar el juego.");
                                      }
                                    }
                                  }}
                                  className="px-2.5 py-1 bg-red-950/30 hover:bg-red-900/40 text-red-400 border border-red-500/20 rounded-lg font-semibold cursor-pointer"
                                >
                                  Eliminar
                                </button>
                              </div>
                            )}

                          </div>
                        );
                      })}
                  </div>

                </div>
              </div>

            </div>

            {/* Simulated server logs for checking digital purchases */}
            <div className="bg-[#120f1e] border border-red-950/10 rounded-2xl p-5 space-y-3.5">
              <h3 className="text-xs font-mono font-black uppercase text-amber-500 tracking-wider flex items-center gap-2 text-left">
                <History className="w-4 h-4 text-red-500" /> Historial de Transacciones de Compra de Claves (General)
              </h3>
              
              <div className="overflow-x-auto text-left">
                {localOrders.length === 0 ? (
                  <p className="text-[11px] text-neutral-500 font-sans italic text-center py-4">No se han registrado simulacros de checkout en esta sesión.</p>
                ) : (
                  <table className="w-full text-[11px] border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-purple-950/10 text-neutral-400 font-mono">
                        <th className="py-2 px-1 text-left">ID Orden</th>
                        <th className="py-2 px-1 text-left">Fecha</th>
                        <th className="py-2 px-1 text-left">Items Adquiridos</th>
                        <th className="py-2 px-1 text-left">Método</th>
                        <th className="py-2 px-1 text-right">Monto Total</th>
                        <th className="py-2 px-1 text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localOrders.map((order, i) => (
                        <tr key={i} className="border-b border-purple-950/10 hover:bg-neutral-950/30">
                          <td className="py-2 px-1 font-mono font-bold text-neutral-400">{order.id}</td>
                          <td className="py-2 px-1 text-neutral-400">{order.date}</td>
                          <td className="py-2 px-1 space-y-1">
                            {order.items.map((it: any, j: number) => (
                              <div key={j} className="flex flex-col">
                                <span className="font-extrabold font-sans text-neutral-200">{it.gameTitle} ({it.platform})</span>
                                <span className="font-mono text-[9px] text-[#22c55e]">Clave: {it.key}</span>
                              </div>
                            ))}
                          </td>
                          <td className="py-2 px-1 font-mono uppercase text-[#e9d5ff]">{order.paymentMethod}</td>
                          <td className="py-2 px-1 text-right font-mono text-emerald-400 font-extrabold">{formatCOP(order.total)}</td>
                          <td className="py-2 px-1 text-center">
                            <span className="bg-emerald-950/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded-full font-mono text-[9px]">
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

          </div>
        )}

        {/* --- APARTADO: PANEL SOCIO VENDEDOR --- */}
        {activeTab === "seller" && userProfile?.role === "seller" && !checkoutResult && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-pink-950/40 pb-3 gap-2">
              <div>
                <h2 className="text-xl font-display font-black text-pink-400 flex items-center gap-2">
                  <Package className="w-5 h-5 text-pink-400" /> Centro de Socios Vendedores VeloKey
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">Socio Comercial Activo: <span className="text-white font-extrabold">{userProfile.name}</span></p>
              </div>
              <button 
                onClick={() => { setActiveTab("store"); }}
                className="px-3 py-1.5 bg-[#120f1e] hover:bg-[#1f1a30] text-neutral-350 text-xs font-semibold rounded-lg border border-purple-950/20 self-start transition-colors cursor-pointer"
              >
                Volver al Catálogo Público
              </button>
            </div>

            {/* Merchant metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-tr from-[#1b0d1e] to-[#0c0915] border border-pink-950/30 rounded-2xl p-4 text-center">
                <span className="text-[10px] text-pink-300 font-mono block uppercase">Reputación Comercial</span>
                <span className="text-2xl font-mono font-black text-pink-400 block mt-1">99.1% Positivo</span>
                <p className="text-[9.5px] text-neutral-400 mt-0.5">Socio Proveedor Verificado VeloKey</p>
              </div>
              <div className="bg-gradient-to-tr from-[#1b0d1e] to-[#0c0915] border border-pink-950/30 rounded-2xl p-4 text-center">
                <span className="text-[10px] text-pink-300 font-mono block uppercase">Claves en Stock</span>
                <span className="text-2xl font-mono font-black text-white block mt-1">
                  {games.reduce((sum, g) => sum + g.sellers.filter(s => s.name === userProfile.name).reduce((sSum, s) => sSum + s.stock, 0), 0)} Unidades
                </span>
                <p className="text-[9.5px] text-neutral-400 mt-0.5">Inventario total de llaves registradas</p>
              </div>
              <div className="bg-gradient-to-tr from-[#1b0d1e] to-[#0c0915] border border-pink-950/30 rounded-2xl p-4 text-center">
                <span className="text-[10px] text-pink-300 font-mono block uppercase">Tipo de Entrega</span>
                <span className="text-2xl font-mono font-black text-yellow-400 block mt-1 flex items-center justify-center gap-1">
                  ⚡ INSTANTÁNEA
                </span>
                <p className="text-[9.5px] text-neutral-400 mt-0.5">Entrega garantizada por correo Google</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* PUBLISH STOCK UTILITY CARD */}
              <div className="lg:col-span-5 space-y-4 text-left">
                <div className="bg-[#120f1e] border border-pink-950/20 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-mono font-black uppercase text-pink-400 tracking-wider">
                    Suministrar Lote de Claves
                  </h3>
                  
                  <div className="space-y-3.5 text-xs">
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block font-sans">Seleccionar Videojuego de Destino:</label>
                      <select
                        value={selectedGameForOffer}
                        onChange={(e) => setSelectedGameForOffer(e.target.value)}
                        className="w-full bg-[#0c0915] border border-purple-950/30 rounded-xl p-2 text-white outline-none cursor-pointer"
                      >
                        <option value="">-- Elige un videojuego del catálogo --</option>
                        {games.map(g => (
                          <option key={g.id} value={g.id}>{g.title} ({g.platform})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block font-sans">Precio Especial por Clave (COP):</label>
                      <input
                        type="number"
                        placeholder="Ej. 135000"
                        value={sellerOfferPrice}
                        onChange={(e) => setSellerOfferPrice(e.target.value)}
                        className="w-full bg-[#0c0915] border border-purple-950/30 rounded-xl p-2 text-white outline-none focus:border-pink-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block font-sans">Cantidad de Claves a Añadir (Stock):</label>
                      <input
                        type="number"
                        placeholder="Ej. 15"
                        value={sellerOfferStock}
                        onChange={(e) => setSellerOfferStock(e.target.value)}
                        className="w-full bg-[#0c0915] border border-purple-950/30 rounded-xl p-2 text-white outline-none focus:border-pink-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block font-sans">Tipo de Expedición:</label>
                      <select
                        value={sellerOfferDelivery}
                        onChange={(e) => setSellerOfferDelivery(e.target.value as "INSTANT" | "MANUAL")}
                        className="w-full bg-[#0c0915] border border-purple-950/30 rounded-xl p-2 text-white outline-none cursor-pointer font-sans"
                      >
                        <option value="INSTANT">⚡ Entrega Inmediata Autorizada</option>
                        <option value="MANUAL">👤 Soporte Directo (Entrega Manual)</option>
                      </select>
                    </div>

                    <button
                      onClick={async () => {
                        if (!selectedGameForOffer || !sellerOfferPrice || !sellerOfferStock) {
                          showToast("error", "Por favor completa todos los campos para añadir tu oferta.");
                          return;
                        }

                        const targetGame = games.find(g => g.id === selectedGameForOffer);
                        if (!targetGame) return;

                        const updatedSellers = [...targetGame.sellers];
                        const existingSellerIndex = updatedSellers.findIndex(s => s.name === userProfile.name);

                        const newSellerRecord = {
                          id: existingSellerIndex !== -1 ? updatedSellers[existingSellerIndex].id : `s-${targetGame.id}-${Math.floor(Math.random() * 89 + 10)}`,
                          name: userProfile.name,
                          rating: 99.1,
                          positiveReviews: (existingSellerIndex !== -1 ? updatedSellers[existingSellerIndex].positiveReviews : 85) + 1,
                          price: Math.round(Number(sellerOfferPrice)),
                          stock: Number(sellerOfferStock),
                          deliveryType: sellerOfferDelivery
                        };

                        if (existingSellerIndex !== -1) {
                          updatedSellers[existingSellerIndex] = newSellerRecord;
                        } else {
                          updatedSellers.push(newSellerRecord);
                        }

                        try {
                          const res = await fetch(`/api/games/${selectedGameForOffer}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ sellers: updatedSellers })
                          });
                          if (res.ok) {
                            showToast("success", `🏪 ¡Oferta publicada! Tu tarifa para "${targetGame.title}" ya está visible en el catálogo de VeloKey.`);
                            setSellerOfferPrice("");
                            setSellerOfferStock("");
                            fetchGames();
                            fetchAdminStats();
                          }
                        } catch (err) {
                          showToast("error", "Hubo un problema al tramitar tu publicación.");
                        }
                      }}
                      className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-center"
                    >
                      Publicar Tarifa y Claves
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-b from-[#1b0f20]/50 to-[#0e0712]/80 border border-[#2d1238] rounded-2xl p-4 text-[11px] space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-300">Normativa de Venta Colectiva</h4>
                  <p className="text-neutral-400">
                    Como socio vendedor de VeloKey Colombia, tus ofertas compiten directamente en el catálogo por recomendación. Los clientes elegirán de manera libre según su criterio de precio, reputación y stock.
                  </p>
                </div>
              </div>

              {/* LIST MY ACTIVE OFFERS PANEL */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-[#120f1e] border border-pink-950/10 rounded-2xl p-4 space-y-3 pb-5">
                  <h3 className="text-xs font-mono font-black uppercase text-pink-400 tracking-wider text-left">
                    Mis Ofertas Activas y Publicaciones
                  </h3>

                  <div className="space-y-2.5">
                    {games.filter(g => g.sellers.some(s => s.name === userProfile.name)).length === 0 ? (
                      <p className="text-neutral-500 py-6 text-center italic text-xs">No has expedido tarifas de venta todavía. Diseña una oferta en el menú a la izquierda.</p>
                    ) : (
                      games
                        .filter(g => g.sellers.some(s => s.name === userProfile.name))
                        .map(game => {
                          const myOfferData = game.sellers.find(s => s.name === userProfile.name);
                          if (!myOfferData) return null;
                          return (
                            <div key={game.id} className="p-3 bg-[#0d0a17]/90 border border-[#25152a] rounded-xl flex items-center justify-between text-xs text-left gap-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={game.coverUrl}
                                  alt={game.title}
                                  className="w-9 h-11 object-cover rounded-lg shrink-0 border border-purple-950/20"
                                />
                                <div className="space-y-0.5">
                                  <h4 className="font-extrabold text-neutral-100">{game.title}</h4>
                                  <span className="font-mono text-[9px] text-pink-400 leading-none block">{game.platform} ({game.region})</span>
                                  <p className="text-[10px] text-neutral-400 pt-0.5">
                                    Precio de Venta: <span className="font-mono text-emerald-400 font-extrabold">{formatCOP(myOfferData.price)}</span> | Tu Stock: <span className="font-mono font-bold text-white">{myOfferData.stock} llaves</span>
                                  </p>
                                </div>
                              </div>

                              <button
                                onClick={async () => {
                                  const customNewStock = prompt(`Ajustar stock de claves para "${game.title}" (Actual: ${myOfferData.stock}):`, myOfferData.stock.toString());
                                  if (customNewStock !== null) {
                                    const cleanedStock = Number(customNewStock);
                                    if (isNaN(cleanedStock)) return;

                                    const nextSellers = game.sellers.map(s => {
                                      if (s.name === userProfile.name) {
                                        return { ...s, stock: cleanedStock };
                                      }
                                      return s;
                                    });

                                    try {
                                      const res = await fetch(`/api/games/${game.id}`, {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ sellers: nextSellers })
                                      });
                                      if (res.ok) {
                                        showToast("success", "🔄 Lote de claves y stock reajustado con éxito en el servidor.");
                                        fetchGames();
                                      }
                                    } catch (err) {
                                      showToast("error", "Error al procesar el ajuste de inventario.");
                                    }
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-pink-950/30 hover:bg-pink-900/40 border border-pink-500/20 rounded-xl text-pink-400 font-bold cursor-pointer"
                              >
                                Modificar Stock
                              </button>

                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* GOOGLE SIGN IN SIMULATION MODAL OVERLAY */}
        <AnimatePresence>
          {showGoogleLoginModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                className="w-full max-w-sm bg-[#ffffff] text-neutral-800 rounded-3xl p-6 shadow-2xl relative border border-neutral-200"
              >
                {/* Close Action */}
                <button
                  onClick={() => setShowGoogleLoginModal(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-4">
                  {/* Header Google Logo */}
                  <div className="text-center space-y-1.5">
                    <svg className="w-8 h-8 mx-auto" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.52 0-6.37-2.85-6.37-6.37s2.85-6.37 6.37-6.37c1.616 0 3.085.607 4.212 1.6l3.023-3.023C19.043 2.222 15.845 1 12.24 1 6.032 1 1 6.032 1 12.24s5.032 11.24 11.24 11.24c5.808 0 10.748-4.227 10.748-11.24 0-.766-.08-1.5-.24-2.215H12.24z"
                      />
                    </svg>
                    <h3 className="text-sm font-sans font-bold text-neutral-900 leading-none">Iniciar sesión con Google</h3>
                    <p className="text-[11px] text-neutral-500">para disfrutar de VeloKey Colombia en Pesos COP</p>
                  </div>

                  {isLoadingAuth ? (
                    // LOADER
                    <div className="py-8 text-center space-y-3">
                      <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto" strokeWidth={3} />
                      <p className="text-[11px] text-neutral-650 font-semibold font-sans">Sincronizando con Google Identity Engine...</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider text-center pt-1 border-t border-neutral-100 font-sans">
                        Cuentas Rápidas de Prueba
                      </p>

                      <div className="space-y-2">
                        {/* suggested account 1 */}
                        <button
                          onClick={async () => {
                            setIsLoadingAuth(true);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            const prof = {
                              isLoggedIn: true,
                              name: "Luis Miguel (Admin)",
                              email: "jaramilloluismiguel003@gmail.com",
                              avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
                              buyerTier: "Dueño 👑",
                              loyaltyPoints: 9999,
                              region: "Colombia (LATAM)",
                              regionalIP: "186.116.14.92",
                              joinedDate: new Date().toLocaleDateString("es-CO", { day: 'numeric', month: 'long', year: 'numeric' }),
                              role: "admin" as const
                            };
                            setUserProfile(prof);
                            localStorage.setItem("velokey_user_profile", JSON.stringify(prof));
                            setIsLoadingAuth(false);
                            setShowGoogleLoginModal(false);
                            showToast("success", "👋 ¡Bienvenido como Administrador! Tienes acceso a herramientas globales.");
                          }}
                          className="w-full p-2 text-left rounded-xl border border-neutral-200 hover:border-purple-500 hover:bg-purple-50/20 flex items-center justify-between transition-all cursor-pointer active:bg-neutral-150 group"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
                              alt="Luis Miguel"
                              className="w-8 h-8 rounded-full object-cover border border-purple-300 shadow-sm"
                            />
                            <div>
                              <span className="text-[11px] font-extrabold text-neutral-800 block leading-tight">Luis Miguel</span>
                              <span className="text-[9px] text-neutral-500 font-mono block leading-none">jaramilloluismiguel003@gmail.com</span>
                            </div>
                          </div>
                          <span className="text-[8.5px] font-mono font-black bg-purple-100 text-purple-700 border border-purple-200 rounded px-1.5 py-0.5 shrink-0 animated-pulse">
                            Administrador 👑
                          </span>
                        </button>

                        {/* suggested account 2 */}
                        <button
                          onClick={async () => {
                            setIsLoadingAuth(true);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            const prof = {
                              isLoggedIn: true,
                              name: "Gamer Legend Pro",
                              email: "gamer.legend@gmail.com",
                              avatar: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=150",
                              buyerTier: "Socio Oro 🥇",
                              loyaltyPoints: 120,
                              region: "Colombia (LATAM)",
                              regionalIP: "186.116.22.45",
                              joinedDate: new Date().toLocaleDateString("es-CO", { day: 'numeric', month: 'long', year: 'numeric' }),
                              role: "seller" as const
                            };
                            setUserProfile(prof);
                            localStorage.setItem("velokey_user_profile", JSON.stringify(prof));
                            setIsLoadingAuth(false);
                            setShowGoogleLoginModal(false);
                            showToast("success", "🏪 Sesión iniciada como Socio Vendedor. ¡Gestiona tus ofertas!");
                          }}
                          className="w-full p-2 text-left rounded-xl border border-neutral-200 hover:border-pink-500 hover:bg-pink-50/20 flex items-center justify-between transition-all cursor-pointer active:bg-neutral-150 group"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=150"
                              alt="Gamer Legend Pro"
                              className="w-8 h-8 rounded-full object-cover border border-pink-300 shadow-sm"
                            />
                            <div>
                              <span className="text-[11px] font-extrabold text-neutral-800 block leading-tight">Gamer Legend Pro</span>
                              <span className="text-[9px] text-neutral-500 font-mono block leading-none">gamer.legend@gmail.com</span>
                            </div>
                          </div>
                          <span className="text-[8.5px] font-mono font-black bg-pink-100 text-pink-700 border border-pink-200 rounded px-1.5 py-0.5 shrink-0">
                            Vendedor 🏪
                          </span>
                        </button>

                        {/* suggested account 3 */}
                        <button
                          onClick={async () => {
                            setIsLoadingAuth(true);
                            await new Promise(resolve => setTimeout(resolve, 1000));
                            const prof = {
                              isLoggedIn: true,
                              name: "Carlos Cliente",
                              email: "carlos.cliente@gmail.com",
                              avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Carlos&backgroundColor=3b82f6",
                              buyerTier: "Bronce",
                              loyaltyPoints: 200,
                              region: "Colombia (LATAM)",
                              regionalIP: "181.143.12.82",
                              joinedDate: new Date().toLocaleDateString("es-CO", { day: 'numeric', month: 'long', year: 'numeric' }),
                              role: "client" as const
                            };
                            setUserProfile(prof);
                            localStorage.setItem("velokey_user_profile", JSON.stringify(prof));
                            setIsLoadingAuth(false);
                            setShowGoogleLoginModal(false);
                            showToast("success", "🛍️ Iniciaste sesión como Cliente. ¡Disfruta comprando videojuegos!");
                          }}
                          className="w-full p-2 text-left rounded-xl border border-neutral-200 hover:border-blue-500 hover:bg-blue-50/20 flex items-center justify-between transition-all cursor-pointer active:bg-neutral-150 group"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs select-none">CC</div>
                            <div>
                              <span className="text-[11px] font-extrabold text-neutral-800 block leading-tight">Carlos Cliente</span>
                              <span className="text-[9px] text-neutral-500 font-mono block leading-none">carlos.cliente@gmail.com</span>
                            </div>
                          </div>
                          <span className="text-[8.5px] font-mono font-black bg-blue-100 text-blue-700 border border-blue-200 rounded px-1.5 py-0.5 shrink-0">
                            Cliente 🎮
                          </span>
                        </button>
                      </div>

                      {/* Custom dynamic credentials fields option */}
                      <div className="border-t border-neutral-150 pt-2.5 space-y-2 text-left">
                        <span className="text-[10px] font-sans font-bold text-neutral-400 uppercase tracking-wider block text-center">
                          Simular otra cuenta Google
                        </span>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-0.5">
                            <label className="text-[9px] text-neutral-500 font-bold uppercase tracking-wide font-sans">Nombre:</label>
                            <input
                              type="text"
                              placeholder="Ej. Juan Pérez"
                              value={customLoginName}
                              onChange={(e) => setCustomLoginName(e.target.value)}
                              className="w-full text-xs font-sans px-2 py-1 border border-neutral-200 focus:border-purple-500 rounded-lg bg-neutral-50 text-neutral-800 outline-none"
                            />
                          </div>

                          <div className="space-y-0.5">
                            <label className="text-[9px] text-neutral-500 font-bold uppercase tracking-wide font-sans">Correo Google:</label>
                            <input
                              type="email"
                              placeholder="Ej. jp@gmail.com"
                              value={customLoginEmail}
                              onChange={(e) => setCustomLoginEmail(e.target.value)}
                              className="w-full text-xs font-mono px-2 py-1 border border-neutral-200 focus:border-purple-500 rounded-lg bg-neutral-50 text-neutral-800 outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          <label className="text-[9px] text-neutral-500 font-bold uppercase tracking-wide font-sans block">Rol asignado:</label>
                          <select
                            value={customLoginRole}
                            onChange={(e) => setCustomLoginRole(e.target.value as "admin" | "seller" | "client")}
                            className="w-full text-xs font-sans px-2 py-1.5 border border-neutral-200 focus:border-purple-500 rounded-lg bg-neutral-50 text-neutral-800 outline-none cursor-pointer"
                          >
                            <option value="client">Cliente Comprador 👥</option>
                            <option value="seller">Vendedor Asociado 🏪</option>
                            <option value="admin">Administrador del Sitio 🛡️</option>
                          </select>
                        </div>

                        <button
                          onClick={async () => {
                            if (!customLoginName.trim() || !customLoginEmail.trim()) {
                              alert("Por favor rellena ambos campos para simular tu cuenta de Google.");
                              return;
                            }
                            if (!customLoginEmail.includes("@") || !customLoginEmail.includes(".")) {
                              alert("Introduce una dirección de correo válida.");
                              return;
                            }
                            setIsLoadingAuth(true);
                            await new Promise(resolve => setTimeout(resolve, 1200));
                            
                            let tier = "Bronce";
                            let prefixMsg = "👋 ¡Hola!";
                            if (customLoginRole === "admin") {
                              tier = "Administrador 👑";
                              prefixMsg = "🛡️ Sesión de administrador iniciada.";
                            } else if (customLoginRole === "seller") {
                              tier = "Vendedor Premium 🏪";
                              prefixMsg = "🏪 Sesión de vendedor asociada.";
                            }

                            const prof = {
                              isLoggedIn: true,
                              name: customLoginName,
                              email: customLoginEmail,
                              avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(customLoginName)}&backgroundColor=7c3aed,d946ef`,
                              buyerTier: tier,
                              loyaltyPoints: 100,
                              region: "Colombia (LATAM)",
                              regionalIP: "186.116.14.21",
                              joinedDate: new Date().toLocaleDateString("es-CO", { day: 'numeric', month: 'long', year: 'numeric' }),
                              role: customLoginRole
                            };
                            setUserProfile(prof);
                            localStorage.setItem("velokey_user_profile", JSON.stringify(prof));
                            setIsLoadingAuth(false);
                            setShowGoogleLoginModal(false);
                            setCustomLoginName("");
                            setCustomLoginEmail("");
                            showToast("success", `${prefixMsg} Iniciaste sesión con Google correctamente.`);
                          }}
                          className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl cursor-pointer transition-all active:scale-98 text-center"
                        >
                          Usar esta cuenta Google
                        </button>
                      </div>

                      <div className="text-[8.5px] text-[#81729c] text-center leading-tight">
                        🔒 Seguridad Google Cloud Identity activa. Los datos persistirán de manera local para pruebas.
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>

      {/* FOOTER DESCRIPTOR WITH COPYRIGHT NOTES */}
      <footer className="mt-16 border-t border-[#1a1728] pt-8 px-4 pb-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center text-xs text-neutral-500">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-4 h-4 text-purple-500 animate-pulse" />
            <span>© 2026 VELOKEY. Clon Sandbox de G2A / Eneba en React y Express.</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setActiveFooterTab("manual")}
              className="hover:text-purple-400 text-neutral-500 font-medium transition-colors bg-transparent border-none cursor-pointer text-xs outline-none"
            >
              Manual de Activación
            </button>
            <button 
              onClick={() => setActiveFooterTab("terms")}
              className="hover:text-purple-400 text-neutral-500 font-medium transition-colors bg-transparent border-none cursor-pointer text-xs outline-none"
            >
              Términos y Condiciones
            </button>
            <button 
              onClick={() => setActiveFooterTab("support")}
              className="hover:text-purple-400 text-neutral-500 font-medium transition-colors bg-transparent border-none cursor-pointer text-xs outline-none"
            >
              Soporte Tecnológico 24/7
            </button>
          </div>
        </div>
      </footer>

      {/* OVERLAY DRAWER / MODAL: GAME SELLERS COMPARISON & DETAILED INFO */}
      <AnimatePresence>
        {selectedGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Soft dark blurred backdrop click to dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGame(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-zoom-out"
            />

            {/* Modal Body scrollable */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#0f0a1d] border border-[#27213d] rounded-3xl p-5 md:p-6 overflow-y-auto max-h-[90vh] z-10 shadow-2xl shadow-purple-950/20"
            >
              
              {/* Dismiss core action button */}
              <button
                onClick={() => setSelectedGame(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-[#201931]/80 hover:bg-[#341b52] hover:text-white text-neutral-400 border border-[#331f4f]/30 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              {/* Upper info: Cover, regional warnings, specs */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                
                {/* Visual cover left */}
                <div className="md:col-span-4 max-w-[170px] md:max-w-none mx-auto w-full">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-[#2b1f47] shadow relative">
                    {!brokenImages[selectedGame.id] ? (
                      <img 
                        src={selectedGame.coverUrl} 
                        alt={selectedGame.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={() => {
                          setBrokenImages((p) => ({ ...p, [selectedGame.id]: true }));
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1b122c] via-[#090612] to-[#120a21] flex flex-col items-center justify-center p-3 text-center">
                        <Gamepad2 className="w-8 h-8 text-purple-400/50 mb-2 shrink-0" />
                        <span className="text-[10px] font-black text-[#debaff] uppercase tracking-wider block px-1">
                          {selectedGame.title}
                        </span>
                        <span className="text-[8px] text-[#8e85a6] mt-1 font-mono">{selectedGame.platform}</span>
                      </div>
                    )}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/85 border border-[#2e2646] text-[8px] font-bold text-[#d946ef] tracking-widest uppercase font-mono">
                      -{selectedGame.discount}% OFF
                    </div>
                  </div>
                </div>

                {/* Text descriptors right */}
                <div className="md:col-span-8 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-black border uppercase ${getPlatformColors(selectedGame.platform)}`}>
                      {selectedGame.platform} KEY
                    </span>
                    <span className="text-xs text-amber-400 font-bold backdrop-blur bg-amber-950/20 px-2 py-0.5 rounded-md border border-amber-900/40 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500" /> {selectedGame.rating} Rating
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">Año {selectedGame.releaseYear}</span>
                  </div>

                  <h3 className="text-xl font-display font-black text-white leading-tight">
                    {selectedGame.title}
                  </h3>

                  {/* Regional notice panel */}
                  {selectedGame.region === "GLOBAL" ? (
                    <div className="p-3.5 rounded-xl bg-emerald-950/15 border border-emerald-900/40 text-xs text-emerald-400 flex items-start gap-2">
                      <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-300 mt-0.5" />
                      <div>
                        <strong>Compatibilidad Certificada: GLOBAL</strong>
                        <p className="text-[11px] text-[#aef5c1] leading-relaxed mt-0.5">
                          Este producto se puede activar en España, Colombia, México, Argentina, EE. UU. y cualquier otro país libre de restricciones geográficas directas.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/50 text-xs text-amber-400 flex items-start gap-2">
                      <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-amber-300 mt-0.5" />
                      <div>
                        <strong>Restricción de Canje Regional: USA</strong>
                        <p className="text-[11px] text-[#fcd292] leading-relaxed mt-0.5 font-medium">
                          {selectedGame.regionWarning || "Esta licencia digital solo se puede activar en cuentas de Estados Unidos (USA). Verifique sus configuraciones de cuenta antes de proceder."}
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-neutral-300 leading-relaxed font-sans line-clamp-3 md:line-clamp-none">
                    {selectedGame.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-[11px] text-neutral-400 border-t border-[#231b34] pt-3">
                    <div>
                      <span>Desarrollador:</span>
                      <strong className="block text-neutral-200 mt-0.5">{selectedGame.developer}</strong>
                    </div>
                    <div>
                      <span>Distribuidor:</span>
                      <strong className="block text-neutral-200 mt-0.5">{selectedGame.publisher}</strong>
                    </div>
                  </div>

                </div>

              </div>

              {/* LIST COMPARING MULTIPLE ALTERNATIVE SELLERS (ENEBA STYLE) */}
              <div className="mt-6 border-t border-[#252038] pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-display font-black tracking-widest text-[#a78bfa] uppercase flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#d946ef]" /> Ofertas de Claves por Vendedores
                  </h4>
                  <span className="text-[10px] text-neutral-500">Ordenado por coste / reputación</span>
                </div>

                <div className="space-y-3.5 max-h-[340px] overflow-y-auto pr-1">
                  {selectedGame.sellers.map((sell) => {
                    const isReviewsExpanded = expandedSellerId === sell.id;
                    const reviewsList = getSellerReviews(sell.name, selectedGame.title, selectedGame.id, sell.id);
                    const avgRating = reviewsList.length > 0
                      ? (reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length).toFixed(1)
                      : "5.0";

                    return (
                      <div 
                        key={sell.id} 
                        className="p-3.5 rounded-2xl bg-[#141022] border border-[#27213e] hover:border-purple-500/30 transition-colors flex flex-col gap-2"
                      >
                        {/* Top row with seller info and pricing */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-semibold text-neutral-200">{sell.name}</span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[8px] font-bold font-mono flex items-center gap-1">
                                👍 {sell.rating}%
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-purple-950/40 text-purple-300 text-[8px] font-bold font-mono">
                                ⭐ {avgRating} ({reviewsList.length} reviews)
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-[10px] text-neutral-500">
                              <span>{sell.positiveReviews.toLocaleString()} ventas</span>
                              <span>•</span>
                              <span className={`${sell.deliveryType === "INSTANT" ? "text-green-500" : "text-amber-500"}`}>
                                {sell.deliveryType === "INSTANT" ? "Instantánea" : "Manual (5 mins)"}
                              </span>
                            </div>
                            <div>
                              <button
                                onClick={() => setExpandedSellerId(isReviewsExpanded ? null : sell.id)}
                                className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold underline mt-1 block flex items-center gap-1 cursor-pointer transition-all"
                              >
                                <MessageSquare className="w-3 h-3" />
                                {isReviewsExpanded ? "Ocultar opiniones" : "Ver opiniones de compradores"}
                              </button>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3 shrink-0">
                            <div className="text-right">
                              <span className="text-neutral-500 text-[9px] line-through block leading-none">
                                Base: {formatCOP(selectedGame.basePrice)}
                              </span>
                              <span className="text-lg font-mono font-black text-amber-400 block leading-tight">
                                {formatCOP(sell.price)}
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                addToCart(selectedGame, sell);
                                setSelectedGame(null); // dismiss popup on select
                                setIsCartOpen(true); // reveal shopping cart immediately
                              }}
                              className="py-2.5 px-3.5 rounded-xl bg-purple-600 hover:bg-[#d946ef] hover:text-white text-white font-semibold text-xs transition-colors flex items-center gap-1 active:scale-95 cursor-pointer"
                            >
                              <ShoppingCart className="w-3.5 h-3.5" /> Comprar
                            </button>
                          </div>
                        </div>

                        {/* Collapsible Reviews Area */}
                        {isReviewsExpanded && (
                          <div className="mt-2.5 pt-2.5 border-t border-[#231a38] space-y-3 bg-[#0d091a]/40 p-3 rounded-xl w-full">
                            <div className="flex items-center justify-between">
                              <h5 className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">
                                Reseñas de compradores de {sell.name}
                              </h5>
                              <span className="text-[9px] text-[#fbbf24] font-bold">Promedio: ⭐ {avgRating} / 5.0</span>
                            </div>
                            
                            {/* Reviews list */}
                            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                              {reviewsList.map((rev, revIdx) => (
                                <div key={revIdx} className="bg-[#120c22] p-2.5 rounded-lg border border-[#211a33]/60 text-[11px] space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-neutral-200 font-bold">{rev.author}</span>
                                    <span className="text-neutral-500 text-[9px]">{rev.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-amber-400 shrink-0">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-2.5 h-2.5 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-neutral-600"}`} 
                                      />
                                    ))}
                                  </div>
                                  <p className="text-neutral-300 italic">"{rev.comment}"</p>
                                </div>
                              ))}
                            </div>

                            {/* Write Review Form */}
                            <div className="bg-[#18112e]/50 border border-[#2c2049] p-3 rounded-xl space-y-2 text-[11px]">
                              <p className="text-purple-300 font-black text-[10px] uppercase">¿Compraste a este vendedor? Deja tu opinión</p>
                              
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-neutral-400 block text-[9px] mb-0.5">Tu Nombre:</label>
                                  <input
                                    type="text"
                                    placeholder={userProfile?.name || "Escribe tu nombre"}
                                    value={newReviewAuthor}
                                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                                    className="w-full bg-black/50 text-white p-1 rounded border border-[#2c214d] text-[10px] outline-none font-sans"
                                  />
                                </div>
                                <div>
                                  <label className="text-neutral-400 block text-[9px] mb-0.5 font-bold text-amber-400 select-none">Calificación:</label>
                                  <select
                                    value={newReviewRating}
                                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                                    className="w-full bg-[#141025] text-white p-1 rounded border border-[#2c214d] text-[10px] cursor-pointer"
                                  >
                                    <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                                    <option value="4">⭐⭐⭐⭐ (4/5)</option>
                                    <option value="3">⭐⭐⭐ (3/5)</option>
                                    <option value="2">⭐⭐ (2/5)</option>
                                    <option value="1">⭐ (1/5)</option>
                                  </select>
                                </div>
                              </div>

                              <div>
                                <label className="text-neutral-400 block text-[9px] mb-0.5 font-bold">Comentario:</label>
                                <div className="flex gap-1.5">
                                  <input
                                    type="text"
                                    placeholder="Ej: Código recibido de inmediato, excelente servicio."
                                    value={newReviewComment}
                                    onChange={(e) => setNewReviewComment(e.target.value)}
                                    className="flex-1 bg-black/50 text-white p-1.5 rounded border border-[#2c214d] text-[10px] outline-none"
                                  />
                                  <button
                                    onClick={() => handleAddSellerReview(selectedGame.id, sell.id, sell.name)}
                                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 rounded text-white font-bold transition-colors flex items-center gap-1 active:scale-95 cursor-pointer text-[10px]"
                                  >
                                    <Send className="w-2.5 h-2.5" /> Enviar
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHOPPING CART OVERLAY RIGHT PANEL DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            
            {/* Blurry background clickable */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-zoom-out"
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 280 }}
                className="w-screen max-w-md bg-[#0f0a1c] border-l border-[#242036] shadow-2xl flex flex-col justify-between"
              >
                
                {/* Drawer Header */}
                <div className="p-4 border-b border-[#201d33] flex items-center justify-between bg-black/40">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4.5 h-4.5 text-[#d946ef]" />
                    <h3 className="text-sm font-display font-semibold text-white">Tu Carrito de Claves</h3>
                    <span className="text-[10px] font-mono p-1 px-2 rounded-full bg-[#201931] text-[#a78bfa]">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                    </span>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 px-2.5 rounded-lg bg-[#201d32] hover:bg-[#4a1c5d] text-neutral-300 text-xs font-semibold cursor-pointer"
                  >
                    Cerrar (Close)
                  </button>
                </div>

                {/* Items container list */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {cart.length > 0 ? (
                    cart.map((item) => {
                      const itemSubTotal = item.seller.price * item.quantity;
                      return (
                        <div 
                          key={`${item.game.id}-${item.seller.id}`} 
                          className="p-3 rounded-2xl bg-[#141223] border border-[#231e35] relative group"
                        >
                          <button
                            onClick={() => removeFromCart(item.game.id, item.seller.id)}
                            className="absolute top-2 right-2 p-1 rounded-md bg-zinc-950 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Remover"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="flex gap-3">
                            <img 
                              src={item.game.coverUrl} 
                              alt={item.game.title} 
                              className="h-16 w-11 object-cover rounded-lg border border-[#231e35]" 
                              referrerPolicy="no-referrer"
                            />
                            
                            <div className="space-y-1 flex-1 min-w-0 pr-6">
                              <span className={`px-1 rounded text-[8px] font-mono font-bold uppercase border ${getPlatformColors(item.game.platform)}`}>
                                {item.game.platform}
                              </span>
                              <h4 className="text-xs font-semibold text-neutral-200 truncate mt-0.5">
                                {item.game.title}
                              </h4>
                              <p className="text-[10px] text-neutral-500 truncate">Vendedor: {item.seller.name}</p>
                              
                              <div className="flex items-center justify-between pt-1">
                                {/* Interactor quantities */}
                                <div className="flex items-center space-x-1.5 bg-black/40 border border-[#2d2944] rounded-lg p-0.5">
                                  <button
                                    onClick={() => updateQuantity(item.game.id, item.seller.id, -1)}
                                    className="p-1 rounded bg-[#201931] text-neutral-400 hover:text-white"
                                  >
                                    <Minus className="w-2.5 h-2.5" />
                                  </button>
                                  <span className="text-xs font-mono font-bold text-neutral-200 px-1">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.game.id, item.seller.id, 1)}
                                    className="p-1 rounded bg-[#201931] text-neutral-400 hover:text-white"
                                  >
                                    <Plus className="w-2.5 h-2.5" />
                                  </button>
                                </div>

                                <span className="font-mono text-xs font-extrabold text-[#d946ef]">
                                  {formatCOP(itemSubTotal)}
                                </span>
                              </div>
                            </div>
                          </div>

                        </div>
                      );
                    })
                  ) : (
                    <div className="py-16 text-center space-y-4">
                      <div className="h-14 w-14 rounded-full bg-[#1b192c] border border-purple-900/40 flex items-center justify-center mx-auto text-neutral-500">
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-neutral-300">Tu carrito de compras está vacío</h4>
                        <p className="text-[11px] text-neutral-500 max-w-[200px] mx-auto mt-0.5">
                          Explora las licencias digitales globales con descuentos brutales de hasta -90%.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Promotional coupon & checkout summary absolute bottom */}
                <div className="p-4 bg-black/40 border-t border-[#221f35] space-y-4">
                  
                  {/* Coupon section lock */}
                  {cart.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] text-neutral-400 uppercase tracking-wider font-mono">
                        <span>Código promocional:</span>
                        <div className="group relative flex items-center gap-1 cursor-help">
                          <HelpCircle className="w-3 h-3 text-purple-400" />
                          <div className="absolute right-0 bottom-full mb-1 p-2 rounded bg-black border border-purple-900 text-[10px] text-purple-200 w-44 z-30 transition-all opacity-0 pointer-events-none group-hover:opacity-100 font-sans leading-normal">
                            ¡Usa los cupones activos para pruebas: <strong>GAMER20</strong> (20%), <strong>G2AKEYS</strong> (10%) o <strong>ENEBA5</strong> (5%)!
                          </div>
                        </div>
                      </div>
                      
                      {appliedPromo ? (
                        <div className="p-2 rounded-xl bg-purple-950/25 border border-purple-900/60 flex items-center justify-between text-xs text-purple-300">
                          <span className="font-semibold">{appliedPromo.code} ({appliedPromo.percent}% de descuento activo)</span>
                          <button onClick={handleClearCoupon} className="text-rose-400 uppercase font-mono text-[9px] hover:underline">
                            Remover
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Ej. GAMER20, ENEBA5"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            className="flex-1 bg-black/60 border border-[#2b2742] rounded-xl px-3 py-1.5 text-xs text-neutral-200 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCoupon}
                            className="px-3.5 py-1.5 bg-[#25203b] hover:bg-purple-900 rounded-xl text-xs font-semibold text-purple-300 transition-colors"
                          >
                            Aplicar
                          </button>
                        </div>
                      )}
                      
                      {promoError && <p className="text-[10px] text-red-400">{promoError}</p>}
                      {promoSuccessMsg && <p className="text-[10px] text-green-400">{promoSuccessMsg}</p>}
                    </div>
                  )}

                  {/* Pricing recap details list */}
                  {cart.length > 0 && (
                    <div className="space-y-1.5 text-xs border-t border-[#201d33] pt-3">
                      <div className="flex justify-between text-neutral-400">
                        <span>Subtotal del carrito:</span>
                        <span className="font-mono">{formatCOP(cartSubtotal)}</span>
                      </div>
                      
                      {appliedPromo && (
                        <div className="flex justify-between text-green-400">
                          <span>Descuento aplicado cupón:</span>
                          <span className="font-mono">-{formatCOP(cartDiscount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-white font-sans text-sm font-extrabold pt-1">
                        <span>Total neto de la factura:</span>
                        <span className="font-mono text-amber-400">{formatCOP(cartTotal)}</span>
                      </div>
                    </div>
                  )}

                  {/* SECURE CHECKOUT PAYMENT GATEWAY PREFERENCES */}
                  {cart.length > 0 && (
                    <div className="space-y-1.5 border-t border-[#201d33] pt-3">
                      <span className="text-[10px] font-mono tracking-wider text-neutral-500 block uppercase">
                        Método de pago seguro
                      </span>
                      
                      <div className="grid grid-cols-2 gap-1.5">
                        {[
                          { id: "cc", label: "Tarjeta Bancaria", icon: <CreditCard className="w-3.5 h-3.5 text-purple-400" /> },
                          { id: "paypal", label: "PayPal Wallet", icon: <span className="text-[10px] font-extrabold text-blue-400">PP</span> },
                          { id: "wallet", label: `Monedero (${formatCOP(walletBalance)})`, icon: <Wallet className="w-3.5 h-3.5 text-emerald-400" /> },
                          { id: "crypto", label: "Cripto Gateway", icon: <Server className="w-3.5 h-3.5 text-amber-400" /> }
                        ].map((pm) => {
                          const isSel = paymentMethod === pm.id;
                          return (
                            <button
                              key={pm.id}
                              type="button"
                              onClick={() => setPaymentMethod(pm.id)}
                              className={`text-left p-2 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                                isSel 
                                  ? "bg-purple-950/40 border-purple-500/70 text-white" 
                                  : "bg-[#18152c]/50 border-[#242137] text-neutral-400 hover:text-neutral-200"
                              }`}
                            >
                              {pm.icon}
                              <span className="text-[10px] font-semibold truncate">{pm.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* SECURE SUBMISSIONS FORM ACTION */}
                  {cart.length > 0 ? (
                    userProfile?.isLoggedIn ? (
                      <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={isCheckingOut}
                        className="w-full py-3.5 gamer-neon-btn rounded-xl font-display font-bold text-xs shadow-md tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isCheckingOut ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Procesando Licencias Seguras...
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4.5 h-4.5" /> PAGAR Y OBTENER CLAVES AHORA ({formatCOP(cartTotal)})
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsCartOpen(false);
                          setActiveTab("profile");
                          setShowGoogleLoginModal(true);
                          showToast("info", "🔑 Por favor, inicia sesión con Google para realizar tu compra segura.");
                        }}
                        className="w-full py-3.5 bg-gradient-to-r from-red-650 via-[#ea4335] to-amber-600 hover:brightness-110 active:scale-98 text-white rounded-xl font-display font-bold text-xs shadow-md tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.52 0-6.37-2.85-6.37-6.37s2.85-6.37 6.37-6.37c1.616 0 3.085.607 4.212 1.6l3.023-3.023C19.043 2.222 15.845 1 12.24 1 6.032 1 1 6.032 1 12.24s5.032 11.24 11.24 11.24c5.808 0 10.748-4.227 10.748-11.24 0-.766-.08-1.5-.24-2.215H12.24z"
                          />
                        </svg>
                        INICIAR SESIÓN CON GOOGLE PARA PAGAR
                      </button>
                    )
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-3 bg-[#242139] text-purple-300 font-semibold text-xs rounded-xl"
                    >
                      Seguir Explorando Videojuegos
                    </button>
                  )}

                  <div className="text-[9px] text-neutral-600 text-center leading-tight">
                    🔒 SSL 256-bit Encrypted Transaction Gateway. Canje inmediato tras el cobro.
                  </div>

                </div>

              </motion.div>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* OVERLAY DRAWER / MODAL: FOOTER LINK DETAILS */}
      <AnimatePresence>
        {activeFooterTab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Soft dark blurred backdrop click to dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveFooterTab(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-zoom-out"
            />

            {/* Modal Body scrollable */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-xl bg-[#0f0a1d] border border-[#27213d] rounded-3xl p-5 md:p-6 overflow-y-auto max-h-[90vh] z-10 shadow-2xl shadow-purple-950/20 text-left"
            >
              
              {/* Dismiss core action button */}
              <button
                onClick={() => setActiveFooterTab(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-[#201931]/80 hover:bg-[#341b52] hover:text-white text-neutral-400 border border-[#331f4f]/30 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              {activeFooterTab === "manual" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-[#27213d] pb-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Manual de Activación</h3>
                      <p className="text-xs text-neutral-400">Guía detallada para activar tus juegos digitales paso a paso</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs text-neutral-300 leading-relaxed max-h-[55vh] overflow-y-auto pr-1">
                    <div className="p-3 bg-[#130d25] border border-[#27213d] rounded-2xl space-y-2">
                      <span className="font-mono text-[11px] font-black text-purple-400 block uppercase tracking-wider">Paso 1: Copiar tu clave de activación</span>
                      <p className="text-neutral-400 text-[11px]">
                        Una vez finalizado tu pago simulado, dirígete a la pestaña <strong>"Mis Compras"</strong> en la barra superior. Allí verás el listado de tus licencias adquiridas. Haz clic en el botón <strong>"Copiar Clave"</strong> para copiar el serial al portapapeles.
                      </p>
                    </div>

                    <div className="p-3 bg-[#130d25] border border-[#27213d] rounded-2xl space-y-2">
                      <span className="font-mono text-[11px] font-black text-purple-400 block uppercase tracking-wider">Paso 2: Canjear según tu plataforma</span>
                      <ul className="list-disc list-inside space-y-1.5 text-neutral-400 text-[11px]">
                        <li>
                          <strong className="text-white">Steam:</strong> Abre Steam en tu PC, haz clic en el menú <code className="bg-[#201931] px-1.5 py-0.5 rounded text-neutral-300 font-mono text-[10px]">Productos &gt; Activar un producto en Steam...</code>, pega el serial y confirma.
                        </li>
                        <li>
                          <strong className="text-white">Epic Games:</strong> Abre el lanzador de Epic Games, haz clic en tu perfil en la esquina superior derecha y selecciona <code className="bg-[#201931] px-1.5 py-0.5 rounded text-neutral-300 font-mono text-[10px]">Canjear código</code>.
                        </li>
                        <li>
                          <strong className="text-white">Xbox / Microsoft:</strong> En tu consola Xbox, ve a la Tienda Microsoft Store y presiona el botón <code className="bg-[#201931] px-1.5 py-0.5 rounded text-neutral-300 font-mono text-[10px]">Canjear código</code>. En PC, usa la app de Xbox o entra a redeem.microsoft.com.
                        </li>
                        <li>
                          <strong className="text-white">PlayStation:</strong> Entra a la PlayStation Store desde tu consola o app móvil, ve al menú de opciones de la parte superior derecha y selecciona <code className="bg-[#201931] px-1.5 py-0.5 rounded text-neutral-300 font-mono text-[10px]">Canjear códigos</code>.
                        </li>
                        <li>
                          <strong className="text-white">Nintendo Switch:</strong> Abre la Nintendo eShop desde el menú HOME de tu consola, selecciona tu cuenta, haz clic en <code className="bg-[#201931] px-1.5 py-0.5 rounded text-neutral-300 font-mono text-[10px]">Canjear código</code> en la barra izquierda e introduce el serial.
                        </li>
                      </ul>
                    </div>

                    <div className="p-3 bg-amber-950/15 border border-amber-900/35 rounded-2xl flex gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <strong className="text-amber-400 text-[11px]">¿Problemas con la Región?</strong>
                        <p className="text-neutral-400 text-[11px]">
                          Asegúrate de comprobar la región de compatibilidad de la oferta comprada. Si es GLOBAL se activará sin restricciones. Si es de una región específica (ej. USA), requerirás que la ubicación de facturación de tu cuenta coincida con esa región.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeFooterTab === "terms" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-[#27213d] pb-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Términos y Condiciones</h3>
                      <p className="text-xs text-neutral-400">Contrato de términos del marketplace VeloKey Colombia</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 text-xs text-neutral-300 leading-relaxed max-h-[55vh] overflow-y-auto pr-1">
                    <p className="text-[11px] text-neutral-400">
                      Bienvenido a VeloKey. Al acceder, registrarse o realizar transacciones en nuestra plataforma de comercio electrónico sandbox, usted acepta y se compromete a respetar plenamente las siguientes cláusulas y políticas:
                    </p>

                    <div className="space-y-1">
                      <strong className="text-white text-[11px]">1. Naturaleza del Servicio y Cuentas Ficticias</strong>
                      <p className="text-[11px] text-neutral-400">
                        VeloKey opera como un marketplace simulado (sandbox) estructurado con fines educativos y de demostración de flujo comercial en Colombia. Los saldos, billeteras electrónicas, llaves seriales y métodos de pago aquí listados no corresponden a transacciones financieras reales. Las claves mostradas son generadas aleatoriamente por algoritmos seguros de prueba y no deben considerarse material comercial real.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white text-[11px]">2. Garantía VeloKey Shield de Llaves Digitales</strong>
                      <p className="text-[11px] text-neutral-400">
                        Ofrecemos garantía de activación instantánea al 100% sobre todos los códigos comprados a través de nuestros vendedores premium. Si una llave resulta defectuosa, inactiva o presenta un error regional no especificado en la ficha técnica, se aplicará el reembolso íntegro a su saldo de billetera virtual.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white text-[11px]">3. Política del Vendedor</strong>
                      <p className="text-[11px] text-neutral-400">
                        Como vendedor de VeloKey, usted es responsable de establecer tarifas justas y competitivas, garantizar que cuenta con suficiente stock ficticio de licencias y responder oportunamente en el soporte. Está estrictamente prohibido simular valoraciones de mala fe para desprestigiar a la competencia.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <strong className="text-white text-[11px]">4. Limitación de Responsabilidad</strong>
                      <p className="text-[11px] text-neutral-400">
                        Los desarrolladores y propietarios del proyecto VeloKey no se hacen responsables de pérdidas resultantes del mal uso de la plataforma o errores tipográficos por parte del comprador al ingresar datos de pago simulados.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeFooterTab === "support" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 border-b border-[#27213d] pb-3">
                    <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">Soporte Tecnológico 24/7</h3>
                      <p className="text-xs text-neutral-400">Centro de ayuda y radicado de tickets simulados</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-xs text-neutral-300 leading-relaxed max-h-[55vh] overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div className="p-3.5 bg-[#130d25] border border-[#27213d] rounded-2xl text-center space-y-1">
                        <strong className="text-white block font-bold">Tiempo de Respuesta Promedio</strong>
                        <span className="font-mono text-emerald-400 text-sm font-black">&lt; 3 minutos</span>
                        <p className="text-[9px] text-neutral-500">Agentes simulados en vivo 24/7</p>
                      </div>
                      <div className="p-3.5 bg-[#130d25] border border-[#27213d] rounded-2xl text-center space-y-1">
                        <strong className="text-white block font-bold">Tasa de Resolución</strong>
                        <span className="font-mono text-purple-400 text-sm font-black">99.7% exitosa</span>
                        <p className="text-[9px] text-neutral-500">Garantía VeloKey Shield</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-neutral-100 uppercase tracking-wide">Preguntas Frecuentes:</h4>
                      <div className="space-y-2">
                        <div className="p-2.5 bg-[#130d25] border border-[#27213d]/45 rounded-xl space-y-1">
                          <strong className="text-white text-[11px]">¿Mi saldo simulado de $600.000 COP expirará?</strong>
                          <p className="text-neutral-400 text-[10px]">No, tu billetera virtual se guarda localmente en el navegador y puedes recargarla en cualquier momento si te quedas sin saldo simulado.</p>
                        </div>
                        <div className="p-2.5 bg-[#130d25] border border-[#27213d]/45 rounded-xl space-y-1">
                          <strong className="text-white text-[11px]">¿Cómo informo de un vendedor inactivo?</strong>
                          <p className="text-neutral-400 text-[10px]">Puedes radicar un caso de soporte a continuación indicando el nombre del vendedor y el título del juego.</p>
                        </div>
                      </div>
                    </div>

                    {/* Support Contact Form Simulation */}
                    <div className="border-t border-[#27213d]/60 pt-3.5 space-y-3">
                      <h4 className="text-[11px] font-bold text-neutral-100 uppercase tracking-wide">Radicar un Ticket Ficticio:</h4>
                      <div className="space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input 
                            type="text" 
                            placeholder="Tu nombre completo"
                            className="bg-black border border-[#27213d] rounded-xl p-2.5 text-white outline-none focus:border-purple-500 text-[11px] w-full"
                          />
                          <input 
                            type="email" 
                            placeholder="Tu correo electrónico" 
                            className="bg-black border border-[#27213d] rounded-xl p-2.5 text-white outline-none focus:border-purple-500 text-[11px] w-full"
                          />
                        </div>
                        <textarea 
                          rows={2.5}
                          placeholder="Describe brevemente el inconveniente..." 
                          className="bg-black border border-[#27213d] rounded-xl p-2.5 text-white outline-none focus:border-purple-500 text-[11px] w-full resize-none"
                        />
                        <button
                          onClick={() => {
                            showToast("success", "📨 ¡Ticket enviado con éxito! Nuestro equipo simulado te responderá en breve.");
                            setActiveFooterTab(null);
                          }}
                          className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all shadow-md active:scale-98 cursor-pointer text-center text-xs"
                        >
                          Enviar Solicitud de Soporte
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
