// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../../utils/api';
// import toast from 'react-hot-toast';
// import {
//   Plus,
//   Search,
//   Edit,
//   Trash2,
//   Eye,
//   EyeOff,
//   Leaf,
//   Star,
// } from 'lucide-react';

// // adjust this path if your assets folder is in a different place
// import adminProductsBanner from '../../assets/adminproducts.webp';

// const AdminProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // 🔹 Default isActive is "all" so admin sees both Active + Inactive by default
//   const [filters, setFilters] = useState({
//     search: '',
//     category: '',
//     isActive: 'all', // "all" | "true" | "false"
//     isOrganic: '',
//   });

//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalProducts: 0,
//   });

//   useEffect(() => {
//     fetchProducts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters, pagination.currentPage]);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       // Build params, but don't send isActive when it's "all"
//       const filteredEntries = Object.entries(filters).filter(
//         ([key, value]) =>
//           value !== '' && !(key === 'isActive' && value === 'all')
//       );

//       const params = {
//         page: pagination.currentPage,
//         limit: 20,
//         ...Object.fromEntries(filteredEntries),
//       };

//       const res = await api.get('/products', { params });

//       setProducts(res.data.products || []);
//       setPagination({
//         currentPage: Number(res.data.currentPage) || 1,
//         totalPages: res.data.totalPages || 1,
//         totalProducts: res.data.totalProducts || 0,
//       });
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to fetch products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleActive = async (productId, currentStatus) => {
//     try {
//       await api.put(`/products/${productId}`, { isActive: !currentStatus });
//       toast.success('Product status updated');
//       // refetch with current filters (including isActive)
//       fetchProducts();
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to update product');
//     }
//   };

//   const handleDelete = async (productId) => {
//     if (!window.confirm('Are you sure you want to delete this product?')) {
//       return;
//     }

//     try {
//       await api.delete(`/products/${productId}`);
//       toast.success('Product deleted successfully');
//       fetchProducts();
//     } catch (error) {
//       console.error(error);
//       toast.error('Failed to delete product');
//     }
//   };

//   const handleFilterChange = (name, value) => {
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       search: '',
//       category: '',
//       isActive: 'all', // reset to all status
//       isOrganic: '',
//     });
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   // Simple stats from current page (for hero chips)
//   const activeCount = products.filter((p) => p.isActive).length;
//   const organicCount = products.filter((p) => p.isOrganic).length;
//   const lowStockCount = products.filter(
//     (p) => p.stock > 0 && p.stock <= 5
//   ).length;
//   const outOfStockCount = products.filter((p) => p.stock <= 0).length;

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
//       {/* Top Hero / Banner */}
//       <div className="relative overflow-hidden rounded-3xl border border-emerald-100/60 bg-slate-950 text-white shadow-lg">
//         {/* Background image + gradient overlay */}
//         <div className="absolute inset-0">
//           <img
//             src={adminProductsBanner}
//             alt="Products overview"
//             className="w-full h-full object-cover opacity-60"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-emerald-900/70" />
//         </div>

//         <div className="relative px-6 sm:px-8 py-6 sm:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//           {/* Left: Title + description */}
//           <div>
//             <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/50 px-3 py-1 mb-3">
//               <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
//               <span className="text-xs font-medium text-emerald-100">
//                 Catalogue Control Center
//               </span>
//             </div>

//             <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
//               Products Dashboard
//             </h1>
//             <p className="mt-2 text-xs sm:text-sm text-emerald-50/80 max-w-xl">
//               Manage Vemapri&apos;s grocery &amp; staples catalogue, pricing, visibility and
//               inventory from a single, streamlined interface.
//             </p>

//             {/* Stats chips */}
//             <div className="mt-4 flex flex-wrap gap-2 text-[11px] sm:text-xs">
//               <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/60 border border-emerald-400/30 px-3 py-1">
//                 <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
//                 <span className="font-semibold">
//                  {(pagination.totalProducts ?? 0).toLocaleString()}

//                 </span>
//                 <span className="text-emerald-50/80">total products</span>
//               </span>

//               <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/60 border border-emerald-400/20 px-3 py-1">
//                 <Eye className="w-3 h-3" />
//                 <span className="font-semibold">{activeCount}</span>
//                 <span className="text-emerald-50/80">active</span>
//               </span>

//               <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/60 border border-emerald-400/20 px-3 py-1">
//                 <Leaf className="w-3 h-3" />
//                 <span className="font-semibold">{organicCount}</span>
//                 <span className="text-emerald-50/80">organic range</span>
//               </span>

//               <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/60 border border-amber-400/30 px-3 py-1">
//                 <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
//                 <span className="font-semibold">{lowStockCount}</span>
//                 <span className="text-emerald-50/80">low stock</span>
//               </span>

//               {outOfStockCount > 0 && (
//                 <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/60 border border-rose-400/40 px-3 py-1">
//                   <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
//                   <span className="font-semibold">{outOfStockCount}</span>
//                   <span className="text-emerald-50/80">out of stock</span>
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Right: Primary action + loader */}
//           <div className="flex flex-col items-end gap-2">
//             {loading && (
//               <div className="flex items-center gap-2 text-[11px] sm:text-xs text-emerald-50/80">
//                 <span className="h-3 w-3 rounded-full border border-emerald-200/70 border-t-transparent animate-spin" />
//                 <span>Loading products…</span>
//               </div>
//             )}

//             {/* 🔸 Updated button: neutral dark, no green gradient */}
//             <Link
//               to="/admin/products/new"
//               className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-50 shadow-md hover:bg-slate-800 hover:shadow-lg transition-all"
//             >
//               <Plus size={16} className="mr-2" />
//               Add New Product
//             </Link>
//             <p className="text-[11px] text-emerald-50/80">
//               Keep adding fresh SKUs to grow the catalogue.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="rounded-2xl bg-white/95 border border-emerald-100/80 shadow-sm p-4 sm:p-5">
//         <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
//           <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
//             <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
//               <Search size={16} />
//             </span>
//             <span>Filter products</span>
//             <span className="hidden sm:inline-block text-xs text-slate-400">
//               Narrow down by text, category, status and type.
//             </span>
//           </div>
//           <button
//             onClick={clearFilters}
//             className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50/70 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-100 transition-all"
//           >
//             Clear all
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
//           {/* Search */}
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search by name, brand, SKU..."
//               value={filters.search}
//               onChange={(e) => handleFilterChange('search', e.target.value)}
//               className="input pl-9 text-sm"
//             />
//             <Search
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//               size={18}
//             />
//           </div>

//           {/* Category */}
//           <select
//             value={filters.category}
//             onChange={(e) => handleFilterChange('category', e.target.value)}
//             className="input text-sm"
//           >
//             <option value="">All Categories</option>
//             <option value="Pulses & Grains">Pulses &amp; Grains</option>
//             <option value="Spices & Masalas">Spices &amp; Masalas</option>
//             <option value="Nuts & Seeds">Nuts &amp; Seeds</option>
//             <option value="Health & Organic Foods">
//               Health &amp; Organic Foods
//             </option>
//           </select>

//           {/* Status */}
//           <select
//             value={filters.isActive}
//             onChange={(e) => handleFilterChange('isActive', e.target.value)}
//             className="input text-sm"
//           >
//             {/* 🔹 "all" is interpreted as no isActive filter */}
//             <option value="all">All Status</option>
//             <option value="true">Active</option>
//             <option value="false">Inactive</option>
//           </select>

//           {/* Organic filter */}
//           <select
//             value={filters.isOrganic}
//             onChange={(e) => handleFilterChange('isOrganic', e.target.value)}
//             className="input text-sm"
//           >
//             <option value="">All Types</option>
//             <option value="true">Organic</option>
//             <option value="false">Non-Organic</option>
//           </select>
//         </div>
//       </div>

//       {/* Products Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
//         {loading ? (
//           [...Array(6)].map((_, i) => (
//             <div
//               key={i}
//               className="rounded-2xl border border-emerald-50 bg-white/80 shadow-sm animate-pulse p-4"
//             >
//               <div className="h-40 bg-slate-100 rounded-xl mb-4" />
//               <div className="h-4 bg-slate-100 rounded mb-2" />
//               <div className="h-4 bg-slate-100 rounded w-2/3" />
//             </div>
//           ))
//         ) : products.length === 0 ? (
//           <div className="col-span-full text-center py-12 text-slate-400 text-sm">
//             No products found for the selected filters.
//           </div>
//         ) : (
//           products.map((product) => {
//            const effectivePrice =
//   typeof product.discountPrice === 'number'
//     ? product.discountPrice
//     : typeof product.price === 'number'
//     ? product.price
//     : 0;

//             const hasDiscount =
//               product.discountPrice && product.discountPrice < product.price;
//             const discountPercent =
//               hasDiscount && product.price
//                 ? Math.round(
//                     ((product.price - product.discountPrice) / product.price) *
//                       100
//                   )
//                 : 0;

//             return (
//               <div
//                 key={product._id}
//                 className="rounded-2xl border border-emerald-50 bg-white/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-4 flex flex-col"
//               >
//                 {/* Image */}
//                 <div className="relative h-40 bg-slate-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
//                   {product.images && product.images[0] ? (
//                     <img
//                       src={product.images[0].url}
//                       alt={product.name}
//                       className="w-full h-full object-contain"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 text-xs">
//                       <Leaf className="mb-1" size={20} />
//                       No image
//                     </div>
//                   )}

//                   {/* Status badges */}
//                   <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
//                     <span
//                       className={`px-2 py-0.5 text-[11px] rounded-full font-medium ${
//                         product.isActive
//                           ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
//                           : 'bg-rose-50 text-rose-700 border border-rose-100'
//                       }`}
//                     >
//                       {product.isActive ? 'Active' : 'Inactive'}
//                     </span>

//                     {product.isOrganic && (
//                       <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
//                         <Leaf size={12} />
//                         Organic
//                       </span>
//                     )}

//                     {product.isFeatured && (
//                       <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full bg-amber-50 text-amber-700 border border-amber-100">
//                         <Star size={12} />
//                         Featured
//                       </span>
//                     )}

//                     {product.stock <= 0 && (
//                       <span className="px-2 py-0.5 text-[11px] rounded-full bg-rose-50 text-rose-700 border border-rose-100">
//                         Out of Stock
//                       </span>
//                     )}
//                     {product.stock > 0 && product.stock <= 5 && (
//                       <span className="px-2 py-0.5 text-[11px] rounded-full bg-amber-50 text-amber-700 border border-amber-100">
//                         Low Stock
//                       </span>
//                     )}

//                     {hasDiscount && (
//                       <span className="px-2 py-0.5 text-[11px] rounded-full bg-emerald-600 text-white font-semibold shadow-sm">
//                         {discountPercent}% OFF
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Name */}
//                 <h3 className="text-sm sm:text-base font-semibold mb-1 line-clamp-2 text-slate-900">
//                   {product.name}
//                 </h3>

//                 {/* Tags row */}
//                 <div className="text-[11px] text-slate-600 mb-2 flex flex-wrap gap-1.5">
//                   {product.category && (
//                     <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
//                       {product.category}
//                     </span>
//                   )}
//                   {product.displayQuantity && (
//                     <span className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-100">
//                       {product.displayQuantity}
//                     </span>
//                   )}
//                   {product.brand && (
//                     <span className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-100">
//                       {product.brand}
//                     </span>
//                   )}
//                 </div>

//                 {/* Price */}
//                 <div className="flex items-baseline mb-2">
//                   <span className="text-lg font-bold text-emerald-600">
//                    ₹{(Number(effectivePrice) || 0).toLocaleString()}

//                   </span>
//                   {hasDiscount && (
//                     <span className="ml-2 text-xs text-slate-400 line-through">
//                     ₹{(Number(product.price) || 0).toLocaleString()}

//                     </span>
//                   )}
//                 </div>

//                 {/* SKU / Stock */}
//                 <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-4">
//                   <div>
//                     <span className="font-medium text-slate-700">SKU:</span>{' '}
//                     {product.sku}
//                   </div>
//                   <div>
//                     <span className="font-medium text-slate-700">Stock:</span>{' '}
//                     <span
//                       className={`font-semibold ${
//                         product.stock <= 0
//                           ? 'text-rose-600'
//                           : product.stock <= 5
//                           ? 'text-amber-600'
//                           : 'text-emerald-600'
//                       }`}
//                     >
//                       {product.stock}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Actions */}
//                 <div className="mt-auto flex space-x-2">
//                   <Link
//                     to={`/admin/products/${product._id}`}
//                     className="flex-1 btn btn-secondary text-xs sm:text-sm flex items-center justify-center"
//                   >
//                     <Edit size={14} className="mr-1" />
//                     Edit
//                   </Link>
//                   <button
//                     onClick={() =>
//                       handleToggleActive(product._id, product.isActive)
//                     }
//                     className="btn btn-secondary text-xs sm:text-sm"
//                     title={product.isActive ? 'Deactivate' : 'Activate'}
//                   >
//                     {product.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
//                   </button>
//                   <button
//                     onClick={() => handleDelete(product._id)}
//                     className="btn btn-danger text-xs sm:text-sm"
//                     title="Delete"
//                   >
//                     <Trash2 size={14} />
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* Pagination */}
//       {pagination.totalPages > 1 && (
//         <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs sm:text-sm text-slate-600">
//           <div>
//             Page{' '}
//             <span className="font-semibold text-slate-900">
//               {pagination.currentPage}
//             </span>{' '}
//             of{' '}
//             <span className="font-semibold text-slate-900">
//               {pagination.totalPages}
//             </span>
//           </div>
//           <div className="flex space-x-2">
//             <button
//               onClick={() =>
//                 setPagination((prev) => ({
//                   ...prev,
//                   currentPage: prev.currentPage - 1,
//                 }))
//               }
//               disabled={pagination.currentPage === 1}
//               className="btn btn-secondary text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>
//             <button
//               onClick={() =>
//                 setPagination((prev) => ({
//                   ...prev,
//                   currentPage: prev.currentPage + 1,
//                 }))
//               }
//               disabled={pagination.currentPage === pagination.totalPages}
//               className="btn btn-secondary text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminProducts;
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Leaf,
  Star,
  Package,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Filter,
  X,
  Layers,

  TrendingDown,
  Box,
} from 'lucide-react';

// Adjust this path if your assets folder is in a different place
import adminProductsBanner from '../../assets/adminproducts.webp';

// -------------------------
// Helper Functions
// -------------------------

/**
 * Get default variant from product
 */
const getDefaultVariant = (product) => {
  if (!product?.variants || product.variants.length === 0) return null;
  return (
    product.variants.find((v) => v.isDefault && v.isActive) ||
    product.variants.find((v) => v.isActive) ||
    product.variants[0]
  );
};

/**
 * Calculate total stock across all active variants
 */
const getTotalStock = (product) => {
  if (!product?.variants || product.variants.length === 0) return 0;
  return product.variants
    .filter((v) => v.isActive)
    .reduce((sum, v) => sum + (v.stock || 0), 0);
};

/**
 * Get price range from variants
 */
const getPriceRange = (product) => {
  if (!product?.variants || product.variants.length === 0) {
    return { min: 0, max: 0, hasRange: false };
  }

  const prices = product.variants
    .filter((v) => v.isActive)
    .map((v) => v.discountPrice || v.price)
    .filter((p) => typeof p === 'number' && !isNaN(p));

  if (prices.length === 0) return { min: 0, max: 0, hasRange: false };

  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return { min, max, hasRange: min !== max };
};

/**
 * Get maximum discount percentage across variants
 */
const getMaxDiscount = (product) => {
  if (!product?.variants || product.variants.length === 0) return 0;

  const discounts = product.variants
    .filter((v) => v.isActive && v.discountPrice && v.discountPrice < v.price)
    .map((v) => Math.round(((v.price - v.discountPrice) / v.price) * 100));

  return discounts.length > 0 ? Math.max(...discounts) : 0;
};

/**
 * Check if any variant is low on stock
 */
const hasLowStock = (product, threshold = 10) => {
  if (!product?.variants || product.variants.length === 0) return false;
  return product.variants.some(
    (v) => v.isActive && v.stock > 0 && v.stock <= (v.lowStockThreshold || threshold)
  );
};

/**
 * Check if all variants are out of stock
 */
const isOutOfStock = (product) => {
  if (!product?.variants || product.variants.length === 0) return true;
  const activeVariants = product.variants.filter((v) => v.isActive);
  if (activeVariants.length === 0) return true;
  return activeVariants.every((v) => v.stock <= 0);
};

/**
 * Get active variants count
 */
const getActiveVariantsCount = (product) => {
  if (!product?.variants) return 0;
  return product.variants.filter((v) => v.isActive).length;
};

/**
 * Format price for display
 */
const formatPrice = (price) => {
  return `₹${(Number(price) || 0).toLocaleString('en-IN')}`;
};

// -------------------------
// Subcomponents
// -------------------------

// Product Card Component
const ProductCard = ({ product, onToggleActive, onDelete }) => {
  const [showVariants, setShowVariants] = useState(false);

  const defaultVariant = getDefaultVariant(product);
  const totalStock = getTotalStock(product);
  const priceRange = getPriceRange(product);
  const maxDiscount = getMaxDiscount(product);
  const outOfStock = isOutOfStock(product);
  const lowStock = hasLowStock(product);
  const activeVariantsCount = getActiveVariantsCount(product);
  const totalVariantsCount = product.variants?.length || 0;

  // Get primary image
  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    defaultVariant?.images?.[0]?.url;

  return (
    <div className="rounded-2xl border border-emerald-50 bg-white/90 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-4 flex flex-col">
      {/* Image Section */}
      <div className="relative h-40 bg-slate-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 text-xs">
            <Package className="mb-1" size={24} />
            No image
          </div>
        )}

        {/* Status badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          <span
            className={`px-2 py-0.5 text-[11px] rounded-full font-medium ${
              product.isActive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}
          >
            {product.isActive ? 'Active' : 'Inactive'}
          </span>

          {product.isOrganic && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Leaf size={12} />
              Organic
            </span>
          )}

          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              <Star size={12} />
              Featured
            </span>
          )}

          {outOfStock && (
            <span className="px-2 py-0.5 text-[11px] rounded-full bg-rose-50 text-rose-700 border border-rose-100">
              Out of Stock
            </span>
          )}

          {!outOfStock && lowStock && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              <AlertTriangle size={10} />
              Low Stock
            </span>
          )}

          {maxDiscount > 0 && (
            <span className="px-2 py-0.5 text-[11px] rounded-full bg-emerald-600 text-white font-semibold shadow-sm">
              {maxDiscount}% OFF
            </span>
          )}
        </div>

        {/* Variants count badge */}
        <div className="absolute bottom-2 left-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full bg-slate-900/70 text-white font-medium backdrop-blur-sm">
            <Layers size={10} />
            {activeVariantsCount}/{totalVariantsCount} variants
          </span>
        </div>
      </div>

      {/* Product Name */}
      <h3 className="text-sm sm:text-base font-semibold mb-1 line-clamp-2 text-slate-900">
        {product.name}
      </h3>

      {/* Tags row */}
      <div className="text-[11px] text-slate-600 mb-2 flex flex-wrap gap-1.5">
        {product.category && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
            {product.category}
          </span>
        )}
        {product.subCategory && (
          <span className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-100">
            {product.subCategory}
          </span>
        )}
        {product.brand && (
          <span className="px-2 py-0.5 rounded-full bg-slate-50 text-slate-700 border border-slate-100">
            {product.brand}
          </span>
        )}
      </div>

      {/* Price Display */}
      <div className="flex items-baseline mb-2">
        {priceRange.hasRange ? (
          <span className="text-lg font-bold text-emerald-600">
            {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
          </span>
        ) : (
          <>
            <span className="text-lg font-bold text-emerald-600">
              {formatPrice(priceRange.min)}
            </span>
            {defaultVariant?.discountPrice &&
              defaultVariant.discountPrice < defaultVariant.price && (
                <span className="ml-2 text-xs text-slate-400 line-through">
                  {formatPrice(defaultVariant.price)}
                </span>
              )}
          </>
        )}
      </div>

      {/* SKU / Stock */}
      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 mb-3">
        <div className="truncate">
          <span className="font-medium text-slate-700">SKU:</span>{' '}
          {product.productSku || defaultVariant?.sku || 'N/A'}
        </div>
        <div>
          <span className="font-medium text-slate-700">Total Stock:</span>{' '}
          <span
            className={`font-semibold ${
              outOfStock
                ? 'text-rose-600'
                : lowStock
                ? 'text-amber-600'
                : 'text-emerald-600'
            }`}
          >
            {totalStock.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Expandable Variants Section */}
      {totalVariantsCount > 0 && (
        <div className="mb-3">
          <button
            onClick={() => setShowVariants(!showVariants)}
            className="w-full flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 py-1.5 px-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <span className="font-medium">
              {showVariants ? 'Hide' : 'Show'} Variants ({totalVariantsCount})
            </span>
            {showVariants ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showVariants && (
            <div className="mt-2 space-y-1.5 max-h-40 overflow-y-auto">
              {product.variants.map((variant, index) => (
                <div
                  key={variant._id || index}
                  className={`flex items-center justify-between text-[11px] p-2 rounded-lg ${
                    variant.isActive
                      ? 'bg-slate-50'
                      : 'bg-slate-100/50 opacity-60'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {variant.isDefault && (
                        <span className="px-1 py-0.5 text-[9px] rounded bg-emerald-100 text-emerald-700 font-medium">
                          DEFAULT
                        </span>
                      )}
                      {!variant.isActive && (
                        <span className="px-1 py-0.5 text-[9px] rounded bg-rose-100 text-rose-700 font-medium">
                          INACTIVE
                        </span>
                      )}
                      <span className="font-medium text-slate-700 truncate">
                        {variant.name || variant.displayQuantity || variant.sku}
                      </span>
                    </div>
                    <div className="text-slate-500 truncate">
                      {variant.displayQuantity || `${variant.quantity} ${variant.unit}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-2">
                    <div className="text-right">
                      <div className="font-semibold text-slate-900">
                        {formatPrice(variant.discountPrice || variant.price)}
                      </div>
                      {variant.discountPrice && variant.discountPrice < variant.price && (
                        <div className="text-slate-400 line-through text-[10px]">
                          {formatPrice(variant.price)}
                        </div>
                      )}
                    </div>
                    <div
                      className={`text-right font-medium min-w-[40px] ${
                        variant.stock <= 0
                          ? 'text-rose-600'
                          : variant.stock <= (variant.lowStockThreshold || 10)
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {variant.stock}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-auto flex space-x-2">
        <Link
          to={`/admin/products/${product._id}`}
          className="flex-1 btn btn-secondary text-xs sm:text-sm flex items-center justify-center"
        >
          <Edit size={14} className="mr-1" />
          Edit
        </Link>
        <button
          onClick={() => onToggleActive(product._id, product.isActive)}
          className="btn btn-secondary text-xs sm:text-sm"
          title={product.isActive ? 'Deactivate' : 'Activate'}
        >
          {product.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        <button
          onClick={() => onDelete(product._id)}
          className="btn btn-danger text-xs sm:text-sm"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

// Stats Chip Component
const StatChip = ({ icon: Icon, value, label, variant = 'default' }) => {
  const variants = {
    default: 'border-emerald-400/30',
    success: 'border-emerald-400/30',
    warning: 'border-amber-400/30',
    danger: 'border-rose-400/40',
  };

  const dotColors = {
    default: 'bg-emerald-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-slate-900/60 border ${variants[variant]} px-3 py-1`}
    >
      {Icon ? (
        <Icon className="w-3 h-3" />
      ) : (
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      <span className="font-semibold">{value}</span>
      <span className="text-emerald-50/80">{label}</span>
    </span>
  );
};

// Filter Badge Component
const FilterBadge = ({ label, onClear }) => (
  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
    {label}
    <button
      onClick={onClear}
      className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
    >
      <X size={12} />
    </button>
  </span>
);

// -------------------------
// Main Component
// -------------------------
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Default isActive is "all" so admin sees both Active + Inactive by default
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    isActive: 'all',
    isOrganic: '',
    isFeatured: '',
    inStock: '',
    sort: 'newest',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Debounced search
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        handleFilterChange('search', searchInput);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.currentPage]);

  const fetchProducts = async () => {
    if (!refreshing) setLoading(true);

    try {
      // Build params, but don't send fields with "all" or empty values
      const filteredEntries = Object.entries(filters).filter(([key, value]) => {
        if (value === '' || value === 'all') return false;
        return true;
      });

      const params = {
        page: pagination.currentPage,
        limit: 20,
        ...Object.fromEntries(filteredEntries),
      };

      const res = await api.get('/products', { params });

      // Handle both old and new API response formats
      const data = res.data.data || res.data;
      const productsData = data.products || [];
      const paginationData = data.pagination || {};

      setProducts(productsData);
      setPagination({
        currentPage: paginationData.currentPage || Number(res.data.currentPage) || 1,
        totalPages: paginationData.totalPages || res.data.totalPages || 1,
        totalProducts: paginationData.totalProducts || res.data.totalProducts || 0,
        hasNextPage: paginationData.hasNextPage || false,
        hasPrevPage: paginationData.hasPrevPage || false,
      });
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const handleToggleActive = async (productId, currentStatus) => {
    try {
      await api.patch(`/products/${productId}/toggle-status`);
      toast.success(`Product ${currentStatus ? 'deactivated' : 'activated'}`);
      fetchProducts();
    } catch (error) {
      console.error(error);
      // Fallback to PUT method if PATCH doesn't exist
      try {
        await api.put(`/products/${productId}`, { isActive: !currentStatus });
        toast.success(`Product ${currentStatus ? 'deactivated' : 'activated'}`);
        fetchProducts();
      } catch (fallbackError) {
        console.error(fallbackError);
        toast.error('Failed to update product status');
      }
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product');
    }
  };

  const handleFilterChange = (name, value) => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setSearchInput('');
    setFilters({
      search: '',
      category: '',
      isActive: 'all',
      isOrganic: '',
      isFeatured: '',
      inStock: '',
      sort: 'newest',
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Calculate stats from current page
  const stats = useMemo(() => {
    const activeCount = products.filter((p) => p.isActive).length;
    const organicCount = products.filter((p) => p.isOrganic).length;
    const featuredCount = products.filter((p) => p.isFeatured).length;

    // Calculate stock stats from variants
    const lowStockCount = products.filter((p) => {
      const total = getTotalStock(p);
      return total > 0 && hasLowStock(p);
    }).length;

    const outOfStockCount = products.filter((p) => isOutOfStock(p)).length;

    const totalVariants = products.reduce(
      (sum, p) => sum + (p.variants?.length || 0),
      0
    );

    return {
      activeCount,
      organicCount,
      featuredCount,
      lowStockCount,
      outOfStockCount,
      totalVariants,
    };
  }, [products]);

  // Active filters count
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sort') return false;
    if (key === 'isActive') return value !== 'all';
    return value !== '';
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Hero / Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-100/60 bg-slate-950 text-white shadow-lg">
        {/* Background image + gradient overlay */}
        <div className="absolute inset-0">
          <img
            src={adminProductsBanner}
            alt="Products overview"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-emerald-900/70" />
        </div>

        <div className="relative px-6 sm:px-8 py-6 sm:py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: Title + description */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-400/50 px-3 py-1 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-100">
                Catalogue Control Center
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
              Products Dashboard
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-emerald-50/80 max-w-xl">
              Manage Vemapri&apos;s grocery &amp; staples catalogue, variants, pricing,
              visibility and inventory from a single, streamlined interface.
            </p>

            {/* Stats chips */}
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] sm:text-xs">
              <StatChip
                value={(pagination.totalProducts ?? 0).toLocaleString()}
                label="total products"
                variant="success"
              />

              <StatChip
                icon={Eye}
                value={stats.activeCount}
                label="active"
                variant="default"
              />

              <StatChip
                icon={Layers}
                value={stats.totalVariants}
                label="variants"
                variant="default"
              />

              <StatChip
                icon={Leaf}
                value={stats.organicCount}
                label="organic"
                variant="default"
              />

              {stats.lowStockCount > 0 && (
                <StatChip
                  icon={TrendingDown}
                  value={stats.lowStockCount}
                  label="low stock"
                  variant="warning"
                />
              )}

              {stats.outOfStockCount > 0 && (
                <StatChip
                  icon={Box}
                  value={stats.outOfStockCount}
                  label="out of stock"
                  variant="danger"
                />
              )}
            </div>
          </div>

          {/* Right: Primary action + loader */}
          <div className="flex flex-col items-end gap-2">
            {(loading || refreshing) && (
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-emerald-50/80">
                <span className="h-3 w-3 rounded-full border border-emerald-200/70 border-t-transparent animate-spin" />
                <span>{refreshing ? 'Refreshing…' : 'Loading products…'}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={loading || refreshing}
                className="inline-flex items-center rounded-full bg-slate-800 px-4 py-2 text-xs sm:text-sm font-medium text-slate-200 shadow hover:bg-slate-700 transition-all disabled:opacity-50"
                title="Refresh products"
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              </button>

              <Link
                to="/admin/products/new"
                className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-50 shadow-md hover:bg-slate-800 hover:shadow-lg transition-all"
              >
                <Plus size={16} className="mr-2" />
                Add New Product
              </Link>
            </div>

            <p className="text-[11px] text-emerald-50/80">
              Keep adding fresh SKUs with multiple variants.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white/95 border border-emerald-100/80 shadow-sm overflow-hidden">
        {/* Filter Header */}
        <div className="flex flex-wrap items-center justify-between p-4 sm:p-5 border-b border-emerald-50">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Filter size={16} />
            </span>
            <span>Filter products</span>
            {activeFiltersCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
                {activeFiltersCount}
              </span>
            )}
            {showFilters ? (
              <ChevronUp size={16} className="text-slate-400" />
            ) : (
              <ChevronDown size={16} className="text-slate-400" />
            )}
          </button>

          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <div className="hidden sm:flex flex-wrap gap-1.5 mr-2">
                {filters.category && (
                  <FilterBadge
                    label={filters.category}
                    onClear={() => handleFilterChange('category', '')}
                  />
                )}
                {filters.isActive !== 'all' && (
                  <FilterBadge
                    label={filters.isActive === 'true' ? 'Active' : 'Inactive'}
                    onClear={() => handleFilterChange('isActive', 'all')}
                  />
                )}
                {filters.isOrganic && (
                  <FilterBadge
                    label={filters.isOrganic === 'true' ? 'Organic' : 'Non-Organic'}
                    onClear={() => handleFilterChange('isOrganic', '')}
                  />
                )}
                {filters.isFeatured && (
                  <FilterBadge
                    label="Featured"
                    onClear={() => handleFilterChange('isFeatured', '')}
                  />
                )}
                {filters.inStock && (
                  <FilterBadge
                    label="In Stock"
                    onClear={() => handleFilterChange('inStock', '')}
                  />
                )}
              </div>
            )}

            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50/70 hover:bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-100 transition-all"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Filter Fields */}
        {showFilters && (
          <div className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Search */}
              <div className="relative sm:col-span-2 lg:col-span-1">
                <input
                  type="text"
                  placeholder="Search by name, brand, SKU..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="input pl-9 text-sm w-full"
                />
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Category */}
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input text-sm"
              >
                <option value="">All Categories</option>
                <option value="Pulses & Grains">Pulses &amp; Grains</option>
                <option value="Spices & Masalas">Spices &amp; Masalas</option>
                <option value="Nuts & Seeds">Nuts &amp; Seeds</option>
                <option value="Health & Organic Foods">Health &amp; Organic Foods</option>
              </select>

              {/* Status */}
              <select
                value={filters.isActive}
                onChange={(e) => handleFilterChange('isActive', e.target.value)}
                className="input text-sm"
              >
                <option value="all">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>

              {/* Organic filter */}
              <select
                value={filters.isOrganic}
                onChange={(e) => handleFilterChange('isOrganic', e.target.value)}
                className="input text-sm"
              >
                <option value="">All Types</option>
                <option value="true">Organic</option>
                <option value="false">Non-Organic</option>
              </select>
            </div>

            {/* Second row of filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Featured filter */}
              <select
                value={filters.isFeatured}
                onChange={(e) => handleFilterChange('isFeatured', e.target.value)}
                className="input text-sm"
              >
                <option value="">All Products</option>
                <option value="true">Featured Only</option>
              </select>

              {/* In Stock filter */}
              <select
                value={filters.inStock}
                onChange={(e) => handleFilterChange('inStock', e.target.value)}
                className="input text-sm"
              >
                <option value="">All Stock Levels</option>
                <option value="true">In Stock Only</option>
              </select>

              {/* Sort */}
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="input text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popularity">Most Popular</option>
              </select>

              {/* Results count */}
              <div className="flex items-center justify-end text-xs text-slate-500">
                Showing{' '}
                <span className="font-semibold text-slate-700 mx-1">
                  {products.length}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-700 mx-1">
                  {pagination.totalProducts}
                </span>{' '}
                products
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {loading && !refreshing ? (
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-emerald-50 bg-white/80 shadow-sm animate-pulse p-4"
            >
              <div className="h-40 bg-slate-100 rounded-xl mb-4" />
              <div className="h-4 bg-slate-100 rounded mb-2" />
              <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
              <div className="flex gap-2">
                <div className="h-8 bg-slate-100 rounded flex-1" />
                <div className="h-8 bg-slate-100 rounded w-10" />
                <div className="h-8 bg-slate-100 rounded w-10" />
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full">
            <div className="text-center py-16 px-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
                <Package size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                No products found
              </h3>
              <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                {activeFiltersCount > 0
                  ? 'Try adjusting your filters to see more results.'
                  : 'Start by adding your first product to the catalogue.'}
              </p>
              {activeFiltersCount > 0 ? (
                <button
                  onClick={clearFilters}
                  className="btn btn-secondary text-sm"
                >
                  Clear all filters
                </button>
              ) : (
                <Link to="/admin/products/new" className="btn btn-primary text-sm">
                  <Plus size={16} className="mr-2" />
                  Add First Product
                </Link>
              )}
            </div>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 rounded-xl border border-emerald-50 p-4">
          <div className="text-xs sm:text-sm text-slate-600">
            Page{' '}
            <span className="font-semibold text-slate-900">
              {pagination.currentPage}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-900">
              {pagination.totalPages}
            </span>
            <span className="hidden sm:inline text-slate-400 ml-2">
              ({pagination.totalProducts} total products)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* First page */}
            <button
              onClick={() =>
                setPagination((prev) => ({ ...prev, currentPage: 1 }))
              }
              disabled={pagination.currentPage === 1}
              className="btn btn-secondary text-xs sm:text-sm px-3 disabled:opacity-50 disabled:cursor-not-allowed"
              title="First page"
            >
              ««
            </button>

            {/* Previous */}
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }))
              }
              disabled={pagination.currentPage === 1}
              className="btn btn-secondary text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page numbers (show max 5) */}
            <div className="hidden sm:flex items-center space-x-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, currentPage: pageNum }))
                    }
                    className={`h-8 w-8 rounded-lg text-xs font-medium transition-colors ${
                      pageNum === pagination.currentPage
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next */}
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }))
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className="btn btn-secondary text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>

            {/* Last page */}
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: pagination.totalPages,
                }))
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className="btn btn-secondary text-xs sm:text-sm px-3 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Last page"
            >
              »»
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;