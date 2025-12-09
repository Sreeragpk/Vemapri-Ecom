import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  Package,
  ChevronDown,
  Search,
  Bell,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  // Star,
} from 'lucide-react';
import api from '../utils/api';
import logo from '../assets/vemapriicon.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifData, setNotifData] = useState({
    notifications: [],
    unreadCount: 0,
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  const categoriesRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const cartRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { user, logout } = useAuth();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
  } = useCart();
  const navigate = useNavigate();

  const cartCount = getCartCount();

  const groceryCategories = [
    { name: 'Pulses & Grains', icon: '🌾', color: 'from-amber-50 to-amber-100' },
    { name: 'Spices & Masalas', icon: '🌶️', color: 'from-rose-50 to-rose-100' },
    { name: 'Nuts & Seeds', icon: '🥜', color: 'from-orange-50 to-orange-100' },
    { name: 'Health & Organic Foods', icon: '🥗', color: 'from-green-50 to-green-100' },
  ];

  // scroll progress effect
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = windowHeight > 0 ? (window.scrollY / windowHeight) * 100 : 0;
      setScrollProgress(scrolled);
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (!user) {
      setNotifData({ notifications: [], unreadCount: 0 });
      return;
    }

    const fetchNotifs = async () => {
      try {
        const res = await api.get('/notifications/mine');
        setNotifData(res.data);
      } catch (err) {
        console.error('Fetch notifications error', err);
      }
    };

    fetchNotifs();
  }, [user]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setIsCategoriesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cart drawer open / close
  const openCart = () => {
    setIsCartOpen(true);
    setIsCartAnimating(true);
    document.body.style.overflow = 'hidden';
  };

  const closeCart = () => {
    setIsCartAnimating(false);
    setTimeout(() => {
      setIsCartOpen(false);
      document.body.style.overflow = 'unset';
    }, 250);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    closeAllMenus();
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsCategoriesOpen(false);
    setNotificationsOpen(false);
    closeCart();
  };

  // Helper: compute a single item's effective price (variant > product)
  const getItemUnitPrice = (item) => {
    // item shape expected: { product, variant?, variantId?, quantity }
    const variant = item.variant || null;
    if (variant) {
      if (variant.discountPrice != null && variant.discountPrice !== '') return Number(variant.discountPrice);
      if (variant.price != null && variant.price !== '') return Number(variant.price);
    }
    const prod = item.product || {};
    if (prod.discountPrice != null && prod.discountPrice !== '') return Number(prod.discountPrice);
    if (prod.price != null && prod.price !== '') return Number(prod.price);
    return 0;
  };

  // Helper: get available stock for an item (variant preferred)
  const getItemStock = (item) => {
    const variant = item.variant || null;
    if (variant && typeof variant.stock === 'number') return variant.stock;
    if (item.product && typeof item.product.stock === 'number') return item.product.stock;
    return Infinity;
  };

  // A safe local subtotal (in case getCartTotal is not variant-aware)
  const localSubtotal = cartItems.reduce((sum, it) => {
    const unitPrice = getItemUnitPrice(it);
    return sum + unitPrice * (Number(it.quantity) || 0);
  }, 0);

  // handlers that pass variantId (if present) to cart functions
  const handleDecrement = (item) => {
    const next = Number(item.quantity) - 1;
    if (next <= 0) {
      // remove item, passing variantId if available
      removeFromCart(item.product._id, item.variantId || null);
      return;
    }
    updateQuantity(item.product._id, next, item.variantId || null);
  };

  const handleIncrement = (item) => {
    const stock = getItemStock(item);
    const next = Number(item.quantity) + 1;
    if (typeof stock === 'number' && stock !== Infinity && next > stock) {
      // can't exceed available stock
      // you may notify user (toast) here; keep UI simple so consumer can hook toast
      // example: toast.error('Cannot add more than available stock');
      return;
    }
    updateQuantity(item.product._id, next, item.variantId || null);
  };

  const subtotal = getCartTotal != null ? getCartTotal() : localSubtotal;

  const LogoBlock = ({ small = false }) => (
    <Link to="/" className="flex items-center gap-3 flex-shrink-0 group" onClick={closeAllMenus}>
      <div className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-200 flex items-center justify-center shadow-sm overflow-hidden group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
        <img
          src={logo}
          alt="Vemapri Logo"
          className="h-full w-full object-contain"
          width={67}
          height={36}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <span className="hidden text-lg font-semibold text-slate-900 items-center justify-center">V</span>
      </div>
      {!small && (
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-lg lg:text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Vemapri
          </span>
          <span className="text-[10px] lg:text-[11px] uppercase tracking-[0.18em] font-medium text-slate-500">
            Gudipati Products
          </span>
        </div>
      )}
    </Link>
  );

  return (
    <>
      <nav
        className={`sticky top-0 z-40 border-b transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-2xl shadow-lg shadow-slate-200/50 border-slate-200/50'
            : 'bg-white/95 backdrop-blur-md border-slate-200'
        }`}
      >
        <div
          className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* MOBILE ROW */}
          <div className="flex h-16 items-center justify-between lg:hidden">
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="group flex items-center justify-center h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 hover:shadow-md"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} className="transition-transform duration-300 rotate-90" /> : <Menu size={20} className="transition-transform duration-300 group-hover:scale-110" />}
            </button>

            <LogoBlock small />

            <div className="flex items-center gap-2">
              {user && (
                <button
                  onClick={() => {
                    closeAllMenus();
                    navigate('/profile');
                  }}
                  className="relative flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white text-xs font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                  aria-label="Account"
                >
                  {user.firstName?.[0]?.toUpperCase() || 'U'}
                  <div className="absolute inset-0 rounded-full bg-white opacity-0 hover:opacity-10 transition-opacity" />
                </button>
              )}

              <button
                onClick={openCart}
                className="relative flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 text-slate-50 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
                aria-label="Open cart"
              >
                <ShoppingCart size={18} className="relative z-10" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-[9px] font-bold text-white shadow-lg animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* DESKTOP ROW */}
          <div className="hidden lg:flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-6 lg:gap-8">
              <LogoBlock />

              <div className="flex items-center gap-1">
                <Link to="/products" onClick={closeAllMenus} className="relative px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-all duration-300 group">
                  Shop
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4" />
                </Link>

                {/* Categories dropdown */}
                <div className="relative" ref={categoriesRef}>
                  <button
                    onClick={() => setIsCategoriesOpen((prev) => !prev)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-300 ${
                      isCategoriesOpen ? 'border-slate-900 text-slate-900 bg-slate-100 shadow-md' : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Categories
                    <ChevronDown size={16} className={`transition-all duration-300 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCategoriesOpen && (
                    <div className="absolute left-0 mt-3 w-72 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-slideDown">
                      <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
                        <p className="text-xs font-bold tracking-wider text-slate-600 uppercase">Browse Categories</p>
                      </div>
                      <div className="py-2">
                        {groceryCategories.map((cat) => (
                          <Link
                            key={cat.name}
                            to={`/products?category=${encodeURIComponent(cat.name)}`}
                            onClick={closeAllMenus}
                            className="group flex items-center gap-4 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all duration-300"
                          >
                            <div className={`flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br ${cat.color} shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110`}>
                              <span className="text-xl">{cat.icon}</span>
                            </div>
                            <span className="flex-1 group-hover:translate-x-1 transition-transform duration-300">{cat.name}</span>
                            <ArrowRight size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </Link>
                        ))}
                      </div>
                      <div className="px-5 py-3 border-t border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                        <Link to="/products" onClick={closeAllMenus} className="group flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-amber-600 transition-colors duration-300">
                          View all products
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link to="/about" onClick={closeAllMenus} className="relative px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-all duration-300 group">
                  About
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-slate-900 transition-all duration-300 group-hover:w-1/2 group-hover:left-1/4" />
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Premium Search */}
              <button className="hidden xl:flex items-center gap-3 px-4 py-2.5 rounded-full bg-gradient-to-r from-slate-50 to-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-md transition-all duration-300 group">
                <Search size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                <span className="text-sm font-medium">Search products…</span>
              </button>

              {/* Notification Bell */}
              {user && (
                <div className="relative" ref={notificationsRef}>
                  <button onClick={() => setNotificationsOpen((prev) => !prev)} className="relative rounded-full border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm hover:border-slate-400 hover:text-slate-900 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <Bell size={18} />
                    {notifData.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-[10px] font-bold text-white shadow-lg animate-pulse">
                        {notifData.unreadCount > 9 ? '9+' : notifData.unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl py-2 text-sm max-h-96 overflow-y-auto premium-scroll animate-slideDown">
                      <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-100">
                        <span className="font-bold text-slate-900">Notifications</span>
                        <button
                          onClick={async () => {
                            try {
                              await api.patch('/notifications/mark-all/read');
                              setNotifData((prev) => ({
                                ...prev,
                                unreadCount: 0,
                                notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
                              }));
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="text-[11px] font-semibold text-slate-600 hover:text-amber-600 transition-colors"
                        >
                          Mark all as read
                        </button>
                      </div>

                      {notifData.notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-xs text-slate-500">
                          <Bell size={24} className="mx-auto mb-2 text-slate-300" />
                          No notifications yet.
                        </div>
                      ) : (
                        notifData.notifications.map((n) => (
                          <div key={n._id} className={`px-4 py-3 border-b border-slate-50 last:border-b-0 transition-colors hover:bg-slate-50 ${!n.isRead ? 'bg-amber-50/30' : 'bg-white'}`}>
                            <div className="flex justify-between items-start gap-3">
                              <div className="flex-1">
                                <div className="text-xs font-bold text-slate-900">{n.title}</div>
                                <div className="text-[11px] text-slate-600 mt-1">{n.message}</div>
                                {n.meta?.orderNumber && (
                                  <Link to={`/orders/${n.meta.orderId}`} className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 mt-2 hover:text-amber-700 transition-colors" onClick={closeAllMenus}>
                                    View order #{n.meta.orderNumber}
                                    <ArrowRight size={12} />
                                  </Link>
                                )}
                              </div>
                              {!n.isRead && <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-sm" />}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* User Menu */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setIsUserMenuOpen((prev) => !prev)} className="flex items-center gap-3 h-11 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 hover:shadow-md transition-all duration-300">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white text-xs font-bold shadow-md">
                      {user.firstName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="hidden lg:flex flex-col items-start leading-tight">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Hello,</span>
                      <span className="text-sm font-bold text-slate-900 max-w-[110px] truncate">{user.firstName}</span>
                    </div>
                    <ChevronDown size={16} className={`hidden lg:block text-slate-400 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-slideDown">
                      <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white text-sm font-bold shadow-lg">
                            {user.firstName?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        {user.role === 'admin' && (
                          <Link to="/admin" onClick={closeAllMenus} className="group flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all duration-300">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                              <Settings size={16} />
                            </div>
                            <div className="flex flex-col flex-1">
                              <span className="font-semibold">Admin Panel</span>
                              <span className="text-xs text-slate-500">Manage products &amp; orders</span>
                            </div>
                          </Link>
                        )}

                        <Link to="/profile" onClick={closeAllMenus} className="group flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all duration-300">
                          <User size={16} className="text-slate-500" />
                          <span className="group-hover:translate-x-1 transition-transform duration-300">My Profile</span>
                        </Link>

                        <Link to="/orders" onClick={closeAllMenus} className="group flex items-center gap-3 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white transition-all duration-300">
                          <Package size={16} className="text-slate-500" />
                          <span className="group-hover:translate-x-1 transition-transform duration-300">My Orders</span>
                        </Link>
                      </div>

                      <div className="border-t border-slate-200 py-2">
                        <button onClick={handleLogout} className="group flex w-full items-center gap-3 px-5 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all duration-300">
                          <LogOut size={16} />
                          <span className="group-hover:translate-x-1 transition-transform duration-300">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" onClick={closeAllMenus} className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-all duration-300">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={closeAllMenus} className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105">
                    Register
                  </Link>
                </div>
              )}

              {/* Cart button (desktop) */}
              <button
                onClick={openCart}
                className="relative hidden lg:flex items-center gap-2 h-11 px-5 rounded-full bg-gradient-to-r from-slate-800 to-slate-950 text-slate-50 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                aria-label="Open cart"
              >
                <ShoppingCart size={18} className="group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-bold">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-6 min-w-[24px] px-1.5 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-500 text-[10px] font-bold text-white shadow-lg animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl animate-slideDown">
          <div className="max-w-[105rem] mx-auto px-4 pt-4 pb-8 space-y-1 overflow-y-auto h-full hide-scrollbar">
            <div className="mb-4">
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:shadow-md transition-all duration-300">
                <Search size={18} />
                <span className="text-sm font-medium">Search products…</span>
              </button>
            </div>

            <Link to="/products" onClick={closeAllMenus} className="block px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white rounded-xl transition-all duration-300">
              Shop
            </Link>

            <div className="pt-3">
              <p className="px-4 pb-2 text-xs font-bold tracking-wider text-slate-500 uppercase">Categories</p>
              {groceryCategories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  onClick={closeAllMenus}
                  className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white rounded-xl transition-all duration-300"
                >
                  <div className={`flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-br ${cat.color} shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110`}>
                    <span className="text-lg">{cat.icon}</span>
                  </div>
                  <span className="flex-1">{cat.name}</span>
                  <ArrowRight size={16} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
            </div>

            <Link to="/about" onClick={closeAllMenus} className="block px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white rounded-xl transition-all duration-300">
              About
            </Link>

            {user ? (
              <div className="pt-4 mt-3 border-t border-slate-200 space-y-2 mb-4">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white text-xs font-bold shadow-md">
                    {user.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">{user.firstName} {user.lastName}</span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <Link to="/admin" onClick={closeAllMenus} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white rounded-xl transition-all duration-300">
                    <Settings size={16} className="text-slate-500" />
                    Admin Panel
                  </Link>
                )}

                <Link to="/profile" onClick={closeAllMenus} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white rounded-xl transition-all duration-300">
                  <User size={16} className="text-slate-500" />
                  My Profile
                </Link>

                <Link to="/orders" onClick={closeAllMenus} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-gradient-to-r hover:from-slate-50 hover:to-white rounded-xl transition-all duration-300">
                  <Package size={16} className="text-slate-500" />
                  My Orders
                </Link>

                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 mt-3 border-t border-slate-200 space-y-3 mb-4">
                <Link to="/login" onClick={closeAllMenus} className="block px-4 py-3 text-center text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
                  Sign In
                </Link>
                <Link to="/register" onClick={closeAllMenus} className="block px-4 py-3 text-center text-sm font-bold text-white bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CART SIDEBAR */}
      {isCartOpen && (
        <>
          <div className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isCartAnimating ? 'opacity-100' : 'opacity-0'}`} onClick={closeCart} />

          <aside
            ref={cartRef}
            className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${isCartAnimating ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ boxShadow: '-20px 0 40px -10px rgba(0, 0, 0, 0.2)' }}
          >
            <div className="relative flex items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingBag size={20} className="text-slate-700" />
                  <h2 className="text-lg font-bold text-slate-900">Shopping Cart</h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {cartCount === 0 ? 'Your cart is empty' : `${cartCount} item${cartCount > 1 ? 's' : ''} • ₹${Number(subtotal).toLocaleString()}`}
                </p>
              </div>
              <button onClick={closeCart} className="flex items-center justify-center h-9 w-9 rounded-full border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 hover:shadow-md transition-all duration-300 hover:rotate-90">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full blur-2xl opacity-40 animate-pulse" />
                    <div className="relative flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 shadow-lg">
                      <ShoppingBag size={40} className="text-slate-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Your cart is empty</h3>
                  <p className="text-sm text-slate-500 mb-6 max-w-xs">Looks like you haven't added anything to your cart yet. Start shopping to fill it up!</p>
                  <button onClick={() => { closeCart(); navigate('/products'); }} className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 text-white text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    Start Shopping
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 premium-scroll">
                    {cartItems.map((item, index) => {
                      const unitPrice = getItemUnitPrice(item);
                      const lineTotal = unitPrice * (Number(item.quantity) || 0);
                      const stock = getItemStock(item);
                      const variantLabel = item.variant?.displayQuantity || item.variant?.name || '';
                      const isMinQty = Number(item.quantity) <= 1;
                      const isMaxQty = typeof stock === 'number' && stock !== Infinity && Number(item.quantity) >= stock;

                      return (
                        <div key={`${item.product._id}_${item.variantId || 'base'}`} className="group relative flex gap-4 p-4 border border-slate-200 rounded-2xl bg-gradient-to-br from-white to-slate-50 hover:shadow-lg hover:border-slate-300 transition-all duration-300" style={{ animation: `slideIn 0.3s ease-out ${index * 0.05}s both` }}>
                          <Link to={`/products/${item.product._id}`} onClick={closeCart} className="flex-shrink-0 group/image">
                            <div className="relative h-20 w-20 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm group-hover/image:shadow-md transition-all duration-300">
                              <img src={item.product.images?.[0]?.url || '/placeholder.png'} alt={item.product.name} className="h-full w-full object-contain group-hover/image:scale-110 transition-transform duration-500" />
                            </div>
                          </Link>

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <Link to={`/products/${item.product._id}`} onClick={closeCart} className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-slate-700 transition-colors">
                                {item.product.name}
                              </Link>
                              <p className="mt-1 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                                {item.product.category}
                              </p>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-baseline gap-2">
                                <span className="text-base font-bold text-slate-900">₹{Number(unitPrice).toLocaleString()}</span>
                                {/* show original price if product-level discount used */}
                                {item.product.discountPrice && !(item.variant && (item.variant.price || item.variant.discountPrice)) && (
                                  <span className="text-xs text-slate-400 line-through">₹{Number(item.product.price).toLocaleString()}</span>
                                )}
                              </div>
                              <div className="text-xs font-semibold text-slate-500">Total: <span className="text-slate-900">₹{Number(lineTotal).toLocaleString()}</span></div>
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="inline-flex items-center rounded-full bg-white border border-slate-200 shadow-sm px-2 py-1.5">
                                <button onClick={() => handleDecrement(item)} disabled={isMinQty} className="flex h-6 w-6 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 active:scale-95">
                                  <Minus size={12} strokeWidth={3} />
                                </button>
                                <span className="mx-3 min-w-[32px] text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                                <button onClick={() => handleIncrement(item)} disabled={isMaxQty} className="flex h-6 w-6 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110 active:scale-95">
                                  <Plus size={12} strokeWidth={3} />
                                </button>
                              </div>

                              <button onClick={() => removeFromCart(item.product._id, item.variantId || null)} className="group/delete inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300">
                                <Trash2 size={12} className="group-hover/delete:scale-110 transition-transform duration-300" /> Remove
                              </button>
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-3">
                              <div className="text-[11px] text-slate-500">
                                {variantLabel ? variantLabel : item.product.displayQuantity ? item.product.displayQuantity : 'Default pack'}
                                {' • '}
                                {stock === Infinity ? 'In stock' : `Available: ${stock}`}
                              </div>
                              {item.variant?.sku && <div className="text-[11px] text-slate-400">SKU: {item.variant.sku}</div>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t border-slate-200 bg-gradient-to-b from-white to-slate-50 px-6 py-5">
                    <div className="space-y-3 mb-5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-600">Subtotal</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">₹{Number(subtotal).toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <span className="inline-block h-1 w-1 rounded-full bg-slate-400" /> Taxes and shipping calculated at checkout
                      </p>
                    </div>

                    <div className="space-y-3">
                      <button onClick={() => { closeCart(); navigate('/checkout'); }} className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-slate-800 to-slate-950 text-white text-sm font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                        Proceed to Checkout
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </button>

                      <button onClick={() => { closeCart(); navigate('/cart'); }} className="w-full px-6 py-3 rounded-full border-2 border-slate-900 text-sm font-bold text-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300">
                        View Full Cart
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>
        </>
      )}

      {/* Animations (can be moved to global CSS) */}
      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .premium-scroll { scrollbar-width: thin; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
};

export default Navbar;
