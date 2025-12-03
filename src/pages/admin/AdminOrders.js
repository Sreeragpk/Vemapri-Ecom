
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
import { Search, Filter, Eye, Truck, CheckCircle2 } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]); // always keep an array
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

      // normalize response shapes:
      // backend may return { items: [...], meta: {...} } or { orders: [...], currentPage, totalPages, totalOrders }
      const data = res.data || {};
      const items = Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.orders)
        ? data.orders
        : Array.isArray(data) // rare case: response is array directly
        ? data
        : [];

      // meta normalization with sensible defaults
      const meta = data.meta || {
        page: data.currentPage || pagination.currentPage,
        limit: data.limit || 20,
        total: data.totalOrders || data.total || (items ? items.length : 0),
      };

      setOrders(items);
      setPagination({
        currentPage: Number(meta.page || pagination.currentPage),
        totalPages: Math.max(1, Math.ceil((meta.total || items.length) / (meta.limit || 20))),
        totalOrders: Number(meta.total || items.length || 0),
      });
    } catch (error) {
      console.error('fetchOrders error:', error);
      toast.error('Failed to fetch orders');
      // keep previous data but ensure orders is an array
      setOrders((prev) => (Array.isArray(prev) ? prev : []));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-50 text-amber-700 border border-amber-100',
      processing: 'bg-sky-50 text-sky-700 border border-sky-100',
      shipped: 'bg-violet-50 text-violet-700 border border-violet-100',
      delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
      cancelled: 'bg-rose-50 text-rose-700 border border-rose-100',
    };
    return (
      colors[status] ||
      'bg-slate-50 text-slate-700 border border-slate-100'
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

    // Delivered → use delivered date if present
    if (latestStatus === 'delivered') {
      const deliveredHistory = order.statusHistory?.find(
        (s) => s.status === 'delivered'
      );
      const deliveredDate =
        deliveredHistory?.changedAt || order.deliveredAt;

      if (deliveredDate) {
        return {
          label: 'Delivered',
          date: new Date(deliveredDate),
          icon: CheckCircle2,
          accent: 'text-emerald-700',
        };
      }
    }

    // Backend expectedDeliveryDate
    if (order.expectedDeliveryDate) {
      return {
        label: 'Expected delivery',
        date: new Date(order.expectedDeliveryDate),
        icon: Truck,
        accent: 'text-emerald-700',
      };
    }

    // Fallback simple estimate from createdAt + status
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
      accent: 'text-emerald-600',
    };
  };

  // render safe helpers
  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
            Orders
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Manage customer orders and track fulfillment for Vemapri grocery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
            {pagination.totalOrders} total orders
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white/90 border border-emerald-100/80 shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Filter size={16} />
            </span>
            <span>Filter orders</span>
          </div>
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50/70 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-100 transition-all"
          >
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          {/* Order number search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by order number..."
              value={filters.orderNumber}
              onChange={(e) =>
                handleFilterChange('orderNumber', e.target.value)
              }
              className="input pl-9 text-sm"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
          </div>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="input text-sm"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Date range */}
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              handleFilterChange('startDate', e.target.value)
            }
            className="input text-sm"
            placeholder="Start Date"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              handleFilterChange('endDate', e.target.value)
            }
            className="input text-sm"
            placeholder="End Date"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-white/95 border border-emerald-100/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-emerald-50 text-sm">
            <thead className="bg-emerald-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                  Order #
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                  Date & Delivery
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white/90 divide-y divide-emerald-50">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400 text-sm">
                      <div className="h-6 w-6 rounded-full border-2 border-emerald-200 border-t-emerald-500 animate-spin" />
                      <span>Loading orders…</span>
                    </div>
                  </td>
                </tr>
              ) : safeOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-10 text-center text-slate-400 text-sm"
                  >
                    No orders found for the selected filters.
                  </td>
                </tr>
              ) : (
                safeOrders.map((order) => {
                  const deliveryMeta = getDeliveryMeta(order);

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-emerald-50/60 transition-colors"
                    >
                      {/* Order number */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="text-[13px] font-semibold text-emerald-700 hover:text-emerald-900"
                        >
                          {order.orderNumber || '—'}
                        </Link>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-[13px] font-medium text-slate-900">
                            {order.user?.firstName || ''} {order.user?.lastName || ''}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {order.user?.email || ''}
                          </div>
                        </div>
                      </td>

                      {/* Date + delivery */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[13px] text-slate-700">
                          {formatDate(order.createdAt)}
                        </div>
                        {deliveryMeta && (
                          <div className="mt-1 flex items-center gap-1 text-[11px]">
                            <deliveryMeta.icon
                              size={12}
                              className="text-emerald-500"
                            />
                            <span className="text-slate-500">
                              {deliveryMeta.label}:{' '}
                              <span
                                className={`font-medium ${deliveryMeta.accent}`}
                              >
                                {formatDate(deliveryMeta.date)}
                              </span>
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Items count */}
                      <td className="px-6 py-4 whitespace-nowrap text-[13px] text-slate-600">
                        {(order.items && order.items.length) || 0} item(s)
                      </td>

                      {/* Total */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[13px] font-semibold text-slate-900">
                          ₹{(Number(order.totalPrice) || 0).toLocaleString()}
                        </div>
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                              order.paymentInfo?.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : order.paymentInfo?.status === 'failed'
                                ? 'bg-rose-50 text-rose-700 border border-rose-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
                            {order.paymentInfo?.status || 'pending'}
                          </span>
                          <span className="text-[11px] text-slate-500 uppercase tracking-wide">
                            {order.paymentInfo?.method || 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Order status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusColor(
                            order.orderStatus
                          )}`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5" />
                          {order.orderStatus || '—'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-200 transition-all"
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
          <div className="bg-emerald-50/70 border-t border-emerald-100 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-600">
            <div>
              Page{' '}
              <span className="font-semibold text-slate-900">
                {pagination.currentPage}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-slate-900">
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
                className="px-3 py-1.5 rounded-full border border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: Math.min(prev.currentPage + 1, pagination.totalPages),
                  }))
                }
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1.5 rounded-full border border-emerald-100 bg-white text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
