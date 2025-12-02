// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import api from '../utils/api';
// import toast from 'react-hot-toast';

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
//     country: 'India'
//   });

//   useEffect(() => {
//     if (!user) {
//       navigate('/login', { state: { from: { pathname: '/checkout' } } });
//       return;
//     }

//     if (cartItems.length === 0) {
//       navigate('/cart');
//       return;
//     }

//     fetchAddresses();
//   }, [user, cartItems]);

//   const fetchAddresses = async () => {
//     try {
//       const res = await api.get('/users/profile');
//       setAddresses(res.data.addresses || []);
      
//       const defaultAddr = res.data.addresses?.find(addr => addr.isDefault);
//       if (defaultAddr) {
//         setSelectedAddress(defaultAddr._id);
//       }
//     } catch (error) {
//       console.error('Error fetching addresses:', error);
//     }
//   };

//   const handleAddressChange = (e) => {
//     setNewAddress({
//       ...newAddress,
//       [e.target.name]: e.target.value
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
//         country: 'India'
//       });
//       fetchAddresses();
//     } catch (error) {
//       toast.error('Failed to add address');
//     }
//   };

//   const calculateTax = () => {
//     return getCartTotal() * 0.18;
//   };

//   const calculateShipping = () => {
//     return getCartTotal() > 1000 ? 0 : 100;
//   };

//   const calculateTotal = () => {
//     return getCartTotal() + calculateTax() + calculateShipping();
//   };

//   const loadRazorpay = () => {
//     return new Promise((resolve) => {
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

//     setLoading(true);

//     try {
//       const selectedAddr = addresses.find(addr => addr._id === selectedAddress);
      
//       // Create order
//       const orderData = {
//         items: cartItems.map(item => ({
//           product: item.product._id,
//           quantity: item.quantity
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
//           mobile: user.mobile
//         },
//         paymentMethod: paymentMethod
//       };

//       const orderRes = await api.post('/orders', orderData);
//       const order = orderRes.data;

//       if (paymentMethod === 'razorpay') {
//         // Load Razorpay
//         const res = await loadRazorpay();
//         if (!res) {
//           toast.error('Razorpay SDK failed to load');
//           return;
//         }

//         // Create Razorpay order
//         const paymentRes = await api.post('/payments/create-order', {
//           amount: order.totalPrice,
//           currency: 'INR'
//         });

//         const options = {
//           key: process.env.REACT_APP_RAZORPAY_KEY_ID,
//           amount: paymentRes.data.amount,
//           currency: paymentRes.data.currency,
//           name: 'Techie Prints',
//           description: `Order #${order.orderNumber}`,
//           order_id: paymentRes.data.orderId,
//           handler: async function (response) {
//             try {
//               // Verify payment
//               await api.post('/payments/verify', {
//                 razorpayOrderId: response.razorpay_order_id,
//                 razorpayPaymentId: response.razorpay_payment_id,
//                 razorpaySignature: response.razorpay_signature
//               });

//               // Update order with payment info
//               await api.put(`/orders/${order._id}/payment`, {
//                 razorpayOrderId: response.razorpay_order_id,
//                 razorpayPaymentId: response.razorpay_payment_id,
//                 razorpaySignature: response.razorpay_signature
//               });

//               clearCart();
//               toast.success('Order placed successfully!');
//               navigate(`/orders/${order._id}`);
//             } catch (error) {
//               toast.error('Payment verification failed');
//             }
//           },
//           prefill: {
//             name: `${user.firstName} ${user.lastName}`,
//             email: user.email,
//             contact: user.mobile
//           },
//           theme: {
//             color: '#0ea5e9'
//           }
//         };

//         const paymentObject = new window.Razorpay(options);
//         paymentObject.open();
//       } else {
//         // Cash on Delivery
//         clearCart();
//         toast.success('Order placed successfully!');
//         navigate(`/orders/${order._id}`);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to place order');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-6">
//           {/* Delivery Address */}
//           <div className="card">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold">Delivery Address</h2>
//               <button
//                 onClick={() => setShowAddressForm(!showAddressForm)}
//                 className="btn btn-primary text-sm"
//               >
//                 {showAddressForm ? 'Cancel' : 'Add New Address'}
//               </button>
//             </div>

//             {showAddressForm && (
//               <form onSubmit={handleAddAddress} className="mb-6 p-4 bg-gray-50 rounded-lg">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Address Type
//                     </label>
//                     <select
//                       name="type"
//                       value={newAddress.type}
//                       onChange={handleAddressChange}
//                       className="input"
//                     >
//                       <option value="home">Home</option>
//                       <option value="work">Work</option>
//                       <option value="other">Other</option>
//                     </select>
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Address Line 1
//                     </label>
//                     <input
//                       type="text"
//                       name="addressLine1"
//                       required
//                       value={newAddress.addressLine1}
//                       onChange={handleAddressChange}
//                       className="input"
//                       placeholder="House/Flat No., Building Name"
//                     />
//                   </div>

//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Address Line 2
//                     </label>
//                     <input
//                       type="text"
//                       name="addressLine2"
//                       value={newAddress.addressLine2}
//                       onChange={handleAddressChange}
//                       className="input"
//                       placeholder="Road Name, Area, Colony"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       City
//                     </label>
//                     <input
//                       type="text"
//                       name="city"
//                       required
//                       value={newAddress.city}
//                       onChange={handleAddressChange}
//                       className="input"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       State
//                     </label>
//                     <input
//                       type="text"
//                       name="state"
//                       required
//                       value={newAddress.state}
//                       onChange={handleAddressChange}
//                       className="input"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       ZIP Code
//                     </label>
//                     <input
//                       type="text"
//                       name="zipCode"
//                       required
//                       value={newAddress.zipCode}
//                       onChange={handleAddressChange}
//                       className="input"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Country
//                     </label>
//                     <input
//                       type="text"
//                       name="country"
//                       required
//                       value={newAddress.country}
//                       onChange={handleAddressChange}
//                       className="input"
//                     />
//                   </div>
//                 </div>

//                 <button type="submit" className="btn btn-primary mt-4">
//                   Save Address
//                 </button>
//               </form>
//             )}

//             <div className="space-y-3">
//               {addresses.length === 0 ? (
//                 <p className="text-gray-500">No saved addresses. Please add one.</p>
//               ) : (
//                 addresses.map((address) => (
//                   <label
//                     key={address._id}
//                     className={`block p-4 border-2 rounded-lg cursor-pointer ${
//                       selectedAddress === address._id
//                         ? 'border-primary-500 bg-primary-50'
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name="address"
//                       value={address._id}
//                       checked={selectedAddress === address._id}
//                       onChange={(e) => setSelectedAddress(e.target.value)}
//                       className="mr-3"
//                     />
//                     <div className="inline-block">
//                       <div className="font-semibold">
//                         {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
//                         {address.isDefault && (
//                           <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
//                             Default
//                           </span>
//                         )}
//                       </div>
//                       <div className="text-sm text-gray-600 mt-1">
//                         {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
//                         {address.city}, {address.state} - {address.zipCode}, {address.country}
//                       </div>
//                     </div>
//                   </label>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Payment Method */}
//           <div className="card">
//             <h2 className="text-xl font-bold mb-4">Payment Method</h2>

//             <div className="space-y-3">
//               <label className="block p-4 border-2 rounded-lg cursor-pointer hover:border-gray-300">
//                 <input
//                   type="radio"
//                   name="payment"
//                   value="razorpay"
//                   checked={paymentMethod === 'razorpay'}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                   className="mr-3"
//                 />
//                 <span className="font-semibold">Online Payment (UPI, Cards, Net Banking)</span>
//                 <p className="text-sm text-gray-600 ml-7">Pay securely via Razorpay</p>
//               </label>

//               <label className="block p-4 border-2 rounded-lg cursor-pointer hover:border-gray-300">
//                 <input
//                   type="radio"
//                   name="payment"
//                   value="cod"
//                   checked={paymentMethod === 'cod'}
//                   onChange={(e) => setPaymentMethod(e.target.value)}
//                   className="mr-3"
//                 />
//                 <span className="font-semibold">Cash on Delivery</span>
//                 <p className="text-sm text-gray-600 ml-7">Pay when you receive the product</p>
//               </label>
//             </div>
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div className="lg:col-span-1">
//           <div className="card sticky top-20">
//             <h2 className="text-xl font-bold mb-4">Order Summary</h2>

//             {/* Cart Items */}
//             <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
//               {cartItems.map((item) => {
//                 const price = item.product.discountPrice || item.product.price;
//                 return (
//                   <div key={item.product._id} className="flex items-center">
//                     <img
//                       src={item.product.images?.[0]?.url || '/placeholder.png'}
//                       alt={item.product.name}
//                       className="w-16 h-16 object-contain rounded"
//                     />
//                     <div className="ml-3 flex-1">
//                       <p className="text-sm font-semibold line-clamp-1">
//                         {item.product.name}
//                       </p>
//                       <p className="text-xs text-gray-600">
//                         Qty: {item.quantity}
//                       </p>
//                     </div>
//                     <p className="text-sm font-semibold">
//                       ₹{(price * item.quantity).toLocaleString()}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="border-t pt-4 space-y-2 mb-4">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Subtotal</span>
//                 <span className="font-semibold">₹{getCartTotal().toLocaleString()}</span>
//               </div>

//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Tax (18% GST)</span>
//                 <span className="font-semibold">₹{calculateTax().toLocaleString()}</span>
//               </div>

//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-600">Shipping</span>
//                 <span className="font-semibold">
//                   {calculateShipping() === 0 ? (
//                     <span className="text-green-600">FREE</span>
//                   ) : (
//                     `₹${calculateShipping()}`
//                   )}
//                 </span>
//               </div>
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
//               onClick={handlePlaceOrder}
//               disabled={loading || !selectedAddress}
//               className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? 'Processing...' : 'Place Order'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;
import React, { useState, useEffect } from 'react';
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
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
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

  // Redirect guards + fetch addresses
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

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/users/profile');
      const userAddresses = res.data.addresses || [];
      setAddresses(userAddresses);

      const defaultAddr = userAddresses.find((addr) => addr.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr._id);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      toast.error('Failed to load addresses');
    }
  };

  const handleAddressChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    try {
      await api.post('/users/address', newAddress);
      toast.success('Address added successfully');
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
      fetchAddresses();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to add address');
    }
  };

  // Display calculations (backend still calculates its own values)
  const calculateTax = () => getCartTotal() * 0.18;

  const calculateShipping = () => (getCartTotal() > 500 ? 0 : 80);

  const calculateTotal = () =>
    getCartTotal() + calculateTax() + calculateShipping();

  // Load Razorpay SDK only once
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (paymentMethod === 'razorpay' && !process.env.REACT_APP_RAZORPAY_KEY_ID) {
      toast.error('Razorpay key is not configured');
      return;
    }

    setLoading(true);

    try {
      const selectedAddr = addresses.find((addr) => addr._id === selectedAddress);
      if (!selectedAddr) {
        toast.error('Selected address not found');
        setLoading(false);
        return;
      }

      // 1) Create order in your DB
      const orderData = {
        items: cartItems.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
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
          mobile: user.mobile,
        },
        // backend uses billingAddress || shippingAddress, so this is OK
        paymentMethod, // 'razorpay' or 'cod'
      };

      const orderRes = await api.post('/orders', orderData);
      const order = orderRes.data;

      // 2) If COD → no Razorpay, just finish
      if (paymentMethod === 'cod') {
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/orders/${order._id}`);
        return;
      }

      // 3) Online payment via Razorpay
      const sdkLoaded = await loadRazorpay();
      if (!sdkLoaded) {
        toast.error('Razorpay SDK failed to load. Check your internet connection.');
        setLoading(false);
        return;
      }

      // Use backend totalPrice (in rupees) → convert to paise
      const amountInPaise = Math.round(order.totalPrice * 100);

      // Create Razorpay order on backend
      const paymentRes = await api.post('/payments/create-order', {
        amount: amountInPaise, // *** amount in paise ***
        currency: 'INR',
        orderId: order._id,
      });

      const { amount, currency, razorpayOrderId } = paymentRes.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount, // in paise
        currency,
        name: 'Techie Prints',
        description: `Order #${order.orderNumber}`,
        order_id: razorpayOrderId,
        prefill: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          contact: user.mobile,
        },
        theme: {
          color: '#059669', // emerald
        },

        handler: async function (response) {
          try {
            // 4) Verify payment signature on backend
            await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: order._id,
            });

            // 5) Mark order as paid + update stock
            await api.put(`/orders/${order._id}/payment`, {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            clearCart();
            toast.success('Payment successful! Order placed.');
            navigate(`/orders/${order._id}`);
          } catch (err) {
            console.error(err);
            toast.error('Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setLoading(false);
            toast('Payment popup closed. You can try again.', { icon: 'ℹ️' });
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response);
        toast.error('Payment failed. Please try again.');
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  const getAddressIcon = (type) => {
    if (type === 'home') return <Home size={18} className="text-emerald-600" />;
    if (type === 'work') return <Briefcase size={18} className="text-sky-600" />;
    return <Building2 size={18} className="text-purple-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-white">
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
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                1
              </span>
              <span>Cart</span>
            </div>
            <span className="h-px w-6 bg-slate-300" />
            <div className="flex items-center gap-1">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                2
              </span>
              <span>Address &amp; Payment</span>
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
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
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
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  {showAddressForm ? 'Cancel' : 'Add new address'}
                </button>
              </div>

              {/* Address form */}
              {showAddressForm && (
                <form
                  onSubmit={handleAddAddress}
                  className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 sm:p-5"
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
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-emerald-300'
                          }`}
                        >
                          {getAddressIcon(type)}
                          <span className="hidden sm:inline">
                            {type === 'home' ? 'Home' : type === 'work' ? 'Work' : 'Other'}
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
                        PIN code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        required
                        value={newAddress.zipCode}
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
                      className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
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
                          ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
                          : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedAddress === address._id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center gap-2">
                          {getAddressIcon(address.type)}
                          <span className="text-sm font-semibold text-slate-900 capitalize">
                            {address.type}
                          </span>
                          {address.isDefault && (
                            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
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
                            {address.city}, {address.state} - {address.zipCode}
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
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Payment method
                  </h2>
                  <p className="text-xs text-slate-500">
                    Secure payment powered by Razorpay.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 sm:p-4 transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={18} className="text-emerald-600" />
                      <span className="text-sm font-semibold text-slate-900">
                        Online payment (UPI, cards, net banking)
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      Pay instantly via Razorpay. Your card details are never stored on our servers.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 sm:p-4 transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-emerald-500 bg-emerald-50/60 shadow-sm'
                      : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Wallet size={18} className="text-slate-700" />
                      <span className="text-sm font-semibold text-slate-900">
                        Cash on delivery
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">
                      Pay in cash when your order is delivered at your doorstep.
                    </p>
                  </div>
                </label>

                <div className="mt-3 grid grid-cols-1 gap-3 text-xs text-slate-500 sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-emerald-600" />
                    <span>Free delivery above ₹500</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-600" />
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
              <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-md">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-white">
                  <h2 className="text-lg font-semibold">Order summary</h2>
                  <p className="text-xs text-emerald-100">
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
                          className="flex items-center gap-3 rounded-xl bg-slate-50/70 p-2"
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
                          <span className="text-emerald-600">FREE</span>
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
                      <span className="text-xl font-bold text-emerald-700">
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
                    className="w-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:from-emerald-700 hover:via-emerald-600 hover:to-lime-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? 'Processing payment...'
                      : selectedAddress
                      ? 'Place order securely'
                      : 'Select an address to continue'}
                  </button>

                  <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>
                      Payments are processed securely. We do not store your card details.
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
