// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useCart } from '../context/CartContext';
// import {
//   ShoppingCart,
//   User,
//   Menu,
//   X,
//   LogOut,
//   Settings,
//   Package,
//   ChevronDown,
//   Heart,
//   Search,
//   MapPin,
// } from 'lucide-react';
// import logo from '../assets/logo.webp';

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
//   const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);

//   const categoriesRef = useRef(null);
//   const userMenuRef = useRef(null);

//   const { user, logout } = useAuth();
//   const { getCartCount } = useCart();
//   const navigate = useNavigate();

//   const cartCount = getCartCount();

//   // Scroll shadow effect
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
//         setIsCategoriesOpen(false);
//       }
//       if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
//         setIsUserMenuOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//     closeAllMenus();
//   };

//   const closeAllMenus = () => {
//     setIsMenuOpen(false);
//     setIsUserMenuOpen(false);
//     setIsCategoriesOpen(false);
//   };

//   const groceryCategories = [
//     { name: 'Pulses & Grains', icon: '🌾' },
//     { name: 'Spices & Masalas', icon: '🌶️' },
//     { name: 'Nuts & Seeds', icon: '🥜' },
//     { name: 'Health & Organic Foods', icon: '🥗' },
//   ];

//   return (
//     <nav
//       className={`sticky top-0 z-50 border-b border-slate-200 transition-all duration-300 ${
//         isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
//       }`}
//     >
//       {/* Top Bar */}
//       {/* <div className="hidden lg:block bg-slate-50 border-b border-slate-200/70">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex h-9 items-center justify-between text-xs text-slate-600">
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-1.5">
//                 <MapPin size={14} className="text-emerald-600" />
//                 <span>
//                   Deliver to:{' '}
//                   <span className="font-medium text-slate-900">Your Location</span>
//                 </span>
//               </div>
//             </div>
//             <div className="flex items-center gap-4">
//               <span>
//                 Customer Support:{' '}
//                 <span className="font-medium text-slate-900">1800-123-4567</span>
//               </span>
//               <span className="text-emerald-700 font-medium">
//                 Free delivery on orders above ₹500
//               </span>
//             </div>
//           </div>
//         </div>
//       </div> */}

//       {/* Main Navigation */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex h-16 items-center justify-between gap-4">
//           {/* Left: Logo + Links */}
//           <div className="flex items-center gap-6 lg:gap-8">
//             {/* Logo */}
//             <Link
//               to="/"
//               className="flex items-center gap-3 flex-shrink-0"
//               onClick={closeAllMenus}
//             >
//               <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm overflow-hidden">
//                 <img
//                   src={logo}
//                   alt="Vemapri Logo"
//                   className="h-full w-full object-contain"
//                   onError={(e) => {
//                     e.target.style.display = 'none';
//                     e.target.nextSibling.style.display = 'flex';
//                   }}
//                 />
//                 <span className="hidden text-lg font-semibold text-emerald-700 items-center justify-center">
//                   V
//                 </span>
//               </div>
//               <div className="hidden sm:flex flex-col leading-tight">
//                 <span className="text-lg lg:text-xl font-semibold tracking-tight text-slate-900">
//                   Vemapri
//                 </span>
//                 <span className="text-[10px] lg:text-[11px] uppercase tracking-[0.18em] text-slate-500">
//                   Grocery & Food Supplies
//                 </span>
//               </div>
//             </Link>

//             {/* Desktop Navigation Links */}
//             <div className="hidden lg:flex items-center gap-1">
//               <Link
//                 to="/products"
//                 onClick={closeAllMenus}
//                 className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 rounded-md hover:bg-slate-50 transition-colors"
//               >
//                 Shop All
//               </Link>

//               {/* Categories dropdown */}
//               <div className="relative" ref={categoriesRef}>
//                 <button
//                   onClick={() => setIsCategoriesOpen((prev) => !prev)}
//                   className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border transition-all ${
//                     isCategoriesOpen
//                       ? 'border-emerald-600 text-emerald-700 bg-emerald-50'
//                       : 'border-transparent text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
//                   }`}
//                 >
//                   Categories
//                   <ChevronDown
//                     size={16}
//                     className={`transition-transform ${
//                       isCategoriesOpen ? 'rotate-180' : ''
//                     }`}
//                   />
//                 </button>

//                 {isCategoriesOpen && (
//                   <div className="absolute left-0 mt-2 w-64 rounded-md border border-slate-200 bg-white shadow-lg overflow-hidden">
//                     <div className="px-4 py-2 border-b border-slate-100">
//                       <p className="text-xs font-semibold tracking-wide text-slate-500">
//                         Browse categories
//                       </p>
//                     </div>
//                     <div className="py-1">
//                       {groceryCategories.map((cat) => (
//                         <Link
//                           key={cat.name}
//                           to={`/products?category=${encodeURIComponent(cat.name)}`}
//                           onClick={closeAllMenus}
//                           className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
//                         >
//                           <span className="text-lg">{cat.icon}</span>
//                           <span>{cat.name}</span>
//                         </Link>
//                       ))}
//                     </div>
//                     <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
//                       <Link
//                         to="/products"
//                         onClick={closeAllMenus}
//                         className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
//                       >
//                         View all products →
//                       </Link>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <Link
//                 to="/about"
//                 onClick={closeAllMenus}
//                 className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 rounded-md hover:bg-slate-50 transition-colors"
//               >
//                 About Us
//               </Link>
//             </div>
//           </div>

//           {/* Right: Search, Cart, User */}
//           <div className="flex items-center gap-2 sm:gap-3">
//             {/* Search - Desktop */}
//             <button className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-md bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 transition-all">
//               <Search size={18} className="text-slate-400" />
//               <span className="text-sm">Search products…</span>
//             </button>

//             {/* Wishlist */}
//             <button className="hidden md:flex items-center justify-center h-10 w-10 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 transition-all">
//               <Heart size={18} />
//             </button>

//             {/* Cart */}
//             <Link
//               to="/cart"
//               onClick={closeAllMenus}
//               className="relative flex items-center gap-2 h-10 px-3 sm:px-4 rounded-md border border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all"
//             >
//               <ShoppingCart size={18} />
//               <span className="hidden sm:inline text-sm font-medium">Cart</span>
//               {cartCount > 0 && (
//                 <span className="absolute -top-2 -right-2 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
//                   {cartCount}
//                 </span>
//               )}
//             </Link>

//             {/* User Menu */}
//             {user ? (
//               <div className="relative" ref={userMenuRef}>
//                 <button
//                   onClick={() => setIsUserMenuOpen((prev) => !prev)}
//                   className="flex items-center gap-2 h-10 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all"
//                 >
//                   <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-semibold">
//                     {user.firstName?.[0]?.toUpperCase() || 'U'}
//                   </div>
//                   <div className="hidden lg:flex flex-col items-start leading-tight">
//                     <span className="text-[10px] text-slate-500">Hello,</span>
//                     <span className="text-sm font-medium text-slate-900 max-w-[110px] truncate">
//                       {user.firstName}
//                     </span>
//                   </div>
//                   <ChevronDown
//                     size={16}
//                     className={`hidden lg:block text-slate-400 transition-transform ${
//                       isUserMenuOpen ? 'rotate-180' : ''
//                     }`}
//                   />
//                 </button>

//                 {isUserMenuOpen && (
//                   <div className="absolute right-0 mt-2 w-64 rounded-md border border-slate-200 bg-white shadow-lg overflow-hidden">
//                     {/* Header */}
//                     <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-semibold">
//                           {user.firstName?.[0]?.toUpperCase() || 'U'}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium text-slate-900 truncate">
//                             {user.firstName} {user.lastName}
//                           </p>
//                           <p className="text-xs text-slate-500 truncate">{user.email}</p>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Links */}
//                     <div className="py-1">
//                       {user.role === 'admin' && (
//                         <Link
//                           to="/admin"
//                           onClick={closeAllMenus}
//                           className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
//                         >
//                           <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-slate-700">
//                             <Settings size={16} />
//                           </div>
//                           <div className="flex flex-col">
//                             <span className="font-medium">Admin Panel</span>
//                             <span className="text-xs text-slate-500">
//                               Manage products & orders
//                             </span>
//                           </div>
//                         </Link>
//                       )}

//                       <Link
//                         to="/profile"
//                         onClick={closeAllMenus}
//                         className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
//                       >
//                         <User size={16} className="text-slate-500" />
//                         My Profile
//                       </Link>

//                       <Link
//                         to="/orders"
//                         onClick={closeAllMenus}
//                         className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
//                       >
//                         <Package size={16} className="text-slate-500" />
//                         My Orders
//                       </Link>
//                     </div>

//                     {/* Logout */}
//                     <div className="border-t border-slate-200 py-2">
//                       <button
//                         onClick={handleLogout}
//                         className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
//                       >
//                         <LogOut size={16} />
//                         Logout
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <div className="hidden md:flex items-center gap-2">
//                 <Link
//                   to="/login"
//                   onClick={closeAllMenus}
//                   className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 rounded-md hover:bg-slate-50 transition-colors"
//                 >
//                   Sign In
//                 </Link>
//                 <Link
//                   to="/register"
//                   onClick={closeAllMenus}
//                   className="px-3 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm hover:shadow-md transition-all"
//                 >
//                   Register
//                 </Link>
//               </div>
//             )}

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setIsMenuOpen((prev) => !prev)}
//               className="lg:hidden flex items-center justify-center h-10 w-10 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
//               aria-label="Toggle menu"
//             >
//               {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {isMenuOpen && (
//         <div className="lg:hidden border-t border-slate-200 bg-white shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
//             {/* Search - Mobile */}
//             <div className="mb-3">
//               <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-200 text-slate-600">
//                 <Search size={18} />
//                 <span className="text-sm">Search products…</span>
//               </button>
//             </div>

//             <Link
//               to="/products"
//               onClick={closeAllMenus}
//               className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-emerald-700 rounded-md transition-colors"
//             >
//               Shop All Products
//             </Link>

//             {/* Categories */}
//             <div className="pt-2">
//               <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">
//                 Categories
//               </p>
//               {groceryCategories.map((cat) => (
//                 <Link
//                   key={cat.name}
//                   to={`/products?category=${encodeURIComponent(cat.name)}`}
//                   onClick={closeAllMenus}
//                   className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-700 rounded-md transition-colors"
//                 >
//                   <span className="text-lg">{cat.icon}</span>
//                   {cat.name}
//                 </Link>
//               ))}
//             </div>

//             <Link
//               to="/about"
//               onClick={closeAllMenus}
//               className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-emerald-700 rounded-md transition-colors"
//             >
//               About Us
//             </Link>

//             {!user && (
//               <div className="pt-4 mt-3 border-t border-slate-200 space-y-2">
//                 <Link
//                   to="/login"
//                   onClick={closeAllMenus}
//                   className="block px-3 py-2 text-center text-sm font-medium text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50 transition-all"
//                 >
//                   Sign In
//                 </Link>
//                 <Link
//                   to="/register"
//                   onClick={closeAllMenus}
//                   className="block px-3 py-2 text-center text-sm font-semibold text-white bg-emerald-600 rounded-md shadow-sm hover:bg-emerald-700 hover:shadow-md transition-all"
//                 >
//                   Create Account
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
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
  Heart,
  Search,
  MapPin,
  Bell,
} from 'lucide-react';
import api from '../utils/api';
import logo from '../assets/logo.webp';

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

  const categoriesRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const cartCount = getCartCount();

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch notifications for logged-in user
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
  };

  const groceryCategories = [
    { name: 'Pulses & Grains', icon: '🌾' },
    { name: 'Spices & Masalas', icon: '🌶️' },
    { name: 'Nuts & Seeds', icon: '🥜' },
    { name: 'Health & Organic Foods', icon: '🥗' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-slate-200 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white'
      }`}
    >
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Logo + Links */}
          <div className="flex items-center gap-6 lg:gap-8">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 flex-shrink-0"
              onClick={closeAllMenus}
            >
              <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm overflow-hidden">
                <img
                  src={logo}
                  alt="Vemapri Logo"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <span className="hidden text-lg font-semibold text-emerald-700 items-center justify-center">
                  V
                </span>
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-lg lg:text-xl font-semibold tracking-tight text-slate-900">
                  Vemapri
                </span>
                <span className="text-[10px] lg:text-[11px] uppercase tracking-[0.18em] text-slate-500">
                  Grocery & Food Supplies
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1">
              <Link
                to="/products"
                onClick={closeAllMenus}
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 rounded-md hover:bg-slate-50 transition-colors"
              >
                Shop All
              </Link>

              {/* Categories dropdown */}
              <div className="relative" ref={categoriesRef}>
                <button
                  onClick={() => setIsCategoriesOpen((prev) => !prev)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border transition-all ${
                    isCategoriesOpen
                      ? 'border-emerald-600 text-emerald-700 bg-emerald-50'
                      : 'border-transparent text-slate-700 hover:text-emerald-700 hover:bg-slate-50'
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
                  <div className="absolute left-0 mt-2 w-64 rounded-md border border-slate-200 bg-white shadow-lg overflow-hidden">
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
                          className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
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
                        className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
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
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 rounded-md hover:bg-slate-50 transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>

          {/* Right: Search, Cart, Notifications, User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search - Desktop */}
            <button className="hidden xl:flex items-center gap-2 px-3 py-2 rounded-md bg-slate-50 border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 transition-all">
              <Search size={18} className="text-slate-400" />
              <span className="text-sm">Search products…</span>
            </button>

            {/* Wishlist */}
            <button className="hidden md:flex items-center justify-center h-10 w-10 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 transition-all">
              <Heart size={18} />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              onClick={closeAllMenus}
              className="relative flex items-center gap-2 h-10 px-3 sm:px-4 rounded-md border border-emerald-600 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all"
            >
              <ShoppingCart size={18} />
              <span className="hidden sm:inline text-sm font-medium">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notification Bell (only when logged in) */}
            {user && (
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen((prev) => !prev)}
                  className="relative rounded-full border border-lime-100 bg-white p-1.5 text-slate-700 shadow-sm hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md transition-all"
                >
                  <Bell size={18} />
                  {notifData.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-semibold text-white">
                      {notifData.unreadCount > 9 ? '9+' : notifData.unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-lime-100 bg-white/95 shadow-xl shadow-emerald-500/10 backdrop-blur-sm py-2 text-sm max-h-96 overflow-y-auto">
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
                        className="text-[11px] text-emerald-600 hover:text-emerald-700"
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
                            !n.isRead ? 'bg-emerald-50/40' : 'bg-white'
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
                                  className="text-[11px] text-emerald-600 mt-1 inline-block"
                                  onClick={closeAllMenus}
                                >
                                  View order #{n.meta.orderNumber}
                                </Link>
                              )}
                            </div>
                            {!n.isRead && (
                              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                            )}
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
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 h-10 px-3 rounded-md border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-semibold">
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
                  <div className="absolute right-0 mt-2 w-64 rounded-md border border-slate-200 bg-white shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-semibold">
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
                              Manage products & orders
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
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/login"
                  onClick={closeAllMenus}
                  className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-700 rounded-md hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeAllMenus}
                  className="px-3 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm hover:shadow-md transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="lg:hidden flex items-center justify-center h-10 w-10 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {/* Search - Mobile */}
            <div className="mb-3">
              <button className="flex items-center gap-3 w-full px-3 py-2 rounded-md bg-slate-50 border border-slate-200 text-slate-600">
                <Search size={18} />
                <span className="text-sm">Search products…</span>
              </button>
            </div>

            <Link
              to="/products"
              onClick={closeAllMenus}
              className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-emerald-700 rounded-md transition-colors"
            >
              Shop All Products
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
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-700 rounded-md transition-colors"
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
            </div>

            <Link
              to="/about"
              onClick={closeAllMenus}
              className="block px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 hover:text-emerald-700 rounded-md transition-colors"
            >
              About Us
            </Link>

            {!user && (
              <div className="pt-4 mt-3 border-t border-slate-200 space-y-2">
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
                  className="block px-3 py-2 text-center text-sm font-semibold text-white bg-emerald-600 rounded-md shadow-sm hover:bg-emerald-700 hover:shadow-md transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
