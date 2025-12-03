// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import api from '../utils/api';
// import {
//   Package,
//   Eye,
//   CreditCard,
//   Truck,
//   CheckCircle2,
//   Clock,
// } from 'lucide-react';

// const Orders = () => {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (user) {
//       fetchOrders();
//     }
//   }, [user]);

//   const fetchOrders = async () => {
//     try {
//       const res = await api.get('/orders');
//       setOrders(res.data || []);
//     } catch (error) {
//       console.error('Error fetching orders:', error);
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
//         icon: Clock,
//       },
//       processing: {
//         label: 'Processing',
//         badge: 'bg-sky-50 text-sky-700 ring-sky-100',
//         dot: 'bg-sky-500',
//         icon: Truck,
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
//         icon: Clock,
//       },
//     };

//     return (
//       map[status] || {
//         label: status || 'Unknown',
//         badge: 'bg-slate-50 text-slate-700 ring-slate-100',
//         dot: 'bg-slate-400',
//         icon: Clock,
//       }
//     );
//   };

//   const getPaymentMeta = (order) => {
//     const method = order?.paymentInfo?.method || 'unknown';
//     const status = order?.paymentInfo?.status || 'pending';

//     const methodLabel =
//       method === 'razorpay'
//         ? 'Online Payment'
//         : method === 'cod'
//         ? 'Cash on Delivery'
//         : 'Payment';

//     let statusLabel = 'Pending';
//     let color =
//       'bg-slate-50 text-slate-700 ring-1 ring-slate-100 border border-transparent';

//     if (status === 'completed') {
//       statusLabel = 'Paid';
//       color = 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100';
//     } else if (status === 'failed') {
//       statusLabel = 'Failed';
//       color = 'bg-rose-50 text-rose-700 ring-1 ring-rose-100';
//     }

//     return {
//       methodLabel,
//       statusLabel,
//       color,
//     };
//   };

//   const formatDate = (date) => {
//     if (!date) return '';
//     return new Date(date).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 w-40 bg-slate-200 rounded-md" />
//           <div className="space-y-3">
//             {[1, 2, 3].map((i) => (
//               <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4">
//                 <div className="flex justify-between mb-4">
//                   <div className="space-y-2">
//                     <div className="h-4 w-48 bg-slate-200 rounded" />
//                     <div className="h-3 w-32 bg-slate-100 rounded" />
//                   </div>
//                   <div className="h-8 w-24 bg-slate-100 rounded-full" />
//                 </div>
//                 <div className="h-16 bg-slate-50 rounded-xl" />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-[60vh] bg-slate-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
//           <div>
//             <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium mb-1">
//               <Package size={18} />
//               <span>Order history</span>
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
//               My Orders
//             </h1>
//             <p className="text-sm text-slate-600 mt-1">
//               Track your purchases, delivery status, and payment details.
//             </p>
//           </div>
//           {orders.length > 0 && (
//             <div className="text-right text-xs sm:text-sm text-slate-500">
//               <span className="font-medium text-slate-700">{orders.length}</span>{' '}
//               order{orders.length > 1 ? 's' : ''} found
//             </div>
//           )}
//         </div>

//         {/* Empty state */}
//         {orders.length === 0 ? (
//           <div className="bg-white border border-dashed border-slate-200 rounded-2xl py-14 px-6 text-center shadow-sm">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
//               <Package size={32} className="text-slate-400" />
//             </div>
//             <h2 className="text-xl font-semibold text-slate-900 mb-2">
//               You don’t have any orders yet
//             </h2>
//             <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
//               Browse our products and place your first order. Your order history will
//               appear here once you start shopping.
//             </p>
//             <Link
//               to="/products"
//               className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-medium shadow-sm hover:bg-emerald-700 transition-colors"
//             >
//               Browse products
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-4 lg:space-y-5">
//             {orders.map((order) => {
//               const statusMeta = getStatusMeta(order.orderStatus);
//               const paymentMeta = getPaymentMeta(order);
//               const StatusIcon = statusMeta.icon;

//               const firstItems = order.items.slice(0, 2);
//               const remainingCount = order.items.length - firstItems.length;

//               return (
//                 <div
//                   key={order._id}
//                   className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
//                 >
//                   {/* Top row */}
//                   <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-slate-100">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
//                       <div className="space-y-1">
//                         <div className="flex items-center gap-2 text-sm text-slate-500">
//                           <span className="font-medium text-slate-900">
//                             Order #{order.orderNumber}
//                           </span>
//                         </div>
//                         <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
//                           <span>Placed on {formatDate(order.createdAt)}</span>
//                           {order?.paymentInfo?.method && (
//                             <span className="hidden sm:inline-block text-slate-400">
//                               •
//                             </span>
//                           )}
//                           {order?.paymentInfo?.method && (
//                             <span className="inline-flex items-center gap-1">
//                               <CreditCard size={14} />
//                               {paymentMeta.methodLabel}
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       <div className="flex flex-wrap items-center gap-2 md:justify-end">
//                         {/* Payment badge */}
//                         <div
//                           className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${paymentMeta.color}`}
//                         >
//                           <CreditCard size={14} />
//                           <span>{paymentMeta.statusLabel}</span>
//                         </div>

//                         {/* Status badge */}
//                         <div
//                           className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ring-1 ${statusMeta.badge}`}
//                         >
//                           <span
//                             className={`h-2 w-2 rounded-full ${statusMeta.dot}`}
//                           />
//                           <StatusIcon size={14} />
//                           <span className="capitalize">
//                             {statusMeta.label || order.orderStatus}
//                           </span>
//                         </div>

//                         {/* View details */}
//                         <Link
//                           to={`/orders/${order._id}`}
//                           className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
//                         >
//                           <Eye size={14} />
//                           <span>View details</span>
//                         </Link>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Items preview */}
//                   <div className="px-4 sm:px-6 py-3 sm:py-4">
//                     <div className="flex flex-col gap-3">
//                       {firstItems.map((item, index) => (
//                         <div
//                           key={index}
//                           className="flex items-center gap-3 sm:gap-4"
//                         >
//                           <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden">
//                             <img
//                               src={item.image || '/placeholder.png'}
//                               alt={item.name}
//                               className="h-full w-full object-contain"
//                             />
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <p className="text-sm font-medium text-slate-900 truncate">
//                               {item.name}
//                             </p>
//                             <p className="text-xs text-slate-500 mt-0.5">
//                               Qty: {item.quantity}
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <p className="text-sm font-semibold text-slate-900">
//                               ₹
//                               {(
//                                 (item.discountPrice || item.price) * item.quantity
//                               ).toLocaleString()}
//                             </p>
//                             {item.discountPrice && (
//                               <p className="text-[11px] text-slate-400 line-through">
//                                 ₹{(item.price * item.quantity).toLocaleString()}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       ))}

//                       {remainingCount > 0 && (
//                         <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
//                           <span>
//                             + {remainingCount} more item
//                             {remainingCount > 1 ? 's' : ''}
//                           </span>
//                           <Link
//                             to={`/orders/${order._id}`}
//                             className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium"
//                           >
//                             View all
//                             <Eye size={12} />
//                           </Link>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Footer row */}
//                   <div className="px-4 sm:px-6 py-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//                     <div className="text-xs sm:text-sm text-slate-500">
//                       <span className="font-medium text-slate-700">
//                         {order.items.length}
//                       </span>{' '}
//                       item{order.items.length > 1 ? 's' : ''} • Order ID:{' '}
//                       <span className="font-mono text-[11px] sm:text-xs text-slate-500">
//                         {order._id}
//                       </span>
//                     </div>
//                     <div className="flex items-baseline gap-2 sm:gap-3 justify-between sm:justify-end">
//                       <span className="text-xs text-slate-500 uppercase tracking-wide">
//                         Total
//                       </span>
//                       <span className="text-lg sm:text-xl font-semibold text-slate-900">
//                         ₹{order.totalPrice.toLocaleString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Orders;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  Package,
  Eye,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import ordersBg from '../assets/ordersbg.png';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusMeta = (status) => {
    const map = {
      pending: {
        label: 'Pending',
        badge: 'bg-zinc-900 text-zinc-200 ring-zinc-700',
        dot: 'bg-amber-400',
        icon: Clock,
      },
      processing: {
        label: 'Processing',
        badge: 'bg-zinc-900 text-zinc-200 ring-zinc-700',
        dot: 'bg-sky-400',
        icon: Truck,
      },
      shipped: {
        label: 'Shipped',
        badge: 'bg-zinc-900 text-zinc-200 ring-zinc-700',
        dot: 'bg-indigo-400',
        icon: Truck,
      },
      delivered: {
        label: 'Delivered',
        badge: 'bg-zinc-900 text-zinc-200 ring-zinc-700',
        dot: 'bg-blue-400',
        icon: CheckCircle2,
      },
      cancelled: {
        label: 'Cancelled',
        badge: 'bg-zinc-900 text-zinc-200 ring-zinc-700',
        dot: 'bg-rose-500',
        icon: Clock,
      },
    };

    return (
      map[status] || {
        label: status || 'Unknown',
        badge: 'bg-zinc-900 text-zinc-200 ring-zinc-700',
        dot: 'bg-zinc-500',
        icon: Clock,
      }
    );
  };

  const getPaymentMeta = (order) => {
    const method = order?.paymentInfo?.method || 'unknown';
    const status = order?.paymentInfo?.status || 'pending';

    const methodLabel =
      method === 'razorpay'
        ? 'Online Payment'
        : method === 'cod'
        ? 'Cash on Delivery'
        : 'Payment';

    let statusLabel = 'Pending';
    let color =
      'bg-zinc-900 text-zinc-200 ring-1 ring-zinc-700 border border-transparent';

    if (status === 'completed') {
      statusLabel = 'Paid';
      color =
        'bg-zinc-900 text-zinc-100 ring-1 ring-zinc-500 border border-zinc-600';
    } else if (status === 'failed') {
      statusLabel = 'Failed';
      color =
        'bg-rose-900/40 text-rose-300 ring-1 ring-rose-700 border border-rose-800';
    } else if (status === 'pending' && method === 'cod') {
      statusLabel = 'Pay on Delivery';
      color =
        'bg-amber-900/40 text-amber-200 ring-1 ring-amber-700 border border-amber-800';
    }

    return {
      methodLabel,
      statusLabel,
      color,
    };
  };

  const getLatestStatus = (order) => {
    if (!order) return null;
    if (order.statusHistory && order.statusHistory.length > 0) {
      return order.statusHistory[order.statusHistory.length - 1].status;
    }
    return order.orderStatus;
  };

  const getDeliveryMeta = (order) => {
    if (!order) return null;

    const latestStatus = getLatestStatus(order);

    // Delivered → show actual delivered date if possible
    if (latestStatus === 'delivered') {
      const deliveredHistory = order.statusHistory?.find(
        (s) => s.status === 'delivered'
      );
      const deliveredDate = deliveredHistory?.changedAt || order.deliveredAt;

      if (deliveredDate) {
        return {
          label: 'Delivered on',
          date: new Date(deliveredDate),
          icon: CheckCircle2,
          accent: 'text-blue-300',
        };
      }
    }

    // Use backend expectedDeliveryDate if present
    if (order.expectedDeliveryDate) {
      return {
        label: 'Expected delivery',
        date: new Date(order.expectedDeliveryDate),
        icon: Truck,
        accent: 'text-zinc-100',
      };
    }

    // Fallback: simple estimate from createdAt + status
    if (!order.createdAt) return null;

    const createdAt = new Date(order.createdAt);
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
      accent: 'text-zinc-100',
    };
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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

  // Loader UI
  if (loading) {
    return (
      <div
        className="min-h-screen w-full relative overflow-hidden"
        style={{
          backgroundImage: `url(${ordersBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-2 border-zinc-700 border-t-transparent rounded-full animate-spin" />
            <div className="space-y-1 text-center">
              <p className="text-sm font-medium text-zinc-100">
                Loading your orders
              </p>
              <p className="text-xs text-zinc-400">
                Please wait while we fetch your order history.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        backgroundImage: `url(${ordersBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-zinc-300 font-medium mb-1">
              <div className="h-8 w-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                <Package size={18} className="text-zinc-200" />
              </div>
              <span className="uppercase tracking-[0.16em] text-[11px] text-zinc-400">
                Order history
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-zinc-50">
              My Orders
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Track your purchases, delivery status, and payment details.
            </p>
          </div>
          {orders.length > 0 && (
            <div className="text-right text-xs sm:text-sm text-zinc-400">
              <span className="font-medium text-zinc-100">{orders.length}</span>{' '}
              order{orders.length > 1 ? 's' : ''} found
            </div>
          )}
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl py-14 px-6 text-center shadow-[0_18px_45px_rgba(0,0,0,0.7)] backdrop-blur">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 mb-4">
              <Package size={32} className="text-zinc-400" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-50 mb-2">
              You don’t have any orders yet
            </h2>
            <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">
              Browse our products and place your first order. Your order history
              will appear here once you start shopping.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-950 text-zinc-50 text-sm font-medium border border-zinc-700 shadow-sm hover:bg-zinc-900 hover:border-zinc-500 transition-colors"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="space-y-4 lg:space-y-5">
            {orders.map((order) => {
              const statusMeta = getStatusMeta(order.orderStatus);
              const paymentMeta = getPaymentMeta(order);
              const StatusIcon = statusMeta.icon;
              const deliveryMeta = getDeliveryMeta(order);
              const DeliveryIcon = deliveryMeta?.icon;

              const firstItems = order.items.slice(0, 2);
              const remainingCount = order.items.length - firstItems.length;

              return (
                <div
                  key={order._id}
                  className="bg-zinc-950/80 border border-zinc-800 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.75)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.85)] transition-shadow backdrop-blur"
                >
                  {/* Top row */}
                  <div className="px-4 sm:px-6 pt-4 pb-3 border-b border-zinc-800/80">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                          <span className="font-medium text-zinc-50">
                            Order #{order.orderNumber}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                          <span>
                            Placed on {formatDateTime(order.createdAt)}
                          </span>

                          {order?.paymentInfo?.method && (
                            <>
                              <span className="hidden sm:inline-block text-zinc-600">
                                •
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <CreditCard size={14} />
                                {paymentMeta.methodLabel}
                              </span>
                            </>
                          )}

                          {deliveryMeta && DeliveryIcon && (
                            <>
                              <span className="hidden sm:inline-block text-zinc-600">
                                •
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <DeliveryIcon
                                  size={14}
                                  className="text-zinc-200"
                                />
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
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 md:justify-end">
                        {/* Payment badge */}
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${paymentMeta.color}`}
                        >
                          <CreditCard size={14} />
                          <span>{paymentMeta.statusLabel}</span>
                        </div>

                        {/* Status badge */}
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ring-1 ${statusMeta.badge}`}
                        >
                          <span
                            className={`h-2 w-2 rounded-full ${statusMeta.dot}`}
                          />
                          <StatusIcon size={14} />
                          <span className="capitalize">
                            {statusMeta.label || order.orderStatus}
                          </span>
                        </div>

                        {/* View / Track */}
                        <Link
                          to={`/orders/${order._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-700 text-xs font-medium text-zinc-100 hover:bg-zinc-900"
                        >
                          <Eye size={14} />
                          <span>View & Track</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-col gap-3">
                      {firstItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 sm:gap-4"
                        >
                          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg border border-zinc-800 bg-zinc-900/60 flex items-center justify-center overflow-hidden">
                            <img
                              src={item.image || '/placeholder.png'}
                              alt={item.name}
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-zinc-50 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-zinc-500 mt-0.5">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-zinc-50">
                              ₹
                              {(
                                (item.discountPrice || item.price) *
                                item.quantity
                              ).toLocaleString()}
                            </p>
                            {item.discountPrice && (
                              <p className="text-[11px] text-zinc-500 line-through">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}

                      {remainingCount > 0 && (
                        <div className="flex items-center justify-between text-xs text-zinc-500 mt-1">
                          <span>
                            + {remainingCount} more item
                            {remainingCount > 1 ? 's' : ''}
                          </span>
                          <Link
                            to={`/orders/${order._id}`}
                            className="inline-flex items-center gap-1 text-zinc-100 hover:text-zinc-50 font-medium"
                          >
                            View all
                            <Eye size={12} />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer row */}
                  <div className="px-4 sm:px-6 py-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="text-xs sm:text-sm text-zinc-500">
                      <span className="font-medium text-zinc-100">
                        {order.items.length}
                      </span>{' '}
                      item{order.items.length > 1 ? 's' : ''} • Order ID:{' '}
                      <span className="font-mono text-[11px] sm:text-xs text-zinc-500">
                        {order._id}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2 sm:gap-3 justify-between sm:justify-end">
                      <span className="text-xs text-zinc-500 uppercase tracking-wide">
                        Total
                      </span>
                      <span className="text-lg sm:text-xl font-semibold text-zinc-50">
                        ₹{order.totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
