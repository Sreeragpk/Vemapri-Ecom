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
//src/pages/Cart.js
// src/pages/Cart.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,

} from "lucide-react";
import api from "../utils/api";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
  } = useCart();

  const [stockErrors, setStockErrors] = useState({});

  const getItemKey = (item) =>
    `${item.product._id}_${item.variantId || "noVar"}`;

  // 🔐 AUTHORITATIVE STOCK CHECK (variant-only)
  useEffect(() => {
    const checkStock = async () => {
      const errors = {};

      for (const item of cartItems) {
        try {
          const res = await api.get(`/products/${item.product._id}`);
          const product = res.data;

          const variant = product.variants?.find(
            (v) => String(v._id) === String(item.variantId)
          );

          const available = Number(variant?.stock ?? 0);

          if (available <= 0) {
            removeFromCart(item.product._id, item.variantId);
            continue;
          }

          if (item.quantity > available) {
            updateQuantity(item.product._id, available, item.variantId);
            errors[getItemKey(item)] = {
              available,
              requested: item.quantity,
            };
          }
        } catch (err) {
          console.error("Stock check failed", err);
        }
      }

      setStockErrors(errors);
    };

    if (cartItems.length > 0) checkStock();
    else setStockErrors({});
  }, [cartItems, removeFromCart, updateQuantity]);

  const hasStockIssues = Object.keys(stockErrors).length > 0;

  const calculateTax = () => getCartTotal() * 0.18;
  const calculateShipping = () => (getCartTotal() > 500 ? 0 : 80);
  const calculateTotal = () =>
    getCartTotal() + calculateTax() + calculateShipping();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <ShoppingBag size={48} className="text-slate-400 mb-3" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-slate-500 mt-2">
          Browse products and add items to your cart.
        </p>
        <Link
          to="/products"
          className="mt-4 rounded-full bg-slate-900 px-6 py-2 text-white"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const variant = item.variant;
            const price =
              variant?.discountPrice ?? variant?.price ?? 0;

            const localStock = Number.isFinite(variant?.stock)
              ? variant.stock
              : 0;

            const isOutOfStock = localStock <= 0;
            const isMaxQty = item.quantity >= localStock;

            return (
              <div
                key={getItemKey(item)}
                className="flex gap-4 bg-white p-4 rounded-xl shadow-sm"
              >
                <img
                  src={
                    variant?.images?.[0]?.url ||
                    item.product.images?.[0]?.url ||
                    "/placeholder.png"
                  }
                  alt={item.product.name}
                  className="w-24 h-24 object-contain border rounded-lg"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">
                    {item.product.name}
                    {variant?.displayQuantity && (
                      <span className="text-sm text-slate-500">
                        {" "}
                        ({variant.displayQuantity})
                      </span>
                    )}
                  </h3>

                  <p className="text-sm text-slate-500">
                    ₹{price.toLocaleString()}
                  </p>

                  {isOutOfStock && (
                    <span className="inline-block mt-2 rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-600">
                      Out of stock
                    </span>
                  )}

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product._id,
                          item.quantity - 1,
                          item.variantId
                        )
                      }
                      disabled={item.quantity <= 1}
                      className="p-1 border rounded disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product._id,
                          item.quantity + 1,
                          item.variantId
                        )
                      }
                      disabled={isMaxQty || isOutOfStock}
                      className="p-1 border rounded disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={() =>
                    removeFromCart(item.product._id, item.variantId)
                  }
                  className="text-rose-500 text-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>

        {/* SUMMARY */}
        <div className="bg-white rounded-xl shadow-md p-4 h-fit">
          <h2 className="font-semibold text-lg mb-3">Order summary</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{getCartTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (18%)</span>
              <span>₹{calculateTax().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {calculateShipping() === 0 ? "FREE" : "₹80"}
              </span>
            </div>
          </div>

          {hasStockIssues && (
            <div className="mt-3 text-xs text-amber-700 bg-amber-50 p-2 rounded">
              Some items were adjusted due to stock changes.
            </div>
          )}

          <div className="mt-4 font-bold text-lg flex justify-between">
            <span>Total</span>
            <span>₹{calculateTotal().toLocaleString()}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            disabled={hasStockIssues}
            className="mt-4 w-full rounded-full bg-slate-900 py-2 text-white disabled:opacity-50"
          >
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
