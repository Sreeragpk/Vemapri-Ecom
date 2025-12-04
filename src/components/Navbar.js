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

  const categoriesRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const cartRef = useRef(null);

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
    { name: 'Pulses & Grains', icon: '🌾' },
    { name: 'Spices & Masalas', icon: '🌶️' },
    { name: 'Nuts & Seeds', icon: '🥜' },
    { name: 'Health & Organic Foods', icon: '🥗' },
  ];

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
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
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setIsCartOpen(false);
  };

  const subtotal = getCartTotal();

  const LogoBlock = ({ small = false }) => (
    <Link
      to="/"
      className="flex items-center gap-3 flex-shrink-0"
      onClick={closeAllMenus}
    >
      <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm overflow-hidden">
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
        <span className="hidden text-lg font-semibold text-slate-900 items-center justify-center">
          V
        </span>
      </div>
      {!small && (
        <div className="hidden sm:flex flex-col leading-tight">
          <span className="text-lg lg:text-xl font-semibold tracking-tight text-slate-900">
            Vemapri
          </span>
          <span className="text-[10px] lg:text-[11px] uppercase tracking-[0.18em] text-slate-500">
            {/* Grocery &amp; Food Supplies */}Gudipati Products
          </span>
        </div>
      )}
    </Link>
  );

  return (
    <>
      <nav
        className={`sticky top-0 z-40 border-b border-slate-200 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-sm'
            : 'bg-white/95 backdrop-blur'
        }`}
      >
        <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* MOBILE ROW: menu left, logo center, icons right */}
          <div className="flex h-16 items-center justify-between lg:hidden">
            {/* Left: mobile menu button */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center justify-center h-10 w-10 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Center: logo */}
            <LogoBlock small />

            {/* Right: account + cart */}
            <div className="flex items-center gap-2">
              {user && (
                <button
                  onClick={() => {
                    closeAllMenus();
                    navigate('/profile');
                  }}
                  className="flex items-center justify-center h-9 w-9 rounded-full bg-slate-900 text-white text-xs font-semibold"
                  aria-label="Account"
                >
                  {user.firstName?.[0]?.toUpperCase() || 'U'}
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center justify-center h-9 w-9 rounded-full border border-slate-900 bg-slate-900 text-slate-50 hover:bg-black hover:border-black transition-all"
                aria-label="Open cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-[16px] px-0.5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* DESKTOP ROW */}
          <div className="hidden lg:flex h-16 items-center justify-between gap-4">
            {/* Left: Logo + Links */}
            <div className="flex items-center gap-6 lg:gap-8">
              <LogoBlock />

              {/* Desktop Navigation Links */}
              <div className="flex items-center gap-1">
                <Link
                  to="/products"
                  onClick={closeAllMenus}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Shop
                </Link>

                {/* Categories dropdown */}
                <div className="relative" ref={categoriesRef}>
                  <button
                    onClick={() => setIsCategoriesOpen((prev) => !prev)}
                    className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border transition-all ${
                      isCategoriesOpen
                        ? 'border-slate-900 text-slate-900 bg-slate-100'
                        : 'border-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    Categories
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isCategoriesOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isCategoriesOpen && (
                    <div className="absolute left-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold tracking-wide text-slate-500">
                          Browse categories
                        </p>
                      </div>
                      <div className="py-1">
                        {groceryCategories.map((cat) => (
                          <Link
                            key={cat.name}
                            to={`/products?category=${encodeURIComponent(cat.name)}`}
                            onClick={closeAllMenus}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                          >
                            <span className="text-lg">{cat.icon}</span>
                            <span>{cat.name}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
                        <Link
                          to="/products"
                          onClick={closeAllMenus}
                          className="text-xs font-medium text-slate-900 hover:text-amber-500"
                        >
                          View all products →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  to="/about"
                  onClick={closeAllMenus}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-colors"
                >
                  About
                </Link>
              </div>
            </div>

            {/* Right: Search, Notifications, User, Cart */}
            <div className="flex items-center gap-3">
              {/* Search - Desktop */}
              <button className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 transition-all">
                <Search size={18} className="text-slate-400" />
                <span className="text-sm">Search products…</span>
              </button>

              {/* Notification Bell (only when logged in) */}
              {user && (
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setNotificationsOpen((prev) => !prev)}
                    className="relative rounded-full border border-slate-200 bg-white p-1.5 text-slate-700 shadow-sm hover:border-slate-400 hover:text-slate-900 hover:shadow-md transition-all"
                  >
                    <Bell size={18} />
                    {notifData.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-semibold text-white">
                        {notifData.unreadCount > 9 ? '9+' : notifData.unreadCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white/95 shadow-xl backdrop-blur-sm py-2 text-sm max-h-96 overflow-y-auto">
                      <div className="flex items-center justify-between px-3 pb-2 border-b border-gray-100">
                        <span className="font-semibold text-slate-800">
                          Notifications
                        </span>
                        <button
                          onClick={async () => {
                            try {
                              await api.patch('/notifications/mark-all/read');
                              setNotifData((prev) => ({
                                ...prev,
                                unreadCount: 0,
                                notifications: prev.notifications.map((n) => ({
                                  ...n,
                                  isRead: true,
                                })),
                              }));
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="text-[11px] text-slate-600 hover:text-slate-900"
                        >
                          Mark all as read
                        </button>
                      </div>

                      {notifData.notifications.length === 0 ? (
                        <div className="px-3 py-6 text-center text-xs text-gray-500">
                          No notifications yet.
                        </div>
                      ) : (
                        notifData.notifications.map((n) => (
                          <div
                            key={n._id}
                            className={`px-3 py-2 border-b border-gray-50 last:border-b-0 ${
                              !n.isRead ? 'bg-slate-50' : 'bg-white'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-xs font-semibold text-slate-800">
                                  {n.title}
                                </div>
                                <div className="text-[11px] text-gray-600 mt-0.5">
                                  {n.message}
                                </div>
                                {n.meta?.orderNumber && (
                                  <Link
                                    to={`/orders/${n.meta.orderId}`}
                                    className="text-[11px] text-amber-600 mt-1 inline-block hover:text-amber-700"
                                    onClick={closeAllMenus}
                                  >
                                    View order #{n.meta.orderNumber}
                                  </Link>
                                )}
                              </div>
                              {!n.isRead && (
                                <span className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* User Menu (desktop) */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 h-10 px-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-semibold">
                      {user.firstName?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div className="hidden lg:flex flex-col items-start leading-tight">
                      <span className="text-[10px] text-slate-500">Hello,</span>
                      <span className="text-sm font-medium text-slate-900 max-w-[110px] truncate">
                        {user.firstName}
                      </span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`hidden lg:block text-slate-400 transition-transform ${
                        isUserMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white text-sm font-semibold">
                            {user.firstName?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Links */}
                      <div className="py-1">
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={closeAllMenus}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                              <Settings size={16} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium">Admin Panel</span>
                              <span className="text-xs text-slate-500">
                                Manage products &amp; orders
                              </span>
                            </div>
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          onClick={closeAllMenus}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <User size={16} className="text-slate-500" />
                          My Profile
                        </Link>

                        <Link
                          to="/orders"
                          onClick={closeAllMenus}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <Package size={16} className="text-slate-500" />
                          My Orders
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-slate-200 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    onClick={closeAllMenus}
                    className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeAllMenus}
                    className="px-3 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-black rounded-full shadow-sm hover:shadow-md transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Cart trigger (desktop) */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative hidden lg:flex items-center gap-2 h-10 px-4 rounded-full border border-slate-900 bg-slate-900 text-slate-50 hover:bg-black hover:border-black transition-all"
                aria-label="Open cart"
              >
                <ShoppingCart size={18} />
                <span className="text-sm font-medium">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-amber-500 text-[10px] font-semibold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - fixed under navbar and scrollable */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-30 border-t border-slate-200 bg-white shadow-lg">
          <div className="max-w-[105rem] mx-auto px-4 pt-4 pb-8 space-y-1 overflow-y-auto">
            {/* Search - Mobile */}
            <div className="mb-3">
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-full bg-slate-50 border border-slate-200 text-slate-600">
                <Search size={18} />
                <span className="text-sm">Search products…</span>
              </button>
            </div>

            <Link
              to="/products"
              onClick={closeAllMenus}
              className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors"
            >
              Shop
            </Link>

            {/* Categories */}
            <div className="pt-2">
              <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Categories
              </p>
              {groceryCategories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  onClick={closeAllMenus}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors"
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
            </div>

            <Link
              to="/about"
              onClick={closeAllMenus}
              className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-slate-900 rounded-md transition-colors"
            >
              About
            </Link>

            {/* Auth / user section in mobile menu */}
            {user ? (
              <div className="pt-4 mt-3 border-t border-slate-200 space-y-2 mb-4">
                <div className="flex items-center gap-3 px-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white text-xs font-semibold">
                    {user.firstName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-900">
                      {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-slate-500">
                      {user.email}
                    </span>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={closeAllMenus}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
                  >
                    <Settings size={16} className="text-slate-500" />
                    Admin Panel
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={closeAllMenus}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
                >
                  <User size={16} className="text-slate-500" />
                  My Profile
                </Link>

                <Link
                  to="/orders"
                  onClick={closeAllMenus}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md"
                >
                  <Package size={16} className="text-slate-500" />
                  My Orders
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 rounded-md"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 mt-3 border-t border-slate-200 space-y-2 mb-4">
                <Link
                  to="/login"
                  onClick={closeAllMenus}
                  className="block px-3 py-2 text-center text-sm font-medium text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeAllMenus}
                  className="block px-3 py-2 text-center text-sm font-semibold text-white bg-slate-900 rounded-full shadow-sm hover:bg-black hover:shadow-md transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CART RIGHT SIDEBAR WITH ITEMS */}
      {isCartOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setIsCartOpen(false)}
          />
          {/* Drawer */}
          <aside
            ref={cartRef}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Your cart
                </p>
                <p className="text-xs text-slate-500">
                  {cartCount === 0
                    ? 'No items added yet.'
                    : `${cartCount} item${cartCount > 1 ? 's' : ''} in your cart`}
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {cartItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-sm text-slate-500 px-4">
                  <ShoppingCart size={32} className="mb-3 text-slate-300" />
                  <p className="mb-1 font-medium text-slate-700">
                    Your cart is empty
                  </p>
                  <p className="mb-4 text-xs text-slate-500">
                    Start adding products to see them here.
                  </p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/products');
                    }}
                    className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-black"
                  >
                    Browse products
                  </button>
                </div>
              ) : (
                <>
                  {/* Items list */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                    {cartItems.map((item) => {
                      const price =
                        item.product.discountPrice || item.product.price;
                      const subtotalItem = price * item.quantity;
                      const isMinQty = item.quantity <= 1;
                      const isMaxQty =
                        item.product.stock &&
                        item.quantity >= item.product.stock;

                      return (
                        <div
                          key={item.product._id}
                          className="flex gap-3 border border-slate-100 rounded-xl p-3"
                        >
                          <Link
                            to={`/products/${item.product._id}`}
                            onClick={() => setIsCartOpen(false)}
                            className="flex-shrink-0"
                          >
                            <div className="h-16 w-16 rounded-lg border border-slate-200 bg-white flex items-center justify-center overflow-hidden">
                              <img
                                src={
                                  item.product.images?.[0]?.url ||
                                  '/placeholder.png'
                                }
                                alt={item.product.name}
                                className="h-full w-full object-contain"
                              />
                            </div>
                          </Link>

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <Link
                                to={`/products/${item.product._id}`}
                                onClick={() => setIsCartOpen(false)}
                                className="text-sm font-semibold text-slate-900 line-clamp-2 hover:text-slate-700"
                              >
                                {item.product.name}
                              </Link>
                              <p className="mt-0.5 text-[11px] text-slate-500">
                                {item.product.category}
                              </p>
                            </div>

                            <div className="mt-1 flex items-center justify-between">
                              <div className="text-sm font-semibold text-slate-900">
                                ₹{price.toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-500">
                                Subtotal:{' '}
                                <span className="font-semibold text-slate-900">
                                  ₹{subtotalItem.toLocaleString()}
                                </span>
                              </div>
                            </div>

                            <div className="mt-2 flex items-center justify-between">
                              {/* Qty controls */}
                              <div className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-1.5 py-1">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product._id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={isMinQty}
                                  className="flex h-6 w-6 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="mx-2 min-w-[28px] text-center text-xs font-semibold text-slate-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.product._id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={isMaxQty}
                                  className="flex h-6 w-6 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.product._id)}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-rose-500"
                              >
                                <Trash2 size={12} />
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary + actions */}
                  <div className="border-t border-slate-200 px-4 py-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-600">Subtotal</span>
                      <span className="text-lg font-semibold text-slate-900">
                        ₹{subtotal.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Taxes and shipping calculated at checkout.
                    </p>

                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/cart');
                      }}
                      className="w-full mb-2 px-4 py-2.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-black transition-all"
                    >
                      View full cart
                    </button>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate('/checkout');
                      }}
                      className="w-full px-4 py-2.5 rounded-full border border-slate-900 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-all"
                    >
                      Proceed to checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Navbar;
