// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../utils/api';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import toast from 'react-hot-toast';
// import {
//   ShoppingCart,
//   Heart,
//   Star,
//   Truck,
//   Shield,
//   RotateCcw,
//   ChevronLeft,
//   ChevronRight,
//   Leaf,
//   Info,
//   ArrowLeft,
// } from 'lucide-react';

// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { addToCart } = useCart();
//   const { user } = useAuth();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [review, setReview] = useState({ rating: 5, comment: '' });
//   const [showReviewForm, setShowReviewForm] = useState(false);

//   useEffect(() => {
//     fetchProduct();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const fetchProduct = async () => {
//     try {
//       const res = await api.get(`/products/${id}`);
//       setProduct(res.data);
//     } catch (error) {
//       console.error('Error fetching product:', error);
//       toast.error('Failed to load product');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = () => {
//     if (product.stock < quantity) {
//       toast.error('Not enough stock available');
//       return;
//     }
//     addToCart(product, quantity);
//     toast.success('Added to cart!');
//   };

//   const handleBuyNow = () => {
//     if (product.stock < quantity) {
//       toast.error('Not enough stock available');
//       return;
//     }
//     addToCart(product, quantity);
//     navigate('/checkout');
//   };

//   const handleSubmitReview = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       toast.error('Please login to submit a review');
//       navigate('/login');
//       return;
//     }

//     try {
//       await api.post(`/products/${id}/review`, review);
//       toast.success('Review submitted successfully');
//       setShowReviewForm(false);
//       setReview({ rating: 5, comment: '' });
//       fetchProduct();
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to submit review');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-[60vh] bg-slate-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="animate-pulse">
//             <div className="mb-6 h-6 w-40 rounded bg-slate-200" />
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="h-96 rounded-3xl bg-slate-200" />
//               <div className="space-y-4">
//                 <div className="h-8 w-3/4 rounded bg-slate-200" />
//                 <div className="h-4 w-1/2 rounded bg-slate-200" />
//                 <div className="h-4 w-2/3 rounded bg-slate-200" />
//                 <div className="h-10 w-1/2 rounded bg-slate-200" />
//                 <div className="h-10 w-full rounded bg-slate-200" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-[40vh] bg-slate-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
//           <p className="text-slate-500">Product not found</p>
//         </div>
//       </div>
//     );
//   }

//   const displayPrice = product.discountPrice || product.price;
//   const hasDiscount =
//     product.discountPrice && product.discountPrice < product.price;
//   const discountPercentage = hasDiscount
//     ? Math.round(
//         ((product.price - product.discountPrice) / product.price) * 100
//       )
//     : 0;

//   const effectiveDisplayQuantity =
//     product.displayQuantity ||
//     (product.quantity && product.unit
//       ? `${product.quantity} ${product.unit}`
//       : '');

//   const hasRatings = product.ratings?.average && product.ratings?.count > 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/20 to-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
//         {/* Top bar / breadcrumb */}
//         <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
//           <button
//             onClick={() => navigate(-1)}
//             className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
//           >
//             <ArrowLeft size={16} />
//             Back
//           </button>

//           <div className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
//             <button
//               onClick={() => navigate('/products')}
//               className="hover:text-emerald-600"
//             >
//               Products
//             </button>
//             <span>/</span>
//             {product.category && (
//               <>
//                 <span className="capitalize hover:text-emerald-600">
//                   {product.category}
//                 </span>
//                 <span>/</span>
//               </>
//             )}
//             <span className="text-slate-700 line-clamp-1 max-w-[220px] sm:max-w-xs">
//               {product.name}
//             </span>
//           </div>
//         </div>

//         {/* Top section: Gallery + Info */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
//           {/* Product Images (sticky on desktop) */}
//           <div className="lg:sticky lg:top-24 self-start">
//             <div className="relative mb-4 overflow-hidden rounded-3xl border border-emerald-50 bg-white shadow-sm">
//               {product.images && product.images.length > 0 ? (
//                 <img
//                   src={product.images[selectedImage]?.url}
//                   alt={product.name}
//                   className="h-[360px] w-full object-contain bg-slate-50"
//                 />
//               ) : (
//                 <div className="flex h-[360px] w-full items-center justify-center bg-slate-50">
//                   <span className="text-slate-400 text-sm">
//                     No image available
//                   </span>
//                 </div>
//               )}

//               {/* Badges */}
//               <div className="absolute top-4 left-4 flex flex-wrap gap-2">
//                 {product.category && (
//                   <span className="inline-flex items-center rounded-full bg-emerald-900/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-50 shadow-sm">
//                     {product.category}
//                   </span>
//                 )}
//                 {effectiveDisplayQuantity && (
//                   <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-800 ring-1 ring-emerald-100">
//                     Pack: {effectiveDisplayQuantity}
//                   </span>
//                 )}
//                 {product.isOrganic && (
//                   <span className="inline-flex items-center rounded-full bg-emerald-50/95 px-2.5 py-1 text-[11px] font-medium text-emerald-800 ring-1 ring-emerald-200">
//                     <Leaf size={14} className="mr-1" />
//                     Organic
//                   </span>
//                 )}
//               </div>

//               {hasDiscount && (
//                 <div className="absolute top-4 right-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow">
//                   {discountPercentage}% OFF
//                 </div>
//               )}

//               {/* Carousel controls */}
//               {product.images && product.images.length > 1 && (
//                 <>
//                   <button
//                     onClick={() =>
//                       setSelectedImage(
//                         selectedImage === 0
//                           ? product.images.length - 1
//                           : selectedImage - 1
//                       )
//                     }
//                     className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-slate-50"
//                   >
//                     <ChevronLeft size={20} />
//                   </button>
//                   <button
//                     onClick={() =>
//                       setSelectedImage(
//                         selectedImage === product.images.length - 1
//                           ? 0
//                           : selectedImage + 1
//                       )
//                     }
//                     className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-slate-50"
//                   >
//                     <ChevronRight size={20} />
//                   </button>
//                 </>
//               )}
//             </div>

//             {/* Thumbnail Images */}
//             {product.images && product.images.length > 1 && (
//               <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
//                 {product.images.map((image, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setSelectedImage(index)}
//                     className={`overflow-hidden rounded-2xl bg-white ring-1 ${
//                       selectedImage === index
//                         ? 'ring-emerald-500'
//                         : 'ring-slate-200 hover:ring-emerald-200'
//                     }`}
//                   >
//                     <img
//                       src={image.url}
//                       alt={`${product.name} ${index + 1}`}
//                       className="h-20 w-full object-contain bg-slate-50"
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Product Info */}
//           <div>
//             {/* Category / Brand / Quantity line */}
//             <div className="mb-3 flex flex-wrap items-center gap-2">
//               {product.brand && (
//                 <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">
//                   {product.brand}
//                 </span>
//               )}
//               {effectiveDisplayQuantity && (
//                 <span className="text-xs text-slate-500">
//                   • {effectiveDisplayQuantity}
//                 </span>
//               )}
//               {product.origin && (
//                 <span className="text-xs text-slate-500">
//                   • Origin: {product.origin}
//                 </span>
//               )}
//             </div>

//             <h1 className="mb-3 text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-slate-900">
//               {product.name}
//             </h1>

//             {/* Rating summary */}
//             <div className="mb-4 inline-flex items-center rounded-full bg-slate-50 px-3 py-1.5 text-xs">
//               <div className="flex items-center">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     size={16}
//                     className={
//                       i < Math.round(product.ratings?.average || 0)
//                         ? 'text-amber-400 fill-current'
//                         : 'text-slate-200'
//                     }
//                   />
//                 ))}
//               </div>
//               <span className="ml-2 text-slate-700">
//                 {hasRatings
//                   ? `${product.ratings.average.toFixed(1)} · ${
//                       product.ratings.count
//                     } review${product.ratings.count > 1 ? 's' : ''}`
//                   : 'No ratings yet'}
//               </span>
//             </div>

//             {/* Price block */}
//             <div className="mb-6 rounded-2xl bg-white px-4 py-4 shadow-sm border border-emerald-50">
//               <div className="flex flex-wrap items-end gap-3">
//                 <span className="text-3xl md:text-4xl font-bold text-emerald-700">
//                   ₹{displayPrice.toLocaleString()}
//                 </span>
//                 {hasDiscount && (
//                   <div className="flex flex-col gap-0.5 text-xs sm:text-sm">
//                     <span className="text-slate-400 line-through">
//                       ₹{product.price.toLocaleString()}
//                     </span>
//                     <span className="font-medium text-emerald-600">
//                       You save ₹
//                       {(product.price - product.discountPrice).toLocaleString()}
//                     </span>
//                   </div>
//                 )}
//               </div>
//               <p className="mt-1 text-[11px] text-slate-500">
//                 Inclusive of all taxes
//               </p>
//             </div>

//             {/* Short description */}
//             {product.description && (
//               <div className="mb-6">
//                 <p className="text-sm leading-relaxed text-slate-700">
//                   {product.description}
//                 </p>
//               </div>
//             )}

//             {/* Stock + key facts */}
//             <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
//               {/* Stock */}
//               <div>
//                 {product.stock > 0 ? (
//                   <>
//                     <p className="text-sm font-semibold text-emerald-600 mb-1">
//                       In stock ({product.stock} units available)
//                     </p>
//                     {product.stock <= 5 && (
//                       <p className="text-xs text-orange-600">
//                         ⚠ Only {product.stock} items left — order soon!
//                       </p>
//                     )}
//                   </>
//                 ) : (
//                   <div className="rounded-2xl border border-rose-100 bg-rose-50 px-3 py-3">
//                     <p className="text-sm font-semibold text-rose-700">
//                       Out of stock
//                     </p>
//                     <p className="mt-1 text-xs text-rose-700/80">
//                       This item is currently unavailable. Please check back
//                       later.
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Shelf life / storage */}
//               <div className="flex items-start rounded-2xl border border-emerald-100 bg-emerald-50/60 px-3 py-3 text-xs text-slate-700">
//                 <Info size={16} className="mr-2 mt-0.5 text-emerald-600" />
//                 <div>
//                   {product.shelfLifeDays && (
//                     <p className="font-semibold text-emerald-800">
//                       Shelf life: {product.shelfLifeDays} days
//                     </p>
//                   )}
//                   {product.storageInstructions && (
//                     <p className="mt-1">{product.storageInstructions}</p>
//                   )}
//                   {!product.shelfLifeDays && !product.storageInstructions && (
//                     <p>Store in a cool, dry and hygienic place.</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Quantity Selector */}
//             {product.stock > 0 && (
//               <div className="mb-6">
//                 <label className="mb-2 block text-sm font-medium text-slate-700">
//                   Quantity
//                 </label>
//                 <div className="inline-flex items-center space-x-3 rounded-full bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
//                   <button
//                     onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                     className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-lg leading-none text-slate-700 hover:bg-slate-100"
//                   >
//                     −
//                   </button>
//                   <input
//                     type="number"
//                     min="1"
//                     max={product.stock}
//                     value={quantity}
//                     onChange={(e) =>
//                       setQuantity(
//                         Math.max(
//                           1,
//                           Math.min(
//                             product.stock,
//                             parseInt(e.target.value, 10) || 1
//                           )
//                         )
//                       )
//                     }
//                     className="h-8 w-14 bg-transparent text-center text-sm text-slate-900 focus:outline-none"
//                   />
//                   <button
//                     onClick={() =>
//                       setQuantity(Math.min(product.stock, quantity + 1))
//                     }
//                     className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-lg leading-none text-slate-700 hover:bg-slate-100"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="mb-8 flex flex-wrap gap-3">
//               <button
//                 onClick={handleAddToCart}
//                 disabled={product.stock === 0}
//                 className="flex-1 min-w-[150px] inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-emerald-700 hover:via-emerald-600 hover:to-lime-500 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <ShoppingCart size={18} className="mr-2" />
//                 Add to cart
//               </button>
//               <button
//                 onClick={handleBuyNow}
//                 disabled={product.stock === 0}
//                 className="flex-1 min-w-[150px] inline-flex items-center justify-center rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Buy now
//               </button>
//               <button className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-rose-50 hover:text-rose-600">
//                 <Heart size={18} />
//               </button>
//             </div>

//             {/* Service highlights */}
//             <div className="border-t border-slate-100 pt-5">
//               <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
//                 <div className="flex items-center gap-2">
//                   <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
//                     <Truck size={18} />
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-slate-900">
//                       Fast delivery
//                     </p>
//                     <p className="text-xs text-slate-500">
//                       Free above ₹500, usually 1–3 days
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
//                     <RotateCcw size={18} />
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-slate-900">
//                       Easy returns
//                     </p>
//                     <p className="text-xs text-slate-500">
//                       Hassle-free 3 day return policy*
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
//                     <Shield size={18} />
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-slate-900">
//                       Quality checked
//                     </p>
//                     <p className="text-xs text-slate-500">
//                       Hygienically packed & sealed
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Lower sections: Specs, Features, Reviews */}
//         <div className="space-y-8 pb-10">
//           {/* Specifications */}
//           {product.specifications && product.specifications.length > 0 && (
//             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
//               <h2 className="mb-4 text-xl sm:text-2xl font-semibold text-slate-900">
//                 Product information
//               </h2>
//               <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
//                 {product.specifications.map((spec, index) => (
//                   <div
//                     key={index}
//                     className="flex border-b border-slate-100 pb-2 last:border-b-0"
//                   >
//                     <span className="w-1/3 text-xs font-semibold text-slate-600 sm:text-sm">
//                       {spec.key}
//                     </span>
//                     <span className="flex-1 text-xs text-slate-800 sm:text-sm">
//                       {spec.value}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Features */}
//           {product.features && product.features.length > 0 && (
//             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
//               <h2 className="mb-4 text-xl sm:text-2xl font-semibold text-slate-900">
//                 Key features
//               </h2>
//               <ul className="list-disc list-inside space-y-2 text-sm text-slate-800">
//                 {product.features.map((feature, index) => (
//                   <li key={index}>{feature}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Reviews */}
//           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
//             <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//               <div>
//                 <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
//                   Customer reviews
//                 </h2>
//                 <p className="mt-1 text-sm text-slate-500">
//                   {product.ratings?.count || 0} review
//                   {product.ratings?.count === 1 ? '' : 's'} for this product
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowReviewForm(!showReviewForm)}
//                 className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
//               >
//                 Write a review
//               </button>
//             </div>

//             {/* Review Form */}
//             {showReviewForm && (
//               <form
//                 onSubmit={handleSubmitReview}
//                 className="mb-8 rounded-2xl bg-slate-50 p-4 sm:p-5"
//               >
//                 <div className="mb-4">
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Rating
//                   </label>
//                   <div className="flex space-x-2">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <button
//                         key={star}
//                         type="button"
//                         onClick={() =>
//                           setReview((prev) => ({ ...prev, rating: star }))
//                         }
//                         className="focus:outline-none"
//                       >
//                         <Star
//                           size={28}
//                           className={
//                             star <= review.rating
//                               ? 'text-amber-400 fill-current'
//                               : 'text-slate-300'
//                           }
//                         />
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="mb-4">
//                   <label className="mb-2 block text-sm font-medium text-slate-700">
//                     Comment
//                   </label>
//                   <textarea
//                     value={review.comment}
//                     onChange={(e) =>
//                       setReview((prev) => ({
//                         ...prev,
//                         comment: e.target.value,
//                       }))
//                     }
//                     rows="4"
//                     className="input text-sm"
//                     placeholder="Share your experience with this product..."
//                   />
//                 </div>

//                 <div className="flex flex-wrap gap-3">
//                   <button
//                     type="submit"
//                     className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
//                   >
//                     Submit review
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowReviewForm(false)}
//                     className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             )}

//             {/* Reviews List */}
//             <div className="space-y-4">
//               {product.reviews && product.reviews.length > 0 ? (
//                 product.reviews
//                   .slice()
//                   .sort(
//                     (a, b) =>
//                       new Date(b.createdAt) - new Date(a.createdAt)
//                   )
//                   .map((rev, index) => (
//                     <div
//                       key={index}
//                       className="border-b border-slate-100 pb-4 last:border-b-0"
//                     >
//                       <div className="mb-1 flex flex-wrap items-center gap-2">
//                         <div className="flex items-center">
//                           {[...Array(5)].map((_, i) => (
//                             <Star
//                               key={i}
//                               size={14}
//                               className={
//                                 i < rev.rating
//                                   ? 'text-amber-400 fill-current'
//                                   : 'text-slate-200'
//                               }
//                             />
//                           ))}
//                         </div>
//                         <span className="text-sm font-semibold text-slate-800">
//                           {rev.user?.firstName} {rev.user?.lastName}
//                         </span>
//                         <span className="text-xs text-slate-500">
//                           {new Date(rev.createdAt).toLocaleDateString()}
//                         </span>
//                       </div>
//                       {rev.comment && (
//                         <p className="mt-1 text-sm text-slate-700">
//                           {rev.comment}
//                         </p>
//                       )}
//                     </div>
//                   ))
//               ) : (
//                 <p className="py-8 text-center text-sm text-slate-500">
//                   No reviews yet. Be the first to review this product!
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Info,
  ArrowLeft,
} from 'lucide-react';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [showReviewForm, setShowReviewForm] = useState(false);

  const [variantIndex, setVariantIndex] = useState(null);

  /* ----------------------------------------
     Fetch product by SLUG
  ---------------------------------------- */
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/slug/${slug}`);
      const p = res.data.data;

      setProduct(p);

      if (Array.isArray(p.variants) && p.variants.length > 0) {
        const activeVariants = p.variants.filter(v => v.isActive);
        const defaultIdx = activeVariants.findIndex(v => v.isDefault);
        setVariantIndex(defaultIdx >= 0 ? defaultIdx : 0);
      } else {
        setVariantIndex(null);
      }

      setQuantity(1);
      setSelectedImage(0);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  /* ----------------------------------------
     Derived data
  ---------------------------------------- */
  const variants = product?.variants?.filter(v => v.isActive) || [];
  const selectedVariant =
    variants.length > 0 && variantIndex != null ? variants[variantIndex] : null;

  const stock =
    selectedVariant && typeof selectedVariant.stock === 'number'
      ? selectedVariant.stock
      : null;

  const isOutOfStock = stock !== null ? stock <= 0 : false;

  const basePrice = selectedVariant?.price ?? 0;
  const displayPrice =
    selectedVariant?.discountPrice != null
      ? selectedVariant.discountPrice
      : selectedVariant?.price ?? 0;

  const hasDiscount = displayPrice < basePrice;
  const discountPercentage = hasDiscount
    ? Math.round(((basePrice - displayPrice) / basePrice) * 100)
    : 0;

  const effectiveDisplayQuantity =
    selectedVariant?.displayQuantity ||
    (selectedVariant?.quantity && selectedVariant?.unit
      ? `${selectedVariant.quantity} ${selectedVariant.unit}`
      : '');

  const perUnitText =
    selectedVariant?.quantity && selectedVariant?.unit
      ? `₹${(displayPrice / selectedVariant.quantity).toFixed(2)} / ${selectedVariant.unit}`
      : null;

  const hasRatings =
    typeof product?.ratings?.average === 'number' &&
    product?.ratings?.count > 0;

  const mainImage =
    selectedVariant?.images?.find(i => i.isPrimary)?.url ||
    product?.images?.find(i => i.isPrimary)?.url ||
    selectedVariant?.images?.[0]?.url ||
    product?.images?.[0]?.url ||
    '';

  const getClampedQuantity = (val) => {
    let v = parseInt(val, 10);
    if (Number.isNaN(v) || v < 1) v = 1;
    if (stock !== null && stock > 0) v = Math.min(v, stock);
    return v;
  };

  useEffect(() => {
    setQuantity(q => getClampedQuantity(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variantIndex, selectedVariant?.stock]);

  /* ----------------------------------------
     Early returns
  ---------------------------------------- */
  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!product) {
    return <div className="p-10 text-center text-gray-500">Product not found</div>;
  }

  /* ----------------------------------------
     Actions
  ---------------------------------------- */
  const handleAddToCart = () => {
    if (isOutOfStock) return toast.error('Out of stock');

    try {
      addToCart(product, selectedVariant, quantity);
      toast.success('Added to cart');
    } catch {
      addToCart(product, quantity);
      toast.success('Added to cart');
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return toast.error('Out of stock');
    handleAddToCart();
    navigate('/checkout');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to review');
      navigate('/login');
      return;
    }

    try {
      await api.post(`/products/${product._id}/reviews`, review);
      toast.success('Review submitted');
      setShowReviewForm(false);
      setReview({ rating: 5, comment: '' });
      fetchProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  /* ----------------------------------------
     Render
  ---------------------------------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-sm text-gray-600">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="relative rounded-3xl border bg-white">
            {mainImage ? (
              <img src={mainImage} alt={product.name} className="h-[380px] w-full object-contain bg-slate-50" />
            ) : (
              <div className="h-[380px] flex items-center justify-center text-gray-400">No image</div>
            )}

            {hasDiscount && (
              <span className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {discountPercentage}% OFF
              </span>
            )}

            {product.maxDiscount > 0 && (
              <span className="absolute top-14 right-4 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                Up to {product.maxDiscount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-2 text-sm mb-3">
            <span>{product.brand}</span>
            {product.isOrganic && (
              <span className="flex items-center gap-1 text-green-600">
                <Leaf size={14} /> Organic
              </span>
            )}
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-2 mb-4">
            {[1,2,3,4,5].map(i => (
              <Star
                key={i}
                size={16}
                className={i <= Math.round(product.ratings.average) ? 'text-amber-400 fill-current' : 'text-gray-300'}
              />
            ))}
            <span className="text-sm text-gray-500">
              {hasRatings ? `${product.ratings.average.toFixed(1)} (${product.ratings.count})` : 'No ratings'}
            </span>
          </div>

          {/* Price */}
          <div className="mb-4">
            <span className="text-3xl font-bold">₹{displayPrice}</span>
            {hasDiscount && (
              <span className="ml-3 text-sm line-through text-gray-400">₹{basePrice}</span>
            )}
            {perUnitText && <p className="text-xs text-gray-500 mt-1">{perUnitText}</p>}
          </div>

          {/* Variants */}
          {variants.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-medium mb-2">Choose pack</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v, idx) => (
                  <button
                    key={v._id}
                    onClick={() => setVariantIndex(idx)}
                    disabled={v.stock <= 0}
                    className={`px-3 py-1.5 rounded-full border text-sm ${
                      idx === variantIndex
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white border-gray-300'
                    } ${v.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {v.displayQuantity || `${v.quantity} ${v.unit}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          {!isOutOfStock && (
            <div className="mb-4">
              <label className="text-sm font-medium">Quantity</label>
              <input
                type="number"
                min="1"
                max={stock ?? undefined}
                value={quantity}
                onChange={e => setQuantity(getClampedQuantity(e.target.value))}
                className="ml-3 w-20 border rounded px-2 py-1"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 bg-gray-900 text-white py-2 rounded-full disabled:opacity-50"
            >
              <ShoppingCart size={16} className="inline mr-2" />
              Add to cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="flex-1 bg-amber-500 text-white py-2 rounded-full disabled:opacity-50"
            >
              Buy now
            </button>
            <button className="h-10 w-10 border rounded-full flex items-center justify-center">
              <Heart size={16} />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700">{product.description}</p>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Customer reviews</h2>

        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="mb-4 bg-gray-900 text-white px-4 py-2 rounded-full"
        >
          Write a review
        </button>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="mb-6 bg-slate-50 p-4 rounded-xl">
            <div className="flex gap-2 mb-3">
              {[1,2,3,4,5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReview(r => ({ ...r, rating: star }))}
                >
                  <Star size={24} className={star <= review.rating ? 'text-amber-400 fill-current' : 'text-gray-300'} />
                </button>
              ))}
            </div>

            <textarea
              rows="3"
              value={review.comment}
              onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
              className="w-full border rounded p-2 text-sm"
              placeholder="Your review"
            />

            <button type="submit" className="mt-3 bg-gray-900 text-white px-4 py-2 rounded-full">
              Submit
            </button>
          </form>
        )}

        {product.reviews?.length > 0 ? (
          product.reviews.map(r => (
            <div key={r._id} className="border-b py-3">
              <div className="flex items-center gap-2 text-sm">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} className={i <= r.rating ? 'text-amber-400 fill-current' : 'text-gray-300'} />
                ))}
                <span className="font-semibold">{r.user?.firstName}</span>
              </div>
              {r.comment && <p className="text-sm mt-1 text-gray-700">{r.comment}</p>}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No reviews yet</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
