// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import api from '../utils/api';
// import toast from 'react-hot-toast';
// import {
//   ArrowLeft,
//   Package,
//   Truck,
//   CheckCircle2,
//   XCircle,
//   CreditCard,
//   MapPin,
// } from 'lucide-react';

// const OrderDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchOrder();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const fetchOrder = async () => {
//     try {
//       const res = await api.get(`/orders/${id}`);
//       setOrder(res.data);
//     } catch (error) {
//       toast.error('Failed to fetch order details');
//       navigate('/orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusMeta = (status) => {
//     const map = {
//       pending: {
//         label: 'Pending',
//         badge: 'bg-amber-50 text-amber-700 ring-amber-100',
//         dot: 'bg-amber-500',
//         icon: Package,
//       },
//       processing: {
//         label: 'Processing',
//         badge: 'bg-sky-50 text-sky-700 ring-sky-100',
//         dot: 'bg-sky-500',
//         icon: Package,
//       },
//       shipped: {
//         label: 'Shipped',
//         badge: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
//         dot: 'bg-indigo-500',
//         icon: Truck,
//       },
//       delivered: {
//         label: 'Delivered',
//         badge: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
//         dot: 'bg-emerald-500',
//         icon: CheckCircle2,
//       },
//       cancelled: {
//         label: 'Cancelled',
//         badge: 'bg-rose-50 text-rose-700 ring-rose-100',
//         dot: 'bg-rose-500',
//         icon: XCircle,
//       },
//     };

//     return (
//       map[status] || {
//         label: status || 'Unknown',
//         badge: 'bg-slate-50 text-slate-700 ring-slate-100',
//         dot: 'bg-slate-400',
//         icon: Package,
//       }
//     );
//   };

//   const getTimelineStatusColor = (status) => {
//     const meta = getStatusMeta(status);
//     return {
//       iconWrapper: `${meta.badge} inline-flex items-center justify-center`,
//       dot: meta.dot,
//     };
//   };

//   const formatDateTime = (date) => {
//     if (!date) return '';
//     return new Date(date).toLocaleString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const formatDate = (date) => {
//     if (!date) return '';
//     return new Date(date).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   const getPaymentMeta = () => {
//     if (!order?.paymentInfo) {
//       return {
//         methodLabel: 'Payment',
//         statusLabel: 'N/A',
//         chipClass: 'bg-slate-50 text-slate-700 ring-slate-100',
//       };
//     }

//     const method = order.paymentInfo.method;
//     const status = order.paymentInfo.status;

//     const methodLabel =
//       method === 'razorpay'
//         ? 'Online Payment'
//         : method === 'cod'
//         ? 'Cash on Delivery'
//         : 'Payment';

//     let statusLabel = status || 'Pending';
//     let chipClass = 'bg-slate-50 text-slate-700 ring-slate-100';

//     if (status === 'completed') {
//       statusLabel = 'Paid';
//       chipClass = 'bg-emerald-50 text-emerald-700 ring-emerald-100';
//     } else if (status === 'failed') {
//       statusLabel = 'Failed';
//       chipClass = 'bg-rose-50 text-rose-700 ring-rose-100';
//     } else if (status === 'pending') {
//       statusLabel = method === 'cod' ? 'Pay on Delivery' : 'Pending';
//       chipClass = 'bg-amber-50 text-amber-700 ring-amber-100';
//     }

//     return { methodLabel, statusLabel, chipClass };
//   };

//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 bg-slate-200 rounded w-44" />
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 space-y-4">
//               <div className="h-40 bg-slate-200 rounded-2xl" />
//               <div className="h-40 bg-slate-200 rounded-2xl" />
//             </div>
//             <div className="space-y-4">
//               <div className="h-32 bg-slate-200 rounded-2xl" />
//               <div className="h-32 bg-slate-200 rounded-2xl" />
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!order) {
//     return null;
//   }

//   const statusMeta = getStatusMeta(order.orderStatus);
//   const paymentMeta = getPaymentMeta();

//   return (
//     <div className="min-h-[60vh] bg-slate-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Back button */}
//         <button
//           onClick={() => navigate('/orders')}
//           className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700 mb-6"
//         >
//           <ArrowLeft size={18} />
//           Back to Orders
//         </button>

//         {/* Header / Hero */}
//         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
//           <div className="px-4 sm:px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div className="space-y-1">
//               <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 uppercase tracking-wide">
//                 <Package size={16} />
//                 <span>Order Details</span>
//               </div>
//               <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
//                 Order #{order.orderNumber}
//               </h1>
//               <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-500">
//                 <span>Placed on {formatDateTime(order.createdAt)}</span>
//                 <span className="hidden sm:inline-block text-slate-300">•</span>
//                 <span>
//                   {order.items.length} item
//                   {order.items.length > 1 ? 's' : ''}
//                 </span>
//                 {order.orderStatus === 'delivered' && order.deliveredAt && (
//                   <>
//                     <span className="hidden sm:inline-block text-slate-300">•</span>
//                     <span>Delivered on {formatDate(order.deliveredAt)}</span>
//                   </>
//                 )}
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-2 md:justify-end">
//               {/* Payment chip */}
//               <div
//                 className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ring-1 ${paymentMeta.chipClass}`}
//               >
//                 <CreditCard size={14} />
//                 <span>{paymentMeta.statusLabel}</span>
//               </div>

//               {/* Status chip */}
//               <div
//                 className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ring-1 ${statusMeta.badge}`}
//               >
//                 <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
//                 <statusMeta.icon size={14} />
//                 <span className="capitalize">{statusMeta.label}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Main layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left: Items + shipping + timeline */}
//           <div className="lg:col-span-2 space-y-5">
//             {/* Items card */}
//             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
//               <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
//                 <div>
//                   <h2 className="text-base sm:text-lg font-semibold text-slate-900">
//                     Items in this order
//                   </h2>
//                   <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
//                     {order.items.length} item
//                     {order.items.length > 1 ? 's' : ''} purchased
//                   </p>
//                 </div>
//                 <span className="hidden sm:inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-100">
//                   Order ID: {order._id}
//                 </span>
//               </div>

//               <div className="divide-y divide-slate-100">
//                 {order.items.map((item, index) => (
//                   <div
//                     key={index}
//                     className="px-4 sm:px-6 py-4 flex items-start gap-3 sm:gap-4"
//                   >
//                     <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
//                       <img
//                         src={item.image || '/placeholder.png'}
//                         alt={item.name}
//                         className="h-full w-full object-contain"
//                       />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm sm:text-base font-medium text-slate-900 truncate">
//                         {item.name}
//                       </p>
//                       <p className="text-xs text-slate-500 mt-1">
//                         Qty: <span className="font-medium">{item.quantity}</span>
//                       </p>
//                       <p className="text-xs text-slate-500 mt-0.5">
//                         Price per item: ₹
//                         {(item.discountPrice || item.price).toLocaleString()}
//                         {item.discountPrice && (
//                           <span className="ml-1 line-through text-[11px] text-slate-400">
//                             ₹{item.price.toLocaleString()}
//                           </span>
//                         )}
//                       </p>
//                     </div>
//                     <div className="text-right text-sm sm:text-base">
//                       <p className="font-semibold text-slate-900">
//                         ₹
//                         {(
//                           (item.discountPrice || item.price) * item.quantity
//                         ).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Shipping address */}
//             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
//               <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center gap-2">
//                 <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
//                   <MapPin size={18} />
//                 </div>
//                 <div>
//                   <h2 className="text-base sm:text-lg font-semibold text-slate-900">
//                     Shipping address
//                   </h2>
//                   <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
//                     Your order will be delivered here.
//                   </p>
//                 </div>
//               </div>
//               <div className="px-4 sm:px-6 py-4 text-sm text-slate-700">
//                 <p className="font-semibold">
//                   {order.shippingAddress?.firstName}{' '}
//                   {order.shippingAddress?.lastName}
//                 </p>
//                 <p className="mt-1">{order.shippingAddress?.addressLine1}</p>
//                 {order.shippingAddress?.addressLine2 && (
//                   <p>{order.shippingAddress.addressLine2}</p>
//                 )}
//                 <p className="mt-1">
//                   {order.shippingAddress?.city}, {order.shippingAddress?.state} -{' '}
//                   {order.shippingAddress?.zipCode}
//                 </p>
//                 <p>{order.shippingAddress?.country}</p>
//                 <p className="mt-2 text-sm text-slate-600">
//                   <span className="font-medium">Mobile:</span>{' '}
//                   {order.shippingAddress?.mobile}
//                 </p>
//               </div>
//             </div>

//             {/* Timeline */}
//             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
//               <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
//                 <h2 className="text-base sm:text-lg font-semibold text-slate-900">
//                   Order timeline
//                 </h2>
//                 <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
//                   Track the progress of your order.
//                 </p>
//               </div>
//               <div className="px-4 sm:px-6 py-4">
//                 {order.statusHistory && order.statusHistory.length > 0 ? (
//                   <ol className="relative border-l border-slate-200 space-y-4">
//                     {order.statusHistory.map((history, index) => {
//                       const colors = getTimelineStatusColor(history.status);
//                       const Icon = getStatusMeta(history.status).icon;
//                       return (
//                         <li key={index} className="ml-2 pl-6">
//                           <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200">
//                             <span
//                               className={`h-2.5 w-2.5 rounded-full ${colors.dot}`}
//                             />
//                           </span>
//                           <div
//                             className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${colors.iconWrapper}`}
//                           >
//                             <Icon size={14} />
//                             <span className="capitalize">{history.status}</span>
//                           </div>
//                           <p className="mt-1 text-xs text-slate-500">
//                             {formatDateTime(history.date)}
//                           </p>
//                           {history.note && (
//                             <p className="mt-1 text-xs sm:text-sm text-slate-700">
//                               {history.note}
//                             </p>
//                           )}
//                         </li>
//                       );
//                     })}
//                   </ol>
//                 ) : (
//                   <div className="flex items-start gap-3">
//                     <div
//                       className={`inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-600`}
//                     >
//                       <statusMeta.icon size={18} />
//                     </div>
//                     <div>
//                       <p className="font-medium text-sm capitalize text-slate-900">
//                         {statusMeta.label}
//                       </p>
//                       <p className="text-xs text-slate-500 mt-1">
//                         {formatDateTime(order.createdAt)}
//                       </p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right: Summary + payment + help */}
//           <div className="space-y-5">
//             {/* Order summary */}
//             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
//               <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
//                 <h2 className="text-base sm:text-lg font-semibold text-slate-900">
//                   Order summary
//                 </h2>
//               </div>
//               <div className="px-4 sm:px-6 py-4 space-y-3 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-slate-600">Subtotal</span>
//                   <span className="font-medium text-slate-900">
//                     ₹{order.itemsPrice.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-slate-600">Tax</span>
//                   <span className="font-medium text-slate-900">
//                     ₹{order.taxPrice.toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-slate-600">Shipping</span>
//                   <span className="font-medium">
//                     {order.shippingPrice === 0 ? (
//                       <span className="text-emerald-600">FREE</span>
//                     ) : (
//                       <span className="text-slate-900">
//                         ₹{order.shippingPrice.toLocaleString()}
//                       </span>
//                     )}
//                   </span>
//                 </div>
//                 <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
//                   <span className="font-semibold text-sm text-slate-900">
//                     Total amount
//                   </span>
//                   <span className="text-lg sm:text-xl font-semibold text-emerald-700">
//                     ₹{order.totalPrice.toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Payment info */}
//             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
//               <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center gap-2">
//                 <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-700">
//                   <CreditCard size={18} />
//                 </div>
//                 <div>
//                   <h2 className="text-base sm:text-lg font-semibold text-slate-900">
//                     Payment information
//                   </h2>
//                   <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
//                     Details about how this order was paid.
//                   </p>
//                 </div>
//               </div>
//               <div className="px-4 sm:px-6 py-4 text-sm space-y-2">
//                 <div className="flex justify-between">
//                   <span className="text-slate-600">Method</span>
//                   <span className="font-medium text-slate-900">
//                     {order.paymentInfo?.method === 'cod'
//                       ? 'Cash on Delivery'
//                       : 'Online Payment'}
//                   </span>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <span className="text-slate-600">Status</span>
//                   <span
//                     className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
//                       order.paymentInfo?.status === 'completed'
//                         ? 'bg-emerald-50 text-emerald-700'
//                         : order.paymentInfo?.status === 'failed'
//                         ? 'bg-rose-50 text-rose-700'
//                         : 'bg-amber-50 text-amber-700'
//                     }`}
//                   >
//                     {order.paymentInfo?.status === 'pending' &&
//                     order.paymentInfo?.method === 'cod'
//                       ? 'Pay on Delivery'
//                       : order.paymentInfo?.status || 'N/A'}
//                   </span>
//                 </div>

//                 {order.paymentInfo?.method === 'razorpay' && (
//                   <>
//                     {order.paymentInfo?.razorpayPaymentId && (
//                       <div className="flex justify-between text-xs text-slate-600">
//                         <span>Payment ID</span>
//                         <span className="font-mono">
//                           {order.paymentInfo.razorpayPaymentId}
//                         </span>
//                       </div>
//                     )}
//                     {order.paymentInfo?.razorpayOrderId && (
//                       <div className="flex justify-between text-xs text-slate-600">
//                         <span>Razorpay Order</span>
//                         <span className="font-mono">
//                           {order.paymentInfo.razorpayOrderId}
//                         </span>
//                       </div>
//                     )}
//                   </>
//                 )}

//                 {order.paymentInfo?.method === 'cod' &&
//                   order.paymentInfo?.status === 'pending' && (
//                     <div className="mt-3 px-3 py-3 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-800">
//                       Please keep{' '}
//                       <span className="font-semibold">
//                         ₹{order.totalPrice.toLocaleString()}
//                       </span>{' '}
//                       ready in cash at the time of delivery.
//                     </div>
//                   )}

//                 {order.paymentInfo?.paidAt && (
//                   <div className="mt-2 text-xs text-slate-500">
//                     {order.paymentInfo.method === 'cod'
//                       ? `Cash collected on ${formatDate(
//                           order.paymentInfo.paidAt
//                         )}`
//                       : `Paid on ${formatDate(order.paymentInfo.paidAt)}`}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Help card */}
//             <div className="bg-slate-900 rounded-2xl shadow-sm text-slate-50 p-5 sm:p-6">
//               <h3 className="text-base sm:text-lg font-semibold mb-2">
//                 Need help with this order?
//               </h3>
//               <p className="text-xs sm:text-sm text-slate-300 mb-4">
//                 If you have any questions about delivery, payment, or items in
//                 this order, our support team is ready to assist you.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
//                 <Link
//                   to="/contact"
//                   className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 transition-colors"
//                 >
//                   Contact support
//                 </Link>
//                 <a
//                   href="tel:18001234567"
//                   className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg border border-slate-600 text-sm font-medium text-slate-100 hover:bg-slate-800 transition-colors"
//                 >
//                   Call: 1800-123-4567
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetail;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  CreditCard,
  MapPin,
} from 'lucide-react';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (error) {
      console.error('Order fetch error:', error);
      toast.error('Failed to fetch order details');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusMeta = (status) => {
    const map = {
      pending: {
        label: 'Pending',
        badge: 'bg-amber-50 text-amber-700 ring-amber-100',
        dot: 'bg-amber-500',
        icon: Package,
      },
      processing: {
        label: 'Processing',
        badge: 'bg-sky-50 text-sky-700 ring-sky-100',
        dot: 'bg-sky-500',
        icon: Package,
      },
      shipped: {
        label: 'Shipped',
        badge: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
        dot: 'bg-indigo-500',
        icon: Truck,
      },
      delivered: {
        label: 'Delivered',
        badge: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
        dot: 'bg-emerald-500',
        icon: CheckCircle2,
      },
      cancelled: {
        label: 'Cancelled',
        badge: 'bg-rose-50 text-rose-700 ring-rose-100',
        dot: 'bg-rose-500',
        icon: XCircle,
      },
    };

    return (
      map[status] || {
        label: status || 'Unknown',
        badge: 'bg-slate-50 text-slate-700 ring-slate-100',
        dot: 'bg-slate-400',
        icon: Package,
      }
    );
  };

  const getTimelineStatusColor = (status) => {
    const meta = getStatusMeta(status);
    return {
      iconWrapper: `${meta.badge} inline-flex items-center justify-center`,
      dot: meta.dot,
    };
  };

  const formatDateTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPaymentMeta = () => {
    if (!order?.paymentInfo) {
      return {
        methodLabel: 'Payment',
        statusLabel: 'N/A',
        chipClass: 'bg-slate-50 text-slate-700 ring-slate-100',
      };
    }

    const method = order.paymentInfo.method;
    const status = order.paymentInfo.status;

    const methodLabel =
      method === 'razorpay'
        ? 'Online Payment'
        : method === 'cod'
        ? 'Cash on Delivery'
        : 'Payment';

    let statusLabel = status || 'Pending';
    let chipClass = 'bg-slate-50 text-slate-700 ring-slate-100';

    if (status === 'completed') {
      statusLabel = 'Paid';
      chipClass = 'bg-emerald-50 text-emerald-700 ring-emerald-100';
    } else if (status === 'failed') {
      statusLabel = 'Failed';
      chipClass = 'bg-rose-50 text-rose-700 ring-rose-100';
    } else if (status === 'pending') {
      statusLabel = method === 'cod' ? 'Pay on Delivery' : 'Pending';
      chipClass = 'bg-amber-50 text-amber-700 ring-amber-100';
    }

    return { methodLabel, statusLabel, chipClass };
  };

  const getLatestStatus = (orderObj) => {
    if (!orderObj) return null;
    if (orderObj.statusHistory && orderObj.statusHistory.length > 0) {
      return orderObj.statusHistory[orderObj.statusHistory.length - 1].status;
    }
    return orderObj.orderStatus;
  };

  const getDeliveryMeta = (orderObj) => {
    if (!orderObj) return null;

    const latestStatus = getLatestStatus(orderObj);

    // delivered → use delivered date
    if (latestStatus === 'delivered') {
      const deliveredHistory = orderObj.statusHistory?.find(
        (s) => s.status === 'delivered'
      );
      const deliveredDate =
        deliveredHistory?.changedAt || orderObj.deliveredAt;

      if (deliveredDate) {
        return {
          label: 'Delivered on',
          date: new Date(deliveredDate),
          icon: CheckCircle2,
          accent: 'text-emerald-700',
        };
      }
    }

    // backend expectedDeliveryDate
    if (orderObj.expectedDeliveryDate) {
      return {
        label: 'Expected delivery',
        date: new Date(orderObj.expectedDeliveryDate),
        icon: Truck,
        accent: 'text-emerald-700',
      };
    }

    // fallback estimate based on createdAt + status
    if (!orderObj.createdAt) return null;

    const createdAt = new Date(orderObj.createdAt);
    const status = latestStatus;
    const expected = new Date(createdAt);

    if (['pending', 'processing'].includes(status)) {
      expected.setDate(expected.getDate() + 2);
    } else if (status === 'shipped') {
      expected.setDate(expected.getDate() + 1);
    } else {
      expected.setDate(expected.getDate() + 2);
    }

    return {
      label: 'Estimated delivery',
      date: expected,
      icon: Truck,
      accent: 'text-emerald-600',
    };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-44" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-40 bg-slate-200 rounded-2xl" />
              <div className="h-40 bg-slate-200 rounded-2xl" />
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-slate-200 rounded-2xl" />
              <div className="h-32 bg-slate-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const latestStatus = getLatestStatus(order);
  const statusMeta = getStatusMeta(latestStatus);
  const StatusIcon = statusMeta.icon;
  const paymentMeta = getPaymentMeta();
  const deliveryMeta = getDeliveryMeta(order);
  const DeliveryIcon = deliveryMeta?.icon;

  return (
    <div className="min-h-[60vh] bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-700 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>

        {/* Header / hero */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-6">
          <div className="px-4 sm:px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 uppercase tracking-wide">
                <Package size={16} />
                <span>Order Details</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Order #{order.orderNumber}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-500">
                <span>Placed on {formatDateTime(order.createdAt)}</span>
                <span className="hidden sm:inline-block text-slate-300">•</span>
                <span>
                  {order.items.length} item
                  {order.items.length > 1 ? 's' : ''}
                </span>

                {deliveryMeta && (
                  <>
                    <span className="hidden sm:inline-block text-slate-300">
                      •
                    </span>
                    <span className="inline-flex items-center gap-1">
                      {DeliveryIcon && (
                        <DeliveryIcon size={14} className="text-emerald-500" />
                      )}
                      <span>
                        {deliveryMeta.label}{' '}
                        <span
                          className={`font-medium ${deliveryMeta.accent}`}
                        >
                          {formatDate(deliveryMeta.date)}
                        </span>
                      </span>
                    </span>
                  </>
                )}

                {/* Show courier in header if available */}
                {order.carrier && (
                  <>
                    <span className="hidden sm:inline-block text-slate-300">
                      •
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm text-slate-500">
                      Shipped via{' '}
                      <span className="font-medium text-slate-800">
                        {order.carrier}
                      </span>
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              {/* Payment chip */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ring-1 ${paymentMeta.chipClass}`}
              >
                <CreditCard size={14} />
                <span>{paymentMeta.statusLabel}</span>
              </div>

              {/* Status chip */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ring-1 ${statusMeta.badge}`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${statusMeta.dot}`}
                />
                <StatusIcon size={14} />
                <span className="capitalize">{statusMeta.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: items + shipping + timeline */}
          <div className="lg:col-span-2 space-y-5">
            {/* Items */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                    Items in this order
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {order.items.length} item
                    {order.items.length > 1 ? 's' : ''} purchased
                  </p>
                </div>
                <span className="hidden sm:inline-flex items-center justify-center px-3 py-1 rounded-full text-[11px] font-medium bg-slate-50 text-slate-600 border border-slate-100">
                  Order ID: {order._id}
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="px-4 sm:px-6 py-4 flex items-start gap-3 sm:gap-4"
                  >
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src={item.image || '/placeholder.png'}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-medium text-slate-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Qty:{' '}
                        <span className="font-medium">{item.quantity}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Price per item: ₹
                        {(item.discountPrice || item.price).toLocaleString()}
                        {item.discountPrice && (
                          <span className="ml-1 line-through text-[11px] text-slate-400">
                            ₹{item.price.toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="text-right text-sm sm:text-base">
                      <p className="font-semibold text-slate-900">
                        ₹
                        {(
                          (item.discountPrice || item.price) * item.quantity
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <MapPin size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                    Shipping address
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Your order will be delivered here.
                  </p>
                </div>
              </div>
              <div className="px-4 sm:px-6 py-4 text-sm text-slate-700">
                <p className="font-semibold">
                  {order.shippingAddress?.firstName}{' '}
                  {order.shippingAddress?.lastName}
                </p>
                <p className="mt-1">{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p className="mt-1">
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} -{' '}
                  {order.shippingAddress?.zipCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
                <p className="mt-2 text-sm text-slate-600">
                  <span className="font-medium">Mobile:</span>{' '}
                  {order.shippingAddress?.mobile}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  Order timeline
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Track the progress of your order from placement to delivery.
                </p>
              </div>
              <div className="px-4 sm:px-6 py-4">
                {order.statusHistory && order.statusHistory.length > 0 ? (
                  <ol className="relative border-l border-slate-200 space-y-4">
                    {order.statusHistory.map((history, index) => {
                      const colors = getTimelineStatusColor(history.status);
                      const Meta = getStatusMeta(history.status);
                      const Icon = Meta.icon;
                      return (
                        <li key={index} className="ml-2 pl-6">
                          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${colors.dot}`}
                            />
                          </span>
                          <div
                            className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium ${colors.iconWrapper}`}
                          >
                            <Icon size={14} />
                            <span className="capitalize">
                              {history.status}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatDateTime(history.changedAt || history.date)}
                          </p>
                          {history.note && (
                            <p className="mt-1 text-xs sm:text-sm text-slate-700">
                              {history.note}
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <div className="flex items-start gap-3">
                    <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-600">
                      <StatusIcon size={18} />
                    </div>
                    <div>
                      <p className="font-medium text-sm capitalize text-slate-900">
                        {statusMeta.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {formatDateTime(order.createdAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: summary + payment + tracking + help */}
          <div className="space-y-5">
            {/* Order summary */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  Order summary
                </h2>
              </div>
              <div className="px-4 sm:px-6 py-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-900">
                    ₹{order.itemsPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-medium text-slate-900">
                    ₹{order.taxPrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-medium">
                    {order.shippingPrice === 0 ? (
                      <span className="text-emerald-600">FREE</span>
                    ) : (
                      <span className="text-slate-900">
                        ₹{order.shippingPrice.toLocaleString()}
                      </span>
                    )}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-sm text-slate-900">
                    Total amount
                  </span>
                  <span className="text-lg sm:text-xl font-semibold text-emerald-700">
                    ₹{order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-700">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                    Payment information
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Details about how this order was paid.
                  </p>
                </div>
              </div>
              <div className="px-4 sm:px-6 py-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Method</span>
                  <span className="font-medium text-slate-900">
                    {order.paymentInfo?.method === 'cod'
                      ? 'Cash on Delivery'
                      : 'Online Payment'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Status</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                      order.paymentInfo?.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : order.paymentInfo?.status === 'failed'
                        ? 'bg-rose-50 text-rose-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {order.paymentInfo?.status === 'pending' &&
                    order.paymentInfo?.method === 'cod'
                      ? 'Pay on Delivery'
                      : order.paymentInfo?.status || 'N/A'}
                  </span>
                </div>

                {order.paymentInfo?.method === 'razorpay' && (
                  <>
                    {order.paymentInfo?.razorpayPaymentId && (
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Payment ID</span>
                        <span className="font-mono">
                          {order.paymentInfo.razorpayPaymentId}
                        </span>
                      </div>
                    )}
                    {order.paymentInfo?.razorpayOrderId && (
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Razorpay Order</span>
                        <span className="font-mono">
                          {order.paymentInfo.razorpayOrderId}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {order.paymentInfo?.method === 'cod' &&
                  order.paymentInfo?.status === 'pending' && (
                    <div className="mt-3 px-3 py-3 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-800">
                      Please keep{' '}
                      <span className="font-semibold">
                        ₹{order.totalPrice.toLocaleString()}
                      </span>{' '}
                      ready in cash at the time of delivery.
                    </div>
                  )}

                {order.paymentInfo?.paidAt && (
                  <div className="mt-2 text-xs text-slate-500">
                    {order.paymentInfo.method === 'cod'
                      ? `Cash collected on ${formatDate(
                          order.paymentInfo.paidAt
                        )}`
                      : `Paid on ${formatDate(order.paymentInfo.paidAt)}`}
                  </div>
                )}
              </div>
            </div>

            {/* Delivery & tracking (reads values set by admin) */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-sky-50 flex items-center justify-center text-sky-600">
                  <Truck size={18} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                    Delivery & tracking
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Track where your package is in the journey.
                  </p>
                </div>
              </div>
              <div className="px-4 sm:px-6 py-4 text-sm space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Courier</span>
                  <span className="font-medium text-slate-900">
                    {order.carrier || 'Not assigned yet'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-600">Tracking ID</span>
                  <span className="font-mono text-xs sm:text-sm text-slate-900">
                    {order.trackingId || 'Not assigned yet'}
                  </span>
                </div>

                {order.trackingUrl ? (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center mt-2 w-full px-4 py-2 rounded-lg bg-sky-50 text-sky-700 text-sm font-medium hover:bg-sky-100 transition-colors"
                  >
                    View live tracking
                  </a>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">
                    Once your order is handed over to a courier partner,
                    tracking details will appear here.
                  </p>
                )}
              </div>
            </div>

            {/* Help */}
            <div className="bg-slate-900 rounded-2xl shadow-sm text-slate-50 p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Need help with this order?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mb-4">
                If you have any questions about delivery, payment, or items in
                this order, our support team is ready to assist you.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg bg-white text-slate-900 text-sm font-medium hover:bg-slate-100 transition-colors"
                >
                  Contact support
                </Link>
                <a
                  href="tel:18001234567"
                  className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-lg border border-slate-600 text-sm font-medium text-slate-100 hover:bg-slate-800 transition-colors"
                >
                  Call: 1800-123-4567
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;



