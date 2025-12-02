// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../../utils/api';
// import toast from 'react-hot-toast';
// import { ArrowLeft, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

// const OrderDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const [statusUpdate, setStatusUpdate] = useState({
//     status: '',
//     note: ''
//   });

//   useEffect(() => {
//     fetchOrder();
//   }, [id]);

//   const fetchOrder = async () => {
//     try {
//       const res = await api.get(`/orders/${id}`);
//       setOrder(res.data);
//       setStatusUpdate({ ...statusUpdate, status: res.data.orderStatus });
//     } catch (error) {
//       toast.error('Failed to fetch order details');
//       navigate('/admin/orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusUpdate = async (e) => {
//     e.preventDefault();
//     setUpdating(true);

//     try {
//       await api.put(`/orders/${id}/status`, statusUpdate);
//       toast.success('Order status updated successfully');
//       fetchOrder();
//       setStatusUpdate({ ...statusUpdate, note: '' });
//     } catch (error) {
//       toast.error('Failed to update order status');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const getStatusIcon = (status) => {
//     const icons = {
//       pending: Package,
//       processing: Package,
//       shipped: Truck,
//       delivered: CheckCircle,
//       cancelled: XCircle
//     };
//     const Icon = icons[status] || Package;
//     return <Icon size={20} />;
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'text-yellow-600 bg-yellow-100',
//       processing: 'text-blue-600 bg-blue-100',
//       shipped: 'text-purple-600 bg-purple-100',
//       delivered: 'text-green-600 bg-green-100',
//       cancelled: 'text-red-600 bg-red-100'
//     };
//     return colors[status] || 'text-gray-600 bg-gray-100';
//   };

//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 bg-gray-200 rounded w-1/4"></div>
//           <div className="h-64 bg-gray-200 rounded"></div>
//         </div>
//       </div>
//     );
//   }

//   if (!order) {
//     return null;
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <button
//         onClick={() => navigate('/admin/orders')}
//         className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
//       >
//         <ArrowLeft size={20} className="mr-2" />
//         Back to Orders
//       </button>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-6">
//           {/* Order Info */}
//           <div className="card">
//             <div className="flex justify-between items-start mb-6">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">
//                   Order {order.orderNumber}
//                 </h1>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Placed on {new Date(order.createdAt).toLocaleString()}
//                 </p>
//               </div>
//               <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
//                 {order.orderStatus}
//               </span>
//             </div>

//             {/* Order Items */}
//             <div>
//               <h2 className="text-lg font-semibold mb-4">Order Items</h2>
//               <div className="space-y-4">
//                 {order.items.map((item, index) => (
//                   <div key={index} className="flex items-center border-b pb-4 last:border-b-0">
//                     <img
//                       src={item.image || '/placeholder.png'}
//                       alt={item.name}
//                       className="w-20 h-20 object-contain rounded"
//                     />
//                     <div className="ml-4 flex-1">
//                       <h3 className="font-semibold text-gray-900">{item.name}</h3>
//                       <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
//                       <p className="text-sm text-gray-600">
//                         Price: ₹{(item.discountPrice || item.price).toLocaleString()}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-semibold text-gray-900">
//                         ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Customer & Shipping Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="card">
//               <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
//               <div className="space-y-2 text-sm">
//                 <p>
//                   <span className="font-medium">Name:</span>{' '}
//                   {order.user?.firstName} {order.user?.lastName}
//                 </p>
//                 <p>
//                   <span className="font-medium">Email:</span>{' '}
//                   {order.user?.email}
//                 </p>
//                 <p>
//                   <span className="font-medium">Mobile:</span>{' '}
//                   {order.user?.mobile}
//                 </p>
//               </div>
//             </div>

//             <div className="card">
//               <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
//               <div className="text-sm text-gray-700">
//                 <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
//                 <p>{order.shippingAddress.addressLine1}</p>
//                 {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
//                 <p>
//                   {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
//                 </p>
//                 <p>{order.shippingAddress.country}</p>
//                 <p className="mt-2">
//                   <span className="font-medium">Mobile:</span> {order.shippingAddress.mobile}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Payment Info */}
//           <div className="card">
//             <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
//             <div className="space-y-2 text-sm">
//               <div className="flex justify-between">
//                 <span className="font-medium">Payment Method:</span>
//                 <span className="uppercase">{order.paymentInfo.method}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="font-medium">Payment Status:</span>
//                 <span className={`px-2 py-1 rounded-full text-xs ${
//                   order.paymentInfo.status === 'completed'
//                     ? 'bg-green-100 text-green-800'
//                     : order.paymentInfo.status === 'failed'
//                     ? 'bg-red-100 text-red-800'
//                     : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {order.paymentInfo.status}
//                 </span>
//               </div>
//               {order.paymentInfo.razorpayPaymentId && (
//                 <div className="flex justify-between">
//                   <span className="font-medium">Transaction ID:</span>
//                   <span className="font-mono text-xs">{order.paymentInfo.razorpayPaymentId}</span>
//                 </div>
//               )}
//               {order.paymentInfo.paidAt && (
//                 <div className="flex justify-between">
//                   <span className="font-medium">Paid At:</span>
//                   <span>{new Date(order.paymentInfo.paidAt).toLocaleString()}</span>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Order Timeline */}
//           <div className="card">
//             <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
//             <div className="space-y-4">
//               {order.statusHistory && order.statusHistory.length > 0 ? (
//                 order.statusHistory.map((history, index) => (
//                   <div key={index} className="flex items-start">
//                     <div className={`p-2 rounded-full ${getStatusColor(history.status)}`}>
//                       {getStatusIcon(history.status)}
//                     </div>
//                     <div className="ml-4">
//                       <p className="font-medium capitalize">{history.status}</p>
//                       <p className="text-sm text-gray-600">
//                         {new Date(history.date).toLocaleString()}
//                       </p>
//                       {history.note && (
//                         <p className="text-sm text-gray-700 mt-1">{history.note}</p>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500">No status updates yet</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* Order Summary */}
//           <div className="card">
//             <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
//             <div className="space-y-3 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subtotal</span>
//                 <span className="font-semibold">₹{order.itemsPrice.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Tax</span>
//                 <span className="font-semibold">₹{order.taxPrice.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Shipping</span>
//                 <span className="font-semibold">
//                   {order.shippingPrice === 0 ? (
//                     <span className="text-green-600">FREE</span>
//                   ) : (
//                     `₹${order.shippingPrice.toLocaleString()}`
//                   )}
//                 </span>
//               </div>
//               <div className="border-t pt-3 flex justify-between">
//                 <span className="font-semibold text-base">Total</span>
//                 <span className="font-bold text-lg text-primary-600">
//                   ₹{order.totalPrice.toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Update Status */}
//           <div className="card">
//             <h2 className="text-lg font-semibold mb-4">Update Order Status</h2>
//             <form onSubmit={handleStatusUpdate} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Status
//                 </label>
//                 <select
//                   value={statusUpdate.status}
//                   onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
//                   className="input"
//                   required
//                 >
//                   <option value="pending">Pending</option>
//                   <option value="processing">Processing</option>
//                   <option value="shipped">Shipped</option>
//                   <option value="delivered">Delivered</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Note (Optional)
//                 </label>
//                 <textarea
//                   value={statusUpdate.note}
//                   onChange={(e) => setStatusUpdate({ ...statusUpdate, note: e.target.value })}
//                   rows="3"
//                   className="input"
//                   placeholder="Add a note about this status update..."
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={updating}
//                 className="w-full btn btn-primary disabled:opacity-50"
//               >
//                 {updating ? 'Updating...' : 'Update Status'}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetail;
// src/pages/admin/OrderDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Link as LinkIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Strict forward status flow
const STATUS_FLOW = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const getStatusIndex = (status) => STATUS_FLOW.indexOf(status);

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [statusUpdate, setStatusUpdate] = useState({
    status: '',
    note: '',
    expectedDeliveryDate: '',
    carrier: '',
    trackingId: '',
    trackingUrl: '',
  });

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders/${id}`);
      const o = res.data;
      setOrder(o);

      setStatusUpdate({
        status: o.orderStatus || 'pending',
        note: '',
        expectedDeliveryDate: o.expectedDeliveryDate
          ? o.expectedDeliveryDate.slice(0, 10) // YYYY-MM-DD
          : '',
        carrier: o.carrier || '',
        trackingId: o.trackingId || '',
        trackingUrl: o.trackingUrl || '',
      });
    } catch (error) {
      console.error('Fetch order error:', error);
      toast.error('Failed to fetch order details');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCODCompleted = async () => {
    if (!window.confirm('Confirm that cash payment has been collected?')) {
      return;
    }

    try {
      await api.put(`/orders/${id}/payment/cod`);
      toast.success('Payment marked as completed');
      fetchOrder();
    } catch (error) {
      console.error('COD update error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to update payment status'
      );
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await api.put(`/orders/${id}/status`, {
        status: statusUpdate.status,
        note: statusUpdate.note,
        carrier: statusUpdate.carrier || undefined,
        trackingId: statusUpdate.trackingId || undefined,
        trackingUrl: statusUpdate.trackingUrl || undefined,
        expectedDeliveryDate: statusUpdate.expectedDeliveryDate || undefined,
      });

      toast.success('Order status updated successfully');
      await fetchOrder();
      setStatusUpdate((prev) => ({ ...prev, note: '' }));
    } catch (error) {
      console.error('Status update error:', error);
      toast.error(
        error.response?.data?.message || 'Failed to update order status'
      );
    } finally {
      setUpdating(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Package,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle,
    };
    const Icon = icons[status] || Package;
    return <Icon size={20} />;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      processing: 'text-blue-600 bg-blue-100',
      shipped: 'text-purple-600 bg-purple-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100',
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!order) return null;

  const hasAdminAccess =
    user && (user.role === 'admin' || user.role === 'subadmin');

  const currentStatus = order.orderStatus;
  const currentIndex = getStatusIndex(currentStatus);
  const isTerminal = currentStatus === 'delivered' || currentStatus === 'cancelled';
  const canEditStatus = hasAdminAccess && !isTerminal;

  // Forward-only: once moved ahead, older statuses are disabled
  const isStatusOptionDisabled = (optionStatus) => {
    if (isTerminal) return true;

    const optionIndex = getStatusIndex(optionStatus);
    if (optionIndex === -1) return true;

    // block going backwards
    if (optionIndex < currentIndex) return true;

    return false;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/admin/orders')}
        className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Orders
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT - Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="card">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order {order.orderNumber}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Placed on{' '}
                  {new Date(order.createdAt).toLocaleString('en-IN')}
                </p>
                {order.expectedDeliveryDate && (
                  <p className="text-sm text-emerald-700 mt-1 font-medium">
                    Expected delivery:{' '}
                    {new Date(order.expectedDeliveryDate).toLocaleDateString(
                      'en-IN'
                    )}
                  </p>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>
            </div>

            {/* Order Items */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center border-b pb-4 last:border-b-0"
                  >
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="w-20 h-20 object-contain rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: ₹
                        {(item.discountPrice || item.price).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
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
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">
                Customer Information
              </h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Name:</span>{' '}
                  {order.user?.firstName} {order.user?.lastName}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{' '}
                  {order.user?.email}
                </p>
                <p>
                  <span className="font-medium">Mobile:</span>{' '}
                  {order.user?.mobile}
                </p>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
              <div className="text-sm text-gray-700">
                <p>
                  {order.shippingAddress?.firstName}{' '}
                  {order.shippingAddress?.lastName}
                </p>
                <p>{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && (
                  <p>{order.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {order.shippingAddress?.city},{' '}
                  {order.shippingAddress?.state} -{' '}
                  {order.shippingAddress?.zipCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
                <p className="mt-2">
                  <span className="font-medium">Mobile:</span>{' '}
                  {order.shippingAddress?.mobile}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Payment Method:</span>
                <span className="uppercase">{order.paymentInfo.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    order.paymentInfo.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : order.paymentInfo.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {order.paymentInfo.status}
                </span>
              </div>
              {order.paymentInfo.razorpayPaymentId && (
                <div className="flex justify-between">
                  <span className="font-medium">Transaction ID:</span>
                  <span className="font-mono text-xs">
                    {order.paymentInfo.razorpayPaymentId}
                  </span>
                </div>
              )}
              {order.paymentInfo.paidAt && (
                <div className="flex justify-between">
                  <span className="font-medium">Paid At:</span>
                  <span>
                    {new Date(order.paymentInfo.paidAt).toLocaleString('en-IN')}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Order Timeline</h2>
            <div className="space-y-4">
              {order.statusHistory && order.statusHistory.length > 0 ? (
                order.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start">
                    <div
                      className={`p-2 rounded-full ${getStatusColor(
                        history.status
                      )}`}
                    >
                      {getStatusIcon(history.status)}
                    </div>
                    <div className="ml-4">
                      <p className="font-medium capitalize">
                        {history.status}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(
                          history.changedAt || history.date
                        ).toLocaleString('en-IN')}
                      </p>
                      {history.note && (
                        <p className="text-sm text-gray-700 mt-1">
                          {history.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No status updates yet</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT - Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  ₹{order.itemsPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">
                  ₹{order.taxPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {order.shippingPrice === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `₹${order.shippingPrice.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold text-base">Total</span>
                <span className="font-bold text-lg text-primary-600">
                  ₹{order.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Shipping & Tracking info (read-only for quick view) */}
          {(order.carrier || order.trackingId || order.trackingUrl) && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-4">
                Shipping & Tracking
              </h2>
              <div className="space-y-2 text-sm">
                {order.carrier && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Courier</span>
                    <span className="font-semibold">{order.carrier}</span>
                  </div>
                )}
                {order.trackingId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tracking ID</span>
                    <span className="font-mono text-xs">
                      {order.trackingId}
                    </span>
                  </div>
                )}
                {order.trackingUrl && (
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-600 text-sm">
                      Tracking link
                    </span>
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 text-xs font-medium"
                    >
                      <LinkIcon size={14} className="mr-1" />
                      Open
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* COD Payment Completion */}
          {hasAdminAccess &&
            order.paymentInfo.method === 'cod' &&
            order.paymentInfo.status === 'pending' && (
              <div className="card bg-yellow-50 border border-yellow-200">
                <h2 className="text-lg font-semibold mb-4 text-yellow-800">
                  Cash on Delivery - Payment Pending
                </h2>
                <p className="text-sm text-gray-700 mb-4">
                  This order is COD. Mark payment as completed when cash is
                  collected during delivery.
                </p>
                <button
                  onClick={handleMarkCODCompleted}
                  className="btn bg-green-600 text-white hover:bg-green-700"
                >
                  Mark Payment as Collected
                </button>
              </div>
            )}

          {/* Update Status & Tracking */}
          {hasAdminAccess && (
            <div className="card">
              <h2 className="text-lg font-semibold mb-2">
                Update Status & Tracking
              </h2>

              {isTerminal && (
                <p className="mb-3 text-xs text-gray-500">
                  This order is <strong>{currentStatus}</strong>. Status and
                  tracking are locked and cannot be changed.
                </p>
              )}

              <form onSubmit={handleStatusUpdate} className="space-y-4">
                {/* Status + expected delivery */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) =>
                      setStatusUpdate((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="input"
                    required
                    disabled={!canEditStatus}
                  >
                    <option
                      value="pending"
                      disabled={isStatusOptionDisabled('pending')}
                    >
                      Pending
                    </option>
                    <option
                      value="processing"
                      disabled={isStatusOptionDisabled('processing')}
                    >
                      Processing
                    </option>
                    <option
                      value="shipped"
                      disabled={isStatusOptionDisabled('shipped')}
                    >
                      Shipped
                    </option>
                    <option
                      value="delivered"
                      disabled={isStatusOptionDisabled('delivered')}
                    >
                      Delivered
                    </option>
                    <option
                      value="cancelled"
                      disabled={isStatusOptionDisabled('cancelled')}
                    >
                      Cancelled
                    </option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Once you move to a later step (e.g. shipped), earlier
                    statuses (pending/processing) are disabled.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected delivery date
                  </label>
                  <input
                    type="date"
                    value={statusUpdate.expectedDeliveryDate}
                    onChange={(e) =>
                      setStatusUpdate((prev) => ({
                        ...prev,
                        expectedDeliveryDate: e.target.value,
                      }))
                    }
                    className="input"
                    disabled={!canEditStatus}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty when marking as &quot;shipped&quot; to let
                    backend auto-calc using DEFAULT_DELIVERY_DAYS.
                  </p>
                </div>

                {/* Courier info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Courier name
                  </label>
                  <input
                    type="text"
                    value={statusUpdate.carrier}
                    onChange={(e) =>
                      setStatusUpdate((prev) => ({
                        ...prev,
                        carrier: e.target.value,
                      }))
                    }
                    className="input"
                    placeholder="e.g. Delhivery, DTDC"
                    disabled={!canEditStatus}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking ID
                  </label>
                  <input
                    type="text"
                    value={statusUpdate.trackingId}
                    onChange={(e) =>
                      setStatusUpdate((prev) => ({
                        ...prev,
                        trackingId: e.target.value,
                      }))
                    }
                    className="input"
                    placeholder="AWB / tracking number"
                    disabled={!canEditStatus}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tracking URL
                  </label>
                  <input
                    type="url"
                    value={statusUpdate.trackingUrl}
                    onChange={(e) =>
                      setStatusUpdate((prev) => ({
                        ...prev,
                        trackingUrl: e.target.value,
                      }))
                    }
                    className="input"
                    placeholder="https://courier.com/track/..."
                    disabled={!canEditStatus}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note (Optional)
                  </label>
                  <textarea
                    value={statusUpdate.note}
                    onChange={(e) =>
                      setStatusUpdate((prev) => ({
                        ...prev,
                        note: e.target.value,
                      }))
                    }
                    rows="3"
                    className="input"
                    placeholder="Add a note about this update (visible in timeline)..."
                    disabled={!canEditStatus}
                  />
                </div>

                <button
                  type="submit"
                  disabled={updating || !canEditStatus}
                  className="w-full btn btn-primary disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Save Status & Tracking'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
