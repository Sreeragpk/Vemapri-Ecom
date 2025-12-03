// import React, { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

// const Cart = () => {
//   const navigate = useNavigate();
//   // const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
//   // Add this near the top of the Cart component:
// const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
// const [stockErrors, setStockErrors] = useState({});

// // Add this useEffect to check stock
// useEffect(() => {
//   const checkStock = async () => {
//     const errors = {};
//     for (let item of cartItems) {
//       try {
//         const res = await api.get(`/products/${item.product._id}`);
//         const product = res.data;
//         if (product.stock < item.quantity) {
//           errors[item.product._id] = {
//             available: product.stock,
//             requested: item.quantity
//           };
//         }
//       } catch (error) {
//         console.error('Error checking stock:', error);
//       }
//     }
//     setStockErrors(errors);
//   };

//   if (cartItems.length > 0) {
//     checkStock();
//   }
// }, [cartItems]);


//   const handleCheckout = () => {
//     if (cartItems.length === 0) return;
//     navigate('/checkout');
//   };

//   const calculateTax = () => {
//     return getCartTotal() * 0.18; // 18% GST
//   };

//   const calculateShipping = () => {
//     return getCartTotal() > 1000 ? 0 : 100;
//   };

//   const calculateTotal = () => {
//     return getCartTotal() + calculateTax() + calculateShipping();
//   };

//   if (cartItems.length === 0) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
//         <ShoppingBag size={64} className="mx-auto text-gray-400 mb-4" />
//         <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
//         <p className="text-gray-600 mb-8">Add some products to get started!</p>
//         <Link to="/products" className="btn btn-primary">
//           Continue Shopping
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Cart Items */}
//         <div className="lg:col-span-2">
//           <div className="card">
//             {cartItems.map((item) => {
//               const price = item.product.discountPrice || item.product.price;
//               const subtotal = price * item.quantity;

//               return (
//                 <div
//                   key={item.product._id}
//                   className="flex items-center border-b last:border-b-0 py-4"
//                 >
//                   {/* Product Image */}
//                   <Link to={`/products/${item.product._id}`} className="flex-shrink-0">
//                     <img
//                       src={item.product.images?.[0]?.url || '/placeholder.png'}
//                       alt={item.product.name}
//                       className="w-24 h-24 object-contain rounded"
//                     />
//                   </Link>

//                   {/* Product Info */}
//                   <div className="ml-4 flex-1">
//                     <Link
//                       to={`/products/${item.product._id}`}
//                       className="text-lg font-semibold text-gray-900 hover:text-primary-600"
//                     >
//                       {item.product.name}
//                     </Link>
//                     <p className="text-sm text-gray-600 mt-1">
//                       {item.product.category}
//                     </p>
//                     <div className="mt-2">
//                       <span className="text-lg font-bold text-primary-600">
//                         ₹{price.toLocaleString()}
//                       </span>
//                       {item.product.discountPrice && (
//                         <span className="ml-2 text-sm text-gray-500 line-through">
//                           ₹{item.product.price.toLocaleString()}
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Quantity Controls */}
//                   <div className="flex items-center space-x-2">
//                     <button
//                       onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
//                       className="p-1 rounded-md border border-gray-300 hover:bg-gray-100"
//                     >
//                       <Minus size={16} />
//                     </button>
//                     <span className="w-12 text-center font-semibold">
//                       {item.quantity}
//                     </span>
//                     <button
//                       onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
//                       disabled={item.quantity >= item.product.stock}
//                       className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <Plus size={16} />
//                     </button>
//                   </div>

//                   {/* Subtotal */}
//                   <div className="ml-4 text-right">
//                     <p className="text-lg font-bold text-gray-900">
//                       ₹{subtotal.toLocaleString()}
//                     </p>
//                   </div>

//                   {/* Remove Button */}
//                   <button
//                     onClick={() => removeFromCart(item.product._id)}
//                     className="ml-4 text-red-600 hover:text-red-700"
//                   >
//                     <Trash2 size={20} />
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="lg:col-span-1">
//           <div className="card sticky top-20">
//             <h2 className="text-xl font-bold mb-4">Order Summary</h2>

//             <div className="space-y-3 mb-4">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subtotal</span>
//                 <span className="font-semibold">
//                   ₹{getCartTotal().toLocaleString()}
//                 </span>
//               </div>

//               <div className="flex justify-between">
//                 <span className="text-gray-600">Tax (18% GST)</span>
//                 <span className="font-semibold">
//                   ₹{calculateTax().toLocaleString()}
//                 </span>
//               </div>

//               <div className="flex justify-between">
//                 <span className="text-gray-600">Shipping</span>
//                 <span className="font-semibold">
//                   {calculateShipping() === 0 ? (
//                     <span className="text-green-600">FREE</span>
//                   ) : (
//                     `₹${calculateShipping()}`
//                   )}
//                 </span>
//               </div>

//               {getCartTotal() < 1000 && getCartTotal() > 0 && (
//                 <p className="text-sm text-gray-600">
//                   Add ₹{(1000 - getCartTotal()).toLocaleString()} more for free shipping
//                 </p>
//               )}
//             </div>

//             <div className="border-t pt-4 mb-6">
//               <div className="flex justify-between items-center">
//                 <span className="text-lg font-bold">Total</span>
//                 <span className="text-2xl font-bold text-primary-600">
//                   ₹{calculateTotal().toLocaleString()}
//                 </span>
//               </div>
//             </div>

//             <button
//               onClick={handleCheckout}
//               className="w-full btn btn-primary mb-4"
//             >
//               Proceed to Checkout
//             </button>

//             <Link
//               to="/products"
//               className="w-full btn btn-secondary text-center block"
//             >
//               Continue Shopping
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  AlertCircle,
  Truck,
  Tag,
} from 'lucide-react';
import api from '../utils/api';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
  } = useCart();

  const [stockErrors, setStockErrors] = useState({});

  // Check stock for items in cart
  useEffect(() => {
    const checkStock = async () => {
      const errors = {};

      for (let item of cartItems) {
        try {
          const res = await api.get(`/products/${item.product._id}`);
          const product = res.data;

          if (product.stock < item.quantity) {
            errors[item.product._id] = {
              available: product.stock,
              requested: item.quantity,
            };
          }
        } catch (error) {
          console.error('Error checking stock:', error);
        }
      }

      setStockErrors(errors);
    };

    if (cartItems.length > 0) {
      checkStock();
    } else {
      setStockErrors({});
    }
  }, [cartItems]);

  const hasStockIssues = Object.keys(stockErrors).length > 0;

  const handleCheckout = () => {
    if (cartItems.length === 0 || hasStockIssues) return;
    navigate('/checkout');
  };

  const calculateTax = () => getCartTotal() * 0.18; // 18% GST
  const calculateShipping = () => (getCartTotal() > 500 ? 0 : 80);
  const calculateTotal = () =>
    getCartTotal() + calculateTax() + calculateShipping();

  const freeShippingThreshold = 500;
  const remainingForFreeShipping = Math.max(
    0,
    freeShippingThreshold - getCartTotal()
  );

  // Empty cart view
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-br from-slate-50 via-slate-100 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900/5 text-slate-900 mb-4 shadow-sm">
            <ShoppingBag size={36} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-slate-500 mb-6 max-w-md text-sm sm:text-base">
            Looks like you haven&apos;t added anything yet. Explore our products
            and start your order.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-black transition-colors"
          >
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/60 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header + step indicator */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Shopping cart
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Review your items before proceeding to checkout.
            </p>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
            <div className="flex items-center gap-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                1
              </span>
              <span>Cart</span>
            </div>
            <span className="h-px w-6 bg-slate-300" />
            <div className="flex items-center gap-1 opacity-80">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-400 text-[10px] font-bold text-slate-600">
                2
              </span>
              <span>Address &amp; payment</span>
            </div>
            <span className="h-px w-6 bg-slate-300" />
            <div className="flex items-center gap-1 opacity-60">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-[10px] font-bold text-slate-400">
                3
              </span>
              <span>Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-4 sm:px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/5 text-slate-900">
                    <ShoppingBag size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Items in your cart
                    </p>
                    <p className="text-xs text-slate-500">
                      {cartItems.length} item
                      {cartItems.length > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearCart}
                  className="text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Clear cart
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => {
                  const price =
                    item.product.discountPrice || item.product.price;
                  const subtotal = price * item.quantity;
                  const hasError = stockErrors[item.product._id];
                  const isMaxQty = item.quantity >= item.product.stock;
                  const isMinQty = item.quantity <= 1;

                  return (
                    <div
                      key={item.product._id}
                      className="flex flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center"
                    >
                      {/* Product Image */}
                      <Link
                        to={`/products/${item.product._id}`}
                        className="flex-shrink-0"
                      >
                        <div className="h-24 w-24 rounded-xl border border-slate-200 bg-white flex items-center justify-center overflow-hidden">
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

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.product._id}`}
                          className="text-sm sm:text-base font-semibold text-slate-900 hover:text-slate-700 line-clamp-2 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">
                          {item.product.category}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="text-base font-bold text-slate-900">
                            ₹{price.toLocaleString()}
                          </span>
                          {item.product.discountPrice && (
                            <>
                              <span className="text-xs text-slate-400 line-through">
                                ₹{item.product.price.toLocaleString()}
                              </span>
                              <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 border border-amber-100">
                                <Tag size={12} className="mr-1" />
                                Save ₹
                                {(
                                  item.product.price -
                                  item.product.discountPrice
                                ).toLocaleString()}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Stock warning per item */}
                        {hasError && (
                          <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2">
                            <AlertCircle
                              size={14}
                              className="mt-0.5 text-amber-500"
                            />
                            <p className="text-[11px] text-amber-800 leading-snug">
                              Only {hasError.available} unit
                              {hasError.available === 1 ? '' : 's'} available.
                              You&apos;ve requested {hasError.requested}. Please
                              reduce the quantity to continue.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Right section: qty + subtotal + remove */}
                      <div className="flex flex-col items-end gap-3 min-w-[150px]">
                        {/* Quantity Controls */}
                        <div className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-1.5 py-1">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            disabled={isMinQty}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="mx-2 min-w-[32px] text-center text-sm font-semibold text-slate-900">
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
                            className="flex h-7 w-7 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Item total</p>
                          <p className="text-base font-bold text-slate-900">
                            ₹{subtotal.toLocaleString()}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden">
                <div className="bg-slate-900 px-4 py-3 text-white">
                  <h2 className="text-lg font-semibold">Order summary</h2>
                  <p className="text-[11px] text-slate-300">
                    Taxes and shipping are calculated based on your cart value.
                  </p>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="space-y-3 mb-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-semibold text-slate-900">
                        ₹{getCartTotal().toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-600">Tax (18% GST)</span>
                      <span className="font-semibold text-slate-900">
                        ₹{calculateTax().toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-600 flex items-center gap-1">
                        Shipping
                        <Truck size={14} className="text-slate-400" />
                      </span>
                      <span className="font-semibold">
                        {calculateShipping() === 0 ? (
                          <span className="text-amber-600">FREE</span>
                        ) : (
                          `₹${calculateShipping()}`
                        )}
                      </span>
                    </div>

                    {/* Free shipping hint */}
                    {getCartTotal() > 0 && remainingForFreeShipping > 0 && (
                      <div className="mt-1 flex items-start gap-2 rounded-lg bg-slate-900/5 px-2.5 py-2 text-[11px] text-slate-800 border border-slate-200">
                        <Truck size={14} className="mt-0.5 text-slate-500" />
                        <p>
                          Add ₹
                          {remainingForFreeShipping.toLocaleString()} more to
                          unlock{' '}
                          <span className="font-semibold">free shipping</span>.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Global stock issue warning */}
                  {hasStockIssues && (
                    <div className="mb-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-800">
                      <AlertCircle size={14} className="mt-0.5" />
                      <p>
                        Some items exceed available stock. Adjust the quantities
                        in your cart before proceeding to checkout.
                      </p>
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">
                        Total payable
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        ₹{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Price inclusive of GST. Final amount may adjust if cart
                      changes.
                    </p>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={hasStockIssues}
                    className={`w-full rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${
                      hasStockIssues
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-slate-900 hover:bg-black'
                    }`}
                  >
                    {hasStockIssues
                      ? 'Resolve stock issues to continue'
                      : 'Proceed to checkout'}
                  </button>

                  <Link
                    to="/products"
                    className="mt-3 block w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
