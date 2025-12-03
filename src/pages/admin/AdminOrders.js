
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import api from '../../utils/api';
// import toast from 'react-hot-toast';
// import { Search, Filter, Eye, Truck, CheckCircle2 } from 'lucide-react';

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filters, setFilters] = useState({
//     orderNumber: '',
//     status: '',
//     startDate: '',
//     endDate: '',
//   });
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     totalOrders: 0,
//   });

//   useEffect(() => {
//     fetchOrders();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [filters, pagination.currentPage]);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const params = {
//         page: pagination.currentPage,
//         limit: 20,
//         ...Object.fromEntries(
//           Object.entries(filters).filter(([_, v]) => v !== '')
//         ),
//       };

//       const res = await api.get('/orders/all', { params });
//       setOrders(res.data.orders);
//       setPagination({
//         currentPage: Number(res.data.currentPage),
//         totalPages: res.data.totalPages,
//         totalOrders: res.data.totalOrders,
//       });
//     } catch (error) {
//       toast.error('Failed to fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-amber-50 text-amber-700 border border-amber-100',
//       processing: 'bg-sky-50 text-sky-700 border border-sky-100',
//       shipped: 'bg-violet-50 text-violet-700 border border-violet-100',
//       delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
//       cancelled: 'bg-rose-50 text-rose-700 border border-rose-100',
//     };
//     return (
//       colors[status] ||
//       'bg-slate-50 text-slate-700 border border-slate-100'
//     );
//   };

//   const handleFilterChange = (field, value) => {
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//     setFilters((prev) => ({ ...prev, [field]: value }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       orderNumber: '',
//       status: '',
//       startDate: '',
//       endDate: '',
//     });
//     setPagination((prev) => ({ ...prev, currentPage: 1 }));
//   };

//   const formatDate = (date) => {
//     if (!date) return '';
//     return new Date(date).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//     });
//   };

//   const getLatestStatus = (order) => {
//     if (order.statusHistory && order.statusHistory.length > 0) {
//       return order.statusHistory[order.statusHistory.length - 1].status;
//     }
//     return order.orderStatus;
//   };

//   const getDeliveryMeta = (order) => {
//     if (!order) return null;

//     const latestStatus = getLatestStatus(order);

//     // Delivered → use delivered date if present
//     if (latestStatus === 'delivered') {
//       const deliveredHistory = order.statusHistory?.find(
//         (s) => s.status === 'delivered'
//       );
//       const deliveredDate =
//         deliveredHistory?.changedAt || order.deliveredAt;

//       if (deliveredDate) {
//         return {
//           label: 'Delivered',
//           date: new Date(deliveredDate),
//           icon: CheckCircle2,
//           accent: 'text-emerald-700',
//         };
//       }
//     }

//     // Backend expectedDeliveryDate
//     if (order.expectedDeliveryDate) {
//       return {
//         label: 'Expected delivery',
//         date: new Date(order.expectedDeliveryDate),
//         icon: Truck,
//         accent: 'text-emerald-700',
//       };
//     }

//     // Fallback simple estimate from createdAt + status
//     if (!order.createdAt) return null;

//     const createdAt = new Date(order.createdAt);
//     const status = latestStatus;
//     const expected = new Date(createdAt);

//     if (['pending', 'processing'].includes(status)) {
//       expected.setDate(expected.getDate() + 2);
//     } else if (status === 'shipped') {
//       expected.setDate(expected.getDate() + 1);
//     } else {
//       expected.setDate(expected.getDate() + 2);
//     }

//     return {
//       label: 'Estimated delivery',
//       date: expected,
//       icon: Truck,
//       accent: 'text-emerald-600',
//     };
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div>
//           <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
//             Orders
//           </h1>
//           <p className="mt-1 text-xs sm:text-sm text-slate-500">
//             Manage customer orders and track fulfillment for Vemapri grocery.
//           </p>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
//             <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
//             {pagination.totalOrders} total orders
//           </span>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="rounded-2xl bg-white/90 border border-emerald-100/80 shadow-sm p-4 sm:p-5">
//         <div className="flex items-center justify-between mb-4 gap-3">
//           <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
//             <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
//               <Filter size={16} />
//             </span>
//             <span>Filter orders</span>
//           </div>
//           <button
//             onClick={clearFilters}
//             className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50/70 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-100 transition-all"
//           >
//             Clear all
//           </button>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
//           {/* Order number search */}
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search by order number..."
//               value={filters.orderNumber}
//               onChange={(e) =>
//                 handleFilterChange('orderNumber', e.target.value)
//               }
//               className="input pl-9 text-sm"
//             />
//             <Search
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//               size={18}
//             />
//           </div>

//           {/* Status */}
//           <select
//             value={filters.status}
//             onChange={(e) => handleFilterChange('status', e.target.value)}
//             className="input text-sm"
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="processing">Processing</option>
//             <option value="shipped">Shipped</option>
//             <option value="delivered">Delivered</option>
//             <option value="cancelled">Cancelled</option>
//           </select>

//           {/* Date range */}
//           <input
//             type="date"
//             value={filters.startDate}
//             onChange={(e) =>
//               handleFilterChange('startDate', e.target.value)
//             }
//             className="input text-sm"
//             placeholder="Start Date"
//           />
//           <input
//             type="date"
//             value={filters.endDate}
//             onChange={(e) =>
//               handleFilterChange('endDate', e.target.value)
//             }
//             className="input text-sm"
//             placeholder="End Date"
//           />
//         </div>
//       </div>

//       {/* Orders Table */}
//       <div className="rounded-2xl bg-white/95 border border-emerald-100/80 shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-emerald-50 text-sm">
//             <thead className="bg-emerald-50/80">
//               <tr>
//                 <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
//                   Order #
//                 </th>
//                 <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
//                   Customer
//                 </th>
//                 <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
//                   Date & Delivery
//                 </th>
//                 <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
//                   Items
//                 </th>
//                 <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
//                   Total
//                 </th>
//                 <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
//                   Payment
//                 </th>
//                 <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="bg-white/90 divide-y divide-emerald-50">
//               {loading ? (
//                 <tr>
//                   <td colSpan="8" className="px-6 py-10 text-center">
//                     <div className="flex flex-col items-center gap-2 text-slate-400 text-sm">
//                       <div className="h-6 w-6 rounded-full border-2 border-emerald-200 border-t-emerald-500 animate-spin" />
//                       <span>Loading orders…</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : orders.length === 0 ? (
//                 <tr>
//                   <td
//                     colSpan="8"
//                     className="px-6 py-10 text-center text-slate-400 text-sm"
//                   >
//                     No orders found for the selected filters.
//                   </td>
//                 </tr>
//               ) : (
//                 orders.map((order) => {
//                   const deliveryMeta = getDeliveryMeta(order);

//                   return (
//                     <tr
//                       key={order._id}
//                       className="hover:bg-emerald-50/60 transition-colors"
//                     >
//                       {/* Order number */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <Link
//                           to={`/admin/orders/${order._id}`}
//                           className="text-[13px] font-semibold text-emerald-700 hover:text-emerald-900"
//                         >
//                           {order.orderNumber}
//                         </Link>
//                       </td>

//                       {/* Customer */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div>
//                           <div className="text-[13px] font-medium text-slate-900">
//                             {order.user?.firstName} {order.user?.lastName}
//                           </div>
//                           <div className="text-[11px] text-slate-500">
//                             {order.user?.email}
//                           </div>
//                         </div>
//                       </td>

//                       {/* Date + delivery */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-[13px] text-slate-700">
//                           {formatDate(order.createdAt)}
//                         </div>
//                         {deliveryMeta && (
//                           <div className="mt-1 flex items-center gap-1 text-[11px]">
//                             <deliveryMeta.icon
//                               size={12}
//                               className="text-emerald-500"
//                             />
//                             <span className="text-slate-500">
//                               {deliveryMeta.label}:{' '}
//                               <span
//                                 className={`font-medium ${deliveryMeta.accent}`}
//                               >
//                                 {formatDate(deliveryMeta.date)}
//                               </span>
//                             </span>
//                           </div>
//                         )}
//                       </td>

//                       {/* Items count */}
//                       <td className="px-6 py-4 whitespace-nowrap text-[13px] text-slate-600">
//                         {order.items.length} item(s)
//                       </td>

//                       {/* Total */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="text-[13px] font-semibold text-slate-900">
//                           ₹{order.totalPrice.toLocaleString()}
//                         </div>
//                       </td>

//                       {/* Payment */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex flex-col gap-1">
//                           <span
//                             className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
//                               order.paymentInfo?.status === 'completed'
//                                 ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
//                                 : order.paymentInfo?.status === 'failed'
//                                 ? 'bg-rose-50 text-rose-700 border border-rose-100'
//                                 : 'bg-amber-50 text-amber-700 border border-amber-100'
//                             }`}
//                           >
//                             <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
//                             {order.paymentInfo?.status || 'pending'}
//                           </span>
//                           <span className="text-[11px] text-slate-500 uppercase tracking-wide">
//                             {order.paymentInfo?.method || 'N/A'}
//                           </span>
//                         </div>
//                       </td>

//                       {/* Order status */}
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusColor(
//                             order.orderStatus
//                           )}`}
//                         >
//                           <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
//                           {order.orderStatus}
//                         </span>
//                       </td>

//                       {/* Actions */}
//                       <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                         <Link
//                           to={`/admin/orders/${order._id}`}
//                           className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-200 transition-all"
//                           title="View order details"
//                         >
//                           <Eye size={16} />
//                         </Link>
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pagination.totalPages > 1 && (
//           <div className="bg-emerald-50/70 border-t border-emerald-100 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
//             <div>
//               Page{' '}
//               <span className="font-semibold text-slate-900">
//                 {pagination.currentPage}
//               </span>{' '}
//               of{' '}
//               <span className="font-semibold text-slate-900">
//                 {pagination.totalPages}
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() =>
//                   setPagination((prev) => ({
//                     ...prev,
//                     currentPage: prev.currentPage - 1,
//                   }))
//                 }
//                 disabled={pagination.currentPage === 1}
//                 className="px-3 py-1.5 rounded-full border border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
//               >
//                 Previous
//               </button>
//               <button
//                 onClick={() =>
//                   setPagination((prev) => ({
//                     ...prev,
//                     currentPage: prev.currentPage + 1,
//                   }))
//                 }
//                 disabled={pagination.currentPage === pagination.totalPages}
//                 className="px-3 py-1.5 rounded-full border border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminOrders;
// src/pages/admin/AdminOrders.js  (replace your existing component)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle2,
  Package,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  // User,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  RefreshCw,
} from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    orderNumber: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
  });

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.currentPage,
        limit: 20,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== '')
        ),
      };

      const res = await api.get('/orders/all', { params });

      const data = res.data || {};
      const items = Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.orders)
        ? data.orders
        : Array.isArray(data)
        ? data
        : [];

      const meta = data.meta || {
        page: data.currentPage || pagination.currentPage,
        limit: data.limit || 20,
        total: data.totalOrders || data.total || (items ? items.length : 0),
      };

      setOrders(items);
      setPagination({
        currentPage: Number(meta.page || pagination.currentPage),
        totalPages: Math.max(
          1,
          Math.ceil((meta.total || items.length) / (meta.limit || 20))
        ),
        totalOrders: Number(meta.total || items.length || 0),
      });
    } catch (error) {
      console.error('fetchOrders error:', error);
      toast.error('Failed to fetch orders');
      setOrders((prev) => (Array.isArray(prev) ? prev : []));
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        icon: Clock,
        iconBg: 'bg-amber-100',
        dot: 'bg-amber-500',
      },
      processing: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: Package,
        iconBg: 'bg-blue-100',
        dot: 'bg-blue-500',
      },
      shipped: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
        icon: Truck,
        iconBg: 'bg-indigo-100',
        dot: 'bg-indigo-500',
      },
      delivered: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        icon: CheckCircle2,
        iconBg: 'bg-emerald-100',
        dot: 'bg-emerald-500',
      },
      cancelled: {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        icon: XCircle,
        iconBg: 'bg-rose-100',
        dot: 'bg-rose-500',
      },
    };
    return (
      configs[status] || {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        icon: AlertCircle,
        iconBg: 'bg-slate-100',
        dot: 'bg-slate-500',
      }
    );
  };

  const getPaymentConfig = (status) => {
    const configs = {
      completed: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        dot: 'bg-emerald-500',
      },
      failed: {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      },
      pending: {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      },
    };
    return (
      configs[status] || {
        bg: 'bg-slate-50',
        text: 'text-slate-700',
        border: 'border-slate-200',
        dot: 'bg-slate-500',
      }
    );
  };

  const handleFilterChange = (field, value) => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      orderNumber: '',
      status: '',
      startDate: '',
      endDate: '',
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getLatestStatus = (order) => {
    if (order?.statusHistory && order.statusHistory.length > 0) {
      return order.statusHistory[order.statusHistory.length - 1].status;
    }
    return order?.orderStatus || 'pending';
  };

  const getDeliveryMeta = (order) => {
    if (!order) return null;

    const latestStatus = getLatestStatus(order);

    if (latestStatus === 'delivered') {
      const deliveredHistory = order.statusHistory?.find(
        (s) => s.status === 'delivered'
      );
      const deliveredDate = deliveredHistory?.changedAt || order.deliveredAt;

      if (deliveredDate) {
        return {
          label: 'Delivered',
          date: new Date(deliveredDate),
          icon: CheckCircle2,
          color: 'text-emerald-600',
        };
      }
    }

    if (order.expectedDeliveryDate) {
      return {
        label: 'Expected',
        date: new Date(order.expectedDeliveryDate),
        icon: Truck,
        color: 'text-indigo-600',
      };
    }

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
      label: 'Estimated',
      date: expected,
      icon: Clock,
      color: 'text-amber-600',
    };
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');
  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/5 via-indigo-500/5 to-slate-900/5 blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 flex items-center justify-center shadow-xl shadow-slate-900/20 border border-white/10">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent tracking-tight">
                  Order Management
                </h1>
                <p className="mt-1 text-sm text-slate-600 flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 size={12} />
                  </span>
                  Track and manage all customer orders
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-lg shadow-slate-200/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 hover:shadow-xl hover:scale-105 transition-all text-sm font-semibold">
                <Download size={16} />
                <span className="hidden sm:inline">Export</span>
              </button>

              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm text-sm shadow-lg shadow-slate-200/50">
                <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-sm">
                  <Package size={14} />
                </div>
                <span className="font-semibold text-slate-900">
                  {pagination.totalOrders}
                </span>
                <span className="text-slate-500">Orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl bg-white border border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md">
                  <Filter size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Filter Orders
                  </h2>
                  <p className="text-xs text-slate-500">
                    Narrow down results using filters
                  </p>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-all text-sm font-semibold"
                >
                  <X size={14} />
                  Clear All
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Order Number Search */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Order Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search order #..."
                    value={filters.orderNumber}
                    onChange={(e) =>
                      handleFilterChange('orderNumber', e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Order Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange('startDate', e.target.value)
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:bg-white focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-2xl bg-white border border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-white">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Order Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Date & Delivery
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-16">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-indigo-600 animate-spin" />
                          <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-transparent border-r-violet-600 animate-spin animation-delay-150" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-slate-900">
                            Loading orders...
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            Please wait while we fetch the data
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : safeOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-16">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
                          <Package className="h-8 w-8 text-slate-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-slate-900">
                            No orders found
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {hasActiveFilters
                              ? 'Try adjusting your filters'
                              : 'Orders will appear here once customers make purchases'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  safeOrders.map((order) => {
                    const deliveryMeta = getDeliveryMeta(order);
                    const statusConfig = getStatusConfig(order.orderStatus);
                    const paymentConfig = getPaymentConfig(
                      order.paymentInfo?.status
                    );
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr
                        key={order._id}
                        className="hover:bg-slate-50/50 transition-colors group"
                      >
                        {/* Order Info */}
                        <td className="px-6 py-4">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="flex items-center gap-3 group/link"
                          >
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 group-hover/link:from-indigo-200 group-hover/link:to-violet-200 transition-colors">
                              <Package
                                size={18}
                                className="text-indigo-600"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 group-hover/link:text-indigo-600">
                                #{order.orderNumber || '—'}
                              </p>
                              <p className="text-xs text-slate-500">
                                {order.items?.length || 0} items
                              </p>
                            </div>
                          </Link>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {(order.user?.firstName?.[0] ?? 'U').toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {order.user?.firstName || ''}{' '}
                                {order.user?.lastName || ''}
                              </p>
                              <p className="text-xs text-slate-500">
                                {order.user?.email || '—'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Date & Delivery */}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-700">
                              <Calendar size={14} className="text-slate-400" />
                              {formatDate(order.createdAt)}
                            </div>
                            {deliveryMeta && (
                              <div
                                className={`flex items-center gap-2 text-xs ${deliveryMeta.color}`}
                              >
                                <deliveryMeta.icon size={12} />
                                <span className="font-medium">
                                  {deliveryMeta.label}:{' '}
                                  {formatDate(deliveryMeta.date)}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Items */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                              <Package size={14} className="text-slate-600" />
                            </div>
                            <span className="text-sm font-semibold text-slate-900">
                              {order.items?.length || 0}
                            </span>
                          </div>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg font-bold text-slate-900">
                              ₹{(Number(order.totalPrice) || 0).toLocaleString()}
                            </span>
                          </div>
                        </td>

                        {/* Payment */}
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${paymentConfig.bg} ${paymentConfig.text} ${paymentConfig.border}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${paymentConfig.dot}`}
                              />
                              {order.paymentInfo?.status || 'pending'}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <CreditCard size={12} />
                              <span className="uppercase tracking-wide font-medium">
                                {order.paymentInfo?.method || 'N/A'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                          >
                            <StatusIcon size={14} />
                            {order.orderStatus || '—'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4">
                          <Link
                            to={`/admin/orders/${order._id}`}
                            className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 shadow-sm hover:shadow-md transition-all"
                            title="View order details"
                          >
                            <Eye size={16} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-gradient-to-r from-slate-50 to-white border-t border-slate-200 px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                  Showing page{' '}
                  <span className="font-bold text-slate-900">
                    {pagination.currentPage}
                  </span>{' '}
                  of{' '}
                  <span className="font-bold text-slate-900">
                    {pagination.totalPages}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: Math.max(1, prev.currentPage - 1),
                      }))
                    }
                    disabled={pagination.currentPage === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all text-sm font-medium"
                  >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(5, pagination.totalPages))].map(
                      (_, idx) => {
                        const pageNum = idx + 1;
                        const isActive = pageNum === pagination.currentPage;
                        return (
                          <button
                            key={pageNum}
                            onClick={() =>
                              setPagination((prev) => ({
                                ...prev,
                                currentPage: pageNum,
                              }))
                            }
                            className={`h-9 w-9 rounded-lg text-sm font-semibold transition-all ${
                              isActive
                                ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg'
                                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        currentPage: Math.min(
                          prev.currentPage + 1,
                          pagination.totalPages
                        ),
                      }))
                    }
                    disabled={
                      pagination.currentPage === pagination.totalPages
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all text-sm font-medium"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default AdminOrders;