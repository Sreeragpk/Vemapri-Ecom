// import React, { useState, useEffect, useMemo } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import api from '../utils/api';
// import ProductCard from '../components/ProductCard';
// import { Filter, Search, X, ChevronDown } from 'lucide-react';
// import productsBanner from '../assets/products.webp';

// const Products = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showFilters, setShowFilters] = useState(false);

//   const [filters, setFilters] = useState({
//     search: searchParams.get('search') || '',
//     category: searchParams.get('category') || '',
//     brand: searchParams.get('brand') || '',
//     minPrice: searchParams.get('minPrice') || '',
//     maxPrice: searchParams.get('maxPrice') || '',
//     minRating: searchParams.get('minRating') || '',
//     isOrganic: searchParams.get('isOrganic') || '',
//     sort: searchParams.get('sort') || 'newest',
//   });

//   const [pagination, setPagination] = useState({
//     currentPage: Number(searchParams.get('page')) || 1,
//     totalPages: 1,
//     totalProducts: 0,
//   });

//   const categories = [
//     'Pulses & Grains',
//     'Spices & Masalas',
//     'Nuts & Seeds',
//     'Health & Organic Foods',
//   ];

//   const brands = [
//     'Vemapri Select',
//     'Vemapri Masala',
//     'Vemapri Wellness',
//     'Other',
//   ];

//   const sortOptions = [
//     { value: 'newest', label: 'Newest First' },
//     { value: 'oldest', label: 'Oldest First' },
//     { value: 'priceAsc', label: 'Price: Low to High' },
//     { value: 'priceDesc', label: 'Price: High to Low' },
//     { value: 'rating', label: 'Highest Rated' },
//   ];

//   useEffect(() => {
//     fetchProducts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters, pagination.currentPage]);

//   useEffect(() => {
//     const params = new URLSearchParams();

//     Object.entries(filters).forEach(([key, value]) => {
//       if (value !== '' && value != null) {
//         params.set(key, value);
//       }
//     });

//     if (pagination.currentPage > 1) {
//       params.set('page', String(pagination.currentPage));
//     }

//     setSearchParams(params);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters, pagination.currentPage]);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const params = {
//         page: pagination.currentPage,
//         limit: 12,
//         ...Object.fromEntries(
//           Object.entries(filters).filter(([_, v]) => v !== '')
//         ),
//       };

//       const res = await api.get('/products', { params });
//       setProducts(res.data.products);
//       setPagination((prev) => ({
//         ...prev,
//         currentPage: Number(res.data.currentPage),
//         totalPages: res.data.totalPages,
//         totalProducts: res.data.totalProducts,
//       }));
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFilterChange = (name, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     setPagination((prev) => ({
//       ...prev,
//       currentPage: 1,
//     }));
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     fetchProducts();
//   };

//   const clearFilters = () => {
//     setFilters({
//       search: '',
//       category: '',
//       brand: '',
//       minPrice: '',
//       maxPrice: '',
//       minRating: '',
//       isOrganic: '',
//       sort: 'newest',
//     });
//     setPagination((prev) => ({
//       ...prev,
//       currentPage: 1,
//     }));
//   };

//   const activeFilterChips = useMemo(() => {
//     const chips = [];

//     if (filters.category) {
//       chips.push({ label: filters.category, key: 'category' });
//     }
//     if (filters.brand) {
//       chips.push({ label: `Brand: ${filters.brand}`, key: 'brand' });
//     }
//     if (filters.minPrice || filters.maxPrice) {
//       chips.push({
//         label: `₹${filters.minPrice || 0} - ₹${filters.maxPrice || '∞'}`,
//         key: 'price',
//       });
//     }
//     if (filters.minRating) {
//       chips.push({
//         label: `Rating ≥ ${filters.minRating}`,
//         key: 'minRating',
//       });
//     }
//     if (filters.isOrganic === 'true') {
//       chips.push({
//         label: 'Organic only',
//         key: 'isOrganic',
//       });
//     }

//     return chips;
//   }, [filters]);

//   const removeChip = (key) => {
//     if (key === 'price') {
//       handleFilterChange('minPrice', '');
//       handleFilterChange('maxPrice', '');
//     } else {
//       handleFilterChange(key, '');
//     }
//   };

//   const organicOptions = [
//     { label: 'All', value: '' },
//     { label: 'Organic', value: 'true' },
//     { label: 'Non-organic', value: 'false' },
//   ];

//   const ratingOptions = [
//     { label: 'Any', value: '' },
//     { label: '3★+', value: '3' },
//     { label: '4★+', value: '4' },
//     { label: '4.5★+', value: '4.5' },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/30">
//       <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Compact Banner */}
//         <div className="mb-5">
//           <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm">
//             <img
//               src={productsBanner}
//               alt="Shop groceries and staples"
//               className="w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 object-cover"
//               loading="lazy"
//               decoding="async"
//             />
//           </div>
//         </div>

//         {/* Compact Header */}
//         <div className="mb-4">
//           <div className="flex items-center justify-between mb-3">
//             <div>
//               <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
//                 All Products
//               </h1>
//               <p className="text-xs text-slate-500 mt-0.5">
//                 {pagination.totalProducts} products available
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 items-start">
//           {/* Compact Filters Sidebar - Desktop */}
//           <aside className="hidden lg:block">
//             <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm sticky top-4 overflow-hidden">
//               {/* Filter Header */}
//               <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
//                 <div className="flex items-center justify-between">
//                   <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
//                     <Filter size={16} className="text-slate-500" />
//                     Filters
//                   </h2>
//                   {activeFilterChips.length > 0 && (
//                     <button
//                       onClick={clearFilters}
//                       className="text-[10px] font-medium text-slate-600 hover:text-slate-900 uppercase tracking-wider"
//                     >
//                       Clear
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
//                 {/* Search */}
//                 <div>
//                   <form onSubmit={handleSearchSubmit} className="relative">
//                     <input
//                       type="text"
//                       value={filters.search}
//                       onChange={(e) =>
//                         handleFilterChange('search', e.target.value)
//                       }
//                       placeholder="Search..."
//                       className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
//                     />
//                     <button
//                       type="submit"
//                       className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
//                     >
//                       <Search size={16} />
//                     </button>
//                   </form>
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
//                     Category
//                   </label>
//                   <select
//                     value={filters.category}
//                     onChange={(e) =>
//                       handleFilterChange('category', e.target.value)
//                     }
//                     className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
//                   >
//                     <option value="">All</option>
//                     {categories.map((cat) => (
//                       <option key={cat} value={cat}>
//                         {cat}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Brand */}
//                 <div>
//                   <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
//                     Brand
//                   </label>
//                   <select
//                     value={filters.brand}
//                     onChange={(e) => handleFilterChange('brand', e.target.value)}
//                     className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
//                   >
//                     <option value="">All</option>
//                     {brands.map((brand) => (
//                       <option key={brand} value={brand}>
//                         {brand}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* Type Pills */}
//                 <div>
//                   <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
//                     Type
//                   </label>
//                   <div className="flex flex-wrap gap-1.5">
//                     {organicOptions.map((opt) => {
//                       const active = filters.isOrganic === opt.value;
//                       return (
//                         <button
//                           key={opt.value || 'all'}
//                           type="button"
//                           onClick={() => handleFilterChange('isOrganic', opt.value)}
//                           className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
//                             active
//                               ? 'bg-slate-900 text-white border-slate-900'
//                               : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
//                           }`}
//                         >
//                           {opt.label}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* Rating Pills */}
//                 <div>
//                   <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
//                     Rating
//                   </label>
//                   <div className="flex flex-wrap gap-1.5">
//                     {ratingOptions.map((opt) => {
//                       const active = filters.minRating === opt.value;
//                       return (
//                         <button
//                           key={opt.value || 'any'}
//                           type="button"
//                           onClick={() => handleFilterChange('minRating', opt.value)}
//                           className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
//                             active
//                               ? 'bg-amber-500 text-white border-amber-500'
//                               : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
//                           }`}
//                         >
//                           {opt.label}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* Price Range */}
//                 <div>
//                   <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
//                     Price (₹)
//                   </label>
//                   <div className="grid grid-cols-2 gap-2">
//                     <input
//                       type="number"
//                       placeholder="Min"
//                       value={filters.minPrice}
//                       onChange={(e) =>
//                         handleFilterChange('minPrice', e.target.value)
//                       }
//                       className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
//                     />
//                     <input
//                       type="number"
//                       placeholder="Max"
//                       value={filters.maxPrice}
//                       onChange={(e) =>
//                         handleFilterChange('maxPrice', e.target.value)
//                       }
//                       className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </aside>

//           {/* Main Products Area */}
//           <div className="flex-1 min-w-0">
//             {/* Top Bar - Mobile Filters + Sort + Active Chips */}
//             <div className="mb-4">
//               {/* Mobile Filter Button + Sort */}
//               <div className="flex items-center gap-2 mb-3">
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="lg:hidden flex-shrink-0 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
//                 >
//                   <Filter size={16} />
//                   Filters
//                   {activeFilterChips.length > 0 && (
//                     <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-slate-900 rounded-full">
//                       {activeFilterChips.length}
//                     </span>
//                   )}
//                 </button>

//                 <div className="flex-1 flex items-center justify-end gap-2">
//                   <label className="text-xs font-medium text-slate-600 hidden sm:block">
//                     Sort:
//                   </label>
//                   <div className="relative">
//                     <select
//                       value={filters.sort}
//                       onChange={(e) => handleFilterChange('sort', e.target.value)}
//                       className="appearance-none pl-3 pr-8 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
//                     >
//                       {sortOptions.map((option) => (
//                         <option key={option.value} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>
//                     <ChevronDown
//                       size={14}
//                       className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
//                     />
//                   </div>
//                 </div>
//               </div>

//               {/* Active Filter Chips */}
//               {activeFilterChips.length > 0 && (
//                 <div className="flex flex-wrap items-center gap-2">
//                   {activeFilterChips.map((chip) => (
//                     <button
//                       key={chip.key}
//                       onClick={() => removeChip(chip.key)}
//                       className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 pl-3 pr-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200/60 hover:bg-slate-200 transition-colors"
//                     >
//                       <span>{chip.label}</span>
//                       <X size={14} className="text-slate-500" />
//                     </button>
//                   ))}
//                   <button
//                     onClick={clearFilters}
//                     className="text-xs font-medium text-slate-500 hover:text-slate-900 underline"
//                   >
//                     Clear all
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Mobile Filters Panel */}
//             {showFilters && (
//               <div className="lg:hidden mb-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
//                   <button
//                     onClick={() => setShowFilters(false)}
//                     className="text-slate-500 hover:text-slate-900"
//                   >
//                     <X size={20} />
//                   </button>
//                 </div>

//                 <div className="space-y-4">
//                   {/* Search */}
//                   <div>
//                     <form onSubmit={handleSearchSubmit} className="relative">
//                       <input
//                         type="text"
//                         value={filters.search}
//                         onChange={(e) =>
//                           handleFilterChange('search', e.target.value)
//                         }
//                         placeholder="Search products..."
//                         className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10"
//                       />
//                       <button
//                         type="submit"
//                         className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
//                       >
//                         <Search size={16} />
//                       </button>
//                     </form>
//                   </div>

//                   {/* Category */}
//                   <div>
//                     <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
//                       Category
//                     </label>
//                     <select
//                       value={filters.category}
//                       onChange={(e) =>
//                         handleFilterChange('category', e.target.value)
//                       }
//                       className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
//                     >
//                       <option value="">All</option>
//                       {categories.map((cat) => (
//                         <option key={cat} value={cat}>
//                           {cat}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Brand */}
//                   <div>
//                     <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
//                       Brand
//                     </label>
//                     <select
//                       value={filters.brand}
//                       onChange={(e) => handleFilterChange('brand', e.target.value)}
//                       className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
//                     >
//                       <option value="">All</option>
//                       {brands.map((brand) => (
//                         <option key={brand} value={brand}>
//                           {brand}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {/* Type */}
//                   <div>
//                     <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
//                       Type
//                     </label>
//                     <div className="flex flex-wrap gap-2">
//                       {organicOptions.map((opt) => {
//                         const active = filters.isOrganic === opt.value;
//                         return (
//                           <button
//                             key={opt.value || 'all'}
//                             type="button"
//                             onClick={() =>
//                               handleFilterChange('isOrganic', opt.value)
//                             }
//                             className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
//                               active
//                                 ? 'bg-slate-900 text-white border-slate-900'
//                                 : 'bg-white text-slate-600 border-slate-200'
//                             }`}
//                           >
//                             {opt.label}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   {/* Rating */}
//                   <div>
//                     <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
//                       Rating
//                     </label>
//                     <div className="flex flex-wrap gap-2">
//                       {ratingOptions.map((opt) => {
//                         const active = filters.minRating === opt.value;
//                         return (
//                           <button
//                             key={opt.value || 'any'}
//                             type="button"
//                             onClick={() =>
//                               handleFilterChange('minRating', opt.value)
//                             }
//                             className={`px-3 py-1.5 rounded-md text-xs font-medium border ${
//                               active
//                                 ? 'bg-amber-500 text-white border-amber-500'
//                                 : 'bg-white text-slate-600 border-slate-200'
//                             }`}
//                           >
//                             {opt.label}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   {/* Price */}
//                   <div>
//                     <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
//                       Price (₹)
//                     </label>
//                     <div className="grid grid-cols-2 gap-2">
//                       <input
//                         type="number"
//                         placeholder="Min"
//                         value={filters.minPrice}
//                         onChange={(e) =>
//                           handleFilterChange('minPrice', e.target.value)
//                         }
//                         className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
//                       />
//                       <input
//                         type="number"
//                         placeholder="Max"
//                         value={filters.maxPrice}
//                         onChange={(e) =>
//                           handleFilterChange('maxPrice', e.target.value)
//                         }
//                         className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
//                       />
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => {
//                       clearFilters();
//                       setShowFilters(false);
//                     }}
//                     className="w-full py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
//                   >
//                     Clear All Filters
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Products Grid */}
//             {loading ? (
//               <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
//                 {[...Array(8)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="bg-white rounded-xl border border-slate-200/60 p-3 shadow-sm animate-pulse"
//                   >
//                     <div className="aspect-square bg-slate-200 rounded-lg mb-3" />
//                     <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
//                     <div className="h-3 bg-slate-100 rounded w-1/2" />
//                   </div>
//                 ))}
//               </div>
//             ) : products.length === 0 ? (
//               <div className="bg-white rounded-xl border border-slate-200/60 py-12 px-6 text-center shadow-sm">
//                 <div className="max-w-md mx-auto">
//                   <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Search size={28} className="text-slate-400" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-slate-900 mb-2">
//                     No products found
//                   </h3>
//                   <p className="text-sm text-slate-500 mb-4">
//                     Try adjusting your filters or search terms
//                   </p>
//                   <button
//                     onClick={clearFilters}
//                     className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-black transition-colors"
//                   >
//                     Clear all filters
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
//                   {products.map((product) => (
//                     <ProductCard key={product._id} product={product} />
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 {pagination.totalPages > 1 && (
//                   <div className="flex justify-center items-center mt-8 gap-2">
//                     <button
//                       onClick={() =>
//                         setPagination((prev) => ({
//                           ...prev,
//                           currentPage: prev.currentPage - 1,
//                         }))
//                       }
//                       disabled={pagination.currentPage === 1}
//                       className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//                     >
//                       Previous
//                     </button>

//                     <div className="flex gap-1">
//                       {[...Array(pagination.totalPages)].map((_, i) => {
//                         const page = i + 1;
//                         const isActive = pagination.currentPage === page;
                        
//                         // Show first, last, current, and adjacent pages
//                         if (
//                           page === 1 ||
//                           page === pagination.totalPages ||
//                           (page >= pagination.currentPage - 1 &&
//                             page <= pagination.currentPage + 1)
//                         ) {
//                           return (
//                             <button
//                               key={page}
//                               onClick={() =>
//                                 setPagination((prev) => ({
//                                   ...prev,
//                                   currentPage: page,
//                                 }))
//                               }
//                               className={`w-9 h-9 text-sm rounded-lg border transition-colors ${
//                                 isActive
//                                   ? 'bg-slate-900 text-white border-slate-900'
//                                   : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
//                               }`}
//                             >
//                               {page}
//                             </button>
//                           );
//                         } else if (
//                           page === pagination.currentPage - 2 ||
//                           page === pagination.currentPage + 2
//                         ) {
//                           return (
//                             <span
//                               key={page}
//                               className="w-9 h-9 flex items-center justify-center text-slate-400"
//                             >
//                               ...
//                             </span>
//                           );
//                         }
//                         return null;
//                       })}
//                     </div>

//                     <button
//                       onClick={() =>
//                         setPagination((prev) => ({
//                           ...prev,
//                           currentPage: prev.currentPage + 1,
//                         }))
//                       }
//                       disabled={
//                         pagination.currentPage === pagination.totalPages
//                       }
//                       className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Products;
// src/pages/Products.js
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import { 
  Filter, 
  Search, 
  X, 
  ChevronDown, 
  Grid3x3, 
  LayoutGrid,
  SlidersHorizontal,
  TrendingUp,
  Sparkles,
  Package,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import productsBanner from '../assets/products.webp';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'compact'

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minRating: searchParams.get('minRating') || '',
    isOrganic: searchParams.get('isOrganic') || '',
    isFeatured: searchParams.get('isFeatured') || '',
    inStock: searchParams.get('inStock') || '',
    sort: searchParams.get('sort') || 'newest',
  });

  const [pagination, setPagination] = useState({
    currentPage: Number(searchParams.get('page')) || 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const categories = [
    'Pulses & Grains',
    'Spices & Masalas',
    'Nuts & Seeds',
    'Health & Organic Foods',
  ];

  const brands = [
    'Vemapri Select',
    'Vemapri Masala',
    'Vemapri Wellness',
    'Other',
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First', icon: Sparkles },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priceAsc', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated', icon: TrendingUp },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'name', label: 'Name (A-Z)' },
  ];

  // Fetch products
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.currentPage]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value != null) {
        params.set(key, value);
      }
    });

    if (pagination.currentPage > 1) {
      params.set('page', String(pagination.currentPage));
    }

    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page: pagination.currentPage,
        limit: 12,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        ),
      };

      const res = await api.get('/products', { params });
      
      // ✅ Handle both old and new API response formats
      const responseData = res.data?.data || res.data;
      const productsData = responseData?.products || [];
      const paginationData = responseData?.pagination || {};
      
      setProducts(productsData);
      setPagination({
        currentPage: paginationData.currentPage || Number(responseData.currentPage) || 1,
        totalPages: paginationData.totalPages || responseData.totalPages || 1,
        totalProducts: paginationData.totalProducts || responseData.totalProducts || 0,
        hasNextPage: paginationData.hasNextPage || false,
        hasPrevPage: paginationData.hasPrevPage || false,
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        hasNextPage: false,
        hasPrevPage: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      isOrganic: '',
      isFeatured: '',
      inStock: '',
      sort: 'newest',
    });
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeFilterChips = useMemo(() => {
    const chips = [];

    if (filters.search) {
      chips.push({ label: `"${filters.search}"`, key: 'search' });
    }
    if (filters.category) {
      chips.push({ label: filters.category, key: 'category' });
    }
    if (filters.brand) {
      chips.push({ label: filters.brand, key: 'brand' });
    }
    if (filters.minPrice || filters.maxPrice) {
      chips.push({
        label: `₹${filters.minPrice || 0} - ₹${filters.maxPrice || '∞'}`,
        key: 'price',
      });
    }
    if (filters.minRating) {
      chips.push({
        label: `${filters.minRating}★ & above`,
        key: 'minRating',
      });
    }
    if (filters.isOrganic === 'true') {
      chips.push({
        label: 'Organic',
        key: 'isOrganic',
      });
    }
    if (filters.isFeatured === 'true') {
      chips.push({
        label: 'Featured',
        key: 'isFeatured',
      });
    }
    if (filters.inStock === 'true') {
      chips.push({
        label: 'In Stock',
        key: 'inStock',
      });
    }

    return chips;
  }, [filters]);

  const removeChip = (key) => {
    if (key === 'price') {
      setFilters((prev) => ({ ...prev, minPrice: '', maxPrice: '' }));
    } else {
      handleFilterChange(key, '');
    }
  };

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const pages = [];
    const { currentPage, totalPages } = pagination;
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={productsBanner}
            alt="Products"
            className="w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
        </div>
        
        <div className="relative max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 mb-4">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-xs font-semibold text-amber-200 uppercase tracking-wider">
                Premium Collection
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Discover Quality<br />Groceries & Staples
            </h1>
            <p className="text-slate-300 text-base md:text-lg max-w-2xl">
              Handpicked selection of premium products for your everyday needs
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search for products, brands, or categories..."
                  className="w-full pl-12 pr-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                />
                {filters.search && (
                  <button
                    type="button"
                    onClick={() => handleFilterChange('search', '')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>
            </div>

            {/* Quick Filters */}
            <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
              {/* Category Dropdown */}
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              </div>

              {/* Advanced Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-xl border transition-all ${
                  showFilters || activeFilterChips.length > 0
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterChips.length > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                    {activeFilterChips.length}
                  </span>
                )}
              </button>

              {/* Refresh Button */}
              <button
                onClick={fetchProducts}
                disabled={loading}
                className="p-3 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50"
                title="Refresh products"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              </button>

              {/* View Toggle */}
              <div className="hidden md:flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'compact'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                  title="Compact view"
                >
                  <Grid3x3 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-slate-50 border-b border-slate-200">
          <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Filter size={20} className="text-slate-600" />
                  Advanced Filters
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Brand */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Brand
                  </label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {['', ...brands].map((brand) => (
                      <label
                        key={brand || 'all'}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                      >
                        <input
                          type="radio"
                          name="brand"
                          value={brand}
                          checked={filters.brand === brand}
                          onChange={(e) => handleFilterChange('brand', e.target.value)}
                          className="w-4 h-4 text-slate-900 focus:ring-2 focus:ring-slate-900"
                        />
                        <span className="text-sm text-slate-700 group-hover:text-slate-900">
                          {brand || 'All Brands'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Product Type
                  </label>
                  <div className="space-y-2">
                    {[
                      { label: 'All Products', value: '' },
                      { label: 'Organic Only', value: 'true' },
                      { label: 'Regular', value: 'false' },
                    ].map((option) => (
                      <label
                        key={option.value || 'all-type'}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                      >
                        <input
                          type="radio"
                          name="organic"
                          value={option.value}
                          checked={filters.isOrganic === option.value}
                          onChange={(e) => handleFilterChange('isOrganic', e.target.value)}
                          className="w-4 h-4 text-slate-900 focus:ring-2 focus:ring-slate-900"
                        />
                        <span className="text-sm text-slate-700 group-hover:text-slate-900">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Minimum Rating
                  </label>
                  <div className="space-y-2">
                    {[
                      { label: 'Any Rating', value: '' },
                      { label: '3 Stars & Above', value: '3' },
                      { label: '4 Stars & Above', value: '4' },
                      { label: '4.5 Stars & Above', value: '4.5' },
                    ].map((option) => (
                      <label
                        key={option.value || 'any-rating'}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
                      >
                        <input
                          type="radio"
                          name="rating"
                          value={option.value}
                          checked={filters.minRating === option.value}
                          onChange={(e) => handleFilterChange('minRating', e.target.value)}
                          className="w-4 h-4 text-amber-500 focus:ring-2 focus:ring-amber-500"
                        />
                        <span className="text-sm text-slate-700 group-hover:text-slate-900">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Stock & Featured */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Availability
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.inStock === 'true'}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked ? 'true' : '')}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                      />
                      <span className="text-sm text-slate-700">In Stock Only</span>
                    </label>
                    <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.isFeatured === 'true'}
                        onChange={(e) => handleFilterChange('isFeatured', e.target.checked ? 'true' : '')}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-2 focus:ring-amber-500"
                      />
                      <span className="text-sm text-slate-700">Featured Products</span>
                    </label>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Price Range (₹)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      min="0"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      min="0"
                    />
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters & Results Count */}
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            {activeFilterChips.length > 0 ? (
              <>
                <span className="text-sm font-medium text-slate-600">
                  Active filters:
                </span>
                {activeFilterChips.map((chip) => (
                  <button
                    key={chip.key}
                    onClick={() => removeChip(chip.key)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-full hover:bg-black transition-colors"
                  >
                    <span>{chip.label}</span>
                    <X size={12} />
                  </button>
                ))}
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900 underline"
                >
                  Clear all
                </button>
              </>
            ) : (
              <p className="text-sm text-slate-500">
                Showing all products
              </p>
            )}
          </div>
          
          <div className="text-sm">
            <span className="font-semibold text-slate-900">
              {pagination.totalProducts || 0}
            </span>
            <span className="text-slate-500"> products found</span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <X size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Something went wrong
            </h3>
            <p className="text-slate-600 mb-6">
              {error}
            </p>
            <button
              onClick={fetchProducts}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-black transition-colors"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
          }`}>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm animate-pulse"
              >
                <div className="aspect-square bg-slate-200 rounded-xl mb-4" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-1/2 mb-3" />
                <div className="h-3 bg-slate-100 rounded w-2/3 mb-2" />
                <div className="h-8 bg-slate-200 rounded-lg mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && (!products || products.length === 0) && (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              No products found
            </h3>
            <p className="text-slate-600 mb-6">
              We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center justify-center px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-black transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products && products.length > 0 && (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
            }`}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center mt-12 gap-4">
                {/* Page Info (Mobile) */}
                <div className="text-sm text-slate-500 sm:hidden">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>

                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="inline-flex items-center gap-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="hidden sm:flex gap-1">
                    {getPaginationNumbers().map((page, index) => (
                      page === '...' ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="min-w-[40px] h-10 flex items-center justify-center text-slate-400"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`min-w-[40px] h-10 text-sm font-medium rounded-xl border transition-all ${
                            pagination.currentPage === page
                              ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    ))}
                  </div>

                  {/* Mobile Page Indicator */}
                  <div className="sm:hidden flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={pagination.totalPages}
                      value={pagination.currentPage}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (val >= 1 && val <= pagination.totalPages) {
                          handlePageChange(val);
                        }
                      }}
                      className="w-16 h-10 text-center text-sm font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <span className="text-sm text-slate-500">
                      / {pagination.totalPages}
                    </span>
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="inline-flex items-center gap-1 px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Page Info (Desktop) */}
                <div className="hidden sm:block text-sm text-slate-500">
                  Showing {((pagination.currentPage - 1) * 12) + 1} - {Math.min(pagination.currentPage * 12, pagination.totalProducts)} of {pagination.totalProducts}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;