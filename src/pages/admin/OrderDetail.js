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
// // src/pages/admin/OrderDetail.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import api from '../../utils/api';
// import toast from 'react-hot-toast';
// import {
//   ArrowLeft,
//   Package,
//   Truck,
//   CheckCircle,
//   XCircle,
//   Link as LinkIcon,
// } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';

// // Strict forward status flow
// const STATUS_FLOW = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// const getStatusIndex = (status) => STATUS_FLOW.indexOf(status);

// const AdminOrderDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);

//   const [statusUpdate, setStatusUpdate] = useState({
//     status: '',
//     note: '',
//     expectedDeliveryDate: '',
//     carrier: '',
//     trackingId: '',
//     trackingUrl: '',
//   });

//   useEffect(() => {
//     fetchOrder();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const fetchOrder = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/orders/${id}`);
//       const o = res.data;
//       setOrder(o);

//       setStatusUpdate({
//         status: o.orderStatus || 'pending',
//         note: '',
//         expectedDeliveryDate: o.expectedDeliveryDate
//           ? o.expectedDeliveryDate.slice(0, 10) // YYYY-MM-DD
//           : '',
//         carrier: o.carrier || '',
//         trackingId: o.trackingId || '',
//         trackingUrl: o.trackingUrl || '',
//       });
//     } catch (error) {
//       console.error('Fetch order error:', error);
//       toast.error('Failed to fetch order details');
//       navigate('/admin/orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkCODCompleted = async () => {
//     if (!window.confirm('Confirm that cash payment has been collected?')) {
//       return;
//     }

//     try {
//       await api.put(`/orders/${id}/payment/cod`);
//       toast.success('Payment marked as completed');
//       fetchOrder();
//     } catch (error) {
//       console.error('COD update error:', error);
//       toast.error(
//         error.response?.data?.message || 'Failed to update payment status'
//       );
//     }
//   };

//   const handleStatusUpdate = async (e) => {
//     e.preventDefault();
//     setUpdating(true);

//     try {
//       await api.put(`/orders/${id}/status`, {
//         status: statusUpdate.status,
//         note: statusUpdate.note,
//         carrier: statusUpdate.carrier || undefined,
//         trackingId: statusUpdate.trackingId || undefined,
//         trackingUrl: statusUpdate.trackingUrl || undefined,
//         expectedDeliveryDate: statusUpdate.expectedDeliveryDate || undefined,
//       });

//       toast.success('Order status updated successfully');
//       await fetchOrder();
//       setStatusUpdate((prev) => ({ ...prev, note: '' }));
//     } catch (error) {
//       console.error('Status update error:', error);
//       toast.error(
//         error.response?.data?.message || 'Failed to update order status'
//       );
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
//       cancelled: XCircle,
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
//       cancelled: 'text-red-600 bg-red-100',
//     };
//     return colors[status] || 'text-gray-600 bg-gray-100';
//   };

//   if (loading) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="animate-pulse space-y-4">
//           <div className="h-8 bg-gray-200 rounded w-1/4" />
//           <div className="h-64 bg-gray-200 rounded" />
//         </div>
//       </div>
//     );
//   }

//   if (!order) return null;

//   const hasAdminAccess =
//     user && (user.role === 'admin' || user.role === 'subadmin');

//   const currentStatus = order.orderStatus;
//   const currentIndex = getStatusIndex(currentStatus);
//   const isTerminal = currentStatus === 'delivered' || currentStatus === 'cancelled';
//   const canEditStatus = hasAdminAccess && !isTerminal;

//   // Forward-only: once moved ahead, older statuses are disabled
//   const isStatusOptionDisabled = (optionStatus) => {
//     if (isTerminal) return true;

//     const optionIndex = getStatusIndex(optionStatus);
//     if (optionIndex === -1) return true;

//     // block going backwards
//     if (optionIndex < currentIndex) return true;

//     return false;
//   };

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
//         {/* LEFT - Main info */}
//         <div className="lg:col-span-2 space-y-6">
//           {/* Order Info */}
//           <div className="card">
//             <div className="flex justify-between items-start mb-6">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">
//                   Order {order.orderNumber}
//                 </h1>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Placed on{' '}
//                   {new Date(order.createdAt).toLocaleString('en-IN')}
//                 </p>
//                 {order.expectedDeliveryDate && (
//                   <p className="text-sm text-emerald-700 mt-1 font-medium">
//                     Expected delivery:{' '}
//                     {new Date(order.expectedDeliveryDate).toLocaleDateString(
//                       'en-IN'
//                     )}
//                   </p>
//                 )}
//               </div>
//               <span
//                 className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
//                   order.orderStatus
//                 )}`}
//               >
//                 {order.orderStatus}
//               </span>
//             </div>

//             {/* Order Items */}
//             <div>
//               <h2 className="text-lg font-semibold mb-4">Order Items</h2>
//               <div className="space-y-4">
//                 {order.items.map((item, index) => (
//                   <div
//                     key={index}
//                     className="flex items-center border-b pb-4 last:border-b-0"
//                   >
//                     <img
//                       src={item.image || '/placeholder.png'}
//                       alt={item.name}
//                       className="w-20 h-20 object-contain rounded"
//                     />
//                     <div className="ml-4 flex-1">
//                       <h3 className="font-semibold text-gray-900">
//                         {item.name}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         Quantity: {item.quantity}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         Price: ₹
//                         {(item.discountPrice || item.price).toLocaleString()}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-semibold text-gray-900">
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
//           </div>

//           {/* Customer & Shipping Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="card">
//               <h2 className="text-lg font-semibold mb-4">
//                 Customer Information
//               </h2>
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
//                 <p>
//                   {order.shippingAddress?.firstName}{' '}
//                   {order.shippingAddress?.lastName}
//                 </p>
//                 <p>{order.shippingAddress?.addressLine1}</p>
//                 {order.shippingAddress?.addressLine2 && (
//                   <p>{order.shippingAddress.addressLine2}</p>
//                 )}
//                 <p>
//                   {order.shippingAddress?.city},{' '}
//                   {order.shippingAddress?.state} -{' '}
//                   {order.shippingAddress?.zipCode}
//                 </p>
//                 <p>{order.shippingAddress?.country}</p>
//                 <p className="mt-2">
//                   <span className="font-medium">Mobile:</span>{' '}
//                   {order.shippingAddress?.mobile}
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
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs ${
//                     order.paymentInfo.status === 'completed'
//                       ? 'bg-green-100 text-green-800'
//                       : order.paymentInfo.status === 'failed'
//                       ? 'bg-red-100 text-red-800'
//                       : 'bg-yellow-100 text-yellow-800'
//                   }`}
//                 >
//                   {order.paymentInfo.status}
//                 </span>
//               </div>
//               {order.paymentInfo.razorpayPaymentId && (
//                 <div className="flex justify-between">
//                   <span className="font-medium">Transaction ID:</span>
//                   <span className="font-mono text-xs">
//                     {order.paymentInfo.razorpayPaymentId}
//                   </span>
//                 </div>
//               )}
//               {order.paymentInfo.paidAt && (
//                 <div className="flex justify-between">
//                   <span className="font-medium">Paid At:</span>
//                   <span>
//                     {new Date(order.paymentInfo.paidAt).toLocaleString('en-IN')}
//                   </span>
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
//                     <div
//                       className={`p-2 rounded-full ${getStatusColor(
//                         history.status
//                       )}`}
//                     >
//                       {getStatusIcon(history.status)}
//                     </div>
//                     <div className="ml-4">
//                       <p className="font-medium capitalize">
//                         {history.status}
//                       </p>
//                       <p className="text-sm text-gray-600">
//                         {new Date(
//                           history.changedAt || history.date
//                         ).toLocaleString('en-IN')}
//                       </p>
//                       {history.note && (
//                         <p className="text-sm text-gray-700 mt-1">
//                           {history.note}
//                         </p>
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

//         {/* RIGHT - Sidebar */}
//         <div className="space-y-6">
//           {/* Order Summary */}
//           <div className="card">
//             <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
//             <div className="space-y-3 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subtotal</span>
//                 <span className="font-semibold">
//                   ₹{order.itemsPrice.toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Tax</span>
//                 <span className="font-semibold">
//                   ₹{order.taxPrice.toLocaleString()}
//                 </span>
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

//           {/* Shipping & Tracking info (read-only for quick view) */}
//           {(order.carrier || order.trackingId || order.trackingUrl) && (
//             <div className="card">
//               <h2 className="text-lg font-semibold mb-4">
//                 Shipping & Tracking
//               </h2>
//               <div className="space-y-2 text-sm">
//                 {order.carrier && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Courier</span>
//                     <span className="font-semibold">{order.carrier}</span>
//                   </div>
//                 )}
//                 {order.trackingId && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Tracking ID</span>
//                     <span className="font-mono text-xs">
//                       {order.trackingId}
//                     </span>
//                   </div>
//                 )}
//                 {order.trackingUrl && (
//                   <div className="flex items-center justify-between mt-2">
//                     <span className="text-gray-600 text-sm">
//                       Tracking link
//                     </span>
//                     <a
//                       href={order.trackingUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="inline-flex items-center text-primary-600 hover:text-primary-700 text-xs font-medium"
//                     >
//                       <LinkIcon size={14} className="mr-1" />
//                       Open
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* COD Payment Completion */}
//           {hasAdminAccess &&
//             order.paymentInfo.method === 'cod' &&
//             order.paymentInfo.status === 'pending' && (
//               <div className="card bg-yellow-50 border border-yellow-200">
//                 <h2 className="text-lg font-semibold mb-4 text-yellow-800">
//                   Cash on Delivery - Payment Pending
//                 </h2>
//                 <p className="text-sm text-gray-700 mb-4">
//                   This order is COD. Mark payment as completed when cash is
//                   collected during delivery.
//                 </p>
//                 <button
//                   onClick={handleMarkCODCompleted}
//                   className="btn bg-green-600 text-white hover:bg-green-700"
//                 >
//                   Mark Payment as Collected
//                 </button>
//               </div>
//             )}

//           {/* Update Status & Tracking */}
//           {hasAdminAccess && (
//             <div className="card">
//               <h2 className="text-lg font-semibold mb-2">
//                 Update Status & Tracking
//               </h2>

//               {isTerminal && (
//                 <p className="mb-3 text-xs text-gray-500">
//                   This order is <strong>{currentStatus}</strong>. Status and
//                   tracking are locked and cannot be changed.
//                 </p>
//               )}

//               <form onSubmit={handleStatusUpdate} className="space-y-4">
//                 {/* Status + expected delivery */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Status
//                   </label>
//                   <select
//                     value={statusUpdate.status}
//                     onChange={(e) =>
//                       setStatusUpdate((prev) => ({
//                         ...prev,
//                         status: e.target.value,
//                       }))
//                     }
//                     className="input"
//                     required
//                     disabled={!canEditStatus}
//                   >
//                     <option
//                       value="pending"
//                       disabled={isStatusOptionDisabled('pending')}
//                     >
//                       Pending
//                     </option>
//                     <option
//                       value="processing"
//                       disabled={isStatusOptionDisabled('processing')}
//                     >
//                       Processing
//                     </option>
//                     <option
//                       value="shipped"
//                       disabled={isStatusOptionDisabled('shipped')}
//                     >
//                       Shipped
//                     </option>
//                     <option
//                       value="delivered"
//                       disabled={isStatusOptionDisabled('delivered')}
//                     >
//                       Delivered
//                     </option>
//                     <option
//                       value="cancelled"
//                       disabled={isStatusOptionDisabled('cancelled')}
//                     >
//                       Cancelled
//                     </option>
//                   </select>
//                   <p className="mt-1 text-xs text-gray-500">
//                     Once you move to a later step (e.g. shipped), earlier
//                     statuses (pending/processing) are disabled.
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Expected delivery date
//                   </label>
//                   <input
//                     type="date"
//                     value={statusUpdate.expectedDeliveryDate}
//                     onChange={(e) =>
//                       setStatusUpdate((prev) => ({
//                         ...prev,
//                         expectedDeliveryDate: e.target.value,
//                       }))
//                     }
//                     className="input"
//                     disabled={!canEditStatus}
//                   />
//                   <p className="mt-1 text-xs text-gray-500">
//                     Leave empty when marking as &quot;shipped&quot; to let
//                     backend auto-calc using DEFAULT_DELIVERY_DAYS.
//                   </p>
//                 </div>

//                 {/* Courier info */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Courier name
//                   </label>
//                   <input
//                     type="text"
//                     value={statusUpdate.carrier}
//                     onChange={(e) =>
//                       setStatusUpdate((prev) => ({
//                         ...prev,
//                         carrier: e.target.value,
//                       }))
//                     }
//                     className="input"
//                     placeholder="e.g. Delhivery, DTDC"
//                     disabled={!canEditStatus}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Tracking ID
//                   </label>
//                   <input
//                     type="text"
//                     value={statusUpdate.trackingId}
//                     onChange={(e) =>
//                       setStatusUpdate((prev) => ({
//                         ...prev,
//                         trackingId: e.target.value,
//                       }))
//                     }
//                     className="input"
//                     placeholder="AWB / tracking number"
//                     disabled={!canEditStatus}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Tracking URL
//                   </label>
//                   <input
//                     type="url"
//                     value={statusUpdate.trackingUrl}
//                     onChange={(e) =>
//                       setStatusUpdate((prev) => ({
//                         ...prev,
//                         trackingUrl: e.target.value,
//                       }))
//                     }
//                     className="input"
//                     placeholder="https://courier.com/track/..."
//                     disabled={!canEditStatus}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Note (Optional)
//                   </label>
//                   <textarea
//                     value={statusUpdate.note}
//                     onChange={(e) =>
//                       setStatusUpdate((prev) => ({
//                         ...prev,
//                         note: e.target.value,
//                       }))
//                     }
//                     rows="3"
//                     className="input"
//                     placeholder="Add a note about this update (visible in timeline)..."
//                     disabled={!canEditStatus}
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={updating || !canEditStatus}
//                   className="w-full btn btn-primary disabled:opacity-50"
//                 >
//                   {updating ? 'Updating...' : 'Save Status & Tracking'}
//                 </button>
//               </form>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminOrderDetail;
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
  RefreshCw,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  Clock,
  Info,
  // Eye,
  AlertCircle,
  Edit3,
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
  const [verifying, setVerifying] = useState(false);
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

  // Fetch order
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
          ? o.expectedDeliveryDate.slice(0, 10)
          : '',
        carrier: o.carrier || '',
        trackingId: o.trackingId || '',
        trackingUrl: o.trackingUrl || '',
      });

      if (
        o.paymentInfo &&
        o.paymentInfo.method === 'cashfree' &&
        o.paymentInfo.status === 'pending'
      ) {
        doVerifyPayment();
      }
    } catch (error) {
      console.error('Fetch order error:', error);
      toast.error('Failed to fetch order details');
      navigate('/admin/orders');
    } finally {
      setLoading(false);
    }
  };

  const doVerifyPayment = async () => {
    if (!id) return;
    try {
      setVerifying(true);
      const res = await api.post('/payments/verify', { orderId: id });
      if (res.data && res.data.verified) {
        toast.success('Payment verified via Cashfree.');
        await fetchOrder();
      } else {
        console.log('verify result:', res.data);
      }
    } catch (err) {
      console.error('verify error:', err);
      toast.error(err.response?.data?.message || 'Payment verification failed');
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyClick = async () => {
    if (!window.confirm('Check Cashfree for this order and update payment status if paid?')) return;
    await doVerifyPayment();
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
      toast.error(error.response?.data?.message || 'Failed to update payment status');
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
      toast.error(error.response?.data?.message || 'Failed to update order status');
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
    return <Icon size={18} />;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-amber-700 bg-amber-50 border-amber-200',
      processing: 'text-blue-700 bg-blue-50 border-blue-200',
      shipped: 'text-purple-700 bg-purple-50 border-purple-200',
      delivered: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      cancelled: 'text-red-700 bg-red-50 border-red-200',
    };
    return colors[status] || 'text-gray-700 bg-gray-50 border-gray-200';
  };

  const getStatusGradient = (status) => {
    const gradients = {
      pending: 'from-amber-500 to-orange-500',
      processing: 'from-blue-500 to-indigo-500',
      shipped: 'from-purple-500 to-pink-500',
      delivered: 'from-emerald-500 to-teal-500',
      cancelled: 'from-red-500 to-rose-500',
    };
    return gradients[status] || 'from-gray-500 to-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/4" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg" />
                <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg" />
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg" />
                <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const hasAdminAccess = user && (user.role === 'admin' || user.role === 'subadmin');
  const currentStatus = order.orderStatus;
  const currentIndex = getStatusIndex(currentStatus);
  const isTerminal = currentStatus === 'delivered' || currentStatus === 'cancelled';
  const canEditStatus = hasAdminAccess && !isTerminal;

  const isStatusOptionDisabled = (optionStatus) => {
    if (isTerminal) return true;
    const optionIndex = getStatusIndex(optionStatus);
    if (optionIndex === -1) return true;
    if (optionIndex < currentIndex) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-12">
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${getStatusGradient(currentStatus)} shadow-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/admin/orders')}
            className="group flex items-center text-white hover:text-white/90 mb-6 transition-all duration-200 hover:translate-x-[-4px]"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:animate-pulse" />
            <span className="font-medium">Back to Orders</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                <Package className="w-8 h-8" />
                Order #{order.orderNumber}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span className="text-sm">Placed on {new Date(order.createdAt).toLocaleString('en-IN')}</span>
                </div>
                {order.expectedDeliveryDate && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">
                      Expected: {new Date(order.expectedDeliveryDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold border-2 ${getStatusColor(order.orderStatus)} shadow-lg backdrop-blur-sm capitalize`}>
                {getStatusIcon(order.orderStatus)}
                {order.orderStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT - Main info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items - Enhanced Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package size={20} />
                  Order Items
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {Array.isArray(order.items) && order.items.map((item, index) => (
                    <div
                      key={index}
                      className="group flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-300"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.image || '/placeholder.png'}
                          alt={item.name}
                          className="w-24 h-24 object-contain rounded-xl bg-gray-50 border border-gray-200 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors truncate">
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Package size={14} />
                            Qty: {item.quantity}
                          </span>
                          <span className="flex items-center gap-1">
                            <CreditCard size={14} />
                            ₹{(item.discountPrice || item.price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-indigo-600">
                          ₹{(((item.discountPrice || item.price) * item.quantity) || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer & Shipping Info - Side by Side Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <User size={18} />
                    Customer Information
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
                    <User size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Full Name</p>
                      <p className="font-semibold text-gray-900">
                        {order.user?.firstName || ''} {order.user?.lastName || ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
                    <Mail size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email Address</p>
                      <p className="font-medium text-gray-900 break-all">{order.user?.email || ''}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
                    <Phone size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Mobile Number</p>
                      <p className="font-medium text-gray-900">{order.user?.mobile || ''}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <MapPin size={18} />
                    Shipping Address
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-gray-50 to-emerald-50 border border-emerald-100">
                    <p className="font-semibold text-gray-900 text-lg">
                      {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                    </p>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      <p>{order.shippingAddress?.addressLine1}</p>
                      {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
                      <p className="font-medium mt-1">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}
                      </p>
                      <p>{order.shippingAddress?.country}</p>
                    </div>
                    <div className="pt-2 mt-2 border-t border-emerald-200 flex items-center gap-2">
                      <Phone size={14} className="text-emerald-600" />
                      <span className="font-semibold text-gray-900">{order.shippingAddress?.mobile}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CreditCard size={20} />
                  Payment Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200">
                    <p className="text-xs text-gray-600 mb-2">Payment Method</p>
                    <p className="text-lg font-bold text-violet-700 uppercase">
                      {order.paymentInfo?.method || 'N/A'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200">
                    <p className="text-xs text-gray-600 mb-2">Payment Status</p>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                      order.paymentInfo?.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      order.paymentInfo?.status === 'failed' ? 'bg-red-100 text-red-800 border border-red-300' : 
                      'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        order.paymentInfo?.status === 'completed' ? 'bg-emerald-500' :
                        order.paymentInfo?.status === 'failed' ? 'bg-red-500' : 'bg-amber-500'
                      } animate-pulse`} />
                      {order.paymentInfo?.status || 'pending'}
                    </span>
                  </div>
                </div>

                {/* Cashfree Details */}
                {(order.paymentInfo?.cashfreeOrderId || order.paymentInfo?.cashfreeReferenceId) && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                    <h3 className="font-semibold text-blue-900 text-sm mb-3 flex items-center gap-2">
                      <Info size={16} />
                      Cashfree Transaction Details
                    </h3>
                    {order.paymentInfo?.cashfreeOrderId && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Link ID:</span>
                        <code className="bg-white px-2 py-1 rounded text-xs font-mono text-blue-700 border border-blue-200">
                          {order.paymentInfo.cashfreeOrderId}
                        </code>
                      </div>
                    )}
                    {order.paymentInfo?.cashfreeReferenceId && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Transaction ID:</span>
                        <code className="bg-white px-2 py-1 rounded text-xs font-mono text-blue-700 border border-blue-200">
                          {order.paymentInfo.cashfreeReferenceId}
                        </code>
                      </div>
                    )}
                    {order.paymentInfo?.cashfreePaymentMode && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Mode:</span>
                        <span className="bg-white px-2 py-1 rounded text-xs font-semibold text-blue-700 border border-blue-200 uppercase">
                          {order.paymentInfo.cashfreePaymentMode}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {order.paymentInfo?.paidAt && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    <CheckCircle size={16} className="text-emerald-600" />
                    <span>Paid on {new Date(order.paymentInfo.paidAt).toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Verify Payment Button */}
                {hasAdminAccess && order.paymentInfo?.method === 'cashfree' && order.paymentInfo?.status === 'pending' && (
                  <div className="mt-4">
                    <button
                      onClick={handleVerifyClick}
                      disabled={verifying}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      {verifying ? (
                        <>
                          <RefreshCw size={18} className="animate-spin" />
                          Verifying Payment...
                        </>
                      ) : (
                        <>
                          <RefreshCw size={18} />
                          Verify Payment Status
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <div className="bg-gradient-to-r from-slate-700 to-gray-800 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Clock size={20} />
                  Order Timeline
                </h2>
              </div>
              <div className="p-6">
                {order.statusHistory && order.statusHistory.length > 0 ? (
                  <div className="relative space-y-6">
                    {/* Timeline Line */}
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-pink-200" />
                    
                    {order.statusHistory.map((history, index) => (
                      <div key={index} className="relative flex items-start gap-4 group">
                        <div className={`relative z-10 p-3 rounded-xl shadow-lg ${getStatusColor(history.status)} border-2 group-hover:scale-110 transition-transform duration-300`}>
                          {getStatusIcon(history.status)}
                        </div>
                        <div className="flex-1 bg-gradient-to-r from-gray-50 to-transparent p-4 rounded-xl border border-gray-200 group-hover:border-indigo-300 group-hover:shadow-md transition-all duration-300">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-gray-900 capitalize text-lg">{history.status}</p>
                            <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 flex items-center gap-1">
                              <Clock size={12} />
                              {new Date(history.changedAt || history.date).toLocaleString('en-IN')}
                            </span>
                          </div>
                          {history.note && (
                            <p className="text-sm text-gray-700 mt-2 p-3 bg-white rounded-lg border border-gray-200 italic">
                              "{history.note}"
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No status updates yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT - Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300 sticky top-6">
              <div className="bg-gradient-to-r from-rose-500 to-pink-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CreditCard size={20} />
                  Order Summary
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Package size={14} />
                    Subtotal
                  </span>
                  <span className="font-semibold text-gray-900">₹{(order.itemsPrice || 0).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Info size={14} />
                    Tax
                  </span>
                  <span className="font-semibold text-gray-900">₹{(order.taxPrice || 0).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Truck size={14} />
                    Shipping
                  </span>
                  <span className="font-semibold">
                    {order.shippingPrice === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      <span className="text-gray-900">₹{(order.shippingPrice || 0).toLocaleString()}</span>
                    )}
                  </span>
                </div>
                
                <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-4">
                  <div className="flex justify-between items-center p-4 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200">
                    <span className="font-bold text-lg text-gray-900">Total Amount</span>
                    <span className="font-bold text-2xl text-rose-600">
                      ₹{(order.totalPrice || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping & Tracking */}
            {(order.carrier || order.trackingId || order.trackingUrl) && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Truck size={18} />
                    Shipping & Tracking
                  </h2>
                </div>
                <div className="p-6 space-y-3">
                  {order.carrier && (
                    <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-200">
                      <p className="text-xs text-gray-600 mb-1">Courier Partner</p>
                      <p className="font-bold text-cyan-700 text-lg">{order.carrier}</p>
                    </div>
                  )}
                  {order.trackingId && (
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-xs text-gray-600 mb-1">Tracking ID</p>
                      <code className="font-mono text-sm font-semibold text-blue-700 break-all">
                        {order.trackingId}
                      </code>
                    </div>
                  )}
                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 group shadow-lg hover:shadow-xl"
                    >
                      <span className="font-semibold">Track Your Order</span>
                      <LinkIcon size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* COD Payment Notice */}
            {hasAdminAccess && order.paymentInfo?.method === 'cod' && order.paymentInfo?.status === 'pending' && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-xl border-2 border-amber-300 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <AlertCircle size={18} />
                    COD - Action Required
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4 p-3 bg-white rounded-lg border border-amber-200">
                    <Info size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      Cash on Delivery order. Mark payment as completed when cash is collected during delivery.
                    </p>
                  </div>
                  <button
                    onClick={handleMarkCODCompleted}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <CheckCircle size={18} />
                    Mark Payment as Collected
                  </button>
                </div>
              </div>
            )}

            {/* Update Status Form */}
            {hasAdminAccess && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Edit3 size={18} />
                    Update Order Status
                  </h2>
                </div>
                <div className="p-6">
                  {isTerminal && (
                    <div className="mb-4 p-4 bg-gray-50 border-l-4 border-gray-400 rounded-lg">
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Info size={16} className="flex-shrink-0" />
                        <span>
                          This order is <strong className="text-gray-900">{currentStatus}</strong>. Status is locked and cannot be changed.
                        </span>
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleStatusUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Order Status</label>
                      <select
                        value={statusUpdate.status}
                        onChange={(e) => setStatusUpdate((prev) => ({ ...prev, status: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        required
                        disabled={!canEditStatus}
                      >
                        <option value="pending" disabled={isStatusOptionDisabled('pending')}>⏳ Pending</option>
                        <option value="processing" disabled={isStatusOptionDisabled('processing')}>📦 Processing</option>
                        <option value="shipped" disabled={isStatusOptionDisabled('shipped')}>🚚 Shipped</option>
                        <option value="delivered" disabled={isStatusOptionDisabled('delivered')}>✅ Delivered</option>
                        <option value="cancelled" disabled={isStatusOptionDisabled('cancelled')}>❌ Cancelled</option>
                      </select>
                      <p className="mt-2 text-xs text-gray-500 bg-blue-50 p-2 rounded-lg border border-blue-100">
                        ℹ️ Status can only move forward. Previous statuses are disabled.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Expected Delivery Date</label>
                      <input
                        type="date"
                        value={statusUpdate.expectedDeliveryDate}
                        onChange={(e) => setStatusUpdate((prev) => ({ ...prev, expectedDeliveryDate: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        disabled={!canEditStatus}
                      />
                      <p className="mt-2 text-xs text-gray-500">Leave empty for auto-calculation when marking as shipped</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Courier Name</label>
                      <input
                        type="text"
                        value={statusUpdate.carrier}
                        onChange={(e) => setStatusUpdate((prev) => ({ ...prev, carrier: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="e.g. Delhivery, DTDC, BlueDart"
                        disabled={!canEditStatus}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tracking ID</label>
                      <input
                        type="text"
                        value={statusUpdate.trackingId}
                        onChange={(e) => setStatusUpdate((prev) => ({ ...prev, trackingId: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed font-mono"
                        placeholder="AWB / Tracking Number"
                        disabled={!canEditStatus}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Tracking URL</label>
                      <input
                        type="url"
                        value={statusUpdate.trackingUrl}
                        onChange={(e) => setStatusUpdate((prev) => ({ ...prev, trackingUrl: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed"
                        placeholder="https://courier.com/track/..."
                        disabled={!canEditStatus}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Add Note (Optional)</label>
                      <textarea
                        value={statusUpdate.note}
                        onChange={(e) => setStatusUpdate((prev) => ({ ...prev, note: e.target.value }))}
                        rows="3"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
                        placeholder="Add a note about this update (visible in timeline)..."
                        disabled={!canEditStatus}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={updating || !canEditStatus}
                      className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {updating ? (
                        <>
                          <RefreshCw size={20} className="animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={20} />
                          Save Status & Tracking
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
