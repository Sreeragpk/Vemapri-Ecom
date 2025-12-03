// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import api from '../utils/api';
// import toast from 'react-hot-toast';
// import {
//   MapPin,
//   Home,
//   Briefcase,
//   Building2,
//   CreditCard,
//   Wallet,
//   ShieldCheck,
//   Truck,
//   AlertCircle,
// } from 'lucide-react';

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { cartItems, getCartTotal, clearCart } = useCart();

//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState('razorpay');
//   const [loading, setLoading] = useState(false);
//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [newAddress, setNewAddress] = useState({
//     type: 'home',
//     addressLine1: '',
//     addressLine2: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: 'India',
//   });

//   // Redirect guards + fetch addresses
//   useEffect(() => {
//     if (!user) {
//       navigate('/login', { state: { from: { pathname: '/checkout' } } });
//       return;
//     }

//     if (!cartItems || cartItems.length === 0) {
//       navigate('/cart');
//       return;
//     }

//     fetchAddresses();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [user, cartItems]);

//   const fetchAddresses = async () => {
//     try {
//       const res = await api.get('/users/profile');
//       const userAddresses = res.data.addresses || [];
//       setAddresses(userAddresses);

//       const defaultAddr = userAddresses.find((addr) => addr.isDefault);
//       if (defaultAddr) {
//         setSelectedAddress(defaultAddr._id);
//       }
//     } catch (error) {
//       console.error('Error fetching addresses:', error);
//       toast.error('Failed to load addresses');
//     }
//   };

//   const handleAddressChange = (e) => {
//     setNewAddress({
//       ...newAddress,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleAddAddress = async (e) => {
//     e.preventDefault();

//     try {
//       await api.post('/users/address', newAddress);
//       toast.success('Address added successfully');
//       setShowAddressForm(false);
//       setNewAddress({
//         type: 'home',
//         addressLine1: '',
//         addressLine2: '',
//         city: '',
//         state: '',
//         zipCode: '',
//         country: 'India',
//       });
//       fetchAddresses();
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || 'Failed to add address');
//     }
//   };

//   // Display calculations (backend still calculates its own values)
//   const calculateTax = () => getCartTotal() * 0.18;

//   const calculateShipping = () => (getCartTotal() > 500 ? 0 : 80);

//   const calculateTotal = () =>
//     getCartTotal() + calculateTax() + calculateShipping();

//   // Load Razorpay SDK only once
//   const loadRazorpay = () => {
//     return new Promise((resolve) => {
//       if (window.Razorpay) {
//         return resolve(true);
//       }

//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handlePlaceOrder = async () => {
//     if (!selectedAddress) {
//       toast.error('Please select a delivery address');
//       return;
//     }

//     if (!paymentMethod) {
//       toast.error('Please select a payment method');
//       return;
//     }

//     if (paymentMethod === 'razorpay' && !process.env.REACT_APP_RAZORPAY_KEY_ID) {
//       toast.error('Razorpay key is not configured');
//       return;
//     }

//     setLoading(true);

//     try {
//       const selectedAddr = addresses.find((addr) => addr._id === selectedAddress);
//       if (!selectedAddr) {
//         toast.error('Selected address not found');
//         setLoading(false);
//         return;
//       }

//       // 1) Create order in your DB
//       const orderData = {
//         items: cartItems.map((item) => ({
//           product: item.product._id,
//           quantity: item.quantity,
//         })),
//         shippingAddress: {
//           firstName: user.firstName,
//           lastName: user.lastName,
//           addressLine1: selectedAddr.addressLine1,
//           addressLine2: selectedAddr.addressLine2,
//           city: selectedAddr.city,
//           state: selectedAddr.state,
//           zipCode: selectedAddr.zipCode,
//           country: selectedAddr.country,
//           mobile: user.mobile,
//         },
//         // backend uses billingAddress || shippingAddress, so this is OK
//         paymentMethod, // 'razorpay' or 'cod'
//       };

//       const orderRes = await api.post('/orders', orderData);
//       const order = orderRes.data;

//       // 2) If COD → no Razorpay, just finish
//       if (paymentMethod === 'cod') {
//         clearCart();
//         toast.success('Order placed successfully!');
//         navigate(`/orders/${order._id}`);
//         return;
//       }

//       // 3) Online payment via Razorpay
//       const sdkLoaded = await loadRazorpay();
//       if (!sdkLoaded) {
//         toast.error('Razorpay SDK failed to load. Check your internet connection.');
//         setLoading(false);
//         return;
//       }

//       // Use backend totalPrice (in rupees) → convert to paise
//       const amountInPaise = Math.round(order.totalPrice * 100);

//       // Create Razorpay order on backend
//       const paymentRes = await api.post('/payments/create-order', {
//         amount: amountInPaise, // *** amount in paise ***
//         currency: 'INR',
//         orderId: order._id,
//       });

//       const { amount, currency, razorpayOrderId } = paymentRes.data;

//       const options = {
//         key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//         amount, // in paise
//         currency,
//         name: 'Techie Prints',
//         description: `Order #${order.orderNumber}`,
//         order_id: razorpayOrderId,
//         prefill: {
//           name: `${user.firstName} ${user.lastName}`,
//           email: user.email,
//           contact: user.mobile,
//         },
//         theme: {
//           color: '#059669', // emerald
//         },

//         handler: async function (response) {
//           try {
//             // 4) Verify payment signature on backend
//             await api.post('/payments/verify', {
//               razorpayOrderId: response.razorpay_order_id,
//               razorpayPaymentId: response.razorpay_payment_id,
//               razorpaySignature: response.razorpay_signature,
//               orderId: order._id,
//             });

//             // 5) Mark order as paid + update stock
//             await api.put(`/orders/${order._id}/payment`, {
//               razorpayOrderId: response.razorpay_order_id,
//               razorpayPaymentId: response.razorpay_payment_id,
//               razorpaySignature: response.razorpay_signature,
//             });

//             clearCart();
//             toast.success('Payment successful! Order placed.');
//             navigate(`/orders/${order._id}`);
//           } catch (err) {
//             console.error(err);
//             toast.error('Payment verification failed. Please contact support.');
//           } finally {
//             setLoading(false);
//           }
//         },

//         modal: {
//           ondismiss: function () {
//             setLoading(false);
//             toast('Payment popup closed. You can try again.', { icon: 'ℹ️' });
//           },
//         },
//       };

//       const rzp = new window.Razorpay(options);

//       rzp.on('payment.failed', function (response) {
//         console.error('Payment failed:', response);
//         toast.error('Payment failed. Please try again.');
//         setLoading(false);
//       });

//       rzp.open();
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || 'Failed to place order');
//       setLoading(false);
//     }
//   };

//   const getAddressIcon = (type) => {
//     if (type === 'home') return <Home size={18} className="text-emerald-600" />;
//     if (type === 'work') return <Briefcase size={18} className="text-sky-600" />;
//     return <Building2 size={18} className="text-purple-600" />;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Heading + Steps */}
//         <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
//               Checkout
//             </h1>
//             <p className="mt-1 text-sm text-slate-500">
//               Complete your order in a few simple steps.
//             </p>
//           </div>

//           {/* Step indicator */}
//           <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
//             <div className="flex items-center gap-1">
//               <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
//                 1
//               </span>
//               <span>Cart</span>
//             </div>
//             <span className="h-px w-6 bg-slate-300" />
//             <div className="flex items-center gap-1">
//               <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
//                 2
//               </span>
//               <span>Address &amp; Payment</span>
//             </div>
//             <span className="h-px w-6 bg-slate-300" />
//             <div className="flex items-center gap-1 opacity-60">
//               <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-[10px] font-bold text-slate-500">
//                 3
//               </span>
//               <span>Confirmation</span>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
//           <div className="space-y-6 lg:col-span-2">
//             {/* Delivery Address */}
//             <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
//               <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <div className="flex items-center gap-2">
//                   <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
//                     <MapPin size={18} />
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-semibold text-slate-900">
//                       Delivery address
//                     </h2>
//                     <p className="text-xs text-slate-500">
//                       Choose an existing address or add a new one.
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowAddressForm(!showAddressForm)}
//                   className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
//                 >
//                   {showAddressForm ? 'Cancel' : 'Add new address'}
//                 </button>
//               </div>

//               {/* Address form */}
//               {showAddressForm && (
//                 <form
//                   onSubmit={handleAddAddress}
//                   className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 sm:p-5"
//                 >
//                   <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
//                     <label className="col-span-1 text-xs font-medium text-slate-700">
//                       Address type
//                     </label>
//                     <div className="col-span-2 flex flex-wrap gap-2">
//                       {['home', 'work', 'other'].map((type) => (
//                         <button
//                           key={type}
//                           type="button"
//                           onClick={() =>
//                             setNewAddress((prev) => ({ ...prev, type }))
//                           }
//                           className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
//                             newAddress.type === type
//                               ? 'bg-emerald-600 text-white shadow-sm'
//                               : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
//                           }`}
//                         >
//                           {getAddressIcon(type)}
//                           <span className="hidden sm:inline">
//                             {type === 'home' ? 'Home' : type === 'work' ? 'Work' : 'Other'}
//                           </span>
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                     <div className="sm:col-span-2">
//                       <label className="mb-1 block text-xs font-medium text-slate-700">
//                         Address line 1 *
//                       </label>
//                       <input
//                         type="text"
//                         name="addressLine1"
//                         required
//                         value={newAddress.addressLine1}
//                         onChange={handleAddressChange}
//                         className="input h-10 text-sm"
//                         placeholder="House/Flat No., Building Name"
//                       />
//                     </div>

//                     <div className="sm:col-span-2">
//                       <label className="mb-1 block text-xs font-medium text-slate-700">
//                         Address line 2
//                       </label>
//                       <input
//                         type="text"
//                         name="addressLine2"
//                         value={newAddress.addressLine2}
//                         onChange={handleAddressChange}
//                         className="input h-10 text-sm"
//                         placeholder="Road name, area, landmark"
//                       />
//                     </div>

//                     <div>
//                       <label className="mb-1 block text-xs font-medium text-slate-700">
//                         City *
//                       </label>
//                       <input
//                         type="text"
//                         name="city"
//                         required
//                         value={newAddress.city}
//                         onChange={handleAddressChange}
//                         className="input h-10 text-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="mb-1 block text-xs font-medium text-slate-700">
//                         State *
//                       </label>
//                       <input
//                         type="text"
//                         name="state"
//                         required
//                         value={newAddress.state}
//                         onChange={handleAddressChange}
//                         className="input h-10 text-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="mb-1 block text-xs font-medium text-slate-700">
//                         PIN code *
//                       </label>
//                       <input
//                         type="text"
//                         name="zipCode"
//                         required
//                         value={newAddress.zipCode}
//                         onChange={handleAddressChange}
//                         className="input h-10 text-sm"
//                       />
//                     </div>

//                     <div>
//                       <label className="mb-1 block text-xs font-medium text-slate-700">
//                         Country *
//                       </label>
//                       <input
//                         type="text"
//                         name="country"
//                         required
//                         value={newAddress.country}
//                         onChange={handleAddressChange}
//                         className="input h-10 text-sm"
//                       />
//                     </div>
//                   </div>

//                   <div className="mt-4 flex flex-wrap gap-3">
//                     <button
//                       type="submit"
//                       className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
//                     >
//                       Save address
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setShowAddressForm(false);
//                       }}
//                       className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </form>
//               )}

//               {/* Address list */}
//               <div className="space-y-3">
//                 {addresses.length === 0 ? (
//                   <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-xs text-slate-500">
//                     <AlertCircle size={16} className="text-amber-500" />
//                     <span>No saved addresses. Please add one.</span>
//                   </div>
//                 ) : (
//                   addresses.map((address) => (
//                     <label
//                       key={address._id}
//                       className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-white p-3 transition-all sm:p-4 ${
//                         selectedAddress === address._id
//                           ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
//                           : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name="address"
//                         value={address._id}
//                         checked={selectedAddress === address._id}
//                         onChange={(e) => setSelectedAddress(e.target.value)}
//                         className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
//                       />
//                       <div className="flex flex-1 flex-col gap-1">
//                         <div className="flex items-center gap-2">
//                           {getAddressIcon(address.type)}
//                           <span className="text-sm font-semibold text-slate-900 capitalize">
//                             {address.type}
//                           </span>
//                           {address.isDefault && (
//                             <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
//                               Default
//                             </span>
//                           )}
//                         </div>
//                         <div className="text-xs text-slate-600">
//                           <p className="line-clamp-2">
//                             {address.addressLine1}
//                             {address.addressLine2 && `, ${address.addressLine2}`}
//                           </p>
//                           <p>
//                             {address.city}, {address.state} - {address.zipCode}
//                           </p>
//                           <p>{address.country}</p>
//                         </div>
//                       </div>
//                     </label>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Payment Method */}
//             <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
//               <div className="mb-4 flex items-center gap-2">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
//                   <CreditCard size={18} />
//                 </div>
//                 <div>
//                   <h2 className="text-lg font-semibold text-slate-900">
//                     Payment method
//                   </h2>
//                   <p className="text-xs text-slate-500">
//                     Secure payment powered by Razorpay.
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 <label
//                   className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 sm:p-4 transition-all ${
//                     paymentMethod === 'razorpay'
//                       ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
//                       : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="payment"
//                     value="razorpay"
//                     checked={paymentMethod === 'razorpay'}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                     className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
//                   />
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <CreditCard size={18} className="text-emerald-600" />
//                       <span className="text-sm font-semibold text-slate-900">
//                         Online payment (UPI, cards, net banking)
//                       </span>
//                     </div>
//                     <p className="mt-1 text-xs text-slate-600">
//                       Pay instantly via Razorpay. Your card details are never stored on our servers.
//                     </p>
//                   </div>
//                 </label>

//                 <label
//                   className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 sm:p-4 transition-all ${
//                     paymentMethod === 'cod'
//                       ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
//                       : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
//                   }`}
//                 >
//                   <input
//                     type="radio"
//                     name="payment"
//                     value="cod"
//                     checked={paymentMethod === 'cod'}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                     className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
//                   />
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <Wallet size={18} className="text-slate-700" />
//                       <span className="text-sm font-semibold text-slate-900">
//                         Cash on delivery
//                       </span>
//                     </div>
//                     <p className="mt-1 text-xs text-slate-600">
//                       Pay in cash when your order is delivered at your doorstep.
//                     </p>
//                   </div>
//                 </label>

//                 <div className="mt-3 grid grid-cols-1 gap-3 text-xs text-slate-500 sm:grid-cols-3">
//                   <div className="flex items-center gap-2">
//                     <Truck size={16} className="text-emerald-600" />
//                     <span>Free delivery above ₹500</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <ShieldCheck size={16} className="text-emerald-600" />
//                     <span>Secure payments</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <AlertCircle size={16} className="text-amber-500" />
//                     <span>COD may not be available in all areas</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-20">
//               <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-md">
//                 <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-white">
//                   <h2 className="text-lg font-semibold">Order summary</h2>
//                   <p className="text-xs text-emerald-100">
//                     Review items and charges before placing the order.
//                   </p>
//                 </div>

//                 <div className="p-4 sm:p-5">
//                   {/* Cart Items */}
//                   <div className="mb-4 max-h-60 space-y-3 overflow-y-auto pr-1">
//                     {cartItems.map((item) => {
//                       const price =
//                         item.product.discountPrice || item.product.price;
//                       return (
//                         <div
//                           key={item.product._id}
//                           className="flex items-center gap-3 rounded-xl bg-slate-50/70 p-2"
//                         >
//                           <img
//                             src={
//                               item.product.images?.[0]?.url || '/placeholder.png'
//                             }
//                             alt={item.product.name}
//                             className="h-12 w-12 rounded-lg border border-slate-200 object-contain bg-white"
//                           />
//                           <div className="flex-1">
//                             <p className="line-clamp-1 text-xs font-medium text-slate-900">
//                               {item.product.name}
//                             </p>
//                             <p className="mt-0.5 text-[11px] text-slate-500">
//                               Qty: {item.quantity}
//                             </p>
//                           </div>
//                           <p className="text-xs font-semibold text-slate-900">
//                             ₹{(price * item.quantity).toLocaleString()}
//                           </p>
//                         </div>
//                       );
//                     })}
//                   </div>

//                   <div className="mb-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-slate-600">Subtotal</span>
//                       <span className="font-semibold">
//                         ₹{getCartTotal().toLocaleString()}
//                       </span>
//                     </div>

//                     <div className="flex justify-between">
//                       <span className="text-slate-600">Tax (18% GST)</span>
//                       <span className="font-semibold">
//                         ₹{calculateTax().toLocaleString()}
//                       </span>
//                     </div>

//                     <div className="flex justify-between">
//                       <span className="text-slate-600">Shipping</span>
//                       <span className="font-semibold">
//                         {calculateShipping() === 0 ? (
//                           <span className="text-emerald-600">FREE</span>
//                         ) : (
//                           `₹${calculateShipping()}`
//                         )}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="mb-4 rounded-xl bg-slate-50 px-3 py-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-semibold text-slate-900">
//                         Total payable
//                       </span>
//                       <span className="text-xl font-bold text-emerald-700">
//                         ₹{calculateTotal().toLocaleString()}
//                       </span>
//                     </div>
//                     <p className="mt-1 text-[11px] text-slate-500">
//                       You will receive order details and updates on your
//                       registered email and mobile.
//                     </p>
//                   </div>

//                   <button
//                     onClick={handlePlaceOrder}
//                     disabled={loading || !selectedAddress}
//                     className="w-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:from-emerald-700 hover:via-emerald-600 hover:to-lime-500 disabled:cursor-not-allowed disabled:opacity-60"
//                   >
//                     {loading
//                       ? 'Processing payment...'
//                       : selectedAddress
//                       ? 'Place order securely'
//                       : 'Select an address to continue'}
//                   </button>

//                   <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
//                     <ShieldCheck size={14} className="text-emerald-600" />
//                     <span>
//                       Payments are processed securely. We do not store your card details.
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;
// src/pages/Checkout.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  MapPin,
  Home,
  Briefcase,
  Building2,
  CreditCard,
  Wallet,
  ShieldCheck,
  Truck,
  AlertCircle,
} from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cashfree');
  const [loading, setLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'home',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  // PIN code helper state
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState('');

  // API base (frontend env) - keep for relay URL construction if needed
  const REACT_API_URL =
    process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const apiBase = REACT_API_URL.replace(/\/api\/?$/, '');

  // fetchAddresses is used in useEffect and after add address
  const fetchAddresses = useCallback(async () => {
    try {
      const res = await api.get('/users/profile');
      const userAddresses = res.data.addresses || [];
      setAddresses(userAddresses);

      const defaultAddr =
        userAddresses.find((a) => a.isDefault) || userAddresses[0];
      if (defaultAddr) setSelectedAddress(defaultAddr._id);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      toast.error('Failed to load addresses');
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
      return;
    }

    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, cartItems]);

  const handleAddressChange = (e) =>
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/users/address', newAddress);
      toast.success('Address added');
      setShowAddressForm(false);
      setNewAddress({
        type: 'home',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
      });
      await fetchAddresses();
    } catch (err) {
      console.error('Add address error:', err);
      toast.error(err.response?.data?.message || 'Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  // ===== Auto-fill City / State / Country from PIN code =====
  useEffect(() => {
    const pincode = newAddress.zipCode.trim();

    if (!pincode) {
      setPinError('');
      return;
    }

    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setPinError('Enter a valid 6-digit PIN code');
      return;
    }

    const fetchPinDetails = async () => {
      try {
        setPinLoading(true);
        setPinError('');

        const res = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const data = await res.json();

        const entry = data?.[0];
        if (!entry || entry.Status !== 'Success' || !entry.PostOffice?.length) {
          setPinError('PIN code not found. Please check and try again.');
          return;
        }

        const po = entry.PostOffice[0];

        setNewAddress((prev) => ({
          ...prev,
          city: po.District || prev.city,
          state: po.State || prev.state,
          country: po.Country || prev.country || 'India',
        }));
        setPinError('');
      } catch (err) {
        console.error('Pincode lookup error:', err);
        setPinError('Unable to fetch location for this PIN. Please fill manually.');
      } finally {
        setPinLoading(false);
      }
    };

    fetchPinDetails();
  }, [newAddress.zipCode]);

  const calculateTax = () =>
    typeof getCartTotal === 'function' ? getCartTotal() * 0.18 : 0;
  const calculateShipping = () => (getCartTotal() > 500 ? 0 : 80);
  const calculateTotal = () =>
    getCartTotal() + calculateTax() + calculateShipping();

  // Poller for verifying payment after creating order
  const pollVerify = (orderId, paymentWindow, opts = {}) => {
    const maxAttempts = opts.maxAttempts || 20; // ~1 minute if interval=3000
    const intervalMs = opts.intervalMs || 3000;
    let attempts = 0;

    const interval = setInterval(async () => {
      attempts += 1;
      try {
        const res = await api.post('/payments/verify', { orderId });
        const data = res.data || {};
        if (data.verified === true) {
          clearInterval(interval);
          try {
            if (paymentWindow) paymentWindow.close();
          } catch (e) {}
          clearCart();
          toast.success('Payment confirmed — order placed!');
          setLoading(false);
          navigate(`/orders/${orderId}`);
          return;
        }

        if (
          data.success === true &&
          data.verified === false &&
          /failed/i.test(data.message || '')
        ) {
          clearInterval(interval);
          try {
            if (paymentWindow) paymentWindow.close();
          } catch (e) {}
          toast.error('Payment failed. Please try again.');
          setLoading(false);
          navigate(`/orders/${orderId}`);
          return;
        }

        if (attempts >= maxAttempts) {
          clearInterval(interval);
          try {
            if (paymentWindow) paymentWindow.focus();
          } catch (e) {}
          toast('Payment not confirmed yet. Check your Orders page.', {
            icon: '⏳',
          });
          setLoading(false);
        }
      } catch (err) {
        console.error('pollVerify error:', err);
        if (attempts >= maxAttempts) {
          clearInterval(interval);
          setLoading(false);
          toast.error(
            'Could not confirm payment right now. Check your Orders page.'
          );
        }
      }
    }, intervalMs);

    return () => clearInterval(interval);
  };

  // ---------- Core: place order using Hosted Payment Link ----------
  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setLoading(true);

    let paymentWindow = null;
    try {
      paymentWindow = window.open('', '_blank', 'noopener,noreferrer');
    } catch (e) {
      paymentWindow = null;
    }

    try {
      const selectedAddr = addresses.find((a) => a._id === selectedAddress);
      if (!selectedAddr) {
        toast.error('Selected address not found');
        setLoading(false);
        if (paymentWindow) paymentWindow.close();
        return;
      }

      const payload = {
        items: cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images?.[0]?.url || '',
          quantity: item.quantity,
          price: item.product.price,
          discountPrice: item.product.discountPrice,
        })),
        shippingAddress: {
          firstName: user.firstName,
          lastName: user.lastName,
          addressLine1: selectedAddr.addressLine1,
          addressLine2: selectedAddr.addressLine2,
          city: selectedAddr.city,
          state: selectedAddr.state,
          zipCode: selectedAddr.zipCode,
          country: selectedAddr.country,
          mobile: user.mobile || '',
        },
        billingAddress: {
          firstName: user.firstName,
          lastName: user.lastName,
          addressLine1: selectedAddr.addressLine1,
          addressLine2: selectedAddr.addressLine2,
          city: selectedAddr.city,
          state: selectedAddr.state,
          zipCode: selectedAddr.zipCode,
          country: selectedAddr.country,
          mobile: user.mobile || '',
        },
        itemsPrice: getCartTotal(),
        taxPrice: calculateTax(),
        shippingPrice: calculateShipping(),
        totalPrice: calculateTotal(),
        paymentMethod: paymentMethod === 'cod' ? 'cod' : 'cashfree',
        currency: 'INR',
        customer: {
          customer_id: user._id,
          customer_email: user.email,
          customer_phone: user.mobile || '',
        },
      };

      const res = await api.post('/payments/create-order', payload);
      const order = res.data.order || res.data;
      const paymentLink =
        res.data.paymentLink || res.data.cashfree?.payment_link || null;
      const paymentSessionId =
        res.data.paymentSessionId || res.data.cashfree?.payment_session_id || null;

      // COD flow
      if (payload.paymentMethod === 'cod') {
        if (paymentWindow) paymentWindow.close();
        clearCart();
        toast.success('Order placed (Cash on Delivery).');
        setLoading(false);
        navigate(`/orders/${order._id}`);
        return;
      }

      // Hosted payment link
      if (paymentLink) {
        if (paymentWindow) {
          try {
            paymentWindow.location.href = paymentLink;
          } catch (err) {
            window.open(paymentLink, '_blank', 'noopener,noreferrer');
          }
        } else {
          window.location.href = paymentLink;
        }

        pollVerify(order._id, paymentWindow, {
          maxAttempts: 20,
          intervalMs: 3000,
        });
        return;
      }

      // Relay / session-id flow
      if (paymentSessionId) {
        const relayUrl = `${apiBase}/api/payments/checkout?session=${encodeURIComponent(
          paymentSessionId
        )}&orderId=${encodeURIComponent(order._id)}`;

        if (paymentWindow) {
          try {
            paymentWindow.location.href = relayUrl;
          } catch (err) {
            window.open(relayUrl, '_blank', 'noopener,noreferrer');
          }
        } else {
          window.location.href = relayUrl;
        }

        pollVerify(order._id, paymentWindow, {
          maxAttempts: 20,
          intervalMs: 3000,
        });
        return;
      }

      if (paymentWindow) paymentWindow.close();
      toast.error(
        'Payment link not returned by server. Please try from your orders page.'
      );
      setLoading(false);
      navigate(`/orders/${order._id}`);
    } catch (err) {
      console.error('Place order error:', err);
      if (paymentWindow) paymentWindow.close();

      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.cashfree?.message ||
        err?.message ||
        'Failed to place order';
      toast.error(msg);
      setLoading(false);
    }
  };

  const getAddressIcon = (type) => {
    if (type === 'home')
      return <Home size={18} className="text-slate-900" />;
    if (type === 'work')
      return <Briefcase size={18} className="text-sky-600" />;
    return <Building2 size={18} className="text-violet-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Heading + Steps */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Checkout
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Complete your order in a few simple steps.
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
            <div className="flex items-center gap-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                1
              </span>
              <span>Cart</span>
            </div>
            <span className="h-px w-6 bg-slate-300" />
            <div className="flex items-center gap-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                2
              </span>
              <span>Address &amp; payment</span>
            </div>
            <span className="h-px w-6 bg-slate-300" />
            <div className="flex items-center gap-1 opacity-60">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-[10px] font-bold text-slate-500">
                3
              </span>
              <span>Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Delivery Address */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/5 text-slate-900">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      Delivery address
                    </h2>
                    <p className="text-xs text-slate-500">
                      Choose an existing address or add a new one.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-black"
                >
                  {showAddressForm ? 'Cancel' : 'Add new address'}
                </button>
              </div>

              {/* Address form */}
              {showAddressForm && (
                <form
                  onSubmit={handleAddAddress}
                  className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
                >
                  <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <label className="col-span-1 text-xs font-medium text-slate-700">
                      Address type
                    </label>
                    <div className="col-span-2 flex flex-wrap gap-2">
                      {['home', 'work', 'other'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() =>
                            setNewAddress((prev) => ({ ...prev, type }))
                          }
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
                            newAddress.type === type
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
                          }`}
                        >
                          {getAddressIcon(type)}
                          <span className="hidden sm:inline">
                            {type === 'home'
                              ? 'Home'
                              : type === 'work'
                              ? 'Work'
                              : 'Other'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Address line 1 *
                      </label>
                      <input
                        type="text"
                        name="addressLine1"
                        required
                        value={newAddress.addressLine1}
                        onChange={handleAddressChange}
                        className="input h-10 text-sm"
                        placeholder="House/Flat No., Building Name"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Address line 2
                      </label>
                      <input
                        type="text"
                        name="addressLine2"
                        value={newAddress.addressLine2}
                        onChange={handleAddressChange}
                        className="input h-10 text-sm"
                        placeholder="Road name, area, landmark"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        PIN code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        value={newAddress.zipCode}
                        onChange={handleAddressChange}
                        className="input h-10 text-sm"
                        placeholder="6-digit PIN"
                      />
                      <div className="mt-1 text-[11px]">
                        {pinLoading && (
                          <span className="text-slate-500">
                            Fetching location…
                          </span>
                        )}
                        {!pinLoading && pinError && (
                          <span className="text-red-600">{pinError}</span>
                        )}
                        {!pinLoading && !pinError && newAddress.zipCode && (
                          <span className="text-slate-500">
                            Location auto-filled based on PIN (you can edit
                            manually).
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        className="input h-10 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        className="input h-10 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        required
                        value={newAddress.country}
                        onChange={handleAddressChange}
                        className="input h-10 text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black disabled:opacity-60"
                    >
                      Save address
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Address list */}
              <div className="space-y-3">
                {addresses.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-xs text-slate-500">
                    <AlertCircle size={16} className="text-amber-500" />
                    <span>No saved addresses. Please add one.</span>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <label
                      key={address._id}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 bg-white p-3 transition-all sm:p-4 ${
                        selectedAddress === address._id
                          ? 'border-slate-900 bg-slate-900/5 shadow-sm'
                          : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        aria-label={`Select address ${address.addressLine1}`}
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedAddress === address._id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mt-1 h-4 w-4 text-slate-900 focus:ring-slate-900"
                      />
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {getAddressIcon(address.type)}
                          <span className="text-sm font-semibold text-slate-900 capitalize">
                            {address.type}
                          </span>
                          {address.isDefault && (
                            <span className="inline-flex items-center rounded-full bg-slate-900/5 px-2 py-0.5 text-[10px] font-semibold text-slate-900">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600">
                          <p className="line-clamp-2">
                            {address.addressLine1}
                            {address.addressLine2 && `, ${address.addressLine2}`}
                          </p>
                          <p>
                            {address.city}, {address.state} -{' '}
                            {address.zipCode}
                          </p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/5 text-slate-900">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Payment method
                  </h2>
                  <p className="text-xs text-slate-500">
                    Secure payment powered by Cashfree.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 sm:p-4 transition-all ${
                    paymentMethod === 'cashfree'
                      ? 'border-slate-900 bg-slate-900/5 shadow-sm'
                      : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cashfree"
                    checked={paymentMethod === 'cashfree'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 h-4 w-4 text-slate-900 focus:ring-slate-900"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={18} className="text-slate-900" />
                      <span className="text-sm font-semibold text-slate-900">
                        Online payment (UPI, cards, net banking)
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      Pay instantly via Cashfree. Your card details are never
                      stored on our servers.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 sm:p-4 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-slate-900 bg-slate-900/5 shadow-sm'
                      : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 h-4 w-4 text-slate-900 focus:ring-slate-900"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Wallet size={18} className="text-slate-900" />
                      <span className="text-sm font-semibold text-slate-900">
                        Cash on delivery
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      Pay in cash when your order is delivered at your
                      doorstep.
                    </p>
                  </div>
                </label>

                <div className="mt-3 grid grid-cols-1 gap-3 text-xs text-slate-500 sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-slate-900" />
                    <span>Free delivery above ₹500</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-slate-900" />
                    <span>Secure payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-amber-500" />
                    <span>COD may not be available in all areas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
                <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-4 py-3 text-white">
                  <h2 className="text-lg font-semibold">Order summary</h2>
                  <p className="text-xs text-slate-200">
                    Review items and charges before placing the order.
                  </p>
                </div>

                <div className="p-4 sm:p-5">
                  {/* Cart Items */}
                  <div className="mb-4 max-h-60 space-y-3 overflow-y-auto pr-1">
                    {cartItems.map((item) => {
                      const price =
                        item.product.discountPrice || item.product.price;
                      return (
                        <div
                          key={item.product._id}
                          className="flex items-center gap-3 rounded-xl bg-slate-50 p-2"
                        >
                          <img
                            src={
                              item.product.images?.[0]?.url || '/placeholder.png'
                            }
                            alt={item.product.name}
                            className="h-12 w-12 rounded-lg border border-slate-200 object-contain bg-white"
                          />
                          <div className="flex-1">
                            <p className="line-clamp-1 text-xs font-medium text-slate-900">
                              {item.product.name}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-xs font-semibold text-slate-900">
                            ₹{(price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mb-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-semibold">
                        ₹{getCartTotal().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tax (18% GST)</span>
                      <span className="font-semibold">
                        ₹{calculateTax().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Shipping</span>
                      <span className="font-semibold">
                        {calculateShipping() === 0 ? (
                          <span className="text-slate-900 font-semibold">
                            FREE
                          </span>
                        ) : (
                          `₹${calculateShipping()}`
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4 rounded-xl bg-slate-50 px-3 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">
                        Total payable
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        ₹{calculateTotal().toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                      You will receive order details and updates on your
                      registered email and mobile.
                    </p>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={loading || !selectedAddress}
                    className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? 'Processing payment...'
                      : selectedAddress
                      ? 'Place order securely'
                      : 'Select an address to continue'}
                  </button>

                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck size={14} className="text-slate-900" />
                    <span>
                      Payments are processed securely. We do not store your card
                      details.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default Checkout;
