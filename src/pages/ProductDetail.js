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

// src/pages/ProductDetail.jsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  Package,
  Check,
  AlertTriangle,
  Minus,
  Plus,
  Share2,
  Clock,
  Award,
  Layers,
  TrendingUp,
} from 'lucide-react';

// -------------------------
// Helper Functions
// -------------------------

/**
 * Format price safely
 */
const formatPrice = (price) => {
  const num = Number(price);
  if (isNaN(num) || num === 0) return '₹0';
  return `₹${num.toLocaleString('en-IN')}`;
};

/**
 * Calculate discount percentage
 */
const calculateDiscount = (originalPrice, discountPrice) => {
  const original = Number(originalPrice);
  const discount = Number(discountPrice);
  if (!original || !discount || discount >= original) return 0;
  return Math.round(((original - discount) / original) * 100);
};

/**
 * Get variant display label
 */
const getVariantLabel = (variant) => {
  if (!variant) return '';
  return (
    variant.displayQuantity ||
    (variant.quantity && variant.unit ? `${variant.quantity} ${variant.unit}` : '') ||
    variant.name ||
    'Pack'
  );
};

// -------------------------
// Subcomponents
// -------------------------

// Image Gallery Component
const ImageGallery = ({ images = [], selectedIndex, onSelect, productName }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const currentImage = images[selectedIndex]?.url || '';
  const hasMultipleImages = images.length > 1;

  const handlePrev = () => {
    onSelect(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
  };

  const handleNext = () => {
    onSelect(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
  };

  return (
    <div className="lg:sticky lg:top-24 self-start">
      {/* Main Image */}
      <div
        className="relative mb-4 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
      >
        {currentImage ? (
          <img
            src={currentImage}
            alt={productName}
            className={`h-[400px] w-full object-contain bg-slate-50 transition-transform duration-300 ${
              isZoomed ? 'scale-110' : 'scale-100'
            }`}
          />
        ) : (
          <div className="flex h-[400px] w-full items-center justify-center bg-slate-50">
            <div className="text-center">
              <Package size={64} className="mx-auto text-slate-300 mb-2" />
              <span className="text-slate-400 text-sm">No image available</span>
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        {hasMultipleImages && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white hover:shadow-lg"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white hover:shadow-lg"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultipleImages && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onSelect(index)}
              className={`overflow-hidden rounded-xl bg-white ring-2 transition-all ${
                selectedIndex === index
                  ? 'ring-gray-900 shadow-md'
                  : 'ring-slate-200 hover:ring-gray-400'
              }`}
            >
              <img
                src={image.url}
                alt={`${productName} ${index + 1}`}
                className="h-16 w-full object-contain bg-slate-50"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Variant Selector Component
const VariantSelector = ({
  variants,
  selectedIndex,
  onSelect,
}) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-slate-800">
          Select Pack Size
        </p>
        <span className="text-xs text-slate-500">
          {variants.filter((v) => v.isActive).length} options available
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {variants.map((variant, idx) => {
          const label = getVariantLabel(variant);
          const price = variant.discountPrice || variant.price || 0;
          const isSelected = idx === selectedIndex;
          const isOutOfStock = variant.stock <= 0;
          const isInactive = !variant.isActive;
          const isDisabled = isOutOfStock || isInactive;
          const hasDiscount = variant.discountPrice && variant.discountPrice < variant.price;
          const discountPercent = hasDiscount
            ? calculateDiscount(variant.price, variant.discountPrice)
            : 0;

          return (
            <button
              key={variant._id || idx}
              type="button"
              onClick={() => !isDisabled && onSelect(idx)}
              disabled={isDisabled}
              className={`relative flex flex-col items-start rounded-xl border-2 px-4 py-3 text-left transition-all ${
                isSelected
                  ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                  : isDisabled
                  ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                  : 'border-slate-200 bg-white text-slate-800 hover:border-gray-400 hover:shadow-md'
              }`}
            >
              {/* Discount Badge */}
              {discountPercent > 0 && !isDisabled && (
                <span
                  className={`absolute -top-2 -right-2 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    isSelected ? 'bg-amber-400 text-gray-900' : 'bg-amber-500 text-white'
                  }`}
                >
                  {discountPercent}% OFF
                </span>
              )}

              {/* Variant Label */}
              <span className="text-sm font-semibold">{label}</span>

              {/* Price */}
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`text-sm font-bold ${
                    isSelected ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {formatPrice(price)}
                </span>
                {hasDiscount && (
                  <span
                    className={`text-xs line-through ${
                      isSelected ? 'text-gray-300' : 'text-slate-400'
                    }`}
                  >
                    {formatPrice(variant.price)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              {isOutOfStock && (
                <span className="text-[10px] text-rose-500 mt-1">Out of stock</span>
              )}
              {!isOutOfStock && variant.stock <= 5 && variant.stock > 0 && (
                <span
                  className={`text-[10px] mt-1 ${
                    isSelected ? 'text-amber-300' : 'text-amber-600'
                  }`}
                >
                  Only {variant.stock} left
                </span>
              )}

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <Check size={14} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Quantity Selector Component
const QuantitySelector = ({ quantity, onQuantityChange, maxQuantity, disabled }) => {
  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (!maxQuantity || quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      if (maxQuantity) {
        onQuantityChange(Math.min(value, maxQuantity));
      } else {
        onQuantityChange(value);
      }
    }
  };

  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        Quantity
      </label>
      <div className="inline-flex items-center rounded-full bg-slate-100 p-1">
        <button
          onClick={handleDecrement}
          disabled={disabled || quantity <= 1}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Decrease quantity"
        >
          <Minus size={18} />
        </button>

        <input
          type="number"
          min="1"
          max={maxQuantity || undefined}
          value={quantity}
          onChange={handleInputChange}
          disabled={disabled}
          className="h-10 w-16 bg-transparent text-center text-base font-semibold text-slate-900 focus:outline-none disabled:opacity-50"
        />

        <button
          onClick={handleIncrement}
          disabled={disabled || (maxQuantity && quantity >= maxQuantity)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Increase quantity"
        >
          <Plus size={18} />
        </button>
      </div>

      {maxQuantity && maxQuantity > 0 && (
        <p className="mt-2 text-xs text-slate-500">
          Maximum {maxQuantity} items available
        </p>
      )}
    </div>
  );
};

// Rating Stars Component
const RatingStars = ({ rating, size = 16, showEmpty = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < fullStars
              ? 'text-amber-400 fill-amber-400'
              : i === fullStars && hasHalfStar
              ? 'text-amber-400 fill-amber-400'
              : showEmpty
              ? 'text-slate-200'
              : 'text-transparent'
          }
        />
      ))}
    </div>
  );
};

// Service Highlights Component
const ServiceHighlights = () => (
  <div className="border-t border-slate-100 pt-6">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Truck size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Fast Delivery</p>
          <p className="text-xs text-slate-500">Free shipping above ₹500</p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <RotateCcw size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Easy Returns</p>
          <p className="text-xs text-slate-500">3-day return policy</p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <Shield size={20} />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Quality Assured</p>
          <p className="text-xs text-slate-500">Hygienically packed</p>
        </div>
      </div>
    </div>
  </div>
);

// -------------------------
// Main Component
// -------------------------
const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useCart() || { addToCart: null, cartItems: [] };
  const { user } = useAuth() || { user: null };

  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Review State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  // -------------------------
  // Fetch Product
  // -------------------------
  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/products/${id}`);

      // Handle both old and new API response formats
      const productData = res.data?.data || res.data;

      if (!productData) {
        throw new Error('Product not found');
      }

      setProduct(productData);

      // Set default variant
      const variants = productData.variants || [];
      if (variants.length > 0) {
        const defaultIdx = variants.findIndex((v) => v.isDefault && v.isActive);
        const firstActiveIdx = variants.findIndex((v) => v.isActive);
        setSelectedVariantIndex(
          defaultIdx >= 0 ? defaultIdx : firstActiveIdx >= 0 ? firstActiveIdx : 0
        );
      } else {
        setSelectedVariantIndex(0);
      }

      setQuantity(1);
      setSelectedImageIndex(0);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.response?.data?.message || 'Failed to load product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // -------------------------
  // Derived Values
  // -------------------------
  const derivedValues = useMemo(() => {
    if (!product) {
      return {
        variants: [],
        selectedVariant: null,
        stock: 0,
        isOutOfStock: true,
        isLowStock: false,
        basePrice: 0,
        displayPrice: 0,
        hasDiscount: false,
        discountPercent: 0,
        savings: 0,
        displayQuantity: '',
        perUnitPrice: null,
        images: [],
        hasRatings: false,
      };
    }

    const variants = product.variants || [];
    const selectedVariant =
      variants.length > 0 && selectedVariantIndex != null
        ? variants[selectedVariantIndex]
        : null;

    // Stock
    const stock = selectedVariant?.stock ?? product.stock ?? 0;
    const isOutOfStock = stock <= 0;
    const isLowStock = stock > 0 && stock <= 5;

    // Pricing
    const basePrice = selectedVariant?.price ?? product.price ?? 0;
    const displayPrice =
      selectedVariant?.discountPrice || selectedVariant?.price ||
      product.discountPrice || product.price || 0;
    const hasDiscount = displayPrice < basePrice && basePrice > 0;
    const discountPercent = hasDiscount
      ? Math.round(((basePrice - displayPrice) / basePrice) * 100)
      : 0;
    const savings = hasDiscount ? basePrice - displayPrice : 0;

    // Display quantity
    const displayQuantity =
      selectedVariant?.displayQuantity ||
      (selectedVariant?.quantity && selectedVariant?.unit
        ? `${selectedVariant.quantity} ${selectedVariant.unit}`
        : '') ||
      product.displayQuantity ||
      (product.quantity && product.unit
        ? `${product.quantity} ${product.unit}`
        : '');

    // Per unit price
    let perUnitPrice = null;
    if (
      selectedVariant &&
      typeof selectedVariant.quantity === 'number' &&
      selectedVariant.quantity > 0 &&
      selectedVariant.unit
    ) {
      const perUnit = displayPrice / selectedVariant.quantity;
      perUnitPrice = `${formatPrice(perUnit.toFixed(2))} / ${selectedVariant.unit}`;
    }

    // Images - combine product and variant images
    const productImages = product.images || [];
    const variantImages = selectedVariant?.images || [];
    const images = variantImages.length > 0 ? variantImages : productImages;

    // Ratings
    const hasRatings = product.ratings?.average > 0 && product.ratings?.count > 0;

    return {
      variants,
      selectedVariant,
      stock,
      isOutOfStock,
      isLowStock,
      basePrice,
      displayPrice,
      hasDiscount,
      discountPercent,
      savings,
      displayQuantity,
      perUnitPrice,
      images,
      hasRatings,
    };
  }, [product, selectedVariantIndex]);

  // -------------------------
  // Cart Integration
  // -------------------------
  const cartQuantity = useMemo(() => {
    if (!product || !cartItems) return 0;

    const cartItem = cartItems.find((item) => {
      const productMatch = item.product?._id === product._id || item.productId === product._id;
      if (!productMatch) return false;

      if (derivedValues.selectedVariant) {
        return (
          item.variantId === derivedValues.selectedVariant._id ||
          item.variant?._id === derivedValues.selectedVariant._id
        );
      }
      return true;
    });

    return cartItem?.quantity || 0;
  }, [product, cartItems, derivedValues.selectedVariant]);

  const remainingStock = derivedValues.stock - cartQuantity;
  const canAddMore = remainingStock > 0;

  // -------------------------
  // Clamp quantity when variant changes
  // -------------------------
  useEffect(() => {
    setQuantity((prevQty) => {
      const maxQty = Math.max(0, remainingStock);
      if (maxQty === 0) return 1;
      return Math.min(prevQty, maxQty);
    });
  }, [selectedVariantIndex, remainingStock]);

  // -------------------------
  // Handlers
  // -------------------------
  const handleAddToCart = () => {
    if (derivedValues.isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }

    if (derivedValues.variants.length > 0 && !derivedValues.selectedVariant) {
      toast.error('Please select a pack size');
      return;
    }

    if (!canAddMore) {
      toast.error(`Maximum quantity (${derivedValues.stock}) already in cart`);
      return;
    }

    if (quantity > remainingStock) {
      toast.error(`Only ${remainingStock} more available`);
      return;
    }

    if (addToCart) {
      try {
        addToCart(product, derivedValues.selectedVariant, quantity);
        toast.success(`Added ${quantity} item(s) to cart`);
      } catch (err) {
        console.error('Add to cart error:', err);
        toast.error('Failed to add to cart');
      }
    } else {
      toast.success('Added to cart!');
    }
  };

  const handleBuyNow = () => {
    if (derivedValues.isOutOfStock) {
      toast.error('This product is out of stock');
      return;
    }

    if (derivedValues.variants.length > 0 && !derivedValues.selectedVariant) {
      toast.error('Please select a pack size');
      return;
    }

    if (addToCart) {
      try {
        addToCart(product, derivedValues.selectedVariant, quantity);
      } catch (err) {
        console.error('Add to cart error:', err);
      }
    }

    navigate('/checkout');
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = product?.name || 'Check out this product';

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }

    if (!reviewForm.rating) {
      toast.error('Please select a rating');
      return;
    }

    setSubmittingReview(true);

    try {
      await api.post(`/products/${id}/reviews`, {
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });

      toast.success('Review submitted successfully');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, comment: '' });
      fetchProduct(); // Refresh product data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleVariantChange = (index) => {
    setSelectedVariantIndex(index);
    setQuantity(1);

    // Update images if variant has specific images
    const variant = product?.variants?.[index];
    if (variant?.images?.length > 0) {
      setSelectedImageIndex(0);
    }
  };

  // -------------------------
  // Loading State
  // -------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="mb-6 h-6 w-40 rounded bg-slate-200" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="h-[400px] rounded-3xl bg-slate-200" />
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 rounded-xl bg-slate-200" />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 w-3/4 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-200" />
                <div className="h-4 w-2/3 rounded bg-slate-200" />
                <div className="h-24 rounded-2xl bg-slate-200" />
                <div className="h-12 rounded-full bg-slate-200" />
                <div className="h-12 rounded-full bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------
  // Error State
  // -------------------------
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Package size={64} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {error || 'Product Not Found'}
          </h2>
          <p className="text-slate-500 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-black"
          >
            <ArrowLeft size={18} />
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------
  // Main Render
  // -------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link to="/products" className="hover:text-slate-900">
              Products
            </Link>
            {product.category && (
              <>
                <ChevronRight size={12} />
                <Link
                  to={`/products?category=${encodeURIComponent(product.category)}`}
                  className="hover:text-slate-900"
                >
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight size={12} />
            <span className="text-slate-700 line-clamp-1 max-w-[150px] sm:max-w-xs">
              {product.name}
            </span>
          </div>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          {/* Image Gallery */}
          <ImageGallery
            images={derivedValues.images}
            selectedIndex={selectedImageIndex}
            onSelect={setSelectedImageIndex}
            productName={product.name}
          />

          {/* Product Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.isOrganic && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                  <Leaf size={14} />
                  100% Organic
                </span>
              )}
              {product.isFeatured && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                  <Award size={14} />
                  Featured
                </span>
              )}
              {product.isBestSeller && (
                <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-800">
                  <TrendingUp size={14} />
                  Best Seller
                </span>
              )}
              {derivedValues.variants.length > 1 && (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  <Layers size={14} />
                  {derivedValues.variants.length} Sizes
                </span>
              )}
            </div>

            {/* Brand & Category */}
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              {product.brand && (
                <span className="font-semibold text-slate-900">{product.brand}</span>
              )}
              {product.brand && product.category && <span>•</span>}
              {product.category && <span>{product.category}</span>}
              {product.origin && (
                <>
                  <span>•</span>
                  <span>Origin: {product.origin}</span>
                </>
              )}
            </div>

            {/* Product Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5">
                <RatingStars rating={product.ratings?.average || 0} size={18} />
                <span className="text-sm font-medium text-slate-700">
                  {derivedValues.hasRatings
                    ? `${product.ratings.average.toFixed(1)}`
                    : 'No ratings'}
                </span>
              </div>
              {derivedValues.hasRatings && (
                <span className="text-sm text-slate-500">
                  ({product.ratings.count} review{product.ratings.count !== 1 ? 's' : ''})
                </span>
              )}
            </div>

            {/* Variant Selector */}
            <VariantSelector
              variants={derivedValues.variants}
              selectedIndex={selectedVariantIndex}
              onSelect={handleVariantChange}
            />

            {/* Price Block */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-5 shadow-sm">
              <div className="flex flex-wrap items-end gap-3 mb-2">
                <span className="text-3xl sm:text-4xl font-bold text-slate-900">
                  {formatPrice(derivedValues.displayPrice)}
                </span>

                {derivedValues.hasDiscount && (
                  <div className="flex flex-col">
                    <span className="text-lg text-slate-400 line-through">
                      {formatPrice(derivedValues.basePrice)}
                    </span>
                    <span className="text-sm font-semibold text-emerald-600">
                      Save {formatPrice(derivedValues.savings)} ({derivedValues.discountPercent}% off)
                    </span>
                  </div>
                )}
              </div>

              {derivedValues.perUnitPrice && (
                <p className="text-sm text-slate-500">{derivedValues.perUnitPrice}</p>
              )}

              <p className="text-xs text-slate-500 mt-1">Inclusive of all taxes</p>

              {derivedValues.displayQuantity && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  <Package size={14} />
                  Pack: {derivedValues.displayQuantity}
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="rounded-xl border border-slate-200 p-4">
              {derivedValues.isOutOfStock ? (
                <div className="flex items-start gap-3 text-rose-700">
                  <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Out of Stock</p>
                    <p className="text-sm text-rose-600">
                      This item is currently unavailable. Please check back later.
                    </p>
                  </div>
                </div>
              ) : derivedValues.isLowStock ? (
                <div className="flex items-start gap-3 text-amber-700">
                  <Clock size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Only {derivedValues.stock} left!</p>
                    <p className="text-sm text-amber-600">Order soon to secure yours.</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 text-emerald-700">
                  <Check size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">In Stock</p>
                    <p className="text-sm text-emerald-600">
                      {derivedValues.stock} units available
                      {cartQuantity > 0 && ` (${cartQuantity} in cart)`}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {!derivedValues.isOutOfStock && (
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
                maxQuantity={remainingStock > 0 ? remainingStock : 1}
                disabled={derivedValues.isOutOfStock || !canAddMore}
              />
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddToCart}
                disabled={derivedValues.isOutOfStock || !canAddMore}
                className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-black hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                <ShoppingCart size={20} />
                {derivedValues.isOutOfStock
                  ? 'Out of Stock'
                  : !canAddMore
                  ? 'Max in Cart'
                  : 'Add to Cart'}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={derivedValues.isOutOfStock}
                className="flex-1 min-w-[150px] inline-flex items-center justify-center gap-2 rounded-full bg-amber-500 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:bg-amber-600 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>

              <button
                onClick={handleWishlist}
                className={`inline-flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-sm transition-all ${
                  isWishlisted
                    ? 'border-rose-200 bg-rose-50 text-rose-600'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600'
                }`}
                aria-label="Add to wishlist"
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>

              <button
                onClick={handleShare}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                aria-label="Share product"
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Description</h3>
                <p className="text-sm leading-relaxed text-slate-600">{product.description}</p>
              </div>
            )}

            {/* Storage Info */}
            {(product.shelfLifeDays || product.storageInstructions) && (
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <Info size={20} className="flex-shrink-0 text-slate-600 mt-0.5" />
                <div className="text-sm">
                  {product.shelfLifeDays && (
                    <p className="font-semibold text-slate-900">
                      Shelf Life: {product.shelfLifeDays} days
                    </p>
                  )}
                  {product.storageInstructions && (
                    <p className="text-slate-600 mt-1">{product.storageInstructions}</p>
                  )}
                </div>
              </div>
            )}

            {/* Service Highlights */}
            <ServiceHighlights />
          </div>
        </div>

        {/* Additional Sections */}
        <div className="space-y-8 pb-12">
          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Product Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-b-0"
                  >
                    <span className="w-1/3 text-sm font-medium text-slate-600">
                      {spec.key}
                    </span>
                    <span className="flex-1 text-sm text-slate-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Key Features</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={18} className="flex-shrink-0 text-emerald-500 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Reviews Section */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Customer Reviews</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {product.reviews?.length || 0} review
                  {(product.reviews?.length || 0) !== 1 ? 's' : ''} for this product
                </p>
              </div>

              {derivedValues.hasRatings && (
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <div className="text-3xl font-bold text-slate-900">
                    {product.ratings.average.toFixed(1)}
                  </div>
                  <div>
                    <RatingStars rating={product.ratings.average} size={16} />
                    <p className="text-xs text-slate-500 mt-1">
                      Based on {product.ratings.count} reviews
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-black"
              >
                <Star size={16} />
                Write a Review
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="mb-8 rounded-xl bg-slate-50 p-5 border border-slate-200"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Share Your Experience
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          size={32}
                          className={
                            star <= reviewForm.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                    }
                    rows="4"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
                    placeholder="Share your experience with this product..."
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
                  >
                    {submittingReview ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews
                  .slice()
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((review, index) => (
                    <div
                      key={review._id || index}
                      className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
                    >
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                          {(review.user?.firstName?.[0] || 'U').toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">
                            {review.user?.firstName} {review.user?.lastName || ''}
                          </p>
                          <div className="flex items-center gap-2">
                            <RatingStars rating={review.rating} size={14} />
                            <span className="text-xs text-slate-500">
                              {new Date(review.createdAt).toLocaleDateString('en-IN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </div>
                        {review.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                            <Check size={12} />
                            Verified
                          </span>
                        )}
                      </div>
                      {review.title && (
                        <p className="font-semibold text-slate-900 mb-1">{review.title}</p>
                      )}
                      {review.comment && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))
              ) : (
                <div className="py-12 text-center">
                  <Star size={48} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-500">No reviews yet</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Be the first to review this product!
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

