// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ShoppingCart, Star } from 'lucide-react';
// import { useCart } from '../context/CartContext';
// import toast from 'react-hot-toast';

// const ProductCard = ({ product }) => {
//   const { addToCart } = useCart();

//   const handleAddToCart = (e) => {
//     e.preventDefault(); // prevent Link navigation when clicking button

//     if (product.stock <= 0) {
//       toast.error('Product is out of stock');
//       return;
//     }

//     addToCart(product);
//     toast.success('Added to cart!');
//   };

//   const displayPrice = product.discountPrice || product.price;
//   const hasDiscount =
//     product.discountPrice && product.discountPrice < product.price;
//   const isOutOfStock = product.stock <= 0;
//   const isLowStock = product.stock > 0 && product.stock <= 5;

//   const hasRatings = product.ratings?.average && product.ratings?.count > 0;

//   const discountPercent = hasDiscount
//     ? Math.round(
//         ((product.price - product.discountPrice) / product.price) * 100
//       )
//     : null;

//   return (
//     <Link to={`/products/${product._id}`} className="group block h-full">
//       <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-emerald-200 group-hover:shadow-lg">
//         {/* Image */}
//         <div className="relative bg-emerald-50/60">
//           <div className="aspect-[4/3] w-full overflow-hidden">
//             {product.images && product.images[0] && (
//               <img
//                 src={product.images[0].url}
//                 alt={product.name}
//                 className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
//                   isOutOfStock ? 'opacity-60' : ''
//                 }`}
//               />
//             )}
//           </div>

//           {/* Top badges */}
//           <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 via-black/10 to-transparent" />

//           <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
//             {product.category && (
//               <span className="inline-flex items-center rounded-full bg-emerald-900/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-50 shadow-sm backdrop-blur">
//                 {product.category}
//               </span>
//             )}

//             {product.isOrganic && (
//               <span className="inline-flex items-center rounded-full bg-emerald-50/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700 ring-1 ring-emerald-100 backdrop-blur">
//                 100% Organic
//               </span>
//             )}
//           </div>

//           <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
//             {hasDiscount && !isOutOfStock && (
//               <div className="rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
//                 {discountPercent}% OFF
//               </div>
//             )}

//             {product.isBestSeller && !isOutOfStock && (
//               <div className="rounded-full bg-emerald-600/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
//                 Best Seller
//               </div>
//             )}

//             {isLowStock && !isOutOfStock && (
//               <div className="rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
//                 Only {product.stock} left
//               </div>
//             )}

//             {isOutOfStock && (
//               <div className="rounded-full bg-slate-900/90 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
//                 Sold Out
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex flex-1 flex-col p-4">
//           {/* Name */}
//           <h3 className="mb-1.5 line-clamp-2 text-base font-semibold text-slate-900">
//             {product.name}
//           </h3>

//           {/* Meta (brand / weight) */}
//           {(product.brand || product.weight || product.unit) && (
//             <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500">
//               {product.brand && (
//                 <span className="rounded-full bg-slate-100 px-2 py-0.5">
//                   {product.brand}
//                 </span>
//               )}
//               {(product.weight || product.unit) && (
//                 <span className="rounded-full bg-slate-50 px-2 py-0.5">
//                   {product.weight} {product.unit}
//                 </span>
//               )}
//             </div>
//           )}

//           {/* Description */}
//           {product.description && (
//             <p className="mb-3 line-clamp-2 text-xs text-slate-600">
//               {product.description}
//             </p>
//           )}

//           {/* Rating */}
//           <div className="mb-3 flex items-center">
//             {hasRatings ? (
//               <>
//                 <div className="flex items-center">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       size={14}
//                       className={
//                         i < Math.round(product.ratings.average)
//                           ? 'text-amber-400 fill-current'
//                           : 'text-slate-200'
//                       }
//                     />
//                   ))}
//                 </div>
//                 <span className="ml-2 text-[11px] text-slate-500">
//                   {product.ratings.average.toFixed(1)} ·{' '}
//                   {product.ratings.count} review
//                   {product.ratings.count > 1 ? 's' : ''}
//                 </span>
//               </>
//             ) : (
//               <span className="text-[11px] text-slate-400">
//                 No ratings yet
//               </span>
//             )}
//           </div>

//           {/* Stock Info */}
//           <div className="mb-3">
//             {isOutOfStock ? (
//               <p className="text-[12px] font-semibold text-red-600">
//                 Out of stock
//               </p>
//             ) : isLowStock ? (
//               <p className="text-[12px] font-semibold text-orange-600">
//                 Only {product.stock} items left – order soon!
//               </p>
//             ) : (
//               <p className="text-[12px] font-semibold text-emerald-600">
//                 In stock · {product.stock} available
//               </p>
//             )}
//           </div>

//           {/* Price row */}
//           <div className="mb-4 flex items-end justify-between">
//             <div>
//               <span className="text-xl font-bold text-emerald-700">
//                 ₹{displayPrice.toLocaleString()}
//               </span>
//               {hasDiscount && (
//                 <span className="ml-2 text-xs text-slate-400 line-through">
//                   ₹{product.price.toLocaleString()}
//                 </span>
//               )}

//               {(product.weight || product.unit) && (
//                 <div className="mt-0.5 text-[11px] text-slate-500">
//                   {product.weight && product.unit
//                     ? `₹${(displayPrice / product.weight).toFixed(2)} / ${
//                         product.unit
//                       }`
//                     : null}
//                 </div>
//               )}
//             </div>

//             {hasDiscount && (
//               <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
//                 You save ₹
//                 {(product.price - product.discountPrice).toLocaleString()}
//               </span>
//             )}
//           </div>

//           {/* Add to Cart Button */}
//           <button
//             onClick={handleAddToCart}
//             disabled={isOutOfStock}
//             className={`mt-auto inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
//               isOutOfStock
//                 ? 'cursor-not-allowed bg-slate-100 text-slate-400'
//                 : 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 text-white shadow-sm hover:shadow-md hover:from-emerald-700 hover:via-emerald-600 hover:to-lime-500'
//             }`}
//           >
//             <ShoppingCart size={18} className="mr-2" />
//             {isOutOfStock ? 'Out of stock' : 'Add to cart'}
//           </button>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default ProductCard;
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { ShoppingCart, Star } from 'lucide-react';
// import { useCart } from '../context/CartContext';
// import toast from 'react-hot-toast';

// const ProductCard = ({ product }) => {
//   const { addToCart, cartItems } = useCart();

//   // 🔥 Pick default variant (or first)
//   const variants = product.variants || [];
//   const selectedVariant =
//     variants.find((v) => v.isDefault) || variants[0] || null;

//   // If no variant found, fall back to old fields (for safety / old data)
//   const stock = selectedVariant ? selectedVariant.stock : product.stock || 0;

//   const displayPrice = selectedVariant
//     ? selectedVariant.discountPrice || selectedVariant.price
//     : product.discountPrice || product.price;

//   const basePrice = selectedVariant
//     ? selectedVariant.price
//     : product.price;

//   const hasDiscount =
//     selectedVariant
//       ? selectedVariant.discountPrice &&
//         selectedVariant.discountPrice < selectedVariant.price
//       : product.discountPrice && product.discountPrice < product.price;

//   const discountPercent =
//     hasDiscount && basePrice
//       ? Math.round(((basePrice - displayPrice) / basePrice) * 100)
//       : null;

//   const hasRatings = product.ratings?.average && product.ratings?.count > 0;

//   // 🛒 Cart: differentiate by product + variant
//   const existingItem = cartItems?.find(
//     (item) =>
//       item.product._id === product._id &&
//       (selectedVariant ? item.variantId === selectedVariant._id : true)
//   );
//   const currentQtyInCart = existingItem ? existingItem.quantity : 0;

//   const isOutOfStock = !stock || stock <= 0;
//   const isAtStockLimit = currentQtyInCart >= stock;
//   const isLowStock = stock > 0 && stock <= 5;

//   const handleAddToCart = (e) => {
//     e.preventDefault(); // prevent navigation

//     if (isOutOfStock) {
//       toast.error('Product is out of stock');
//       return;
//     }

//     if (isAtStockLimit) {
//       toast.error(
//         `You already added the maximum available quantity (${stock}).`
//       );
//       return;
//     }

//     // 🔥 IMPORTANT: pass variant info to cart
//     // Adjust this line to match your CartContext API.
//     // Example assumption: addToCart(product, variant)
//     addToCart(product, selectedVariant);

//     toast.success('Added to cart!');
//   };

//   // Variant quantity/unit for display (e.g. "500 g", "1 kg", "500 g x 2")
//   const variantLabel =
//     selectedVariant?.displayQuantity ||
//     (selectedVariant?.quantity && selectedVariant?.unit
//       ? `${selectedVariant.quantity} ${selectedVariant.unit}`
//       : null);

//   // Per-unit price if possible
//   let perUnitText = null;
//   if (
//     selectedVariant &&
//     typeof selectedVariant.quantity === 'number' &&
//     selectedVariant.quantity > 0 &&
//     selectedVariant.unit
//   ) {
//     const perUnit = displayPrice / selectedVariant.quantity;
//     perUnitText = `₹${perUnit.toFixed(2)} / ${selectedVariant.unit}`;
//   }

//   const mainImage =
//     (selectedVariant &&
//       selectedVariant.images &&
//       selectedVariant.images[0]?.url) ||
//     product.images?.[0]?.url ||
//     '';

//   return (
//     <Link to={`/products/${product._id}`} className="group block h-full">
//       <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-gray-300 group-hover:shadow-lg">
//         {/* Image */}
//         <div className="relative bg-gray-50">
//           <div className="aspect-[4/3] w-full overflow-hidden">
//             {mainImage && (
//               <img
//                 src={mainImage}
//                 alt={product.name}
//                 className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
//                   isOutOfStock || isAtStockLimit ? 'opacity-60' : ''
//                 }`}
//               />
//             )}
//           </div>

//           {/* Image gradient */}
//           <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 via-black/15 to-transparent" />

//           {/* Top left badges */}
//           <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
//             {product.category && (
//               <span className="inline-flex items-center rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-sm backdrop-blur">
//                 {product.category}
//               </span>
//             )}

//             {product.isOrganic && (
//               <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-900 ring-1 ring-gray-200 backdrop-blur">
//                 100% Organic
//               </span>
//             )}

//             {variantLabel && (
//               <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
//                 {variantLabel}
//               </span>
//             )}
//           </div>

//           {/* Top right badges */}
//           <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
//             {hasDiscount && !isOutOfStock && (
//               <div className="rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
//                 {discountPercent}% OFF
//               </div>
//             )}

//             {product.isBestSeller && !isOutOfStock && (
//               <div className="rounded-full bg-black/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm">
//                 Best Seller
//               </div>
//             )}

//             {isLowStock && !isOutOfStock && (
//               <div className="rounded-full bg-orange-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
//                 Only {stock} left
//               </div>
//             )}

//             {(isOutOfStock || isAtStockLimit) && (
//               <div className="rounded-full bg-gray-900/90 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
//                 {isOutOfStock ? 'Sold Out' : 'Limit Reached'}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex flex-1 flex-col p-4">
//           {/* Name */}
//           <h3 className="mb-1.5 line-clamp-2 text-base font-semibold text-gray-900">
//             {product.name}
//           </h3>

//           {/* Meta (brand / variant size) */}
//           {(product.brand || variantLabel) && (
//             <div className="mb-2 flex flex-wrap items-center gap-2 text-[11px] font-medium text-gray-500">
//               {product.brand && (
//                 <span className="rounded-full bg-gray-100 px-2 py-0.5">
//                   {product.brand}
//                 </span>
//               )}
//               {variantLabel && (
//                 <span className="rounded-full bg-gray-50 px-2 py-0.5">
//                   {variantLabel}
//                 </span>
//               )}
//             </div>
//           )}

//           {/* Description */}
//           {product.description && (
//             <p className="mb-3 line-clamp-2 text-xs text-gray-600">
//               {product.description}
//             </p>
//           )}

//           {/* Rating */}
//           <div className="mb-3 flex items-center">
//             {hasRatings ? (
//               <>
//                 <div className="flex items-center">
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       size={14}
//                       className={
//                         i < Math.round(product.ratings.average)
//                           ? 'text-yellow-400 fill-current'
//                           : 'text-gray-200'
//                       }
//                     />
//                   ))}
//                 </div>
//                 <span className="ml-2 text-[11px] text-gray-500">
//                   {product.ratings.average.toFixed(1)} ·{' '}
//                   {product.ratings.count} review
//                   {product.ratings.count > 1 ? 's' : ''}
//                 </span>
//               </>
//             ) : (
//               <span className="text-[11px] text-gray-400">No ratings yet</span>
//             )}
//           </div>

//           {/* Stock Info */}
//           <div className="mb-3">
//             {isOutOfStock ? (
//               <p className="text-[12px] font-semibold text-red-600">
//                 Out of stock
//               </p>
//             ) : isAtStockLimit ? (
//               <p className="text-[12px] font-semibold text-orange-600">
//                 You added all available stock ({stock}).
//               </p>
//             ) : isLowStock ? (
//               <p className="text-[12px] font-semibold text-orange-600">
//                 Only {stock} items left – order soon!
//               </p>
//             ) : (
//               <p className="text-[12px] font-semibold text-gray-700">
//                 In stock · {stock} available
//               </p>
//             )}
//           </div>

//           {/* Price row */}
//           <div className="mb-4 flex items-end justify-between">
//             <div>
//               <span className="text-xl font-semibold text-gray-900">
//                 ₹{displayPrice.toLocaleString()}
//               </span>
//               {hasDiscount && basePrice && (
//                 <span className="ml-2 text-xs text-gray-400 line-through">
//                   ₹{basePrice.toLocaleString()}
//                 </span>
//               )}

//               {perUnitText && (
//                 <div className="mt-0.5 text-[11px] text-gray-500">
//                   {perUnitText}
//                 </div>
//               )}
//             </div>

//             {hasDiscount && basePrice && (
//               <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-semibold text-gray-800">
//                 You save ₹{(basePrice - displayPrice).toLocaleString()}
//               </span>
//             )}
//           </div>

//           {/* Add to Cart Button */}
//           <button
//             onClick={handleAddToCart}
//             disabled={isOutOfStock || isAtStockLimit || !selectedVariant}
//             className={`mt-auto inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
//               isOutOfStock || isAtStockLimit || !selectedVariant
//                 ? 'cursor-not-allowed bg-gray-100 text-gray-400'
//                 : 'bg-gray-900 text-white shadow-sm hover:bg-black hover:shadow-md'
//             }`}
//           >
//             <ShoppingCart size={18} className="mr-2" />
//             {isOutOfStock
//               ? 'Out of stock'
//               : isAtStockLimit
//               ? 'Max quantity in cart'
//               : !selectedVariant
//               ? 'Variant not available'
//               : 'Add to cart'}
//           </button>
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default ProductCard;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Eye, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  // Variant logic
  const variants = product.variants || [];
  const selectedVariant = variants.find((v) => v.isDefault) || variants[0] || null;
  const stock = selectedVariant ? selectedVariant.stock : product.stock || 0;
  const displayPrice = selectedVariant
    ? selectedVariant.discountPrice || selectedVariant.price
    : product.discountPrice || product.price;
  const basePrice = selectedVariant ? selectedVariant.price : product.price;
  const hasDiscount = selectedVariant
    ? selectedVariant.discountPrice && selectedVariant.discountPrice < selectedVariant.price
    : product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount && basePrice
    ? Math.round(((basePrice - displayPrice) / basePrice) * 100)
    : null;

  const hasRatings = product.ratings?.average && product.ratings?.count > 0;
  const existingItem = cartItems?.find(
    (item) => item.product._id === product._id &&
      (selectedVariant ? item.variantId === selectedVariant._id : true)
  );
  const currentQtyInCart = existingItem ? existingItem.quantity : 0;
  const isOutOfStock = !stock || stock <= 0;
  const isAtStockLimit = currentQtyInCart >= stock;
  const isLowStock = stock > 0 && stock <= 5;

  const variantLabel = selectedVariant?.displayQuantity ||
    (selectedVariant?.quantity && selectedVariant?.unit
      ? `${selectedVariant.quantity} ${selectedVariant.unit}`
      : null);

  const mainImage = (selectedVariant?.images?.[0]?.url) || product.images?.[0]?.url || '';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || isAtStockLimit) return;
    addToCart(product, selectedVariant);
    toast.success('Added to cart!', {
      icon: '🛒',
      style: {
        borderRadius: '12px',
        background: '#1e293b',
        color: '#fff',
      },
    });
  };

  return (
    <Link 
      to={`/products/${product._id}`} 
      className="group block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full flex flex-col bg-white rounded-3xl border-2 border-transparent hover:border-amber-200 overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-amber-100/50">
        
        {/* Animated Border Gradient */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
        <div className="absolute inset-[2px] bg-white rounded-[22px] -z-10" />

        {/* Image Section */}
        <div className="relative overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-amber-50 to-orange-50 p-6">
            {mainImage && (
              <img
                src={mainImage}
                alt={product.name}
                className={`w-full h-full object-contain transition-all duration-700 ${
                  isHovered ? 'scale-110 rotate-2' : 'scale-100 rotate-0'
                } ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
              />
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {hasDiscount && (
              <div className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
                {discountPercent}% OFF
              </div>
            )}
            {product.isBestSeller && (
              <div className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                ⭐ Best Seller
              </div>
            )}
            {variantLabel && (
              <div className="px-3 py-1.5 bg-white text-slate-700 text-xs font-bold rounded-full shadow-lg border">
                {variantLabel}
              </div>
            )}
          </div>

          {/* Side Actions */}
          <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}>
            <button
              onClick={(e) => {
                e.preventDefault();
                toast.success('Added to wishlist');
              }}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-colors"
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => e.preventDefault()}
              className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 transition-colors"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>

          {/* Stock Warning */}
          {isLowStock && !isOutOfStock && (
            <div className="absolute bottom-4 left-4 right-4">
              <div className="px-4 py-2 bg-orange-500 text-white text-xs font-bold rounded-full text-center animate-pulse">
                🔥 Only {stock} left - Order soon!
              </div>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <div className="px-6 py-3 bg-slate-900 text-white font-bold rounded-full">
                Sold Out
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-5">
          {/* Category */}
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">
            {product.category}
          </span>

          {/* Name */}
          <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-slate-900 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            {hasRatings ? (
              <>
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="text-sm font-bold text-amber-700">
                    {product.ratings.average.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {product.ratings.count} reviews
                </span>
              </>
            ) : (
              <span className="text-xs text-slate-400 italic">New product</span>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price & Cart */}
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900">
                  ₹{displayPrice?.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{basePrice?.toLocaleString()}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <span className="text-xs text-emerald-600 font-semibold">
                  Save ₹{(basePrice - displayPrice)?.toLocaleString()}
                </span>
              )}
            </div>

            {/* Add to Cart */}
            {currentQtyInCart > 0 ? (
              <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // Remove from cart logic
                  }}
                  className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-slate-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-sm">{currentQtyInCart}</span>
                <button
                  onClick={handleAddToCart}
                  disabled={isAtStockLimit}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                    isAtStockLimit 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-amber-500 text-white hover:bg-amber-600'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                  isOutOfStock
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white hover:shadow-xl hover:scale-110'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;